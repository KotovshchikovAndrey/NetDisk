import typing as tp
from dataclasses import dataclass
from datetime import datetime
from uuid import UUID

from domain.entities.resource import Resource
from domain.values import resources as values


@dataclass(frozen=True, kw_only=True)
class ResourceOutput:
    id: UUID
    owner_id: UUID
    name: str
    description: str
    download_uri: str
    media_type: values.MediaType
    byte_size: int | None
    shared_access: values.SharedAccess
    user_accesses: list[values.UserAccess]
    created_at: datetime
    updated_at: datetime

    @classmethod
    def from_domain(cls: tp.Type["ResourceOutput"], entity: Resource):
        return cls(
            id=entity.id,
            owner_id=entity.owner_id,
            media_type=entity.media_type,
            shared_access=entity.shared_access,
            user_accesses=entity.user_accesses,
            created_at=entity.created_at,
            updated_at=entity.updated_at,
            name=entity.name.to_generic_type(),
            description=entity.description.to_generic_type(),
            download_uri=entity.download_uri.to_generic_type(),
            byte_size=entity.byte_size.to_generic_type(),
        )


@dataclass(frozen=True, kw_only=True)
class GetMyResourcesInput:
    owner_id: UUID
    limit: int
    offset: int
