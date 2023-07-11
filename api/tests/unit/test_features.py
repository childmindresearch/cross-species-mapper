# pylint: disable=protected-access
import numpy as np
from sklearn.metrics import pairwise

from src.routers.features import controller, schemas, utils


def test_world_coordinates_to_voxel_coordinates() -> None:
    """Test world_coordinates_to_voxel_coordinates."""
    voxel_coordinates = controller._world_coordinates_to_matrix_coordinates([0, 0, 0])

    assert (voxel_coordinates == (45, 63, 36)).all()


def test_cosine_similarity() -> None:
    """Test cosine_similarity."""
    a = np.array([[1, 2, 3], [4, 5, 6]])
    b = np.array([[7, 8, 9], [10, 11, 12]])
    expected = pairwise.cosine_similarity(a, b)

    actual = utils._cosine_similarity(a, b)

    assert np.allclose(actual, expected)
