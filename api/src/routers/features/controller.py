""" Controller for the features router """
import itertools
import logging
import os

import fastapi
import nibabel as nib
import numpy as np
from fastapi import status
from nimare import dataset as nimare_dataset
from nimare import utils as nimare_utils
from nimare.decode import discrete
from numpy import linalg
from src import settings
from src import utils as src_utils
from src.routers.features import controller, schemas
from src.routers.features import utils as features_utils

config = settings.get_settings()
LOGGER_NAME = config.LOGGER_NAME
logger = logging.getLogger(LOGGER_NAME)

DATASET = nimare_dataset.Dataset(
    os.path.join(nimare_utils.get_resource_path(), "neurosynth_laird_studies.json")
)


def get_nimare_features(
    x_coordinate: float,
    y_coordinate: float,
    z_coordinate: float,
) -> schemas.NiMareFeatures:
    """Get NiMare features for a coordinate.

    Args:
        coordinates: The coordinates for which to get NiMare features.

    Returns:
        The NiMARE features in feature-name, correlation pairs.
    """
    matrix_coordinates = _world_coordinates_to_matrix_coordinates(
        [x_coordinate, y_coordinate, z_coordinate]
    )
    seeds = np.zeros(DATASET.masker.mask_img.shape, np.int32)
    try:
        seeds = features_utils.create_sphere(
            size=DATASET.masker.mask_img.shape,
            center=matrix_coordinates.tolist(),
            radius=10,
        )
    except IndexError as exc:
        logger.error(
            "Invalid coordinates: %s, %s, %s", x_coordinate, y_coordinate, z_coordinate
        )
        raise fastapi.HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid coordinates.",
        ) from exc

    logger.info("Decoding coordinate.")
    mask_image = nib.Nifti1Image(seeds, DATASET.masker.mask_img.affine)
    decoded_features = _run_decoder(mask_image)

    return schemas.NiMareFeatures(features=decoded_features)


def get_cross_species_features(
    species: str, side: str, seed_vertex: int
) -> dict[str, list[float]]:
    """Fetches the human and macaque feature matrices.

    Args:
        species: The species to fetch the hemispheres for, valid values are
            'human' and 'macaque'.
        side: The hemisphere to fetch the surfaces for, valid values are 'left' and
            'right'.
        seed_vertex: The vertex to compute the similarity from.

    Returns:
        A feature matrix stored as a list of lists.
    """
    seed_features = features_utils.load_feature_data(species, side)
    surface = src_utils.get_surface(species=species, side=side)

    all_species = ["human", "macaque"]
    all_sides = ["left", "right"]

    similarities = {}
    for target_species, target_side in itertools.product(all_species, all_sides):
        logger.info(
            "Computing feature similarity for %s_%s.", target_species, target_side
        )
        target_features = features_utils.load_feature_data(target_species, target_side)
        similarity = features_utils.compute_similarity(
            seed_vertex,
            surface,
            seed_features,
            target_features,
            roi_size=5,
            weighting="gaussian",
        )

        similarities[f"{target_species}_{target_side}"] = similarity.tolist()

    return similarities


def _run_decoder(mask_image: nib.Nifti1Image) -> list[schemas.NiMareSingleFeature]:
    """Run the ROI association decoder.

    Args:
        mask_image: The mask image, contains 1 within the ROI, 0 otherwise.

    Returns:
        The decoded features in feature-name, correlation pairs.

    """
    decoder = discrete.ROIAssociationDecoder(mask_image)
    decoder.fit(DATASET)
    decoded_features = decoder.transform()
    decoded_features_schemas = [
        schemas.NiMareSingleFeature(name=feature[0], correlation=feature[1])
        for feature in decoded_features.itertuples(name=None)
    ]
    decoded_features_schemas.sort(key=lambda x: x.correlation, reverse=True)
    for feature in decoded_features_schemas:
        feature.name = feature.name.replace("Neurosynth_TFIDF__", "")

    return decoded_features_schemas


def _world_coordinates_to_matrix_coordinates(
    coordinates: list[float],
) -> np.ndarray:
    """Convert world coordinates to matrix coordinates.

    Args:
        coordinates: The millimeter coordinates.

    Returns:
        The voxel coordinates.
    """
    logger.debug("Converting world coordinates to matrix coordinates.")
    matrix_coordinates = nib.affines.apply_affine(
        linalg.inv(DATASET.masker.mask_img.affine),
        coordinates,
    )
    logger.info("Matrix coordinates: %s", matrix_coordinates)
    logger.info("World coordinates: %s", coordinates)

    return matrix_coordinates.round().astype(np.int32)
