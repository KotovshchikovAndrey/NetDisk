from abc import abstractmethod

from domain.entities.cart import Cart
from domain.repositories.base import IBaseRepository


class ICartRepository(IBaseRepository[Cart]): ...
