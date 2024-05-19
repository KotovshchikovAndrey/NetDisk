from unittest.mock import AsyncMock
from uuid import UUID, uuid4

import pytest

from domain.repositories.unit_of_work import UnitOfWork


@pytest.fixture
def mock_unit_of_work(mocker) -> UnitOfWork:
    mock_uow = mocker.MagicMock(spec=UnitOfWork)
    mock_uow.__aenter__.return_value = mock_uow

    mock_files_repository = mocker.MagicMock()
    mock_uow.files = mock_files_repository
    mock_files_repository.save = AsyncMock()

    mock_uow.commit = AsyncMock()
    mock_uow.rollback = AsyncMock()

    return mock_uow


@pytest.fixture
def owner_id() -> UUID:
    return uuid4()
