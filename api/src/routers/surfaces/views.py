"""View definitions for the surfaces router."""
import logging

import fastapi
from fastapi import status

from src import settings
from src.routers.surfaces import controller, schemas

config = settings.get_settings()
LOGGER_NAME = config.LOGGER_NAME

logger = logging.getLogger(LOGGER_NAME)

router = fastapi.APIRouter(prefix="/surfaces", tags=["surfaces"])


@router.get("/hemispheres", responses={status.HTTP_200_OK: {"model": schemas.Surface}})
def get_hemispheres(
    species: str = fastapi.Query(
        ..., example="human", description="The species to fetch the hemispheres for."
    ),
    side: str = fastapi.Query(
        ..., example="left", description="The hemisphere to fetch the surfaces for."
    ),
) -> schemas.Surface:
    """Fetches the human and macaque hemisphere surfaces.

    Args:
        species: The species to fetch the hemispheres for, valid values are
            'human' and 'macaque'.
        side: The hemisphere to fetch the surfaces for, valid values are 'left' and
            'right'.

    Returns:
        A Pydantic BaseClass containing the surface.
    """
    logger.info("Calling GET /surfaces/hemispheres endpoint.")
    return controller.get_hemispheres(species, side)


@router.get(
    "/similarity",
    responses={status.HTTP_200_OK: {"model": list[schemas.FeatureSimilarity]}},
)
def get_feature_similarity(
    seed_species: str = fastapi.Query(
        ..., example="human", description="The species to fetch the hemispheres for."
    ),
    seed_side: str = fastapi.Query(
        ..., example="left", description="The hemisphere to fetch the surfaces for."
    ),
    seed_vertex: int = fastapi.Query(
        ...,
        example=1,
        description="The vertex to fetch the feature similarity for, 0-indexed.",
    ),
) -> dict[str, list[float]]:
    """Fetches the human and macaque feature matrices.

    Args:
        species: The species where the seed is, valid values are
            'human' and 'macaque'.
        side: The hemisphere where the seed is, valid values are 'left' and
            'right'.
        vertex: The vertex to fetch the feature similarity for, 0-indexed.

    Returns:
        A Pydantic BaseClass containing the feature vectors for similarity to
        the seed vertex.
    """
    logger.info("Calling GET /surfaces/similarity endpoint.")
    return controller.get_feature_similarity(seed_species, seed_side, seed_vertex)
