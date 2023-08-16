"""Wrapper function for Azure Functions."""
# pylint: disable=invalid-name
import asyncio

import aiohttp
import azure.functions as func
import nest_asyncio

from src import builder

nest_asyncio.apply()
app = builder.build_app()


async def main(req: func.HttpRequest, context: func.Context) -> func.HttpResponse:
    """Each request is redirected to the ASGI handler."""
    async with aiohttp.ClientSession():
        loop = asyncio.get_running_loop()
        return await loop.run_in_executor(
            None, func.AsgiMiddleware(app).handle, req, context
        )
