from dataclasses import dataclass, field
from datetime import UTC, datetime
from uuid import UUID
from domain.entities.file_entity import FileResource
from domain.factories.base_factory import BaseFactory
from domain.values.resource_values import (
    ByteSize,
    Description,
    DownloadUri,
    FileName,
    SharedAccess,
    UserAccess,
)


@dataclass(frozen=True, kw_only=True)
class FileResourceFactory(BaseFactory[FileResource]):
    owner_id: UUID
    name: str
    download_uri: str
    description: str = field(default="")
    byte_size: ByteSize = field(default=None)
    shared_access: SharedAccess = field(default=SharedAccess.PRIVATE)

    def create(self) -> FileResource:
        filename = FileName(self.name)
        owner_access = UserAccess(
            owner_id=self.owner_id,
            access=UserAccess.Access.OWNER,
        )

        return FileResource(
            id=self.id,
            owner_id=self.owner_id,
            name=filename,
            byte_size=self.byte_size,
            description=Description(self.description),
            download_uri=DownloadUri(self.download_uri),
            shared_access=SharedAccess,
            media_type=filename.define_media_type(),
            created_at=datetime.now(UTC),
            updated_at=datetime.now(UTC),
            user_accesses=[owner_access],
        )
