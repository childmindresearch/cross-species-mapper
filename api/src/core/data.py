"""Module for data access."""
import logging
import tempfile

import nibabel
import numpy as np
from azure.storage import blob

from src.core import settings

config = settings.get_settings()
AZURE_STORAGE_BLOB_URL = config.AZURE_STORAGE_BLOB_URL
AZURE_ACCESS_KEY = config.AZURE_ACCESS_KEY

logger = logging.getLogger(config.LOGGER_NAME)


def get_blob_container() -> blob.ContainerClient:
    """Gets the blob container for the API.

    Returns:
        The blob container.

    """
    logger.debug("Getting blob container.")
    blob_client = blob.BlobServiceClient(
        account_url=AZURE_STORAGE_BLOB_URL,
        credential=AZURE_ACCESS_KEY.get_secret_value(),
    )

    return blob_client.get_container_client("main")


def download_file_from_blob(
    blob_filename: str,
    local_filename: str,
) -> None:
    """Reads a file from blob storage.

    Args:
        blob_filename: The filename of the file in blob storage.
        local_filename: The filename of the file locally.

    """
    logger.debug("Reading file from blob.")
    blob_client = get_blob_container()
    file_blob = blob_client.get_blob_client(blob_filename)
    contents = file_blob.download_blob().readall()
    with open(local_filename, "wb") as f:
        f.write(contents)


def get_feature_data(species: str, side: str) -> np.ndarray:
    """Gets the feature file for the given species and side.

    Args:
        species: The species.
        side: The side.

    Returns:
        The feature file.

    """
    logger.info("Getting feature file.")
    filename = f"{species}_{side}_gradient_10k_fs_lr.nii.gz"
    with tempfile.NamedTemporaryFile(suffix=".nii.gz") as temp_file:
        download_file_from_blob(filename, temp_file.name)
        return nibabel.load(temp_file.name).get_fdata()  # type: ignore[attr-defined]


def get_surface_file(species: str, side: str) -> nibabel.GiftiImage:
    """Gets the surface file for the given species and side.

    Args:
        species: The species.
        side: The side.

    Returns:
        The surface file.

    """
    logger.info("Getting surface file.")
    filename = f"{species}_{side}_inflated_10k_fs_lr.surf.gii"
    with tempfile.NamedTemporaryFile(suffix=".surf.gii") as temp_file:
        download_file_from_blob(filename, temp_file.name)
        return nibabel.load(temp_file.name)  # type: ignore[return-value]
