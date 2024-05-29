from domain.entities.file import File
from domain.values import resources as values
from infrastructure.sqlalchemy.models.resource import ResourceModel


class FileMapper:
    @staticmethod
    def to_domain(model: ResourceModel) -> File:
        return File(
            id=model.id,
            owner_id=model.owner_id,
            media_type=model.media_type,
            shared_access=model.shared_access,
            created_at=model.created_at,
            updated_at=model.updated_at,
            user_accesses=model.user_accesses,
            byte_size=values.ByteSize(model.byte_size),
            name=values.ResourceName(model.name),
            description=values.Description(model.description),
            download_uri=values.DownloadUri(model.download_uri),
        )

    @staticmethod
    def from_domain(entity: File) -> ResourceModel:
        return ResourceModel(
            id=entity.id,
            owner_id=entity.owner_id,
            media_type=entity.media_type,
            shared_access=entity.shared_access,
            created_at=entity.created_at,
            updated_at=entity.updated_at,
            user_accesses=entity.user_accesses,
            byte_size=entity.byte_size.to_generic_type(),
            name=entity.name.to_generic_type(),
            description=entity.description.to_generic_type(),
            download_uri=entity.download_uri.to_generic_type(),
        )
