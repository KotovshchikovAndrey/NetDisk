from datetime import datetime
from uuid import UUID
from sqlalchemy import (
    CheckConstraint,
    ForeignKey,
    String,
    Text,
    Integer,
    orm,
    DateTime,
    text,
)
from sqlalchemy.dialects.postgresql import JSONB
from infrastructure.sqlalchemy.models.base_model import BaseModel
from domain import consts
from domain.values.resource_values import MediaType, SharedAccess, UserAccess


class ResourceModel(BaseModel):
    __tablename__ = "resource"
    __table_args__ = (
        CheckConstraint("byte_size > 0", name="check_byte_size_is_positive_number"),
    )

    owner_id: orm.Mapped[UUID] = orm.mapped_column(nullable=False)
    media_type: orm.Mapped[MediaType] = orm.mapped_column(nullable=False)
    byte_size: orm.Mapped[int] = orm.mapped_column(Integer, nullable=False)
    shared_access: orm.Mapped[SharedAccess] = orm.mapped_column(nullable=False)

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

    created_at: orm.Mapped[datetime] = orm.mapped_column(
        DateTime(timezone=False),
        nullable=False,
        server_default=text("TIMEZONE('utc', NOW())"),
    )

    updated_at: orm.Mapped[datetime] = orm.mapped_column(
        DateTime(timezone=False),
        nullable=False,
        server_default=text("TIMEZONE('utc', NOW())"),
        # нужен тригер на уровне бд
    )

    user_accesses: orm.Mapped[list[UserAccess]] = orm.mapped_column(
        JSONB(none_as_null=True),
        nullable=False,
        server_default=r"{}",
    )

    parent_resource_id: orm.Mapped[UUID] = orm.mapped_column(
        ForeignKey("resource.id", ondelete="CASCADE"),
        nullable=True,
    )

    resources: orm.Mapped["ResourceModel"] = orm.relationship(
        uselist=True,
        lazy="noload",
    )
