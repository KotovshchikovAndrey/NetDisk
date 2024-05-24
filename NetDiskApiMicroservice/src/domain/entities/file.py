from dataclasses import dataclass

from domain.entities.resource import Resource
from domain.values import resources as values


@dataclass(eq=False, kw_only=True)
class File(Resource):
    name: values.FileName
    byte_size: values.ByteSize
