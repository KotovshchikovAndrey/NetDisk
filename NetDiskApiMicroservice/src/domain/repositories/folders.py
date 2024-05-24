from abc import abstractmethod

from domain.entities.folder import Folder
from domain.repositories.base import IBaseRepository
from domain.repositories.queries.folders import FolderQuery


class IFolderRepository(IBaseRepository[Folder]):
    @abstractmethod
    async def get_list(self, query: FolderQuery) -> list[Folder]: ...
