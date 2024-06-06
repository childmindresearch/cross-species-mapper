"""View definitions for the surfaces router."""

import logging
from typing import Literal, Set

import fastapi

from src.core import data_fetcher, settings
from src.routers.graphs import controller

config = settings.get_settings()
LOGGER_NAME = config.LOGGER_NAME

logger = logging.getLogger(LOGGER_NAME)

router = fastapi.APIRouter(prefix="/graphs", tags=["graphs"])


@router.get("/vertex-to-parcel")
def get_vertex_to_parcel_mapping(
    vertex_id: int = fastapi.Query(
        ..., description="The vertex ID to fetch the parcel for."
    ),
    species: Literal["human", "macaque"] = fastapi.Query(
        ..., description="The species to fetch the vertex to parcel mapping for."
    ),
) -> data_fetcher.VertexToParcelMapping:
    """Fetches the vertex to parcel mapping for the given species.

    Args:
        species: The species to fetch the vertex to parcel mapping for.

    Returns:
        A fastapi response containing the vertex to parcel mapping.
    """
    logger.info("Calling GET /surfaces/vertex-to-parcel endpoint.")
    return controller.get_vertex_to_parcel_mapping(vertex_id, species)


@router.get("/region")
def get_graph_by_region(
    region: str = fastapi.Query(..., description="The region to fetch the graphs for."),
    modality: str = fastapi.Query(..., description="The modality of the graph."),
    target_species: Literal["human", "macaque"] = fastapi.Query(
        ..., description="The species to return the graph for."
    ),
) -> fastapi.Response:
    """Fetches the graph for a given region, modality, and species.

    Args:
        region: The region to fetch the graphs for.
        modality: The modality of the graph.
        target_species: The species to return the graph for.

    Returns:
        A fastapi response containing the bytes of the graph.
    """
    logger.info("Calling GET /surfaces/region endpoint.")
    return controller.get_graph_by_region(region, modality, target_species)


@router.get("/region-names")
def get_region_names(
    species: Literal["human", "macaque"] = fastapi.Query(
        ..., description="The species for which to get region names."
    ),
) -> Set[str]:
    """Fetches the region names for the given species.

    Args:
        species: The species for which to get region names.

    Returns:
        A set containing the region names.
    """
    logger.info("Calling GET /surfaces/region-names endpoint.")
    return controller.get_region_names(species)
