"""Utility functions for the entire app."""
import functools
import logging
import pathlib
import tempfile
from typing import Union

import fastapi
import nibabel
import numpy as np
import requests
from fastapi import status
from nibabel import nifti1
from nibabel.gifti import gifti

from src import settings

config = settings.get_settings()
LOGGER_NAME = config.LOGGER_NAME

logger = logging.getLogger(LOGGER_NAME)

DATA_URLS = {
    "surface_human_left": "https://github.com/cmi-dair/cross-species-mapper/raw/main/api/data/surfaces/human_left_inflated_10k_fs_lr.surf.gii?download=",
    "surface_human_right": "https://github.com/cmi-dair/cross-species-mapper/raw/main/api/data/surfaces/human_right_inflated_10k_fs_lr.surf.gii?download=",
    "surface_macaque_left": "https://github.com/cmi-dair/cross-species-mapper/raw/main/api/data/surfaces/macaque_left_inflated_10k_fs_lr.surf.gii?download=",
    "surface_macaque_right": "https://github.com/cmi-dair/cross-species-mapper/raw/main/api/data/surfaces/macaque_left_inflated_10k_fs_lr.surf.gii?download=",
}


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
        with tempfile.TemporaryDirectory() as tempdir:
            surface_path = pathlib.Path(tempdir) / "surface.gii"
            with open(surface_path, "wb") as f:
                request = requests.get(DATA_URLS[f"surface_{species}_{side}"])
                f.write(request.content)
                gii = nibabel.load(surface_path)

        if not isinstance(gii, gifti.GiftiImage):
            logger.error("Could not load gifti file %s.", surface_path)
            raise fastapi.HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Could not load gifti file {surface_path}",
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


def download_file(filename: Union[str, pathlib.Path], url: str):
    """Download a file from a URL.

    Args:
        filename: The filename to save the file as.
        url: The URL to download from.

    """
    logger.info("Downloading file %s from %s.", filename, url)
    with tempfile.TemporaryDirectory() as tmp_dir:
        tmp_path = pathlib.Path(tmp_dir) / filename
        request = requests.get(url, stream=True)
        with open(tmp_path, "wb") as f:
            for chunk in request.iter_content(chunk_size=1024):
                if chunk:
                    f.write(chunk)

        tmp_path.rename(filename)
