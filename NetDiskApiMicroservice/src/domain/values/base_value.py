import typing as tp
from dataclasses import dataclass
from abc import ABC, abstractmethod


TValue = tp.TypeVar("TValue", bound=object)


@dataclass(frozen=True)
class BaseValue(ABC, tp.Generic[TValue]):
    value: TValue

    def __post_init__(self) -> None:
        self.validate()

    def to_generic_type(self) -> TValue:
        return self.value

    @abstractmethod
    def validate(self) -> None: ...
