from dataclasses import dataclass
from domain.exceptions.base_exception import BaseException


@dataclass(eq=False)
class InvalidResourceNameTypeException(BaseException):
    @property
    def message(self) -> str:
        return f"Invalid resource name type! The name '{self.value}' is not str!"


@dataclass(eq=False)
class TooLongResourceNameException(BaseException):
    @property
    def message(self) -> str:
        return f"Invalid resource name value! The name '{self.value}' is too long!"


@dataclass(eq=False)
class InvalidDescriptionTypeException(BaseException):
    @property
    def message(self) -> str:
        return f"Invalid description type! The description '{self.value}' is not str!"


@dataclass(eq=False)
class TooLongDescriptionException(BaseException):
    @property
    def message(self) -> str:
        return f"Invalid description value! The description '{self.value}' is too long!"


@dataclass(eq=False)
class InvalidByteSizeTypeException(BaseException):
    @property
    def message(self) -> str:
        return f"Invalid byte size type! The byte size '{self.value}' is not int!"


@dataclass(eq=False)
class NegativeByteSizeNumberException(BaseException):
    @property
    def message(self) -> str:
        return f"Invalid byte size value! The byte size '{self.value}' is negative number (expected positive)!"


@dataclass(eq=False)
class InvalidDownloadUriTypeException(BaseException):
    @property
    def message(self) -> str:
        return f"Invalid download uri type! The download uri '{self.value}' is not str!"


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
