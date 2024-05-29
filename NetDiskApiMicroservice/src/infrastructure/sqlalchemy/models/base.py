import uuid
from datetime import datetime

from sqlalchemy import DateTime, orm, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import declared_attr


class BaseModel(orm.DeclarativeBase):
    @declared_attr.directive
    def __tablename__(cls) -> str:
        return cls.__name__.replace("Model", "").lower()

    id: orm.Mapped[uuid.UUID] = orm.mapped_column(UUID(as_uuid=True), primary_key=True)

    def get_insert_values(self) -> dict[str, str]:
        insert_values = {}
        for column in self.get_columns():
            column_value = getattr(self, column)
            if column_value is not None:
                insert_values[column] = column_value

        return insert_values

    @classmethod
    def get_columns(cls) -> list[str]:
        return list(map(lambda column: column.name, cls.__table__.columns))


class TimestampMixin:
    updated_at: orm.Mapped[datetime] = orm.mapped_column(
        DateTime(timezone=False),
        nullable=False,
        server_default=text("TIMEZONE('utc', NOW())"),
    )

    created_at: orm.Mapped[datetime] = orm.mapped_column(
        DateTime(timezone=False),
        nullable=False,
        server_default=text("TIMEZONE('utc', NOW())"),
    )
