"""Main module for the API."""
import asyncio
import logging
import time

import fastapi
from fastapi import responses, status
from fastapi.middleware import cors

from src.core import settings
from src.routers.features import views as feature_views
from src.routers.surfaces import views as surface_views

config = settings.get_settings()
LOGGER_NAME = config.LOGGER_NAME
REQUEST_TIMEOUT = config.REQUEST_TIMEOUT

settings.initialize_logger()
logger = logging.getLogger(LOGGER_NAME)

api = fastapi.APIRouter(prefix="/api")
api.include_router(feature_views.router)
api.include_router(surface_views.router)

logger.info("Starting API.")
app = fastapi.FastAPI()
app.include_router(api)

logger.info("Adding CORS middleware.")
app.add_middleware(
    cors.CORSMiddleware,
    allow_origins="*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def timeout_middleware(request: fastapi.Request, call_next):
    """Middleware function that adds a timeout to the request processing time. If
    the request processing time exceeds the specified timeout, a 504 Gateway
    Timeout response is returned.
    """
    start_time = time.time()
    try:
        return await asyncio.wait_for(call_next(request), timeout=REQUEST_TIMEOUT)
    except asyncio.TimeoutError:
        process_time = time.time() - start_time
        return responses.JSONResponse(
            {
                "detail": "Request processing time exceeded limit",
                "processing_time": process_time,
            },
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
        )
