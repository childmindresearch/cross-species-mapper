"""Endpoint tests for the surfaces router."""
from fastapi import status, testclient

from src import main

client = testclient.TestClient(main.app)


def test_cross_species_similarity() -> None:
    """Test that all expected feature vectors are returned."""
    expected_keys = ["human_left", "human_right", "macaque_left", "macaque_right"]

    response = client.get(
        "/api/v1/features/cross_species",
        params={"seed_species": "human", "seed_side": "left", "seed_vertex": 1},
    )

    assert response.status_code == status.HTTP_200_OK
    assert response.json().keys() == set(expected_keys)
    assert len(response.json()[expected_keys[0]]) == 10242


def test_get_neuroquery() -> None:
    """Test that all expected feature vectors are returned."""
    response = client.get(
        "/api/v1/features/neuroquery",
        params={"seed_vertex": 10241, "seed_species": "human", "seed_side": "left"},
    )

    assert response.status_code == status.HTTP_200_OK
    assert len(response.json()) == 10


def test_get_neuroquery_too_high_vertex() -> None:
    """Test that an error is returned upon requesting a too high vertex."""
    response = client.get(
        "/api/v1/features/neuroquery",
        params={"seed_vertex": 10242, "seed_species": "human", "seed_side": "left"},
    )

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.json()["detail"] == "Invalid vertex: 10242, valid range is 0-10241."
