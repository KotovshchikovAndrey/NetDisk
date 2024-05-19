from application.dtos.file_dtos import AddFileToDiskInput
from application.usecases.base_usecase import IBaseUsecase
from domain.factories.file_factory import FileFactory
from domain.repositories.unit_of_work import UnitOfWork


class AddFileToDiskUsecase(IBaseUsecase[AddFileToDiskInput, None]):
    _unit_of_work: UnitOfWork

    def __init__(self, unit_of_work: UnitOfWork) -> None:
        self._unit_of_work = unit_of_work

    async def execute(self, dto: AddFileToDiskInput) -> None:
        factory = FileFactory(**dto.to_dict())
        new_file = factory.create()

        async with self._unit_of_work as uow:
            await uow.files.save(new_file)
            await uow.commit()
