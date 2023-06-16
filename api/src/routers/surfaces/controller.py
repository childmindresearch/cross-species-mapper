"""Controller for the surface endpoints."""
import fastapi
import nibabel
import numpy as np
from fastapi import status
from nibabel import nifti1
from nibabel.gifti import gifti
from templateflow import api as templateflow_api

from src.routers.surfaces import schemas


def get_hemispheres() -> schemas.AllSurfaces:
    """Fetches the human fsLR-32k surfaces.

    Returns:
        A JSON-like schema containing the fsLR-32k surfaces.
    """
    surfaces = templateflow_api.get(
        "fsLR", density="32k", suffix="midthickness", raise_empty=True, desc=None
    )
    surfaces.sort()

    if len(surfaces) != 2:
        raise fastapi.HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Expected two hemisphere surfaces, found {len(surfaces)}.",
        )

    surface_schemas = []
    for surface in surfaces:
        gifti_data = nibabel.load(surface)
        vertices = _extract_vertices(gifti_data)
        faces = _extract_faces(gifti_data)

        surface_schemas.append(
            schemas.Surface(
                name=surface.name,
                xCoordinate=vertices[:, 0].tolist(),
                yCoordinate=vertices[:, 1].tolist(),
                zCoordinate=vertices[:, 2].tolist(),
                iFaces=faces[:, 0].tolist(),
                jFaces=faces[:, 1].tolist(),
                kFaces=faces[:, 2].tolist(),
            )
        )
    output_schema = schemas.AllSurfaces(
        fslr_32k_left=surface_schemas[0], fslr_32k_right=surface_schemas[1]
    )
    return output_schema


def _extract_vertices(surface: gifti.GiftiImage) -> np.ndarray:
    """Extracts the vertices from a surface.

    Args:
        surface: A nibabel surface object.

    Returns:
        A list of vertices.
    """
    for darray in surface.darrays:
        if darray.intent == nifti1.intent_codes["NIFTI_INTENT_POINTSET"]:
            vertices = darray.data
            break
    else:  # no break
        raise fastapi.HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Surface does not contain vertices.",
        )
    return vertices


def _extract_faces(surface: gifti.GiftiImage) -> np.ndarray:
    """Extracts the faces from a surface.

    Args:
        surface: A nibabel surface object.

    Returns:
        A list of faces.
    """
    for darray in surface.darrays:
        if darray.intent == nifti1.intent_codes["NIFTI_INTENT_TRIANGLE"]:
            faces = darray.data
            break
    else:  # no break
        raise fastapi.HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Surface does not contain faces.",
        )
    return faces
