"""Unit tests for the surfaces controller."""
import nibabel
import numpy as np
import templateflow.api as templateflow_api

from src.routers.surfaces import controller


def test_extract_vertices() -> None:
    """Test that the vertices are extracted from a surface."""
    surface = templateflow_api.get(
        "fsLR", density="32k", suffix="midthickness", raise_empty=True, desc=None
    )[0]
    gifti = nibabel.load(surface)

    vertices = controller._extract_vertices(gifti)

    assert vertices.shape == (32492, 3)
    assert vertices.dtype == np.dtype("float32")


def test_extract_faces() -> None:
    """Test that the faces are extracted from a surface."""
    surface = templateflow_api.get(
        "fsLR", density="32k", suffix="midthickness", raise_empty=True, desc=None
    )[0]
    gifti = nibabel.load(surface)

    faces = controller._extract_faces(gifti)

    assert faces.shape == (64980, 3)
    assert faces.dtype == np.dtype("int32")
    assert np.all(faces >= 0)
