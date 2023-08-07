"""Wrapper function for Azure Functions."""
import azure.functions as func
import nest_asyncio

from src import main as src_main

nest_asyncio.apply()


async def main(req: func.HttpRequest, context: func.Context) -> func.HttpResponse:
    """Each request is redirected to the ASGI handler."""
    return func.AsgiMiddleware(src_main.app).handle(req, context)
