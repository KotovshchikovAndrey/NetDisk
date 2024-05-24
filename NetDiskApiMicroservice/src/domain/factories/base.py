import typing as tp
from abc import ABC, abstractmethod
from dataclasses import dataclass, field

from domain.entities.base import BaseEntity
from domain.values.base import Id

TEntity = tp.TypeVar("TEntity", bound=BaseEntity)


@dataclass(frozen=True, kw_only=True)
class BaseFactory(ABC, tp.Generic[TEntity]):
    id: str | None = field(default=None)

    def create_id(self) -> "Id":
        if self.id is not None:
            return Id(self.id)

        return Id.generate()

    @abstractmethod
    def create(self) -> TEntity: ...
