from dataclasses import field
from datetime import datetime
from uuid import UUID

from pydantic.dataclasses import dataclass

from domain.entities.base import BaseEntity
from domain.values import resources as values


@dataclass(eq=False, kw_only=True, config=dict(validate_assignment=True))
class Resource(BaseEntity):
    owner_id: UUID
    name: values.ResourceName
    description: values.Description
    download_uri: values.DownloadUri
    media_type: values.MediaType
    shared_access: values.SharedAccess
    created_at: datetime
    updated_at: datetime
    byte_size: values.ByteSize | None = field(default=None)
    user_accesses: list[values.UserAccess] = field(default_factory=list)
