import typing as tp

from fastapi import APIRouter

from application.usecases.folders.create_folder import CreateFolderUsecase
from application.usecases.folders.upload_file_to_folder import UploadFileToFolderUsecase
from presentation.rest.api.v1.folders.schemas import (
    CreateFolderRequest,
    UploadFileToFolderRequest,
)
from presentation.rest.schemas import ApiResponse
from setup.ioc_container import container

router = APIRouter(prefix="/folders")


@router.post("/", response_model=ApiResponse)
async def create_folder(request: CreateFolderRequest):
    usecase = container.get(CreateFolderUsecase)
    await usecase.execute(request.to_application_dto())
    return {"message": "Folder has been created!"}


@router.post("/files", response_model=ApiResponse)
async def upload_file_to_folder(request: UploadFileToFolderRequest):
    usecase = container.get(UploadFileToFolderUsecase)
    await usecase.execute(request.to_application_dto())
    return {"message": "File has been uploaded to folder successfully!"}


# TODO: Need to check is download_uri already exists in usecases
