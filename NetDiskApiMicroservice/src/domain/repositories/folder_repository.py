from abc import abstractmethod

from domain.entities.folder_entity import Folder
from domain.repositories.base_repository import IBaseRepository
from domain.repositories.queries.folder_query import FolderQuery


class IFolderRepository(IBaseRepository[Folder]):
    @abstractmethod
    async def get_list(self, query: FolderQuery) -> list[Folder]: ...
