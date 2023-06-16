"""Endpoint tests for the surfaces router."""
from fastapi import status, testclient

from src import main

client = testclient.TestClient(main.app)


def test_get_hemispheres() -> None:
    """Test that the hemispheres are returned."""
    response = client.get("/surface/hemispheres")

    assert response.status_code == status.HTTP_200_OK
    assert response.json().keys() == {"fslr_32k_left", "fslr_32k_right"}
