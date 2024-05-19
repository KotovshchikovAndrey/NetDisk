from sqlalchemy.ext.asyncio import AsyncSession

from domain.repositories.unit_of_work import UnitOfWork
from infrastructure.sqlalchemy.connection import SqlalchemyConnection
from infrastructure.sqlalchemy.repositories import *


class SqlalchemyUnitOfWork(UnitOfWork):
    _connection: SqlalchemyConnection
    _current_session: AsyncSession

    def __init__(self, connection: SqlalchemyConnection) -> None:
        self._connection = connection

    async def __aenter__(self):
        self._current_session = self._connection.create_session()
        self.files = FileSqlalchemyRepository(self._current_session)
        self.folders = FolderSqlalchemyRepository(self._current_session)
        self.carts = CartSqlalchemyRepository(self._current_session)

        return await super().__aenter__()

    async def commit(self) -> None:
        await self._current_session.commit()

    async def rollback(self) -> None:
        await self._current_session.rollback()
