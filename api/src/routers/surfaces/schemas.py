""" Output schemas for the surface router. """
from typing import List

import pydantic


class Surface(pydantic.BaseModel):
    """A schema for surface objects."""

    name: str = pydantic.Field(..., example="Human Surface Left")
    vertices: List[List[float]] = pydantic.Field(..., example=[[1, 2, 3]])
    faces: List[List[int]] = pydantic.Field(..., example=[[1, 2, 3]])
