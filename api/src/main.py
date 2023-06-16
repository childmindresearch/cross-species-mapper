import logging

import fastapi
from fastapi.middleware import cors

from src.routers.surfaces import views

logger = logging.getLogger("Cross Species Mapper")

logger.setLevel(logging.INFO)

app = fastapi.FastAPI()
app.include_router(views.router)

app.add_middleware(
    cors.CORSMiddleware,
    allow_origins="*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
