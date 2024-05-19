from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from domain.entities.file_entity import File
from domain.repositories.file_repository import IFileRepository
from domain.repositories.queries.file_query import FileQuery


class FileSqlalchemyRepository(IFileRepository):
    _session: AsyncSession

    def __init__(self, session: AsyncSession):
        self._session = session

    async def get_list(self, query: FileQuery) -> list[File]: ...

    async def get_one(self) -> File | None: ...

    async def save(self, entity: File) -> None: ...

    async def remove_by_id(self, id: UUID) -> None: ...
