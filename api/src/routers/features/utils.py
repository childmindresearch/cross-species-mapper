""" Utility functions for the features router. """
import functools
import logging

import fastapi
import nibabel
import numpy as np
import numpy.typing as npt
from fastapi import status
from nibabel import nifti1
from scipy.spatial import distance
from sklearn.metrics import pairwise

from src import settings
from src import utils as src_utils

config = settings.get_settings()
FEATURE_DIR = config.DATA_DIR / "features"
LOGGER_NAME = config.LOGGER_NAME

logger = logging.getLogger(LOGGER_NAME)


@functools.cache
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
    nifti_file = FEATURE_DIR / f"{species}_{side}_gradient_10k_fs_LR.nii.gz"
    nifti = nibabel.load(nifti_file)

    if not isinstance(nifti, nifti1.Nifti1Image):
        logger.error("Could not load nifti file %s", nifti_file)
        raise fastapi.HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not load nifti file {nifti_file}",
        )

    nifti_data = nifti.get_fdata()
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
    seed_distances = distance.cdist(
        seed_surface.vertices, np.atleast_2d(seed_surface.vertices[seed_vertex, :])
    ).squeeze()
    roi_vertices = seed_distances < roi_size

    logger.info("Computing similarity.")
    cosine_similarity = pairwise.cosine_similarity(
        np.array(seed_features)[roi_vertices, :], target_features
    )
    # fisher_z = np.arctanh(cosine_similarity)

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
    weighted_average = np.average(cosine_similarity, axis=0, weights=weights)
    # weighted_average = np.average(fisher_z, axis=0, weights=weights)
    # weighted_average[np.isnan(weighted_average)] = 0
    # weighted_average[np.isinf(weighted_average)] = 99999
    return weighted_average


def create_sphere(size: list[int], center: list[int], radius: int) -> np.ndarray:
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

    mesh = np.meshgrid(*[np.arange(dimension) for dimension in size])
    grid = np.stack(mesh, axis=-1) - center_array

    sphere = (np.linalg.norm(grid, axis=-1) < radius).astype(np.int32)

    return sphere
