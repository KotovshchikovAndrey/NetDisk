from uuid import UUID, uuid4
import pytest


@pytest.fixture
def owner_id() -> UUID:
    return uuid4()
