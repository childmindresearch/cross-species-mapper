from typing import Literal, Set

import fastapi

from src.core import data_fetcher

HUMAN_TO_MACAQUE = data_fetcher.get_vertex_to_parcel_mapping("human")
MACAQUE_TO_HUMAN = data_fetcher.get_vertex_to_parcel_mapping("macaque")

MODALITY_ABBREVIATIONS = {
    "human": {"area": "SA", "thickness": "CT", "volume": ""},
    "macaque": {"area": "Area", "thickness": "Thickness", "volume": "CortVolume"},
}


def get_region_names(
    species: Literal["human", "macaque"],
) -> Set[str]:
    """Fetches the region names for the given species.

    Regions are the same across human to macaque and macaque to human mappings.

    Args:
        species: The species of the source vertex.

    Returns:
        A fastapi response containing the region names.
    """
    if species == "human":
        return set(mapping.AparcName for mapping in HUMAN_TO_MACAQUE)
    elif species == "macaque":
        return set(mapping.MarkovName for mapping in HUMAN_TO_MACAQUE)


def get_graph_by_region(
    region: str,
    modality: str,
    target_species: Literal["human", "macaque"],
) -> fastapi.Response:
    """Fetches the graph for a given region, modality, and species.
    Args:
        region: The region to fetch the graphs for.
        modality: The modality of the graph.
        target_species: The species to return the graph for.

    Returns:
        A fastapi response containing the bytes of the graph.
    """
    if target_species == "human":
        file_components = [
            f"svgs/{target_species}/FIT",
            MODALITY_ABBREVIATIONS[target_species][modality],
            region,
            "centile_log_highres.svg",
        ]
        filename = "_".join(component for component in file_components if component)

    elif target_species == "macaque":
        filename = f"svgs/{target_species}/{MODALITY_ABBREVIATIONS[target_species][modality]}/{region}/{region}_centile_log_highres.svg"

    bytes = data_fetcher.download_blob_to_bytes(filename)
    return fastapi.Response(content=bytes, media_type="image/svg+xml")


def get_vertex_to_parcel_mapping(
    vertex: int,
    source_species: Literal["human", "macaque"],
) -> data_fetcher.VertexToParcelMapping:
    """Fetches the parcel mapping for a given vertex and species.
    Args:
        vertex: The vertex to fetch the parcel mapping for.
        source_species: The species of the source vertex.

    Returns:
        The parcel mapping for the given vertex and species.
    """
    if source_species == "human":
        return HUMAN_TO_MACAQUE[vertex]
    elif source_species == "macaque":
        return MACAQUE_TO_HUMAN[vertex]
