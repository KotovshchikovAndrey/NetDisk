from datetime import UTC, datetime
from uuid import uuid4

import pytest

from application.dtos.file_dtos import AddFileToDiskInput
from application.usecases.files.add_file_to_disk import AddFileToDiskUsecase
from domain.repositories.unit_of_work import UnitOfWork


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
    ):
        dto = AddFileToDiskInput(
            owner_id=owner_id,
            name=name,
            download_uri=download_uri,
            byte_size=byte_size,
            created_at=created_at,
        )

        usecase = AddFileToDiskUsecase(unit_of_work=mock_unit_of_work)
        output = await usecase.execute(dto)
        assert output is None
