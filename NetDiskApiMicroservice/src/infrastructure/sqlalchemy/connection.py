from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)


class SqlalchemyConnection:
    _engine: AsyncEngine
    _session_factory: async_sessionmaker[AsyncSession]

    def __init__(self, connection_url: str, echo: bool = False) -> None:
        self._engine = create_async_engine(url=connection_url, echo=echo)
        self._session_factory = async_sessionmaker(
            bind=self._engine,
            autoflush=False,
            expire_on_commit=False,
            autocommit=False,
        )

    def create_session(self) -> AsyncSession:
        session = self._session_factory()
        return session

    async def close(self) -> None:
        await self._engine.dispose()
