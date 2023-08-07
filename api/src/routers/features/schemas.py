"""Output schemas for the features router."""
from typing import List

import pydantic


class InputCoordinates(pydantic.BaseModel):
    """A schema for input coordinates."""

    x: int = pydantic.Field(..., example=1)
    y: int = pydantic.Field(..., example=2)
    z: int = pydantic.Field(..., example=3)


class NiMareSingleFeature(pydantic.BaseModel):
    """A schema for a single Nimare feature."""

    name: str = pydantic.Field(..., example="feature1")
    correlation: float = pydantic.Field(..., example=0.1)


class NiMareFeatures(pydantic.BaseModel):
    """A schema for Nimare features."""

    features: List[NiMareSingleFeature] = pydantic.Field(...)


class FeatureSimilarity(pydantic.BaseModel):
    """A schema for feature similarity vectors."""

    human_left: List[float] = pydantic.Field(..., example=[1, 2, 3])
    human_right: List[float] = pydantic.Field(..., example=[1, 2, 3])
    macaque_left: List[float] = pydantic.Field(..., example=[1, 2, 3])
    macaque_right: List[float] = pydantic.Field(..., example=[1, 2, 3])
