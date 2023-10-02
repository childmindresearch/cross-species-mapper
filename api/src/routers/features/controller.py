""" Controller for the features router """
from __future__ import annotations

import itertools
import logging
from typing import Dict, List

import fastapi
from fastapi import status

from src.core import data_fetcher, settings
from src.routers.features import utils as features_utils

config = settings.get_settings()
LOGGER_NAME = config.LOGGER_NAME
logger = logging.getLogger(LOGGER_NAME)


def get_cross_species_features(
    species: str, side: str, seed_vertex: int
) -> Dict[str, List[float]]:
    """Fetches the human and macaque feature matrices.

    Args:
        species: The species to fetch the hemispheres for, valid values are
            'human' and 'macaque'.
        side: The hemisphere to fetch the surfaces for, valid values are 'left' and
            'right'.
        seed_vertex: The vertex to compute the similarity from.

    Returns:
        A feature matrix stored as a list of lists.
    """
    seed_features = features_utils.load_feature_data(species, side)
    surface = data_fetcher.get_surface_data(species=species, side=side)

    all_species = ["human", "macaque"]
    all_sides = ["left", "right"]

    similarities = {}
    for target_species, target_side in itertools.product(all_species, all_sides):
        logger.info(
            "Computing feature similarity for %s_%s.", target_species, target_side
        )
        target_features = features_utils.load_feature_data(target_species, target_side)
        similarity = features_utils.compute_similarity(
            seed_vertex,
            surface,
            seed_features,
            target_features,
            roi_size=5,
            weighting="gaussian",
        )

        similarities[f"{target_species}_{target_side}"] = similarity.tolist()

    return similarities


def get_neuroquery(species: str, side: str, vertex: int) -> List[str]:
    """Fetches the neuroquery features for the given vertex.

    Args:
        species: The species to fetch the hemispheres for, valid values are
            'human' and 'macaque'.
        side: The hemisphere to fetch the surfaces for, valid values are 'left' and
            'right'.
        vertex: The vertex to compute the similarity from.

    Returns:
        A list of neuroquery features.
    """
    if species != "human":
        raise fastapi.HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only human has been implemented, not {seed_species}.",
        )

    neuroquery_data = data_fetcher.get_neuroquery_data()

    if side == "right":
        vertex += len(neuroquery_data) // 2
    if side == "left" and vertex >= len(neuroquery_data) // 2:
        raise fastapi.HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid vertex: {vertex}, valid range is 0-{len(neuroquery_data) // 2 - 1}.",
        )

    try:
        return neuroquery_data[vertex]
    except IndexError as exc_info:
        logger.error("IndexError: %s", exc_info)
        raise fastapi.HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid vertex: {vertex}, valid range is 0-{len(neuroquery_data) // 2 - 1}.",
        )
