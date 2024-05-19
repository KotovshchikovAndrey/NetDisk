import typing as tp
from abc import ABC, abstractmethod

from domain.repositories.cart_repository import ICartRepository
from domain.repositories.file_repository import IFileRepository
from domain.repositories.folder_repository import IFolderRepository


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
