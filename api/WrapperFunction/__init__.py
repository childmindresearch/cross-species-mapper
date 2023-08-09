"""Wrapper function for Azure Functions."""
# pylint: disable=invalid-name
import aiohttp
import azure.functions as func

from src import main as src_main


async def main(req: func.HttpRequest, context: func.Context) -> func.HttpResponse:
    """Each request is redirected to the ASGI handler."""
    async with aiohttp.ClientSession():
        return await func.AsgiMiddleware(src_main.app).handle(req, context)
