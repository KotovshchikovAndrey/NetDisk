from domain.exceptions.base import BaseException


class NoSuchFolderException(BaseException):
    value: str

    @property
    def message(self) -> str:
        return f"Folder with id '{self.value}' does not exists!"
