import os
from typing import Optional

class Settings:
    PROJECT_NAME: str = "Mivaj.com Sports Engine"
    API_V1_STR: str = "/api/v1"
    
    # Supabase
    SUPABASE_URL: str = os.getenv("NEXT_PUBLIC_SUPABASE_URL", "https://wpspjtsrvvmlceizdzci.supabase.co")
    SUPABASE_SERVICE_ROLE_KEY: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
    SUPABASE_ANON_KEY: str = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "")
    
    # Redis
    REDIS_URL: str = os.getenv("UPSTASH_REDIS_REST_URL", "redis://localhost:6379")
    
    # OpenAI / Moderation
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    
    # WAHA WhatsApp HTTP API
    WAHA_API_URL: str = os.getenv("WAHA_API_URL", "http://localhost:3008")
    WAHA_SESSION: str = os.getenv("WAHA_SESSION", "default")
    
    # Sports Data
    FOOTBALL_DATA_TOKEN: str = os.getenv("FOOTBALL_DATA_TOKEN", "")
    THE_SPORTS_DB_KEY: str = os.getenv("THE_SPORTS_DB_KEY", "3")

settings = Settings()
