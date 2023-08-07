""" Utility functions for the features router. """
from __future__ import annotations

import functools
import itertools
import logging
from typing import List

import fastapi
import numpy as np
import numpy.typing as npt
from fastapi import status
from sklearn import neighbors

from src.core import data, settings
from src.core import utils as src_utils

config = settings.get_settings()
LOGGER_NAME = config.LOGGER_NAME

logger = logging.getLogger(LOGGER_NAME)


# Precompute surface distance cKDTree and keep in memory
TREE = {}
for local_species, local_side in itertools.product(
    ["human", "macaque"], ["left", "right"]
):
    TREE[local_species + "_" + local_side] = neighbors.BallTree(
        src_utils.Surface(local_species, local_side).vertices
    )


@functools.lru_cache(maxsize=None)
def load_feature_data(
    species: str, side: str, remove_singleton: bool = True
) -> np.ndarray:
    """Cached call to feature data.

    Args:
        species: The species to fetch the features for, valid values are
            'human' and 'macaque'.
        side: The hemisphere to fetch the features for, valid values are 'left' and
            'right'.
        remove_singleton: Whether to remove the singleton dimension from the data.

    Returns:
        The feature data.

    """
    logger.info("Loading feature data.")
    nifti_data = data.get_feature_data(species, side)
    if remove_singleton:
        nifti_data = np.squeeze(nifti_data)

    return nifti_data


def compute_similarity(
    seed_vertex: int,
    seed_surface: src_utils.Surface,
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
    indices, distances = TREE[
        seed_surface.species + "_" + seed_surface.side
    ].query_radius(
        [seed_surface.vertices[seed_vertex, :]], r=roi_size, return_distance=True
    )

    logger.info("Computing similarity.")
    cosine_similarity = _cosine_similarity(
        np.array(seed_features)[indices[0], :], target_features
    )
    fisher_z = np.arctanh(cosine_similarity)

    if weighting == "uniform":
        weights = None
    elif weighting == "gaussian":
        weights = np.exp(-(distances[0] ** 2) / 2)
    else:
        logger.error("Invalid weighting scheme: %s", weighting)
        raise fastapi.HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid weighting scheme: {weighting}",
        )

    logger.info("Computing weighted average with method: %s.", weighting)
    weighted_average = np.average(fisher_z, axis=0, weights=weights)

    return weighted_average


def create_sphere(size: List[int], center: List[int], radius: int) -> np.ndarray:
    """Creates a sphere of a given size and radius inside a numpy array.

    Args:
        size: The size of the array.
        center: The center of the sphere.
        radius: The radius of the sphere.

    Returns:
        A numpy array with the sphere inside.

    """
    if len(size) != len(center):
        raise ValueError("Size and center must have the same length.")

    center_array = np.array(center).reshape(*[1] * len(size), len(size))

    mesh = np.meshgrid(*[np.arange(dimension) for dimension in size], indexing="ij")
    grid = np.stack(mesh, axis=-1) - center_array

    sphere = (np.linalg.norm(grid, axis=-1) < radius).astype(np.int32)

    return sphere


def _cosine_similarity(
    seed_features: npt.ArrayLike, target_features: npt.ArrayLike
) -> np.ndarray:
    """Computes the cosine similarity between two sets of features.

    Args:
        seed_features: The features on the seed surface.
        target_features: The features on the target surface.

    Returns:
        A vector of similarities per vertex.

    """
    cosine_similarity = np.dot(seed_features, np.transpose(target_features)) / (
        np.linalg.norm(seed_features, axis=1)[:, np.newaxis]
        * np.linalg.norm(target_features, axis=1)[np.newaxis, :]
    )
    cosine_similarity[cosine_similarity > 0.9999] = 0.9999
    cosine_similarity[cosine_similarity < -0.9999] = -0.9999
    cosine_similarity[np.isnan(cosine_similarity)] = 0
    return cosine_similarity
