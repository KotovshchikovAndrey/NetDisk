import typing as tp
from abc import abstractmethod
from uuid import UUID

from domain.entities.base_entity import BaseEntity

TEntity = tp.TypeVar("TEntity", bound=BaseEntity)


class IBaseRepository(tp.Protocol[TEntity]):
    @abstractmethod
    async def get_one(self) -> TEntity | None: ...

    @abstractmethod
    async def save(self, entity: TEntity) -> None: ...

    @abstractmethod
    async def remove_by_id(self, id: UUID) -> None: ...
