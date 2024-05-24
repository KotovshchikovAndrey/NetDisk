from domain.exceptions.base import BaseException


class NoSuchFileException(BaseException):
    value: str

    @property
    def message(self) -> str:
        return f"File with id '{self.value}' does not exists!"
