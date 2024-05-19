import injector

from application.usecases.files.add_file_to_disk import AddFileToDiskUsecase
from domain.repositories.unit_of_work import UnitOfWork
from infrastructure.sqlalchemy.connection import SqlalchemyConnection
from infrastructure.sqlalchemy.repositories.unit_of_work import SqlalchemyUnitOfWork
from setup import settings


class InfrastructureProvider(injector.Module):
    @injector.provider
    def provide_ping_message(self) -> str:
        return "pong"

    @injector.provider
    def provide_unit_of_work(self) -> UnitOfWork:
        connection = SqlalchemyConnection(
            connection_url=settings.DATABASE_URL,
            echo=True,
        )

        return SqlalchemyUnitOfWork(connection)


class ApplicationProvider(injector.Module):
    @injector.provider
    def provide_add_file_to_disk_usecase(
        self, unit_of_work: UnitOfWork
    ) -> AddFileToDiskUsecase:
        return AddFileToDiskUsecase(unit_of_work)


container = injector.Injector([InfrastructureProvider, ApplicationProvider])
