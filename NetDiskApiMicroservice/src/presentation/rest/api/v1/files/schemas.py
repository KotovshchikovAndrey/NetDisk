import typing as tp
from datetime import datetime
from uuid import UUID

import annotated_types as at
from pydantic import BaseModel, Field

from application.dtos import files as dtos
from domain import consts


class UploadFileToDiskRequest(BaseModel):
    id: tp.Annotated[UUID | None, Field(default=None)]
    owner_id: UUID
    name: tp.Annotated[str, at.MaxLen(consts.MAX_RESOURCE_NAME_LENGTH)]
    download_uri: tp.Annotated[str, at.MaxLen(consts.MAX_RESOURCE_DOWNLOAD_URI_LENGTH)]
    description: tp.Annotated[
        str, Field(max_length=consts.MAX_RESOURCE_DESCRIPTION_LENGTH, default="")
    ]
    byte_size: tp.Annotated[int, at.Ge(0)]
    created_at: tp.Annotated[datetime, Field(datetime_format="%Y/%m/%d %H:%M")]

    def to_application_dto(self) -> dtos.UploadFileToDiskInput:
        return dtos.UploadFileToDiskInput(
            id=self.id,
            byte_size=self.byte_size,
            created_at=self.created_at,
            download_uri=self.download_uri,
            name=self.name,
            owner_id=self.owner_id,
        )


class UploadFileToDiskResponse(BaseModel):
    file_id: UUID
