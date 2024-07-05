import typing as tp
from abc import ABC, abstractmethod
from dataclasses import field
from uuid import UUID, uuid4

from pydantic.dataclasses import dataclass

from domain.entities.base import BaseEntity

TEntity = tp.TypeVar("TEntity", bound=BaseEntity)


@dataclass(frozen=True, kw_only=True, config=dict(validate_assignment=True))
class BaseFactory(ABC, tp.Generic[TEntity]):
    id: UUID | None = field(default=None)

    def __post_init__(self) -> None:
        if self.id is None:
            self.id = uuid4()

    @abstractmethod
    def create(self) -> TEntity: ...
