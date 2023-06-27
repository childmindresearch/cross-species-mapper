"""Utility functions for the surfaces router."""
import functools
import logging
import pathlib

import fastapi
import nibabel
import numpy as np
from fastapi import status
from nibabel import nifti1
from nibabel.gifti import gifti
from src import settings

config = settings.get_settings()
SURFACE_DIR = config.DATA_DIR / "surfaces"
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
        logger.error(f"Could not load nifti file {nifti_file}")
        raise fastapi.HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not load nifti file {nifti_file}",
        )

    nifti_data = nifti.get_fdata()
    if remove_singleton:
        nifti_data = np.squeeze(nifti_data)

    return nifti_data


@functools.cache
def load_surface(species: str, side: str) -> gifti.GiftiImage:
    """Cached call to surface data.

    Returns:
        The surface data.

    """
    logger.info("Loading surface data.")
    surface_path = SURFACE_DIR / f"{species}_{side}_midthickness_10k_fs_lr.surf.gii"
    gii = nibabel.load(surface_path)

    if not isinstance(gii, gifti.GiftiImage):
        logger.error(f"Could not load gifti file {surface_path}")
        raise fastapi.HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not load gifti file {surface_path}",
        )

    return gii


def extract_gifti_vertices(surface: gifti.GiftiImage) -> np.ndarray:
    """Extracts the vertices from a gifti surface.

    Args:
        surface: A nibabel surface object.

    Returns:
        A list of vertices.
    """
    logger.info("Extracting vertices from surface.")
    for darray in surface.darrays:
        if darray.intent == nifti1.intent_codes["NIFTI_INTENT_POINTSET"]:
            vertices = darray.data
            break
    else:  # no break
        logger.error("Surface does not contain vertices.")
        raise fastapi.HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Surface does not contain vertices.",
        )
    return vertices


def extract_gifti_faces(surface: gifti.GiftiImage) -> np.ndarray:
    """Extracts the faces from a gifti surface.

    Args:
        surface: A nibabel surface object.

    Returns:
        A list of faces.
    """
    logger.info("Extracting faces from surface.")
    for darray in surface.darrays:
        if darray.intent == nifti1.intent_codes["NIFTI_INTENT_TRIANGLE"]:
            faces = darray.data
            break
    else:  # no break
        logger.error("Surface does not contain faces.")
        raise fastapi.HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Surface does not contain faces.",
        )
    return faces
