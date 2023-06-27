"""Controller for the surface endpoints."""
import itertools
import logging

import fastapi
import numpy as np
from fastapi import status
from nibabel.gifti import gifti
from numpy import typing as npt
from scipy.spatial import distance
from sklearn.metrics import pairwise

from src import settings
from src.routers.surfaces import schemas, utils

config = settings.get_settings()
SURFACE_DIR = config.DATA_DIR / "surfaces"
FEATURE_DIR = config.DATA_DIR / "features"
LOGGER_NAME = config.LOGGER_NAME

logger = logging.getLogger(LOGGER_NAME)


def get_hemispheres(species: str, side: str) -> schemas.Surface:
    """Fetches the human and macaque fsLR-10k surfaces.

    Args:
        species: The species to fetch the hemispheres for, valid values are
            'human' and 'macaque'.
        side: The hemisphere to fetch the surfaces for, valid values are 'left' and
            'right'.

    Returns:
        A hemispheric surface for humans or macaques.
    """
    logger.info("Fetching %s_%s surface.", species, side)
    gifti_data = utils.load_surface(species, side)

    vertices = utils.extract_gifti_vertices(gifti_data)
    faces = utils.extract_gifti_faces(gifti_data)

    return schemas.Surface(
        name=f"{species}_{side}",
        xCoordinate=vertices[:, 0].tolist(),
        yCoordinate=vertices[:, 1].tolist(),
        zCoordinate=vertices[:, 2].tolist(),
        iFaces=faces[:, 0].tolist(),
        jFaces=faces[:, 1].tolist(),
        kFaces=faces[:, 2].tolist(),
    )


def get_feature_similarity(
    species: str, side: str, seed_vertex: int
) -> dict[str, list[float]]:
    """Fetches the human and macaque feature matrices.

    Args:
        species: The species to fetch the hemispheres for, valid values are
            'human' and 'macaque'.
        side: The hemisphere to fetch the surfaces for, valid values are 'left' and
            'right'.
        seed_vertex: The vertex to compute the similarity from.

    Returns:
        A feature matrix stored as a list of lists.
    """
    seed_features = utils.load_feature_data(species, side)
    seed_surface = utils.load_surface(species, side)

    all_species = ["human", "macaque"]
    all_sides = ["left", "right"]

    similarities = {}
    for target_species, target_side in itertools.product(all_species, all_sides):
        logger.info(
            "Computing feature similarity for %s_%s.", target_species, target_side
        )
        target_features = utils.load_feature_data(target_species, target_side)
        similarity = compute_similarity(
            seed_vertex,
            seed_surface,
            seed_features,
            target_features,
            roi_size=5,
            weighting="gaussian",
        )

        similarities[f"{target_species}_{target_side}"] = similarity.tolist()

    return similarities


def compute_similarity(
    seed_vertex: int,
    seed_surface: gifti.GiftiImage,
    seed_features: npt.ArrayLike,
    target_features: npt.ArrayLike,
    roi_size: int = 5,
    weighting: str = "uniform",
) -> np.ndarray:
    """Computes feature similarity. This uses three steps:
        0. Select the vertices within the ROI of interest.
        1. Compute the cosine similarity.
        2. Apply a Fisher-Z transform.
        3. Weight the contributions of each vertex in the ROI.

    Args:
        seed_vertex: The vertex to use as the seed.
        seed_surface: The surface where the seed is selected.
        seed_features: The features on the seed surface.
        target_features: The features on the target surface.
        roi_size: The size of the ROI to use in the same units
            as the surface.
        weighting: The weighting scheme to use, valid values are
            'uniform' and 'gaussian'.

    Returns:
        A vector of similarities per vertex.

    Notes:
        NaN values are replaced with 0 and Inf values are replaced with
        99999 as these are not JSON serializable.
    """
    logger.info("Computing vertices within the ROI.")
    vertices = utils.extract_gifti_vertices(seed_surface)
    seed_distances = distance.cdist(
        vertices, np.atleast_2d(vertices[seed_vertex, :])
    ).squeeze()
    roi_vertices = seed_distances < roi_size

    logger.info("Computing similarity.")
    cosine_similarity = pairwise.cosine_similarity(
        np.array(seed_features)[roi_vertices, :], target_features
    )
    cosine_similarity[cosine_similarity > 0.9999] = 0.9999
    fisher_z = np.arctanh(cosine_similarity)

    if weighting == "uniform":
        weights = None
    elif weighting == "gaussian":
        weights = np.exp(-seed_distances[roi_vertices] ** 2 / 2)
    else:
        logger.error("Invalid weighting scheme: %s", weighting)
        raise fastapi.HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid weighting scheme: {weighting}",
        )

    logger.info("Computing weighted average with method: %s.", weighting)
    weighted_average = np.average(fisher_z, axis=0, weights=weights)

    return weighted_average
