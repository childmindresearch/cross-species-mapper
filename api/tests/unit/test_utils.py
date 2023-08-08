"""Unit tests for the surfaces controller."""
import numpy as np
from src.core import utils as src_utils
from src.routers.features import utils as features_utils


def test_surface_vertices() -> None:
    """Test that the vertices are extracted from a surface."""
    surface = src_utils.Surface("human", "left")

    assert surface.vertices.shape == (10242, 3)
    assert surface.vertices.dtype == np.dtype("float32")


def test_extract_faces() -> None:
    """Test that the faces are extracted from a surface."""
    surface = src_utils.Surface("human", "left")

    assert surface.faces.shape == (20480, 3)
    assert surface.faces.dtype == np.dtype("int32")


def test_compute_similarity() -> None:
    """Test that the similarity between two feature vectors is computed correctly."""
    seed = 1
    seed_surface = src_utils.Surface("human", "left")
    seed_features = np.ones((10242, 10))
    target_features = np.ones((10242, 10))
    roi_size = 10
    weighting = "uniform"

    similarity = features_utils.compute_similarity(
        seed, seed_surface, seed_features, target_features, roi_size, weighting
    )

    assert similarity.shape == (10242,)
    assert similarity.dtype == np.dtype("float64")
    assert np.allclose(similarity, np.arctanh(0.9999))
