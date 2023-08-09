"""Wrapper function for Azure Functions."""
# pylint: disable=invalid-name
import asyncio

import aiohttp
import azure.functions as func
import nest_asyncio

from src import main as src_main

nest_asyncio.apply()

APP = src_main.build_app()


async def main(req: func.HttpRequest, context: func.Context) -> func.HttpResponse:
    """Each request is redirected to the ASGI handler."""
    async with aiohttp.ClientSession():
        loop = asyncio.get_running_loop()
        return await loop.run_in_executor(
            None, func.AsgiMiddleware(APP).handle, req, context
        )
