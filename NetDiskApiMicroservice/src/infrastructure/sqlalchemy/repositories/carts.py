from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from domain.entities.cart import Cart
from domain.repositories.carts import ICartRepository


class CartSqlalchemyRepository(ICartRepository):
    _session: AsyncSession

    def __init__(self, session: AsyncSession):
        self._session = session

    async def get_one(self) -> Cart | None: ...

    async def save(self, entity: Cart) -> None: ...

    async def remove_by_id(self, id: UUID) -> None: ...
