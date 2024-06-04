from typing import Literal

import fastapi

from src.core import data_fetcher

HUMAN_TO_MACAQUE = data_fetcher.get_vertex_to_parcel_mapping("human")
MACAQUE_TO_HUMAN = data_fetcher.get_vertex_to_parcel_mapping("macaque")

MODALITY_ABBREVIATIONS = {
    "human": {"area": "SA", "thickness": "CT", "volume": ""},
    "macaque": {"area": "Area", "thickness": "Thickness", "volume": "CortVolume"},
}


def get_graph_by_vertex(
    vertex: int,
    modality: str,
    source_species: Literal["human", "macaque"],
    target_species: Literal["human", "macaque"],
) -> fastapi.Response:
    """Fetches the graph for a given vertex, modality, and species.
    Args:
        vertex: The vertex to fetch the graphs for.
        modality: The modality of the graph.
        source_species: The species of the source vertex.
        target_species: The species to return the graph for.

    Returns:
        A fastapi response containing the bytes of the graph.
    """
    if source_species == "human":
        mapping = HUMAN_TO_MACAQUE[vertex]
    elif source_species == "macaque":
        mapping = MACAQUE_TO_HUMAN[vertex]

    if target_species == "human":
        area = mapping["AparcName"]
        file_components = [
            f"svgs/{target_species}/FIT",
            MODALITY_ABBREVIATIONS[target_species][modality],
            area,
            "centile_log_highres.svg",
        ]
        filename = "_".join(component for component in file_components if component)

    elif target_species == "macaque":
        area = mapping["MarkovName"]
        filename = f"svgs/{target_species}/{MODALITY_ABBREVIATIONS[target_species][modality]}/{area}/{area}_centile_log_highres.svg"

    bytes = data_fetcher.download_blob_to_bytes(filename)
    return fastapi.Response(content=bytes, media_type="image/svg+xml")
