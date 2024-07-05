from dataclasses import field
from datetime import datetime
from uuid import UUID

from pydantic.dataclasses import dataclass


@dataclass(frozen=True, kw_only=True, config=dict(validate_assignment=True))
class UploadFileToFolderInput:
    id: UUID | None = field(default=None)
    owner_id: UUID
    name: str
    download_uri: str
    byte_size: int
    created_at: datetime
    folder_id: UUID


@dataclass(frozen=True, kw_only=True, config=dict(validate_assignment=True))
class CreateFolderInput:
    name: str
    description: str
    owner_id: UUID
    parent_folder_id: UUID | None = field(default=None)
    created_at: datetime
