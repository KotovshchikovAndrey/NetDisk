import injector

from application.usecases.files.replace_download_uri import ReplaceDownloadUriUsecase
from application.usecases.files.upload_file_to_disk import UploadFileToDiskUsecase
from application.usecases.folders.create_folder import CreateFolderUsecase
from application.usecases.folders.upload_file_to_folder import UploadFileToFolderUsecase
from domain.repositories.unit_of_work import UnitOfWork
from infrastructure.sqlalchemy.connection import SqlalchemyConnection
from infrastructure.sqlalchemy.repositories.unit_of_work import SqlalchemyUnitOfWork
from setup.config import settings


class InfrastructureProvider(injector.Module):
    @injector.provider
    def provide_ping_message(self) -> str:
        return "pong"

    @injector.provider
    def provide_unit_of_work(self) -> UnitOfWork:
        connection = SqlalchemyConnection(
            connection_url=settings.database.url,
            echo=settings.database.echo,
        )

        return SqlalchemyUnitOfWork(connection)


class ApplicationProvider(injector.Module):
    @injector.provider
    def provide_add_file_to_disk_usecase(
        self, unit_of_work: UnitOfWork
    ) -> UploadFileToDiskUsecase:
        return UploadFileToDiskUsecase(unit_of_work)

    @injector.provider
    def provide_replcace_download_uri_usecase(
        self, unit_of_work: UnitOfWork
    ) -> ReplaceDownloadUriUsecase:
        return ReplaceDownloadUriUsecase(unit_of_work)

    @injector.provider
    def provide_upload_file_to_folder_usecase(
        self, unit_of_work: UnitOfWork
    ) -> UploadFileToFolderUsecase:
        return UploadFileToFolderUsecase(unit_of_work)

    @injector.provider
    def provide_create_folder_usecase(
        self, unit_of_work: UnitOfWork
    ) -> CreateFolderUsecase:
        return CreateFolderUsecase(unit_of_work)


container = injector.Injector([InfrastructureProvider, ApplicationProvider])
