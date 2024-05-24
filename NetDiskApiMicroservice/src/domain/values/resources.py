import re
from dataclasses import dataclass
from enum import StrEnum

from domain import consts
from domain.exceptions import resources as exceptions
from domain.values.base import BaseValue, Id


@dataclass(frozen=True)
class ResourceName(BaseValue[str]):
    value: str

    def validate(self) -> None:
        if not isinstance(self.value, str):
            raise exceptions.InvalidResourceNameTypeException(self.value)

        if len(self.value) > consts.MAX_RESOURCE_NAME_LENGTH:
            raise exceptions.TooLongResourceNameException(self.value)


@dataclass(frozen=True)
class FileName(ResourceName):
    def define_media_type(self) -> "MediaType":
        ext = self.get_ext()
        match ext:
            case ext if ext in consts.ALLOWED_IMAGE_EXT:
                return MediaType.IMAGE

            case ext if ext in consts.ALLOWED_AUDIO_EXT:
                return MediaType.AUDIO

            case _:
                return MediaType.UNKNOWN

    def get_ext(self) -> str:
        *_, ext = self.value.split(".")
        return ext


@dataclass(frozen=True)
class FolderName(ResourceName): ...


@dataclass(frozen=True)
class Description(BaseValue[str]):
    value: str

    def validate(self) -> None:
        if not isinstance(self.value, str):
            raise exceptions.InvalidDescriptionTypeException(self.value)

        if len(self.value) > consts.MAX_RESOURCE_DESCRIPTION_LENGTH:
            raise exceptions.TooLongDescriptionException(self.value)


@dataclass(frozen=True)
class ByteSize(BaseValue[int]):
    value: int

    def validate(self) -> None:
        if not isinstance(self.value, int):
            raise exceptions.InvalidByteSizeTypeException(self.value)

        if self.value < 0:
            raise exceptions.NegativeByteSizeNumberException(self.value)


@dataclass(frozen=True)
class DownloadUri(BaseValue[str]):
    value: str

    def validate(self) -> None:
        if not isinstance(self.value, str):
            raise exceptions.InvalidDownloadUriTypeException(self.value)

        if len(self.value) > consts.MAX_RESOURCE_DOWNLOAD_URI_LENGTH:
            raise exceptions.TooLongDownloadUriException(self.value)

        if not re.match("(?:http|https):\/\/[A-Za-z.-_]+.(?:com|ru)", self.value):
            raise exceptions.InvalidDownloadUriFormatException(self.value)


@dataclass(frozen=True)
class UserAccess:
    owner_id: Id
    access: "Access"

    class Access(StrEnum):
        READ = "READ"
        COMMENT = "COMMENT"
        EDIT = "EDIT"
        OWNER = "OWNER"


class MediaType(StrEnum):
    TEXT = "TEXT"
    WORD = "WORD"
    PDF = "PDF"
    IMAGE = "IMAGE"
    VIDEO = "VIDEO"
    AUDIO = "AUDIO"
    FOLDER = "FOLDER"
    UNKNOWN = "UNCNOWN"


class SharedAccess(StrEnum):
    PRIVATE = "PRIVATE"
    ALL_READ = "ALL_READ"
    ALL_COMMENT = "ALL_COMMENT"
    ALL_EDIT = "ALL_EDIT"
