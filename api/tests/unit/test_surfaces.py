"""Unit tests for the surfaces controller."""
import numpy as np
from src.routers.surfaces import controller, utils


def test_extract_vertices() -> None:
    """Test that the vertices are extracted from a surface."""
    gifti = utils.load_surface("human", "left")

    vertices = utils.extract_gifti_vertices(gifti)

    assert vertices.shape == (10242, 3)
    assert vertices.dtype == np.dtype("float32")


def test_extract_faces() -> None:
    """Test that the faces are extracted from a surface."""
    gifti = utils.load_surface("human", "left")

    faces = utils.extract_gifti_faces(gifti)

    assert faces.shape == (20480, 3)
    assert faces.dtype == np.dtype("int32")
    assert np.all(faces >= 0)


def test_compute_similarity() -> None:
    """Test that the similarity between two feature vectors is computed correctly."""
    seed = 1
    seed_surface = utils.load_surface("human", "left")
    seed_features = np.ones((10242, 10))
    target_features = np.ones((10242, 10))
    roi_size = 10
    weighting = "uniform"

    similarity = controller.compute_similarity(
        seed, seed_surface, seed_features, target_features, roi_size, weighting
    )

    assert similarity.shape == (10242,)
    assert similarity.dtype == np.dtype("float64")
    assert np.allclose(np.tanh(similarity), 1)
