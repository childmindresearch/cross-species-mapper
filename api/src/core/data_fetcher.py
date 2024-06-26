"""Module for data access."""

import dataclasses
import functools
import gzip
import json
import logging
import tempfile
from typing import List

import fastapi
import h5py
import numpy as np
from azure.storage import blob

from src.core import settings, types

config = settings.get_settings()
ENVIRONMENT = config.ENVIRONMENT
DATA_DIR = config.DATA_DIR
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


def download_blob_to_bytes(blob_filename: str) -> bytes:
    """Downloads a blob file to bytes.

    Args:
        blob_filename: The filename of the file in blob storage.

    Returns:
        The file contents as bytes.

    """
    logger.debug("Downloading file from blob.")
    blob_client = get_blob_container()
    file_blob = blob_client.get_blob_client(blob_filename)
    return file_blob.download_blob().readall()


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
    contents = download_blob_to_bytes(blob_filename)
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
    filename = f"{species}_{side}_gradient_10k_fs_lr.h5"

    if ENVIRONMENT == "development":
        filepath = str(DATA_DIR / filename)
    else:
        temp_file = tempfile.NamedTemporaryFile(suffix=".h5")
        filepath = temp_file.name
        download_file_from_blob(filename, filepath)

    with h5py.File(filepath, "r") as h5file:
        return np.array(h5file["data"])


def get_neuroquery_data(vertex: int) -> List[List[str]]:
    """Gets the neuroquery data.

    Returns:
        The neuroquery data.

    Notes:
        Always fetched from Azure as this is too large for Git.

    """
    logger.info("Getting neuroquery data.")
    filename = f"neuroquery_features_10k_{str(vertex).zfill(6)}.json.gz"

    temp_file = tempfile.NamedTemporaryFile(suffix=".json.gz")
    filepath = temp_file.name
    download_file_from_blob(filename, filepath)

    with gzip.open(filepath, "rb") as file_buffer:
        return json.load(file_buffer)


def get_surface_data(species: str, side: str) -> types.Surface:
    """Gets the surface file for the given species and side.

    Args:
        species: The species.
        side: The side.

    Returns:
        The surface file.

    """
    logger.info("Getting surface file.")
    filename = f"{species}_{side}_inflated_10k_fs_lr.h5"
    if ENVIRONMENT == "development":
        filepath = str(DATA_DIR / filename)
    else:
        temp_file = tempfile.NamedTemporaryFile(suffix=".h5")
        filepath = temp_file.name
        download_file_from_blob(filename, filepath)

    with h5py.File(filepath, "r") as h5file:
        name = h5file["name"][()].decode("utf-8")
        vertices = h5file["vertices"][()]
        faces = h5file["faces"][()]

    return types.Surface(name=name, vertices=vertices, faces=faces)


@functools.lru_cache(maxsize=None)
def get_surface(species: str, side: str) -> types.Surface:
    """Cached call to surface data.

    Args:
        species: The species.
        side: The side.

    Returns:
        The surface data.

    """
    return get_surface_data(species=species, side=side)


@dataclasses.dataclass
class VertexToParcelMapping:
    """Vertex to parcel mapping."""

    AparcLabel: int
    AparcName: str
    MarkovLabel: int
    MarkovName: str


def get_vertex_to_parcel_mapping(species: str) -> List[VertexToParcelMapping]:
    """Gets the vertex to parcel mapping.

    Args:
        species: The source species.

    Returns:
        The vertex to parcel mapping.

    """
    logger.info("Getting vertex to parcel mapping.")
    if species == "human":
        filename = "svgs/human_to_monkey_mapping.json"
    elif species == "macaque":
        filename = "svgs/monkey_to_human_mapping.json"
    else:
        raise fastapi.HTTPException(
            status_code=400,
            detail="Invalid species.",
        )
    with tempfile.NamedTemporaryFile(suffix=".json") as json_file:
        download_file_from_blob(filename, json_file.name)
        with open(json_file.name, "r") as f:
            data_as_dicts = json.load(f)
        return [VertexToParcelMapping(**data) for data in data_as_dicts]
