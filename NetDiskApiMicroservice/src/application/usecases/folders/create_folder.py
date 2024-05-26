from dataclasses import asdict

from application.dtos.folders import CreateFolderInput
from application.usecases.base import IBaseUsecase
from domain.factories.folders import FolderFactory
from domain.repositories.unit_of_work import UnitOfWork


class CreateFolderUsecase(IBaseUsecase[CreateFolderInput, None]):
    _unit_of_work: UnitOfWork

    def __init__(self, unit_of_work: UnitOfWork) -> None:
        self._unit_of_work = unit_of_work

    async def execute(self, dto: CreateFolderInput) -> None:
        factory = FolderFactory(**asdict(dto))
        new_folder = factory.create()

        async with self._unit_of_work as uow:
            await uow.resources.save(new_folder)
            await uow.commit()
