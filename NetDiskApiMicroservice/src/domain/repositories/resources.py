import typing as tp
from abc import abstractmethod
from uuid import UUID

from domain.entities.file import File
from domain.entities.folder import Folder
from domain.entities.resource import Resource
from domain.repositories.base import IBaseRepository
from domain.repositories.queries.resources import ResourceQuery


class IResourceRepository(IBaseRepository[Resource]):
    @abstractmethod
    async def get_list(self, query: ResourceQuery) -> list[Resource]: ...

    @abstractmethod
    async def get_file_by_id(self, id: UUID) -> File | None: ...

    @abstractmethod
    async def get_folder_by_id(
        self, id: UUID, fetch_resources: bool = False
    ) -> Folder | None: ...

    @abstractmethod
    async def check_download_uri_occupied(self, download_uri: str) -> bool: ...
