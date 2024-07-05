from domain.exceptions.base import BaseException


class OccupiedDownloadUriException(BaseException):
    value: str

    @property
    def message(self) -> str:
        return f"Invalid download uri! The download uri '{self.value}' is already occupied!"
