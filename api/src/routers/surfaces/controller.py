"""Controller for the surface endpoints."""

import logging

from src.core import data_fetcher, settings
from src.routers.surfaces import schemas

config = settings.get_settings()
LOGGER_NAME = config.LOGGER_NAME

logger = logging.getLogger(LOGGER_NAME)


def get_hemispheres(species: str, side: str) -> schemas.Surface:
    """Fetches the human and macaque fsLR-10k surfaces.

    Args:
        species: The species to fetch the hemispheres for, valid values are
            'human' and 'macaque'.
        side: The hemisphere to fetch the surfaces for, valid values are 'left' and
            'right'.

    Returns:
        A hemispheric surface for humans or macaques.
    """
    logger.info("Fetching %s_%s surface.", species, side)
    surface = data_fetcher.get_surface_data(species=species, side=side)

    return schemas.Surface(
        name=f"{species}_{side}",
        vertices=surface.vertices.tolist(),
        faces=surface.faces.tolist(),
    )
