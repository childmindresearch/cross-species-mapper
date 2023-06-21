import fastapi

from src.routers.surfaces import controller, schemas

router = fastapi.APIRouter(prefix="/surfaces")


@router.get("/hemispheres")
def get_hemispheres() -> schemas.AllSurfaces:
    """Fetches the human and macaque hemisphere surfaces.

    Returns:
        A dictionary containing the human and macaque hemisphere surfaces.
    """
    return controller.get_hemispheres()
