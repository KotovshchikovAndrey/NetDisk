from dataclasses import dataclass, field
from datetime import UTC, datetime

from domain.entities.folder import Folder
from domain.factories.base import BaseFactory
from domain.values import resources as values
from domain.values.base import Id


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
            owner_id=Id(self.owner_id),
            access=values.UserAccess.Access.OWNER,
        )

        return Folder(
            id=self.create_id(),
            owner_id=Id(self.owner_id),
            name=values.FolderName(self.name),
            description=values.Description(self.description),
            download_uri=values.DownloadUri(self.download_uri),
            shared_access=self.shared_access,
            byte_size=None,
            created_at=self.created_at,
            updated_at=self.created_at,
            user_accesses=[owner_access],
        )
