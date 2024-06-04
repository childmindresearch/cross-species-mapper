"""View definitions for the surfaces router."""

import logging
from typing import Literal

import fastapi

from src.core import settings
from src.routers.graphs import controller

config = settings.get_settings()
LOGGER_NAME = config.LOGGER_NAME

logger = logging.getLogger(LOGGER_NAME)

router = fastapi.APIRouter(prefix="/graph", tags=["graph"])


@router.get("/graphs-by-vertex")
def get_graph(
    vertex: int,
    modality: str,
    source_species: Literal["human", "macaque"],
    target_species: Literal["human", "macaque"],
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
