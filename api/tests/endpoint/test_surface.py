"""Endpoint tests for the surfaces router."""
from fastapi import status, testclient

from src import main

client = testclient.TestClient(main.app)


def test_get_hemispheres() -> None:
    """Test that the hemispheres are returned."""
    response = client.get(
        "/surfaces/hemispheres", params={"species": "human", "side": "left"}
    )

    assert response.status_code == status.HTTP_200_OK
    assert response.json().keys() == {
        "iFaces",
        "jFaces",
        "kFaces",
        "name",
        "xCoordinate",
        "yCoordinate",
        "zCoordinate",
    }


def test_get_feature_similarity() -> None:
    """Test that all expected feature vectors are returned."""
    expected_keys = ["human_left", "human_right", "macaque_left", "macaque_right"]

    response = client.get(
        "/surfaces/similarity",
        params={"seed_species": "human", "seed_side": "left", "seed_vertex": 1},
    )

    assert response.status_code == status.HTTP_200_OK
    assert response.json().keys() == set(expected_keys)
    assert len(response.json()[expected_keys[0]]) == 10242
