from uuid import UUID

from domain.entities.file import File
from domain.entities.folder import Folder
from domain.entities.resource import Resource
from domain.repositories.queries.resources import ResourceQuery
from domain.repositories.resources import IResourceRepository
from domain.values.resources import MediaType


class MockResourceRepository(IResourceRepository):
    _database: list[Resource]

    def __init__(self, database: list[Resource] = []) -> None:
        self._database = database

    async def get_list(self, query: ResourceQuery) -> list[Resource]:
        return self._database

    async def get_file_by_id(self, id: UUID) -> File | None:
        for resource in self._database:
            if resource.media_type != MediaType.FOLDER and resource.id == id:
                return resource

    async def get_folder_by_id(
        self, id: UUID, fetch_resources: bool = False
    ) -> Folder | None:
        for resource in self._database:
            if resource.media_type == MediaType.FOLDER and resource.id == id:
                return resource

    async def get_one(self, id: UUID) -> Resource | None:
        for resource in self._database:
            if resource.id == id:
                return resource

    async def save(self, entity: Resource) -> None:
        self._database.append(entity)

    async def remove_by_id(self, id: UUID) -> None: ...

    async def check_download_uri_occupied(self, download_uri: str) -> bool:
        return False
