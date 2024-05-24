from datetime import UTC, datetime
from unittest.mock import AsyncMock
from uuid import UUID, uuid4

import pytest

from domain.entities.file import File
from domain.repositories.unit_of_work import UnitOfWork
from domain.values.base import Id
from domain.values import resources as values
from test.mocks.file_repository import MockFileRepository


@pytest.fixture
def mock_unit_of_work(mocker, file: File) -> UnitOfWork:
    mock_uow = mocker.MagicMock(spec=UnitOfWork)
    mock_uow.__aenter__.return_value = mock_uow

    mock_files_repository = MockFileRepository(database=[file])
    mock_uow.files = mock_files_repository

    mock_uow.commit = AsyncMock()
    mock_uow.rollback = AsyncMock()

    return mock_uow


@pytest.fixture
def owner_id() -> str:
    return str(uuid4())


@pytest.fixture
def file_id() -> str:
    return str(uuid4())


@pytest.fixture
def file(file_id: str, owner_id: str) -> File:
    return File(
        id=Id(file_id),
        byte_size=100,
        created_at=datetime.now(UTC),
        updated_at=datetime.now(UTC),
        description=values.Description(""),
        download_uri=values.DownloadUri("https://my.site.com"),
        media_type=values.MediaType.TEXT,
        name=values.FileName("new_file.txt"),
        owner_id=Id(owner_id),
        shared_access=values.SharedAccess.PRIVATE,
        user_accesses=[
            values.UserAccess(
                owner_id=Id(owner_id),
                access=values.UserAccess.Access.OWNER,
            )
        ],
    )
