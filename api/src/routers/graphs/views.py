"""View definitions for the surfaces router."""

import logging
from typing import Literal

import fastapi

from src.core import settings
from src.routers.graphs import controller

config = settings.get_settings()
LOGGER_NAME = config.LOGGER_NAME

logger = logging.getLogger(LOGGER_NAME)

router = fastapi.APIRouter(prefix="/graphs", tags=["graphs"])


@router.get("/vertex")
def get_graph(
    vertex: int = fastapi.Query(..., description="The vertex to fetch the graphs for."),
    modality: str = fastapi.Query(
        ..., description="The modality of the graph.", example="thickness"
    ),
    source_species: Literal["human", "macaque"] = fastapi.Query(
        ..., description="The species of the source vertex."
    ),
    target_species: Literal["human", "macaque"] = fastapi.Query(
        ..., description="The species to return the graph for."
    ),
) -> fastapi.Response:
    """Fetches the graphs that contain the given vertex.

    Args:
        vertex: The vertex to fetch the graphs for.
        modality: The modality of the graph.
        source_species: The species of the source vertex.
        target_species: The species to return the graph for.

    Returns:
        A fastapi response containing the bytes of the graph.
    """
    logger.info("Calling GET /surfaces/graphs-by-vertex endpoint.")
    return controller.get_graph_by_vertex(
        vertex, modality, source_species, target_species
    )
