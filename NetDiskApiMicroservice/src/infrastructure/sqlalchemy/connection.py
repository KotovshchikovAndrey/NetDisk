from asyncio import current_task
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    AsyncEngine,
    async_sessionmaker,
    create_async_engine,
    async_scoped_session,
)


class SqlalchemyConnection:
    _engine: AsyncEngine
    _session_provider: async_scoped_session[AsyncSession]

    def __init__(self, connection_url: str, echo: bool = False) -> None:
        self._engine = create_async_engine(url=connection_url, echo=echo)
        session_factory = async_sessionmaker(
            bind=self._engine,
            autoflush=False,
            expire_on_commit=False,
            autocommit=False,
        )

        self._session_provider = async_scoped_session(
            scopefunc=current_task,
            session_factory=session_factory,
        )

    def create_session(self) -> AsyncSession:
        session = self._session_provider()
        return session

    async def close(self) -> None:
        await self._engine.dispose()
