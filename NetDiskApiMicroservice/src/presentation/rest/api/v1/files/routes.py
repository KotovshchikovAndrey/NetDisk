from fastapi import APIRouter, status

from application.usecases.files.upload_file_to_disk import UploadFileToDiskUsecase
from presentation.rest.api.v1.files.schemas import (
    UploadFileToDiskRequest,
    UploadFileToDiskResponse,
)
from presentation.rest.schemas import ApiResponse
from setup.ioc_container import container

router = APIRouter(prefix="/files")


@router.post(
    "/",
    response_model=ApiResponse[UploadFileToDiskResponse],
    status_code=status.HTTP_201_CREATED,
)
async def upload_file_to_disk(request: UploadFileToDiskRequest):
    usecase = container.get(UploadFileToDiskUsecase)
    file_id = await usecase.execute(request.to_application_dto())

    return {
        "message": "File has been uploaded succesfully!",
        "data": {"file_id": file_id},
    }
