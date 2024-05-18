from uuid import UUID, uuid4
from sqlalchemy import orm


class BaseModel(orm.DeclarativeBase):
    id: orm.Mapped[UUID] = orm.mapped_column(primary_key=True, default=uuid4)
