from dataclasses import field
from datetime import UTC, datetime
from uuid import UUID

from pydantic.dataclasses import dataclass

from domain.entities.file import File
from domain.factories.base import BaseFactory
from domain.values import resources as values


@dataclass(frozen=True, kw_only=True, config=dict(validate_assignment=True))
class FileFactory(BaseFactory[File]):
    owner_id: UUID
    name: str
    download_uri: str
    description: str = field(default="")
    byte_size: int = field(default=None)
    shared_access: values.SharedAccess = field(default=values.SharedAccess.PRIVATE)
    created_at: datetime = field(default_factory=lambda: datetime.now(UTC))

    def create(self) -> File:
        filename = values.FileName(self.name)
        owner_access = values.UserAccess(
            owner_id=self.owner_id,
            access=values.UserAccess.Access.OWNER,
        )

        return File(
            id=self.id,
            owner_id=self.owner_id,
            name=filename,
            byte_size=values.ByteSize(self.byte_size),
            description=values.Description(self.description),
            download_uri=values.DownloadUri(self.download_uri),
            shared_access=self.shared_access,
            media_type=filename.define_media_type(),
            created_at=self.created_at,
            updated_at=self.created_at,
            user_accesses=[owner_access],
        )
