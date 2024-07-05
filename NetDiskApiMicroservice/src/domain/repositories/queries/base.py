from pydantic.dataclasses import dataclass


@dataclass(frozen=True, kw_only=True, config=dict(validate_assignment=True))
class BaseQuery:
    limit: int | None = None
    offset: int = 0
