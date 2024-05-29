from dataclasses import field
from uuid import UUID

from pydantic.dataclasses import dataclass

from domain.entities.resource import Resource
from domain.exceptions.folders import UserCannotAddToFolderException
from domain.values import resources as values


@dataclass(eq=False, kw_only=True, config=dict(validate_assignment=True))
class Folder(Resource):
    name: values.FolderName
    media_type: values.MediaType = field(default=values.MediaType.FOLDER, init=False)
    parent_folder_id: UUID | None = field(default=None)
    resources: list["Resource"] = field(default_factory=list)

    def add_resource(self, adding_user_id: UUID, resource: "Resource") -> None:
        if not self._check_user_can_add_resource(adding_user_id):
            raise UserCannotAddToFolderException(str(adding_user_id))

        self.resources.append(resource)

    def _check_user_can_add_resource(self, user_id: UUID) -> bool:
        needed_accesses = {
            values.Access.EDIT,
            values.Access.OWNER,
        }

        for user_access in self.user_accesses:
            if user_access["owner_id"] == str(user_id) and any(needed_accesses):
                return True

        return False
