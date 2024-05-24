import injector

from setup.config import settings
from domain.repositories.unit_of_work import UnitOfWork
from infrastructure.sqlalchemy.connection import SqlalchemyConnection
from infrastructure.sqlalchemy.repositories.unit_of_work import SqlalchemyUnitOfWork

from application.usecases.files.add_file_to_disk import AddFileToDiskUsecase
from application.usecases.files.replace_download_uri import ReplaceDownloadUriUsecase


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
    ) -> AddFileToDiskUsecase:
        return AddFileToDiskUsecase(unit_of_work)

    @injector.provider
    def provide_replcace_download_uri_usecase(
        self, unit_of_work: UnitOfWork
    ) -> ReplaceDownloadUriUsecase:
        return ReplaceDownloadUriUsecase(unit_of_work)


container = injector.Injector([InfrastructureProvider, ApplicationProvider])
