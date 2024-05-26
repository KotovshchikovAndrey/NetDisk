from pydantic.dataclasses import dataclass

from domain.entities.resource import Resource
from domain.values import resources as values


@dataclass(eq=False, kw_only=True, config=dict(validate_assignment=True))
class File(Resource):
    name: values.FileName
    byte_size: values.ByteSize

    def replace_download_uri(self, new_uri: str) -> None:
        self.download_uri = values.DownloadUri(new_uri)
