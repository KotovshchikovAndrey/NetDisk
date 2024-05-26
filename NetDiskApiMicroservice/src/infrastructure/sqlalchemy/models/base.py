import uuid

from sqlalchemy import orm
from sqlalchemy.dialects.postgresql import UUID


class BaseModel(orm.DeclarativeBase):
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
