from dataclasses import asdict
from uuid import UUID

from application.dtos.folders import UploadFileToFolderInput
from application.exceptions.folders import NoSuchFolderException
from application.exceptions.resources import OccupiedDownloadUriException
from application.usecases.base import IBaseUsecase
from domain.factories.files import FileFactory
from domain.repositories.unit_of_work import UnitOfWork


class UploadFileToFolderUsecase(IBaseUsecase[UploadFileToFolderInput, UUID]):
    _unit_of_work: UnitOfWork

    def __init__(self, unit_of_work: UnitOfWork) -> None:
        self._unit_of_work = unit_of_work

    async def execute(self, dto: UploadFileToFolderInput) -> None:
        async with self._unit_of_work as uow:
            folder = await uow.resources.get_folder_by_id(dto.folder_id)
            if folder is None:
                raise NoSuchFolderException(dto.folder_id)

            if await uow.resources.check_download_uri_occupied(dto.download_uri):
                raise OccupiedDownloadUriException(dto.download_uri)

            factory = FileFactory(**asdict(dto))
            new_file = factory.create()
            folder.add_resource(adding_user_id=dto.owner_id, resource=new_file)

            await uow.resources.save(folder)
            await uow.commit()

            return new_file.id
