from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.core.supabase import supabase

router = APIRouter(prefix="/follows", tags=["Player Follows & WhatsApp Alerts"])

class FollowRequest(BaseModel):
    user_id: str
    phone_number: Optional[str] = None
    notify_whatsapp: bool = True

IN_MEMORY_FOLLOWS = set()

@router.post("/{player_id}")
async def toggle_player_follow(player_id: str, req: FollowRequest):
    key = f"{req.user_id}:{player_id}"
    
    if supabase:
        try:
            # Check existing
            existing = supabase.table("player_follows").select("*").eq("user_id", req.user_id).eq("player_id", player_id).execute()
            if existing and existing.data:
                # Unfollow
                supabase.table("player_follows").delete().eq("user_id", req.user_id).eq("player_id", player_id).execute()
                return {"success": True, "followed": False, "message": "Unfollowed player match alerts."}
            else:
                # Follow
                supabase.table("player_follows").insert({
                    "user_id": req.user_id,
                    "player_id": player_id,
                    "notify_whatsapp": req.notify_whatsapp
                }).execute()
                return {"success": True, "followed": True, "message": "🔔 Following player! WhatsApp kickoff alerts active."}
        except Exception as e:
            print(f"Supabase follow toggle fallback: {e}")
            
    # Fallback in-memory
    if key in IN_MEMORY_FOLLOWS:
        IN_MEMORY_FOLLOWS.remove(key)
        return {"success": True, "followed": False, "message": "Unfollowed player match alerts."}
    else:
        IN_MEMORY_FOLLOWS.add(key)
        return {"success": True, "followed": True, "message": "🔔 Following player! WhatsApp kickoff alerts active."}
