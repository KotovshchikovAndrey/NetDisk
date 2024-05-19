from dataclasses import dataclass

from domain.entities.resource_entity import Resource
from domain.values import resource_values as values


@dataclass(eq=False, kw_only=True)
class File(Resource):
    name: values.FileName
    byte_size: values.ByteSize
