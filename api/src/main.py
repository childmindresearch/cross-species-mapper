"""Main module for the API."""
import logging

import fastapi
from fastapi.middleware import cors
from src import settings
from src.routers.surfaces import views

config = settings.get_settings()
LOGGER_NAME = config.LOGGER_NAME

settings.initialize_logger()
logger = logging.getLogger(LOGGER_NAME)

logger.info("Starting API.")
app = fastapi.FastAPI()

logger.info("Adding routers.")
app.include_router(views.router)

logger.info("Adding CORS middleware.")
app.add_middleware(
    cors.CORSMiddleware,
    allow_origins="*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
