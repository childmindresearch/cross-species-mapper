""" Output schemas for the surface router. """
import pydantic


class Surface(pydantic.BaseModel):
    """A schema for surface objects."""

    name: str = pydantic.Field(..., example="Human Surface Left")
    xCoordinate: list[int] = pydantic.Field(..., example=[1, 2, 3])
    yCoordinate: list[int] = pydantic.Field(..., example=[1, 2, 3])
    zCoordinate: list[int] = pydantic.Field(..., example=[1, 2, 3])
    iFaces: list[int] = pydantic.Field(..., example=[1, 2, 3])
    jFaces: list[int] = pydantic.Field(..., example=[1, 2, 3])
    kFaces: list[int] = pydantic.Field(..., example=[1, 2, 3])
