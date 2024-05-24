from abc import ABC
from dataclasses import dataclass, field
from domain.values.base import Id


@dataclass(eq=False, kw_only=True)
class BaseEntity(ABC):
    id: Id = field(default_factory=Id.generate)

    def __eq__(self, value: object) -> bool:
        if not isinstance(value, BaseEntity):
            return False

        return self.id == value.id
