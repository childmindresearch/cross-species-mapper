""" Output schemas for the surface router. """
import pydantic


class Surface(pydantic.BaseModel):  # type: ignore[misc]
    """A surface object."""

    name: str = pydantic.Field(..., example="Human Surface Left")
    xCoordinate: list[int] = pydantic.Field(..., example=[1, 2, 3])
    yCoordinate: list[int] = pydantic.Field(..., example=[1, 2, 3])
    zCoordinate: list[int] = pydantic.Field(..., example=[1, 2, 3])
    iFaces: list[int] = pydantic.Field(..., example=[1, 2, 3])
    jFaces: list[int] = pydantic.Field(..., example=[1, 2, 3])
    kFaces: list[int] = pydantic.Field(..., example=[1, 2, 3])


class FeatureSimilarity(pydantic.BaseModel):  # type: ignore[misc]
    """A schema for feature similarity vectors."""

    human_left: list[float] = pydantic.Field(..., example=[1, 2, 3])
    human_right: list[float] = pydantic.Field(..., example=[1, 2, 3])
    macaque_left: list[float] = pydantic.Field(..., example=[1, 2, 3])
    macaque_right: list[float] = pydantic.Field(..., example=[1, 2, 3])
