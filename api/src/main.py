"""Entrypoint for Uvicorn."""
from src import builder

app = builder.build_app()
