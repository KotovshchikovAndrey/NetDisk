import typing as tp
from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from uuid import UUID, uuid4

from domain.entities.base_entity import BaseEntity

TEntity = tp.TypeVar("TEntity", bound=BaseEntity)


@dataclass(frozen=True, kw_only=True)
class BaseFactory(ABC, tp.Generic[TEntity]):
    id: UUID = field(default_factory=uuid4, init=False)

    @abstractmethod
    def create(self) -> TEntity: ...
