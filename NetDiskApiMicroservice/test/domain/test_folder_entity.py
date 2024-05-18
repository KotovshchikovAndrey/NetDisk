import pytest
from uuid import UUID
from domain.factories.folder_factory import FolderResourceFactory
from domain.values.resource_values import MediaType, SharedAccess
from domain import consts
from domain.exceptions.resource_exceptions import (
    TooLongDescriptionException,
    TooLongResourceNameException,
    InvalidByteSizeTypeException,
    InvalidDescriptionTypeException,
    InvalidDownloadUriFormatException,
    InvalidDownloadUriTypeException,
    InvalidResourceNameTypeException,
    NegativeByteSizeNumberException,
    TooLongDownloadUriException,
)


class TestFolderEntity:
    @pytest.mark.parametrize(
        "name, download_uri, description",
        (
            ("New Folder 1", "https://blobstorage.com/folderId", ""),
            ("New Folder 2", "https://blobstorage.com/folderId", "something"),
            ("New Folder 3", "http://blobstorage.com/folderId", "something"),
        ),
    )
    def test_create_folder_success(
        self,
        owner_id: UUID,
        name: str,
        download_uri: str,
        description: str,
    ) -> None:
        factory = FolderResourceFactory(
            name=name,
            description=description,
            download_uri=download_uri,
            owner_id=owner_id,
        )

        new_folder = factory.create()
        assert new_folder.name.to_generic_type() == name
        assert new_folder.description.to_generic_type() == description
        assert new_folder.download_uri.to_generic_type() == download_uri
        assert new_folder.owner_id == owner_id
        assert new_folder.byte_size is None
        assert new_folder.media_type == MediaType.FOLDER
        assert new_folder.shared_access == SharedAccess.PRIVATE

    @pytest.mark.parametrize(
        "name, download_uri, description",
        (
            (
                "X" * (consts.MAX_RESOURCE_NAME_LENGTH + 1),
                "https://blobstorage.com/folderId",
                "",
            ),
        ),
    )
    def test_create_folder_raise_too_long_resource_name_exception(
        self,
        owner_id: UUID,
        name: str,
        download_uri: str,
        description: str,
    ):
        factory = FolderResourceFactory(
            name=name,
            description=description,
            download_uri=download_uri,
            owner_id=owner_id,
        )

        with pytest.raises(TooLongResourceNameException):
            factory.create()

    @pytest.mark.parametrize(
        "name, download_uri, description",
        (
            (
                "New Folder",
                "https://blobstorage.com/folderId",
                "X" * (consts.MAX_RESOURCE_DESCRIPTION_LENGTH + 1),
            ),
        ),
    )
    def test_create_folder_raise_too_long_description_exception(
        self,
        owner_id: UUID,
        name: str,
        download_uri: str,
        description: str,
    ):
        factory = FolderResourceFactory(
            name=name,
            description=description,
            download_uri=download_uri,
            owner_id=owner_id,
        )

        with pytest.raises(TooLongDescriptionException):
            factory.create()
