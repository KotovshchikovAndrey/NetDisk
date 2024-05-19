from fastapi import APIRouter

router = APIRouter(prefix="/folders")


@router.get("/")
async def get_my_files():
    return 200
