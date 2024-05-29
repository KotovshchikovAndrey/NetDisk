from domain.entities.folder import Folder
from domain.values import resources as values
from infrastructure.sqlalchemy.mappers.resources import ResourceMapper
from infrastructure.sqlalchemy.models.resource import ResourceModel


class FolderMapper:
    @staticmethod
    def to_domain(model: ResourceModel) -> Folder:
        resources = []
        for resource_model in model.resources:
            resources.append(ResourceMapper.to_domain(resource_model))

        return Folder(
            id=model.id,
            owner_id=model.owner_id,
            name=values.FolderName(model.name),
            description=values.Description(model.description),
            download_uri=values.DownloadUri(model.download_uri),
            shared_access=model.shared_access,
            created_at=model.created_at,
            updated_at=model.updated_at,
            parent_folder_id=model.parent_resource_id,
            user_accesses=model.user_accesses,
            resources=resources,
        )

    @staticmethod
    def from_domain(entity: Folder) -> ResourceModel:
        resources = []
        for resource in entity.resources:
            resources.append(ResourceMapper.from_domain(resource))

        return ResourceModel(
            id=entity.id,
            owner_id=entity.owner_id,
            shared_access=entity.shared_access,
            media_type=entity.media_type,
            created_at=entity.created_at,
            updated_at=entity.updated_at,
            user_accesses=entity.user_accesses,
            parent_resource_id=entity.parent_folder_id,
            resources=resources,
            name=entity.name.to_generic_type(),
            description=entity.description.to_generic_type(),
            download_uri=entity.download_uri.to_generic_type(),
        )
