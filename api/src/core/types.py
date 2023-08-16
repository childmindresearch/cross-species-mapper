""" Separate file for type definitions. 
Kept separate from the main code to avoid circular imports.
"""
import dataclasses

import numpy as np


@dataclasses.dataclass
class Surface:
    """Convenience class for surface handling."""

    name: str
    vertices: np.ndarray
    faces: np.ndarray

    @property
    def species(self) -> str:
        """The species of the surface."""
        return self.name.split("_")[0]

    @property
    def side(self) -> str:
        """The hemisphere of the surface."""
        return self.name.split("_")[1]
