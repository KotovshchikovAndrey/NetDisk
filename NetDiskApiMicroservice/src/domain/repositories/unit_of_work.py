import typing as tp
from abc import ABC, abstractmethod

from domain.repositories.carts import ICartRepository
from domain.repositories.files import IFileRepository
from domain.repositories.folders import IFolderRepository


class UnitOfWork(ABC):
    files: IFileRepository
    folders: IFolderRepository
    carts: ICartRepository

    async def __aenter__(self) -> tp.Self:
        return self

    async def __aexit__(self, *args, **kwargs) -> None:
        await self.rollback()

    @abstractmethod
    async def commit(self) -> None: ...

    @abstractmethod
    async def rollback(self) -> None: ...
