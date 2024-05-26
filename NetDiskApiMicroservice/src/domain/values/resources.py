import re
from enum import StrEnum
from uuid import UUID

from pydantic.dataclasses import dataclass

from domain import consts
from domain.exceptions import resources as exceptions
from domain.values.base import BaseValue


@dataclass(frozen=True, config=dict(validate_assignment=True))
class ResourceName(BaseValue[str]):
    value: str

    def validate(self) -> None:
        if len(self.value) > consts.MAX_RESOURCE_NAME_LENGTH:
            raise exceptions.TooLongResourceNameException(self.value)


@dataclass(frozen=True, config=dict(validate_assignment=True))
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


@dataclass(frozen=True, config=dict(validate_assignment=True))
class FolderName(ResourceName): ...


@dataclass(frozen=True, config=dict(validate_assignment=True))
class Description(BaseValue[str]):
    value: str

    def validate(self) -> None:
        if len(self.value) > consts.MAX_RESOURCE_DESCRIPTION_LENGTH:
            raise exceptions.TooLongDescriptionException(self.value)


@dataclass(frozen=True, config=dict(validate_assignment=True))
class ByteSize(BaseValue[int]):
    value: int

    def validate(self) -> None:
        if self.value < 0:
            raise exceptions.NegativeByteSizeNumberException(self.value)


@dataclass(frozen=True, config=dict(validate_assignment=True))
class DownloadUri(BaseValue[str]):
    value: str

    def validate(self) -> None:
        if len(self.value) > consts.MAX_RESOURCE_DOWNLOAD_URI_LENGTH:
            raise exceptions.TooLongDownloadUriException(self.value)

        if not re.match("(?:http|https):\/\/[A-Za-z.-_]+.(?:com|ru)", self.value):
            raise exceptions.InvalidDownloadUriFormatException(self.value)


@dataclass(frozen=True, config=dict(validate_assignment=True))
class UserAccess:
    owner_id: UUID
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
