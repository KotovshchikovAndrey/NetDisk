from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from domain.entities.folder_entity import Folder
from domain.repositories.folder_repository import IFolderRepository
from domain.repositories.queries.folder_query import FolderQuery


class FolderSqlalchemyRepository(IFolderRepository):
    _session: AsyncSession

    def __init__(self, session: AsyncSession):
        self._session = session

    async def get_list(self, query: FolderQuery) -> list[Folder]: ...

    async def get_one(self) -> Folder | None: ...

    async def save(self, entity: Folder) -> None: ...

    async def remove_by_id(self, id: UUID) -> None: ...
