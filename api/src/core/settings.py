"""Settings for the API."""
import functools
import logging
import sys

import pydantic


class Settings(pydantic.BaseSettings):  # type: ignore[valid-type, misc]
    """Settings for the API."""

    LOGGER_NAME: str = pydantic.Field("Cross Species Mapper API", env="LOGGER_NAME")

    AZURE_STORAGE_BLOB_URL: str = pydantic.Field(..., env="AZURE_STORAGE_BLOB_URL")
    AZURE_ACCESS_KEY: pydantic.SecretStr = pydantic.Field(..., env="AZURE_ACCESS_KEY")


@functools.lru_cache()
def get_settings() -> Settings:
    """Cached fetcher for the API settings.

    Returns:
        The settings for the API.
    """

    return Settings()  # type: ignore[call-arg]


def initialize_logger() -> None:
    """Initializes the logger for the API."""
    settings = get_settings()
    logger = logging.getLogger(settings.LOGGER_NAME)
    logger.setLevel(logging.INFO)

    formatter = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    )

    handler = logging.StreamHandler(stream=sys.stdout)
    handler.setFormatter(formatter)
    logger.addHandler(handler)
