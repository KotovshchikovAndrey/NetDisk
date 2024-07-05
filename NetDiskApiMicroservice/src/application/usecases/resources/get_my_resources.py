from dataclasses import asdict

from application.dtos.resources import GetMyResourcesInput, ResourceOutput
from application.usecases.base import IBaseUsecase
from domain.repositories.queries.resources import ResourceQuery
from domain.repositories.unit_of_work import UnitOfWork


class GetMyResourcesUsecase(IBaseUsecase[GetMyResourcesInput, list[ResourceOutput]]):
    _unit_of_work: UnitOfWork

    def __init__(self, unit_of_work: UnitOfWork) -> None:
        self._unit_of_work = unit_of_work

    async def execute(self, dto: GetMyResourcesInput) -> list[ResourceOutput]:
        query = ResourceQuery(**asdict(dto))
        async with self._unit_of_work as uow:
            resources = await uow.resources.get_list(query)
            return [ResourceOutput.from_domain(resource) for resource in resources]
