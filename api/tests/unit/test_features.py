# pylint: disable=protected-access
from src.routers.features import controller, schemas


def test_world_coordinates_to_voxel_coordinates() -> None:
    """Test world_coordinates_to_voxel_coordinates."""
    voxel_coordinates = controller._world_coordinates_to_matrix_coordinates([0, 0, 0])

    assert (voxel_coordinates == (45, 63, 36)).all()
