"""Settings for the API."""
import functools
import logging
import pathlib

import pydantic

CURRENT_DIR = pathlib.Path(__file__).parent


class Settings(pydantic.BaseSettings):  # mypy: ignore
    """Settings for the API."""

    LOGGER_NAME: str = "Cross Species Mapper API"
    DATA_DIR: pathlib.Path = pathlib.Path(CURRENT_DIR.parent / "data")


@functools.lru_cache()
def get_settings() -> Settings:
    """Cached fetcher for the API settings.

    Returns:
        The settings for the API.
    """

    return Settings()


def initialize_logger() -> None:
    """Initializes the logger for the API."""
    settings = get_settings()
    logger = logging.getLogger(settings.LOGGER_NAME)
    logger.setLevel(logging.INFO)

    formatter = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    )

    for handler in logger.handlers:
        handler.setFormatter(formatter)
