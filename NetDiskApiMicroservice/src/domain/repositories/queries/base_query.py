from dataclasses import dataclass


@dataclass(frozen=True, kw_only=True)
class BaseQuery:
    limit: int | None = None
    offset: int = 0
