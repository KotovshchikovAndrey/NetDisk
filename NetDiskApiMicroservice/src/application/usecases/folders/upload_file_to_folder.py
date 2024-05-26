from dataclasses import asdict

from application.dtos.folders import UploadFileToFolderInput
from application.exceptions.folders import NoSuchFolderException
from application.usecases.base import IBaseUsecase
from domain.factories.files import FileFactory
from domain.repositories.unit_of_work import UnitOfWork


class UploadFileToFolderUsecase(IBaseUsecase[UploadFileToFolderInput, None]):
    _unit_of_work: UnitOfWork

    def __init__(self, unit_of_work: UnitOfWork) -> None:
        self._unit_of_work = unit_of_work

    async def execute(self, dto: UploadFileToFolderInput) -> None:
        async with self._unit_of_work as uow:
            folder = await uow.resources.get_folder_by_id(dto.folder_id)
            if folder is None:
                raise NoSuchFolderException(dto.folder_id)

            factory = FileFactory(**asdict(dto))
            folder.add_resource(
                adding_user_id=dto.owner_id,
                resource=factory.create(),
            )

            await uow.resources.save(folder)
            await uow.commit()
