import os
from pathlib import Path
from pydantic_settings import BaseSettings
from typing import Optional

BASE_DIR = Path(__file__).resolve().parent.parent
DB_FILE = BASE_DIR / "career_guidance.db"

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI-Enabled Career Counselling & Family Decision-Support Platform"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = "super-secret-jwt-token-key-for-career-counselling-platform"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # Database: Supports SQLite out-of-the-box or PostgreSQL
    DATABASE_URL: str = f"sqlite:///{DB_FILE.as_posix()}"

    # Configurable Recommendation Engine Weights (Must sum to 1.0)
    WEIGHT_INTEREST: float = 0.30
    WEIGHT_SKILL: float = 0.20
    WEIGHT_ACADEMIC: float = 0.15
    WEIGHT_APTITUDE: float = 0.15
    WEIGHT_STRENGTH: float = 0.10
    WEIGHT_PREFERENCE: float = 0.10

    # LLM Explanation Configuration
    LLM_PROVIDER: str = "template"  # options: 'template', 'openai', 'gemini'
    OPENAI_API_KEY: Optional[str] = None
    GEMINI_API_KEY: Optional[str] = None

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
