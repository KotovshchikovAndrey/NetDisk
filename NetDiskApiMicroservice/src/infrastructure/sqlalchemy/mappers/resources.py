from domain.entities.resource import Resource
from domain.values import resources as values
from infrastructure.sqlalchemy.models.resource import ResourceModel


class ResourceMapper:
    @staticmethod
    def to_domain(model: ResourceModel) -> Resource:
        byte_size = None
        if model.byte_size is not None:
            byte_size = values.ByteSize(model.byte_size)

        return Resource(
            id=model.id,
            owner_id=model.owner_id,
            media_type=model.media_type,
            shared_access=model.shared_access,
            created_at=model.created_at,
            updated_at=model.updated_at,
            user_accesses=model.user_accesses,
            byte_size=byte_size,
            name=values.ResourceName(model.name),
            description=values.Description(model.description),
            download_uri=values.DownloadUri(model.download_uri),
        )

    @staticmethod
    def from_domain(entity: Resource) -> ResourceModel:
        byte_size = None
        if entity.byte_size is not None:
            byte_size = entity.byte_size.to_generic_type()

        return ResourceModel(
            id=entity.id,
            owner_id=entity.owner_id,
            media_type=entity.media_type,
            shared_access=entity.shared_access,
            created_at=entity.created_at,
            updated_at=entity.updated_at,
            user_accesses=entity.user_accesses,
            byte_size=byte_size,
            name=entity.name.to_generic_type(),
            description=entity.description.to_generic_type(),
            download_uri=entity.download_uri.to_generic_type(),
        )
