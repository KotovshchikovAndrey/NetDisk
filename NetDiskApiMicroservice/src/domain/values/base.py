import typing as tp
from abc import ABC, abstractmethod
from dataclasses import dataclass
from uuid import UUID, uuid4

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


@dataclass(frozen=True)
class Id(BaseValue[str]):
    value: str

    def validate(self) -> None:
        if not self._is_valid_uuid():
            raise

    @staticmethod
    def generate() -> "Id":
        return Id(str(uuid4()))

    def _is_valid_uuid(self, version: int = 4) -> bool:
        try:
            uuid = UUID(self.value, version=version)
        except ValueError:
            return False

        return str(uuid) == self.value
