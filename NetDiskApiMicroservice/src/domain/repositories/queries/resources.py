from dataclasses import field

from pydantic import field_validator
from pydantic.dataclasses import dataclass

from domain.repositories.queries.base import BaseQuery


@dataclass(frozen=True, kw_only=True, config=dict(validate_assignment=True))
class ResourceQuery(BaseQuery):
    owner_ids: list[str] = field(default_factory=list)

    @field_validator("owner_ids", mode="before")
    @classmethod
    def validate_owner_ids(cls, value: str | list[str]) -> list[str]:
        if isinstance(value, str):
            return [value]

        return value
