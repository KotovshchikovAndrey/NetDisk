from fastapi import APIRouter

from .carts.routes import router as cart_router
from .files.routes import router as file_router
from .folders.routes import router as folder_router

router = APIRouter(prefix="/api/v1")
router.include_router(file_router)
router.include_router(folder_router)
router.include_router(cart_router)
