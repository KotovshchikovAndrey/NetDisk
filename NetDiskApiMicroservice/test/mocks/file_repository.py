from uuid import UUID
from domain.entities.file import File
from domain.repositories.files import IFileRepository
from domain.repositories.queries.files import FileQuery
from domain.values.base import Id


class MockFileRepository(IFileRepository):
    _database: list[File]

    def __init__(self, database: list[File] = []) -> None:
        self._database = database

    async def get_list(self, query: FileQuery) -> list[File]:
        return self._database

    async def get_one(self, id: str) -> File | None:
        for file in self._database:
            if file.id == Id(id):
                return file

    async def save(self, entity: File) -> None:
        self._database.append(entity)

    async def remove_by_id(self, id: str) -> None: ...
