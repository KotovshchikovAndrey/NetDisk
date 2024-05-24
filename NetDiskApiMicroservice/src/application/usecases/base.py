import typing as tp
from abc import abstractmethod

TInput = tp.TypeVar("TInput", bound=object)
TOutput = tp.TypeVar("TOutput", bound=object)


class IBaseUsecase(tp.Protocol[TInput, TOutput]):
    @abstractmethod
    async def execute(self, dto: TInput) -> TOutput: ...
