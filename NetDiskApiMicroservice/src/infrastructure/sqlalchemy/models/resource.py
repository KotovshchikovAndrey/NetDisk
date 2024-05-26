from dataclasses import asdict
from datetime import datetime
from uuid import UUID

from sqlalchemy import (
    CheckConstraint,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    orm,
    text,
)
from sqlalchemy.dialects.postgresql import JSONB

from domain import consts
from domain.values.resources import MediaType, SharedAccess, UserAccess
from infrastructure.sqlalchemy.models.base import BaseModel


class ResourceModel(BaseModel):
    __tablename__ = "resource"

    __table_args__ = (
        CheckConstraint("byte_size > 0", name="check_byte_size_is_positive_number"),
    )

    name: orm.Mapped[str] = orm.mapped_column(
        String(consts.MAX_RESOURCE_NAME_LENGTH),
        nullable=False,
    )

    description: orm.Mapped[str] = orm.mapped_column(
        Text(),
        nullable=False,
        default="",
    )

    download_uri: orm.Mapped[str] = orm.mapped_column(
        String(consts.MAX_RESOURCE_DOWNLOAD_URI_LENGTH),
        nullable=False,
        unique=True,
    )

    owner_id: orm.Mapped[UUID] = orm.mapped_column(nullable=False)

    media_type: orm.Mapped[MediaType] = orm.mapped_column(nullable=False)

    byte_size: orm.Mapped[int] = orm.mapped_column(Integer, nullable=True)

    shared_access: orm.Mapped[SharedAccess] = orm.mapped_column(nullable=False)

    created_at: orm.Mapped[datetime] = orm.mapped_column(
        DateTime(timezone=False),
        nullable=False,
        server_default=text("TIMEZONE('utc', NOW())"),
    )

    updated_at: orm.Mapped[datetime] = orm.mapped_column(
        DateTime(timezone=False),
        nullable=False,
        server_default=text("TIMEZONE('utc', NOW())"),
    )

    user_accesses: orm.Mapped[list[dict]] = orm.mapped_column(
        JSONB(none_as_null=True),
        nullable=False,
        server_default=r"{}",
    )

    parent_resource_id: orm.Mapped[UUID] = orm.mapped_column(
        ForeignKey("resource.id", ondelete="CASCADE"),
        nullable=True,
    )

    resources: orm.Mapped[list["ResourceModel"]] = orm.relationship(
        uselist=True,
        lazy="noload",
    )

    def get_insert_values(self) -> dict[str, str]:
        insert_values = super().get_insert_values()
        # insert_values["shared_access"] = self.shared_access
        # insert_values["user_accesses"] = [
        #     asdict(user_access) for user_access in self.user_accesses
        # ]

        return insert_values
