from application.exceptions.files import NoSuchFileException
from application.usecases.base import IBaseUsecase
from application.dtos.files import ReplaceDownloadUriInput
from domain.repositories.unit_of_work import UnitOfWork


class ReplaceDownloadUriUsecase(IBaseUsecase[ReplaceDownloadUriInput, None]):
    _unit_of_work: UnitOfWork

    def __init__(self, unit_of_work: UnitOfWork) -> None:
        self._unit_of_work = unit_of_work

    async def execute(self, dto: ReplaceDownloadUriInput) -> None:
        async with self._unit_of_work as uow:
            file = await uow.files.get_one(dto.id)
            if file is None:
                raise NoSuchFileException(dto.id)

            file.download_uri = dto.download_uri
            await uow.files.save(file)
            await uow.commit()
