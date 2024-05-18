from dataclasses import dataclass, field
from domain.entities.resource_entity import Resource
from domain.values.resource_values import FolderName, MediaType


@dataclass(eq=False, kw_only=True)
class FolderResource(Resource):
    name: FolderName
    media_type: MediaType = field(default=MediaType.FOLDER, init=False)
    resources: list["Resource"] = field(default_factory=list)

    def add_resource(self, resource: "Resource") -> None:
        self.resources.append(resource)
