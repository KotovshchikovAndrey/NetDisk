from dataclasses import dataclass, field
from datetime import datetime
from uuid import UUID

from domain.entities.base_entity import BaseEntity
from domain.values import resource_values as values


@dataclass(eq=False, kw_only=True)
class Resource(BaseEntity):
    owner_id: UUID
    name: values.FileName | values.FolderName
    description: values.Description
    download_uri: values.DownloadUri
    media_type: values.MediaType
    byte_size: values.ByteSize | None
    shared_access: values.SharedAccess
    user_accesses: list[values.UserAccess] = field(default_factory=list)
    created_at: datetime
    updated_at: datetime
