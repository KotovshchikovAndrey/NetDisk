from dataclasses import dataclass, field
from datetime import datetime
from uuid import UUID
from domain.entities.base_entity import BaseEntity
from domain.values.resource_values import (
    FileName,
    FolderName,
    ByteSize,
    DownloadUri,
    MediaType,
    Description,
    SharedAccess,
    UserAccess,
)


@dataclass(eq=False, kw_only=True)
class Resource(BaseEntity):
    owner_id: UUID
    name: FileName | FolderName
    description: Description
    download_uri: DownloadUri
    media_type: MediaType
    byte_size: ByteSize | None
    shared_access: SharedAccess
    user_accesses: list[UserAccess] = field(default_factory=list)
    created_at: datetime
    updated_at: datetime
