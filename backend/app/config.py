from pydantic_settings import BaseSettings
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
    DATABASE_URL: str = normalize_database_url(
        os.getenv(
            "DATABASE_URL",
            "postgresql+asyncpg://postgres:postgres@localhost:5433/ngo_tracker",
        )
    )

    class Config:
        env_file = ".env"


settings = Settings()
