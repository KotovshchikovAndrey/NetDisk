from dataclasses import dataclass


@dataclass(eq=False)
class BaseException(Exception):
    value: str

    @property
    def message(self) -> str:
        return f"Invalid value '{self.value}'"
