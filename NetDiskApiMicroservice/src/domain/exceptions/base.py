from dataclasses import dataclass


@dataclass(eq=False)
class BaseException(Exception):
    value: str

    @property
    def message(self) -> str:
        return f"Invalid value '{self.value}'"


@dataclass(eq=False)
class InvalidIdException(BaseException):
    @property
    def message(self) -> str:
        return f"Invalid id '{self.value}'! Expected valid uuid!"
