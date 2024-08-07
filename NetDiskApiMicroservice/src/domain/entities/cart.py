from dataclasses import field
from datetime import UTC, datetime
from uuid import UUID

from pydantic.dataclasses import dataclass

from domain.entities.base import BaseEntity
from domain.entities.resource import Resource


@dataclass(eq=False, kw_only=True, config=dict(validate_assignment=True))
class Cart(BaseEntity):
    owner_id: UUID
    updated_at: datetime
    resources: list["CartResource"] = field(default_factory=list)

    def add_resource(self, resource: Resource) -> None:
        self.resources.append(CartResource(resource))

    def clear(self) -> None:
        self.resources.clear()


@dataclass(eq=False, kw_only=True, config=dict(validate_assignment=True))
class CartResource(BaseEntity):
    resource: Resource
    deleted_at: datetime = field(default_factory=lambda: datetime.now(UTC))
