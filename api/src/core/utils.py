"""Utility functions for the entire app."""
import functools
import logging

import fastapi
import numpy as np
from fastapi import status
from nibabel import nifti1
from nibabel.gifti import gifti

from src.core import data, settings

config = settings.get_settings()
LOGGER_NAME = config.LOGGER_NAME

logger = logging.getLogger(LOGGER_NAME)


def add_cache_control(
    response: fastapi.Response, expiry_in_minutes: int = 525600
) -> fastapi.Response:
    """Adds cache control headers to a response.

    Args:
        response: The response to add the headers to.
        expiry_in_minutes: The number of minutes to set the expiry to.
            Defaults to 525600 (1 year).

    Returns:
        The response with the headers added.

    """
    logger.info("Adding cache control headers.")
    response.headers["Cache-Control"] = f"max-age={expiry_in_minutes * 60}"
    return response


class Surface:
    """Convenience class for surface handling."""

    def __init__(self, species: str, side: str):
        self.species = species
        self.side = side
        self.gifti = self._load_surface(species, side)
        self.vertices = self._extract_gifti_vertices()
        self.faces = self._extract_gifti_faces()

    @staticmethod
    @functools.lru_cache(maxsize=None)
    def _load_surface(species: str, side: str) -> gifti.GiftiImage:
        """Cached call to surface data.

        Returns:
            The surface data.

        """
        logger.info("Loading surface data.")
        gii = data.get_surface_file(species, side)

        if not isinstance(gii, gifti.GiftiImage):
            logger.error("Could not load gifti file.")
            raise fastapi.HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Could not load gifti file.",
            )

        return gii

    def _extract_gifti_vertices(self) -> np.ndarray:
        """Extracts the vertices from a gifti surface.

        Args:
            surface: A nibabel surface object.

        Returns:
            A list of vertices.
        """
        logger.info("Extracting vertices from surface.")
        for darray in self.gifti.darrays:
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

    def _extract_gifti_faces(self) -> np.ndarray:
        """Extracts the faces from a gifti surface.

        Args:
            surface: A nibabel surface object.

        Returns:
            A list of faces.
        """
        logger.info("Extracting faces from surface.")
        for darray in self.gifti.darrays:
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


@functools.lru_cache(maxsize=None)
def get_surface(species: str, side: str) -> Surface:
    """Cached call to surface data.

    Args:
        species: The species.
        side: The side.

    Returns:
        The surface data.

    """
    return Surface(species, side)
