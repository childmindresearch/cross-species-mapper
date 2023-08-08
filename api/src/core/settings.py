"""Settings for the API."""
import functools
import logging
import pathlib

import pydantic

DATA_DIR = pathlib.Path(__file__).parent.parent.parent / "data"


class Settings(pydantic.BaseSettings):  # type: ignore[valid-type, misc]
    """Settings for the API."""

    LOGGER_NAME: str = pydantic.Field("Cross Species Mapper API", env="LOGGER_NAME")

    AZURE_STORAGE_BLOB_URL: str = pydantic.Field(..., env="AZURE_STORAGE_BLOB_URL")
    AZURE_ACCESS_KEY: str = pydantic.Field(..., env="AZURE_ACCESS_KEY")

    REQUEST_TIMEOUT: float = pydantic.Field(10.0, env="REQUEST_TIMEOUT")


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

    ch = logging.StreamHandler()
    ch.setFormatter(formatter)
    logger.addHandler(ch)
