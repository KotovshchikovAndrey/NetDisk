from uuid import UUID

from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload
from sqlalchemy.sql import delete, exists, select

from domain.entities.file import File
from domain.entities.folder import Folder
from domain.entities.resource import Resource
from domain.repositories.queries.resources import ResourceQuery
from domain.repositories.resources import IResourceRepository
from infrastructure.sqlalchemy.mappers.files import FileMapper
from infrastructure.sqlalchemy.mappers.folders import FolderMapper
from infrastructure.sqlalchemy.mappers.resources import ResourceMapper
from infrastructure.sqlalchemy.models.resource import ResourceModel


class ResourceSqlalchemyRepository(IResourceRepository):
    _session: AsyncSession

    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def get_one(self, id: UUID) -> Resource | None:
        stmt = select(ResourceModel).where(ResourceModel.id == id)
        model = await self._session.scalar(stmt)
        if model is not None:
            return ResourceMapper.to_domain(model)

    async def save(self, entity: Resource) -> None:
        model = ResourceMapper.from_domain(entity)
        stmt = insert(ResourceModel).values(**model.get_insert_values())
        stmt = stmt.on_conflict_do_update(
            constraint="resource_pkey",
            set_=dict(stmt.excluded),
        )

        await self._session.execute(stmt)
        if isinstance(entity, Folder) and entity.resources:
            await self._save_folder_resources(
                folder_id=entity.id, resources=entity.resources
            )

    async def remove_by_id(self, id: UUID) -> None:
        stmt = delete(ResourceModel).where(ResourceModel.id == id)
        await self._session.execute(stmt)

    async def get_list(self, query: ResourceQuery) -> list[Resource]:
        in_list = query.owner_ids
        if not isinstance(in_list, list):
            in_list = [query.owner_ids]

        stmt = (
            select(ResourceModel)
            .where(ResourceModel.owner_id.in_(in_list))
            .offset(query.offset)
        )

        if query.limit is not None:
            stmt = stmt.limit(query.limit)

        models = await self._session.scalars(stmt)
        return [ResourceMapper.to_domain(model) for model in models]

    async def get_file_by_id(self, id: UUID) -> File | None:
        stmt = select(ResourceModel).where(ResourceModel.id == id)
        model = await self._session.scalar(stmt)
        if model is not None:
            return FileMapper.to_domain(model)

    async def get_folder_by_id(
        self, id: UUID, fetch_resources: bool = False
    ) -> Folder | None:
        stmt = select(ResourceModel).where(ResourceModel.id == id)
        if not fetch_resources:
            model = await self._session.scalar(stmt)
            if model is not None:
                return FolderMapper.to_domain(model)

        stmt = stmt.options(joinedload(ResourceModel.resources))
        model = await self._session.scalar(stmt)
        if model is not None:
            return FolderMapper.to_domain(model)

    async def check_download_uri_occupied(self, download_uri: str) -> bool:
        stmt = exists().where(ResourceModel.download_uri == download_uri).select()
        result = await self._session.scalar(stmt)
        return bool(result)

    async def _save_folder_resources(
        self, folder_id: UUID, resources: list[Resource]
    ) -> None:
        models = [ResourceMapper.from_domain(resource) for resource in resources]
        insert_values_list = []
        for model in models:
            insert_values = model.get_insert_values()
            insert_values["parent_resource_id"] = folder_id
            insert_values_list.append(insert_values)

        stmt = insert(ResourceModel).values(insert_values_list)
        stmt = stmt.on_conflict_do_update(
            constraint="resource_pkey",
            set_=dict(stmt.excluded),
        )

        await self._session.execute(stmt)
