"""Utility functions for the entire app."""
import logging

import fastapi

from src.core import settings

config = settings.get_settings()
LOGGER_NAME = config.LOGGER_NAME

logger = logging.getLogger(LOGGER_NAME)


def add_cache_control(
    response: fastapi.Response, expiry_in_minutes: int = 525600
) -> fastapi.Response:
    """Adds cache control headers to a response.

    Args:
        response: The response to add the headers to.
        expiry_in_minutes: The number of minutes to set the expiry to.
            Defaults to 525600 (1 year).

    Returns:
        The response with the headers added.

    """
    logger.info("Adding cache control headers.")
    response.headers["Cache-Control"] = f"max-age={expiry_in_minutes * 60}"
    return response
