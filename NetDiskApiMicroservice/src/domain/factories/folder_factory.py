from dataclasses import dataclass, field
from datetime import UTC, datetime
from uuid import UUID

from domain.entities.folder_entity import Folder
from domain.factories.base_factory import BaseFactory
from domain.values import resource_values as values


@dataclass(frozen=True, kw_only=True)
class FolderFactory(BaseFactory[Folder]):
    owner_id: str
    name: str
    download_uri: str
    description: str = field(default="")
    shared_access: values.SharedAccess = field(default=values.SharedAccess.PRIVATE)
    created_at: datetime = field(default_factory=lambda: datetime.now(UTC))

    def create(self) -> Folder:
        owner_access = values.UserAccess(
            owner_id=self.owner_id,
            access=values.UserAccess.Access.OWNER,
        )

        return Folder(
            id=self.id,
            owner_id=UUID(self.owner_id),
            name=values.FolderName(self.name),
            description=values.Description(self.description),
            download_uri=values.DownloadUri(self.download_uri),
            shared_access=self.shared_access,
            byte_size=None,
            created_at=self.created_at,
            updated_at=self.created_at,
            user_accesses=[owner_access],
        )
