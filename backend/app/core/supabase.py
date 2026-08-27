import os
from supabase import create_client, Client
from app.core.config import settings

def get_supabase_client() -> Optional[Client]:
    try:
        url = settings.SUPABASE_URL
        key = settings.SUPABASE_SERVICE_ROLE_KEY or settings.SUPABASE_ANON_KEY
        if url and key:
            return create_client(url, key)
    except Exception as e:
        print(f"Supabase client initialization warning: {e}")
    return None

supabase: Optional[Client] = get_supabase_client()
