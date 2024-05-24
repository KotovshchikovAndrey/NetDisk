import typing as tp
from dataclasses import asdict, dataclass, field
from datetime import datetime

from domain.entities.file import File
from domain.values import resources as values


@dataclass(frozen=True, kw_only=True)
class FileOutput:
    owner_id: str
    name: str
    description: str
    download_uri: str
    media_type: values.MediaType
    byte_size: int
    shared_access: values.SharedAccess
    user_accesses: list[values.UserAccess]
    created_at: datetime
    updated_at: datetime

    @classmethod
    def from_domain(cls: tp.Type["FileOutput"], entity: File):
        return cls(
            owner_id=str(entity.owner_id),
            name=entity.name.to_generic_type(),
            description=entity.description.to_generic_type(),
            download_uri=entity.download_uri.to_generic_type(),
            media_type=entity.media_type,
            byte_size=entity.byte_size.to_generic_type(),
            shared_access=entity.shared_access,
            user_accesses=entity.user_accesses,
            created_at=entity.created_at,
            updated_at=entity.updated_at,
        )


@dataclass(frozen=True, kw_only=True)
class AddFileToDiskInput:
    id: str | None = field(default=None)
    owner_id: str
    name: str
    download_uri: str
    byte_size: int
    created_at: datetime

    def to_dict(self) -> dict:
        return asdict(self)


@dataclass(frozen=True, kw_only=True)
class ReplaceDownloadUriInput:
    id: str
    download_uri: str
