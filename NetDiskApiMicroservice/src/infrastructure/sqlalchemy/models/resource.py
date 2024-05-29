from uuid import UUID

from sqlalchemy import CheckConstraint, ForeignKey, Integer, String, Text, orm
from sqlalchemy.dialects.postgresql import JSONB

from domain import consts
from domain.values.resources import MediaType, SharedAccess, UserAccess
from infrastructure.sqlalchemy.models.base import BaseModel, TimestampMixin


class ResourceModel(TimestampMixin, BaseModel):
    __table_args__ = (
        CheckConstraint("byte_size >= 0", name="check_byte_size_is_positive_number"),
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

    user_accesses: orm.Mapped[list[UserAccess]] = orm.mapped_column(
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
