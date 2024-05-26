from dataclasses import asdict

from application.dtos.files import UploadFileToDiskInput
from application.usecases.base import IBaseUsecase
from domain.factories.files import FileFactory
from domain.repositories.unit_of_work import UnitOfWork


class UploadFileToDiskUsecase(IBaseUsecase[UploadFileToDiskInput, None]):
    _unit_of_work: UnitOfWork

    def __init__(self, unit_of_work: UnitOfWork) -> None:
        self._unit_of_work = unit_of_work

    async def execute(self, dto: UploadFileToDiskInput) -> None:
        factory = FileFactory(**asdict(dto))
        new_file = factory.create()

        async with self._unit_of_work as uow:
            await uow.resources.save(new_file)
            await uow.commit()
