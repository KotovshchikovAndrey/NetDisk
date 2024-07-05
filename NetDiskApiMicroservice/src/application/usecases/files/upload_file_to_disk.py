from dataclasses import asdict
from uuid import UUID

from application.dtos.files import UploadFileToDiskInput
from application.exceptions.resources import OccupiedDownloadUriException
from application.usecases.base import IBaseUsecase
from domain.factories.files import FileFactory
from domain.repositories.unit_of_work import UnitOfWork


class UploadFileToDiskUsecase(IBaseUsecase[UploadFileToDiskInput, UUID]):
    _unit_of_work: UnitOfWork

    def __init__(self, unit_of_work: UnitOfWork) -> None:
        self._unit_of_work = unit_of_work

    async def execute(self, dto: UploadFileToDiskInput) -> None:
        async with self._unit_of_work as uow:
            if await uow.resources.check_download_uri_occupied(dto.download_uri):
                raise OccupiedDownloadUriException(dto.download_uri)

            factory = FileFactory(**asdict(dto))
            new_file = factory.create()

            await uow.resources.save(new_file)
            await uow.commit()

            return new_file.id
