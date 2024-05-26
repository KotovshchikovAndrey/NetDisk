from abc import ABC
from dataclasses import field
from uuid import UUID, uuid4

from pydantic.dataclasses import dataclass


@dataclass(eq=False, kw_only=True, config=dict(validate_assignment=True))
class BaseEntity(ABC):
    id: UUID = field(default_factory=uuid4)

    def __eq__(self, value: object) -> bool:
        if not isinstance(value, BaseEntity):
            return False

        return self.id == value.id
