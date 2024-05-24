from datetime import UTC, datetime
from uuid import uuid4

import pytest

from application.dtos import files as dtos
from application.usecases.files.add_file_to_disk import AddFileToDiskUsecase
from application.usecases.files.replace_download_uri import ReplaceDownloadUriUsecase
from domain.repositories.unit_of_work import UnitOfWork
from application.exceptions import files as exceptions


class TestFileUsecases:
    @pytest.mark.parametrize(
        "owner_id, name, download_uri, byte_size, created_at",
        (
            (
                str(uuid4()),
                "new_file.txt",
                "https://my.storage.com",
                100,
                datetime.now(UTC),
            ),
            (
                str(uuid4()),
                "new_file.mp4",
                "https://mystorage.com",
                100,
                datetime.now(UTC),
            ),
        ),
    )
    async def test_add_file_to_disk_success(
        self,
        mock_unit_of_work: UnitOfWork,
        owner_id: str,
        name: str,
        download_uri: str,
        byte_size: int,
        created_at: datetime,
    ) -> None:
        dto = dtos.AddFileToDiskInput(
            owner_id=owner_id,
            name=name,
            download_uri=download_uri,
            byte_size=byte_size,
            created_at=created_at,
        )

        usecase = AddFileToDiskUsecase(unit_of_work=mock_unit_of_work)
        output = await usecase.execute(dto)
        assert output is None

    @pytest.mark.parametrize(
        "download_uri",
        (
            "https://my.storage.com",
            "https://mystorage.com",
        ),
    )
    async def test_replcace_download_uri_success(
        self,
        mock_unit_of_work: UnitOfWork,
        file_id: str,
        download_uri: str,
    ) -> None:
        dto = dtos.ReplaceDownloadUriInput(id=file_id, download_uri=download_uri)
        usecase = ReplaceDownloadUriUsecase(unit_of_work=mock_unit_of_work)
        output = await usecase.execute(dto)
        assert output is None

    @pytest.mark.parametrize(
        "download_uri",
        (
            "https://my.storage.com",
            "https://mystorage.com",
        ),
    )
    async def test_replcace_download_uri_raise_no_such_file_exception(
        self,
        mock_unit_of_work: UnitOfWork,
        download_uri: str,
    ) -> None:
        not_exists_id = str(uuid4())
        dto = dtos.ReplaceDownloadUriInput(id=not_exists_id, download_uri=download_uri)
        usecase = ReplaceDownloadUriUsecase(unit_of_work=mock_unit_of_work)

        with pytest.raises(exceptions.NoSuchFileException):
            await usecase.execute(dto)
