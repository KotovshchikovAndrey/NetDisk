from pydantic import BaseModel
from pydantic_settings import BaseSettings, SettingsConfigDict


class DatabaseConfig(BaseModel):
    url: str
    pool_size: int = 1
    echo: bool = True


class ServerConfig(BaseModel):
    host: str
    port: int
    worker_count: int = 1
    is_debug: bool = True


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        case_sensitive=False,
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        env_nested_delimiter="__",
    )

    server: ServerConfig
    database: DatabaseConfig


settings = Settings()
