"""Controller for the surface endpoints."""
import logging

from src import settings, utils
from src.routers.surfaces import schemas

config = settings.get_settings()
SURFACE_DIR = config.DATA_DIR / "surfaces"
FEATURE_DIR = config.DATA_DIR / "features"
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
    surface = utils.Surface(species=species, side=side)

    return schemas.Surface(
        name=f"{species}_{side}",
        xCoordinate=surface.vertices[:, 0].tolist(),
        yCoordinate=surface.vertices[:, 1].tolist(),
        zCoordinate=surface.vertices[:, 2].tolist(),
        iFaces=surface.faces[:, 0].tolist(),
        jFaces=surface.faces[:, 1].tolist(),
        kFaces=surface.faces[:, 2].tolist(),
    )
