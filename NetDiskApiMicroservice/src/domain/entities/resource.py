from dataclasses import dataclass, field
from datetime import datetime

from domain.entities.base import BaseEntity
from domain.values import resources as values
from domain.values.base import Id


@dataclass(eq=False, kw_only=True)
class Resource(BaseEntity):
    owner_id: Id
    name: values.FileName | values.FolderName
    description: values.Description
    download_uri: values.DownloadUri
    media_type: values.MediaType
    byte_size: values.ByteSize | None
    shared_access: values.SharedAccess
    user_accesses: list[values.UserAccess] = field(default_factory=list)
    created_at: datetime
    updated_at: datetime
