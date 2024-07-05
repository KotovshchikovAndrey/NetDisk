import typing as tp
from datetime import datetime
from uuid import UUID

import annotated_types as at
from pydantic import BaseModel, Field

from application.dtos import folders as dtos
from domain import consts


class CreateFolderRequest(BaseModel):
    name: tp.Annotated[str, at.MaxLen(consts.MAX_RESOURCE_NAME_LENGTH)]
    owner_id: UUID
    parent_folder_id: tp.Annotated[UUID | None, Field(default=None)]
    created_at: tp.Annotated[datetime, Field(datetime_format="%Y/%m/%d %H:%M")]
    description: tp.Annotated[
        str, Field(max_length=consts.MAX_RESOURCE_DESCRIPTION_LENGTH, default="")
    ]

    def to_application_dto(self) -> dtos.CreateFolderInput:
        return dtos.CreateFolderInput(
            description=self.description,
            name=self.name,
            owner_id=self.owner_id,
            created_at=self.created_at,
            parent_folder_id=self.parent_folder_id,
        )


class CreateFolderResponse(BaseModel):
    folder_id: UUID


class UploadFileToFolderRequest(BaseModel):
    file_id: tp.Annotated[UUID | None, Field(default=None)]
    owner_id: UUID
    name: tp.Annotated[str, at.MaxLen(consts.MAX_RESOURCE_NAME_LENGTH)]
    download_uri: tp.Annotated[str, at.MaxLen(consts.MAX_RESOURCE_DOWNLOAD_URI_LENGTH)]
    byte_size: tp.Annotated[int, at.Ge(0)]
    created_at: tp.Annotated[datetime, Field(datetime_format="%Y/%m/%d %H:%M")]
    folder_id: UUID

    def to_application_dto(self) -> dtos.UploadFileToFolderInput:
        return dtos.UploadFileToFolderInput(
            id=self.file_id,
            name=self.name,
            byte_size=self.byte_size,
            owner_id=self.owner_id,
            download_uri=self.download_uri,
            folder_id=self.folder_id,
            created_at=self.created_at,
        )


class UploadFileToFolderResponse(BaseModel):
    file_id: UUID
