"""Output schemas for the features router."""
from typing import List

import pydantic


class InputCoordinates(pydantic.BaseModel):
    """A schema for input coordinates."""

    x: int = pydantic.Field(..., example=1)
    y: int = pydantic.Field(..., example=2)
    z: int = pydantic.Field(..., example=3)


class FeatureSimilarity(pydantic.BaseModel):
    """A schema for feature similarity vectors."""

    human_left: List[float] = pydantic.Field(..., example=[1, 2, 3])
    human_right: List[float] = pydantic.Field(..., example=[1, 2, 3])
    macaque_left: List[float] = pydantic.Field(..., example=[1, 2, 3])
    macaque_right: List[float] = pydantic.Field(..., example=[1, 2, 3])
