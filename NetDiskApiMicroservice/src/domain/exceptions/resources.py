from dataclasses import dataclass

from domain.exceptions.base import BaseException


@dataclass(eq=False)
class TooLongResourceNameException(BaseException):
    @property
    def message(self) -> str:
        return f"Invalid resource name value! The name '{self.value}' is too long!"


@dataclass(eq=False)
class TooLongDescriptionException(BaseException):
    @property
    def message(self) -> str:
        return f"Invalid description value! The description '{self.value}' is too long!"


@dataclass(eq=False)
class NegativeByteSizeNumberException(BaseException):
    @property
    def message(self) -> str:
        return f"Invalid byte size value! The byte size '{self.value}' is negative number (expected positive)!"


@dataclass(eq=False)
class TooLongDownloadUriException(BaseException):
    @property
    def message(self) -> str:
        return f"Invalid download uri value! The download uri '{self.value}' too long!"


@dataclass(eq=False)
class InvalidDownloadUriFormatException(BaseException):
    @property
    def message(self) -> str:
        return f"Invalid download uri value! The download uri '{self.value}' is not valid uri!"
