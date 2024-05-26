from domain.exceptions.base import BaseException


class UserCannotAddToFolderException(BaseException):
    value: str

    @property
    def messege(self) -> str:
        return f"Permission denied! The user with id {self.value} has not access for adding!"
