from dataclasses import dataclass, field
from datetime import UTC, datetime
from uuid import UUID
from src.domain.entities.folder_entity import FolderResource
from domain.factories.base_factory import BaseFactory
from domain.values.resource_values import (
    FolderName,
    Description,
    DownloadUri,
    SharedAccess,
    UserAccess,
)


@dataclass(frozen=True, kw_only=True)
class FolderResourceFactory(BaseFactory[FolderResource]):
    owner_id: UUID
    name: str
    download_uri: str
    description: str = field(default="")
    shared_access: SharedAccess = field(default=SharedAccess.PRIVATE)

    def create(self) -> FolderResource:
        owner_access = UserAccess(
            owner_id=self.owner_id,
            access=UserAccess.Access.OWNER,
        )

        return FolderResource(
            id=self.id,
            owner_id=self.owner_id,
            name=FolderName(self.name),
            description=Description(self.description),
            download_uri=DownloadUri(self.download_uri),
            shared_access=self.shared_access,
            byte_size=None,
            created_at=datetime.now(UTC),
            updated_at=datetime.now(UTC),
            user_accesses=[owner_access],
        )
