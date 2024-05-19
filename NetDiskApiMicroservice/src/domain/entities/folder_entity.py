from dataclasses import dataclass, field

from domain.entities.resource_entity import Resource
from domain.values import resource_values as values


@dataclass(eq=False, kw_only=True)
class Folder(Resource):
    name: values.FolderName
    media_type: values.MediaType = field(default=values.MediaType.FOLDER, init=False)
    resources: list["Resource"] = field(default_factory=list)

    def add_resource(self, resource: "Resource") -> None:
        self.resources.append(resource)
