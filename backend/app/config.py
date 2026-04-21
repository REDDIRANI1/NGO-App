from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict
import os


def normalize_database_url(url: str) -> str:
    if not url:
        return "postgresql+asyncpg://postgres:postgres@localhost:5433/ngo_tracker"
    if url.startswith("postgresql://") and "+asyncpg" not in url:
        return url.replace("postgresql://", "postgresql+asyncpg://", 1)
    if url.startswith("postgres://"):
        return url.replace("postgres://", "postgresql+asyncpg://", 1)
    return url


class Settings(BaseSettings):
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql+asyncpg://postgres:postgres@localhost:5433/ngo_tracker",
    )

    model_config = SettingsConfigDict(env_file=".env")

    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def _normalize_database_url(cls, value: str) -> str:
        return normalize_database_url(value)


settings = Settings()
