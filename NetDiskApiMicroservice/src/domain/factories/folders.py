from dataclasses import field
from datetime import UTC, datetime
from uuid import UUID

from pydantic.dataclasses import dataclass

from domain import consts
from domain.entities.folder import Folder
from domain.factories.base import BaseFactory
from domain.values import resources as values


@dataclass(frozen=True, kw_only=True, config=dict(validate_assignment=True))
class FolderFactory(BaseFactory[Folder]):
    owner_id: UUID
    name: str
    description: str = field(default="")
    shared_access: values.SharedAccess = field(default=values.SharedAccess.PRIVATE)
    created_at: datetime = field(default_factory=lambda: datetime.now(UTC))
    parent_folder_id: UUID | None = field(default=None)

    def create(self) -> Folder:
        download_uri = consts.DOWNLOAD_FOLDER_URI.format(self.id)
        owner_access = values.UserAccess(
            owner_id=str(self.owner_id),
            access=values.Access.OWNER,
        )

        return Folder(
            id=self.id,
            owner_id=self.owner_id,
            name=values.FolderName(self.name),
            description=values.Description(self.description),
            download_uri=values.DownloadUri(download_uri),
            shared_access=self.shared_access,
            created_at=self.created_at,
            updated_at=self.created_at,
            user_accesses=[owner_access],
            parent_folder_id=self.parent_folder_id,
        )
