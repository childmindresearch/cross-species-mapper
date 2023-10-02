""" View definitions for the features router. """
from __future__ import annotations

import logging
from typing import Dict, List

import fastapi
from fastapi import status

from src.core import settings, utils
from src.routers.features import controller, schemas

router = fastapi.APIRouter(prefix="/features", tags=["features"])

config = settings.get_settings()
LOGGER_NAME = config.LOGGER_NAME
logger = logging.getLogger(LOGGER_NAME)


@router.get(
    "/cross_species",
    responses={status.HTTP_200_OK: {"model": List[schemas.FeatureSimilarity]}},
)
def get_feature_similarity(
    response: fastapi.Response,
    species: str = fastapi.Query(
        ..., example="human", description="The species to fetch the hemispheres for."
    ),
    side: str = fastapi.Query(
        ..., example="left", description="The hemisphere to fetch the surfaces for."
    ),
    vertex: int = fastapi.Query(
        ...,
        example=1,
        description="The vertex to fetch the feature similarity for, 0-indexed.",
    ),
) -> Dict[str, List[float]]:
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
    response = utils.add_cache_control(response)
    return controller.get_cross_species_features(species, side, vertex)


@router.get(
    "/neuroquery",
    responses={status.HTTP_200_OK: {"model": List[str]}},
)
def get_neuroquery(
    response: fastapi.Response,
    species: str = fastapi.Query(
        ..., example="human", description="The species to fetch the hemispheres for."
    ),
    side: str = fastapi.Query(
        ..., example="left", description="The hemisphere to fetch the surfaces for."
    ),
    vertex: int = fastapi.Query(
        ...,
        example=1,
        description="The vertex to fetch the neuroquery for, 0-indexed.",
    ),
) -> List[str]:
    """Fetches the neuroquery for the given vertex.

    Args:
        species: The species to fetch the hemispheres for, valid values are
            'human' and 'macaque'.
        side: The hemisphere to fetch the surfaces for, valid values are 'left' and
            'right'.
        vertex: The vertex to fetch the neuroquery for, 0-indexed.

    Returns:
        A Pydantic BaseClass containing the neuroquery for the given vertex.
    """
    logger.info("Calling GET /surfaces/neuroquery endpoint.")
    response = utils.add_cache_control(response)
    return controller.get_neuroquery(species, side, vertex)
