from datetime import datetime
from uuid import UUID

from sqlalchemy import DateTime, ForeignKey, UniqueConstraint, orm, text

from infrastructure.sqlalchemy.models.base_model import BaseModel
from infrastructure.sqlalchemy.models.resource_model import ResourceModel


class CartModel(BaseModel):
    __tablename__ = "cart"

    owner_id: orm.Mapped[UUID] = orm.mapped_column(nullable=False, unique=True)
    updated_at: orm.Mapped[datetime] = orm.mapped_column(
        DateTime(timezone=False),
        server_default=text("TIMEZONE('utc', NOW())"),
    )

    resources: orm.Mapped[list["CartResourceModel"]] = orm.relationship(
        uselist=True,
        lazy="noload",
    )


class CartResourceModel(BaseModel):
    __tablename__ = "cart_resource"
    __table_args__ = (
        UniqueConstraint("cart_id", "resource_id", name="unique_cart_resource_ids"),
    )

    cart_id: orm.Mapped[UUID] = orm.mapped_column(
        ForeignKey("cart.id", ondelete="CASCADE"),
        nullable=False,
    )

    resource_id: orm.Mapped[UUID] = orm.mapped_column(
        ForeignKey("resource.id", ondelete="CASCADE"),
        nullable=False,
    )

    deleted_at: orm.Mapped[datetime] = orm.mapped_column(
        DateTime(timezone=False),
        nullable=False,
        server_default=text("TIMEZONE('utc', NOW())"),
    )

    resource: orm.Mapped["ResourceModel"] = orm.relationship()
