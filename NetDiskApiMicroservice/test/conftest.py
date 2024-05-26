from datetime import UTC, datetime
from test.mocks.resource_repository import MockResourceRepository
from unittest.mock import AsyncMock
from uuid import UUID, uuid4

import pytest

from domain.entities.file import File
from domain.repositories.unit_of_work import UnitOfWork
from domain.values import resources as values


@pytest.fixture
def mock_unit_of_work(mocker, file: File) -> UnitOfWork:
    mock_uow = mocker.MagicMock(spec=UnitOfWork)
    mock_uow.__aenter__.return_value = mock_uow

    mock_resource_repository = MockResourceRepository(database=[file])
    mock_uow.resources = mock_resource_repository

    mock_uow.commit = AsyncMock()
    mock_uow.rollback = AsyncMock()

    return mock_uow


@pytest.fixture
def owner_id() -> UUID:
    return uuid4()


@pytest.fixture
def file_id() -> UUID:
    return uuid4()


@pytest.fixture
def file(file_id: UUID, owner_id: UUID) -> File:
    return File(
        id=file_id,
        owner_id=owner_id,
        byte_size=values.ByteSize(100),
        created_at=datetime.now(UTC),
        updated_at=datetime.now(UTC),
        description=values.Description(""),
        download_uri=values.DownloadUri("https://my.site.com"),
        media_type=values.MediaType.TEXT,
        name=values.FileName("new_file.txt"),
        shared_access=values.SharedAccess.PRIVATE,
        user_accesses=[
            values.UserAccess(owner_id=owner_id, access=values.UserAccess.Access.OWNER)
        ],
    )
