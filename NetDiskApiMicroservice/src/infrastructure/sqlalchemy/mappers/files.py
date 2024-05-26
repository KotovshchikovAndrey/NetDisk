from domain.entities.file import File
from domain.values import resources as values
from infrastructure.sqlalchemy.models.resource import ResourceModel


class FileMapper:
    @staticmethod
    def to_domain(model: ResourceModel) -> File:
        user_accesses = []
        for user_access in model.user_accesses:
            user_access = values.UserAccess(
                owner_id=user_access["owner_id"],
                access=user_access["access"],
            )

        user_accesses.append(user_access)

        return File(
            id=model.id,
            owner_id=model.owner_id,
            media_type=model.media_type,
            shared_access=model.shared_access,
            created_at=model.created_at,
            updated_at=model.updated_at,
            user_accesses=user_accesses,
            name=values.FileName(model.name),
            description=values.Description(model.description),
            download_uri=values.DownloadUri(model.download_uri),
            byte_size=values.ByteSize(model.byte_size),
        )

    @staticmethod
    def from_domain(entity: File) -> ResourceModel:
        user_accesses = []
        for user_access in entity.user_accesses:
            user_accesses.append(
                {"owner_id": str(user_access.owner_id), "access": user_access.access}
            )

        return ResourceModel(
            id=entity.id,
            owner_id=entity.owner_id,
            media_type=entity.media_type,
            shared_access=entity.shared_access,
            created_at=entity.created_at,
            updated_at=entity.updated_at,
            user_accesses=user_accesses,
            name=entity.name.to_generic_type(),
            description=entity.description.to_generic_type(),
            download_uri=entity.download_uri.to_generic_type(),
            byte_size=entity.byte_size.to_generic_type(),
        )
