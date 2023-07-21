""" Output schemas for the surface router. """
import pydantic


class Surface(pydantic.BaseModel):
    """A schema for surface objects."""

    name: str = pydantic.Field(..., example="Human Surface Left")
    vertices: list[list[float]] = pydantic.Field(..., example=[[1, 2, 3]])
    faces: list[list[int]] = pydantic.Field(..., example=[[1, 2, 3]])
