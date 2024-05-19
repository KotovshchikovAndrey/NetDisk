from abc import abstractmethod

from domain.entities.cart_entity import Cart
from domain.repositories.base_repository import IBaseRepository


class ICartRepository(IBaseRepository[Cart]): ...
