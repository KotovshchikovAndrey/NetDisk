import typing as tp

import annotated_types as at
from fastapi import Query
from pydantic import BaseModel, Field

TSchema = tp.TypeVar("TSchema", bound=BaseModel)


class PaginationRequest(BaseModel):
    limit: tp.Annotated[int | None, Field(Query(gt=0, default=None))]
    offset: tp.Annotated[int, Field(Query(gt=0, default=0))]


class PaginationResponse(BaseModel):
    limit: tp.Annotated[int, at.Gt(0)]
    offset: tp.Annotated[int, at.Ge(0)]
    total: tp.Annotated[int, at.Gt(0)]


class ApiResponse(BaseModel, tp.Generic[TSchema]):
    message: str
    data: tp.Annotated[TSchema | dict, Field(default_factory=dict)]
    errors: tp.Annotated[list[tp.Any], Field(default_factory=list)]
