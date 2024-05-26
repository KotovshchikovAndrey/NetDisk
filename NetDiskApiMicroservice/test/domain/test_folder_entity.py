from uuid import UUID

import pytest

from domain import consts
from domain.exceptions import resources as exceptions
from domain.factories.folders import FolderFactory
from domain.values.resources import MediaType, SharedAccess


class TestFolderEntity:
    @pytest.mark.parametrize(
        "name, description",
        (
            ("New Folder 1", ""),
            ("New Folder 2", "something"),
            ("New Folder 3", "something"),
        ),
    )
    def test_create_folder_success(
        self,
        owner_id: UUID,
        name: str,
        description: str,
    ) -> None:
        factory = FolderFactory(name=name, description=description, owner_id=owner_id)
        new_folder = factory.create()

        assert new_folder.name.to_generic_type() == name
        assert new_folder.description.to_generic_type() == description
        assert new_folder.owner_id == owner_id
        assert new_folder.byte_size is None
        assert new_folder.media_type == MediaType.FOLDER
        assert new_folder.shared_access == SharedAccess.PRIVATE
        assert (
            new_folder.download_uri.to_generic_type()
            == consts.DOWNLOAD_FOLDER_URI.format(str(new_folder.id))
        )

    @pytest.mark.parametrize(
        "name, description",
        (
            (
                "X" * (consts.MAX_RESOURCE_NAME_LENGTH + 1),
                "",
            ),
        ),
    )
    def test_create_folder_raise_too_long_resource_name_exception(
        self,
        owner_id: UUID,
        name: str,
        description: str,
    ) -> None:
        factory = FolderFactory(name=name, description=description, owner_id=owner_id)
        with pytest.raises(exceptions.TooLongResourceNameException):
            factory.create()

    @pytest.mark.parametrize(
        "name, description",
        (
            (
                "New Folder",
                "X" * (consts.MAX_RESOURCE_DESCRIPTION_LENGTH + 1),
            ),
        ),
    )
    def test_create_folder_raise_too_long_description_exception(
        self,
        owner_id: UUID,
        name: str,
        description: str,
    ) -> None:
        factory = FolderFactory(name=name, description=description, owner_id=owner_id)
        with pytest.raises(exceptions.TooLongDescriptionException):
            factory.create()
