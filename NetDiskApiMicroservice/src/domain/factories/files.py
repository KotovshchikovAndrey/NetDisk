from dataclasses import dataclass, field
from datetime import UTC, datetime

from domain.entities.file import File
from domain.factories.base import BaseFactory
from domain.values import resources as values
from domain.values.base import Id


@dataclass(frozen=True, kw_only=True)
class FileFactory(BaseFactory[File]):
    owner_id: str
    name: str
    download_uri: str
    description: str = field(default="")
    byte_size: values.ByteSize = field(default=None)
    shared_access: values.SharedAccess = field(default=values.SharedAccess.PRIVATE)
    created_at: datetime = field(default_factory=lambda: datetime.now(UTC))

    def create(self) -> File:
        filename = values.FileName(self.name)
        owner_access = values.UserAccess(
            owner_id=Id(self.owner_id),
            access=values.UserAccess.Access.OWNER,
        )

        return File(
            id=self.create_id(),
            owner_id=Id(self.owner_id),
            name=filename,
            byte_size=self.byte_size,
            description=values.Description(self.description),
            download_uri=values.DownloadUri(self.download_uri),
            shared_access=values.SharedAccess,
            media_type=filename.define_media_type(),
            created_at=self.created_at,
            updated_at=self.created_at,
            user_accesses=[owner_access],
        )