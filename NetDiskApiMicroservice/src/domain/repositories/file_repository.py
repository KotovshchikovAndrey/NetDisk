from abc import abstractmethod

from domain.entities.file_entity import File
from domain.repositories.base_repository import IBaseRepository
from domain.repositories.queries.file_query import FileQuery


class IFileRepository(IBaseRepository[File]):
    @abstractmethod
    async def get_list(self, query: FileQuery) -> list[File]: ...
