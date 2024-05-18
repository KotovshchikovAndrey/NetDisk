from dataclasses import dataclass
from domain.entities.resource_entity import Resource
from domain.values.resource_values import ByteSize, FileName


@dataclass(eq=False, kw_only=True)
class FileResource(Resource):
    name: FileName
    byte_size: ByteSize
