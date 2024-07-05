import typing as tp

from fastapi import APIRouter, status

from application.usecases.folders.create_folder import CreateFolderUsecase
from application.usecases.folders.upload_file_to_folder import UploadFileToFolderUsecase
from presentation.rest.api.v1.folders.schemas import (
    CreateFolderRequest,
    CreateFolderResponse,
    UploadFileToFolderRequest,
    UploadFileToFolderResponse,
)
from presentation.rest.schemas import ApiResponse
from setup.ioc_container import container

router = APIRouter(prefix="/folders")


@router.post(
    "/",
    response_model=ApiResponse[CreateFolderResponse],
    status_code=status.HTTP_201_CREATED,
)
async def create_folder(request: CreateFolderRequest):
    usecase = container.get(CreateFolderUsecase)
    folder_id = await usecase.execute(request.to_application_dto())

    return {
        "message": "Folder has been created!",
        "data": {"folder_id": folder_id},
    }


@router.post(
    "/files",
    response_model=ApiResponse[UploadFileToFolderResponse],
    status_code=status.HTTP_201_CREATED,
)
async def upload_file_to_folder(request: UploadFileToFolderRequest):
    usecase = container.get(UploadFileToFolderUsecase)
    file_id = await usecase.execute(request.to_application_dto())

    return {
        "message": "File has been uploaded to folder successfully!",
        "data": {"file_id": file_id},
    }
