"""Endpoint tests for the surfaces router."""
from fastapi import status, testclient

from src import main

client = testclient.TestClient(main.app)


def test_get_nimare_features_success() -> None:
    """Test that the expected features are returned."""
    response = client.get(
        "/features/nimare",
        params={
            "x": 0,
            "y": 0,
            "z": 0,
        },
    )

    assert response.status_code == status.HTTP_200_OK
    assert isinstance(response.json()["features"][0]["name"], str)
    assert isinstance(response.json()["features"][0]["correlation"], float)


def test_get_nimare_features_bad_coordinates() -> None:
    """Test that the expected features are returned."""
    response = client.get(
        "/features/nimare",
        params={
            "x": -99999,
            "y": 0,
            "z": 0,
        },
    )

    assert response.status_code == status.HTTP_400_BAD_REQUEST


def test_cross_species_similarity() -> None:
    """Test that all expected feature vectors are returned."""
    expected_keys = ["human_left", "human_right", "macaque_left", "macaque_right"]

    response = client.get(
        "/features/cross_species",
        params={"seed_species": "human", "seed_side": "left", "seed_vertex": 1},
    )

    assert response.status_code == status.HTTP_200_OK
    assert response.json().keys() == set(expected_keys)
    assert len(response.json()[expected_keys[0]]) == 10242
