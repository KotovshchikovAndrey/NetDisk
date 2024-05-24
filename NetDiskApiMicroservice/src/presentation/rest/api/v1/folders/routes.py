from uuid import uuid4

from fastapi import APIRouter
from sqlalchemy import select, text
from infrastructure.sqlalchemy.models.cart import CartModel
from setup.config import settings
from infrastructure.sqlalchemy.connection import SqlalchemyConnection
from infrastructure.sqlalchemy.models.resource import ResourceModel

router = APIRouter(prefix="/folders")


@router.get("/")
async def get_my_files():
    connection = SqlalchemyConnection(connection_url=settings.database.url, echo=True)
    session = connection.create_session()

    # query = select(CartModel).limit(1)
    # result = await session.scalar(query)
    # print(result.id)
    model = CartModel(id=uuid4(), owner_id=uuid4())
    session.add(model)
    await session.commit()
    await session.aclose()

    return 200
