from uuid import UUID

from application.dtos.files import ReplaceDownloadUriInput
from application.exceptions.files import NoSuchFileException
from application.exceptions.resources import OccupiedDownloadUriException
from application.usecases.base import IBaseUsecase
from domain.repositories.unit_of_work import UnitOfWork


class ReplaceDownloadUriUsecase(IBaseUsecase[ReplaceDownloadUriInput, UUID]):
    _unit_of_work: UnitOfWork

    def __init__(self, unit_of_work: UnitOfWork) -> None:
        self._unit_of_work = unit_of_work

    async def execute(self, dto: ReplaceDownloadUriInput) -> None:
        async with self._unit_of_work as uow:
            file = await uow.resources.get_file_by_id(dto.id)
            if file is None:
                raise NoSuchFileException(dto.id)

            if await uow.resources.check_download_uri_occupied(dto.download_uri):
                raise OccupiedDownloadUriException(dto.download_uri)

            file.replace_download_uri(dto.download_uri)
            await uow.resources.save(file)
            await uow.commit()

            return file.id
