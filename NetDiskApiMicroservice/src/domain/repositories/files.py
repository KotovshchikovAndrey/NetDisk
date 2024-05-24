from abc import abstractmethod

from domain.entities.file import File
from domain.repositories.base import IBaseRepository
from domain.repositories.queries.files import FileQuery


class IFileRepository(IBaseRepository[File]):
    @abstractmethod
    async def get_list(self, query: FileQuery) -> list[File]: ...
