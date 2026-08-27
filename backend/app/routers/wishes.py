from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from app.services.moderation import moderate_text
from app.core.supabase import supabase

router = APIRouter(prefix="/players/{player_id}/wishes", tags=["Birthday Wishes (Birthday Pro)"])

class SubmitWishRequest(BaseModel):
    sender_name: str = Field(..., min_length=2, max_length=100)
    wish_message: str = Field(..., min_length=3, max_length=500)
    user_id: Optional[str] = None

# Fallback in-memory storage for wishes
IN_MEMORY_WISHES = {}

@router.get("")
async def get_player_wishes(player_id: str):
    if supabase:
        try:
            data = supabase.table("birthday_wishes")\
                .select("*")\
                .eq("player_id", player_id)\
                .eq("moderation_status", "APPROVED")\
                .order("created_at", desc=True)\
                .limit(50)\
                .execute()
            if data and data.data:
                return {"success": True, "count": len(data.data), "data": data.data}
        except Exception as e:
            print(f"Supabase wishes query fallback: {e}")
            
    wishes = IN_MEMORY_WISHES.get(player_id, [
        {
            "id": "w-seed-1",
            "player_id": player_id,
            "sender_name": "NaijaSuperFan",
            "wish_message": "Happy Birthday King! More goals, more trophies, and pure greatness! 🔥🎂",
            "moderation_status": "APPROVED",
            "likes_count": 28,
            "created_at": datetime.utcnow().isoformat()
        }
    ])
    return {"success": True, "count": len(wishes), "data": wishes}

@router.post("")
async def submit_birthday_wish(player_id: str, req: SubmitWishRequest):
    # 🛡️ AUTOMATED 2-TIER CONTENT MODERATION PIPELINE
    mod_result = await moderate_text(req.wish_message)
    if mod_result["status"] == "REJECTED":
        raise HTTPException(
            status_code=400,
            detail={
                "error": "CONTENT_MODERATION_FAILED",
                "message": mod_result["reason"],
                "score": mod_result["score"]
            }
        )
        
    wish_record = {
        "player_id": player_id,
        "user_id": req.user_id,
        "sender_name": req.sender_name.strip(),
        "wish_message": req.wish_message.strip(),
        "moderation_status": "APPROVED",
        "moderation_score": mod_result["score"],
        "moderation_reason": mod_result["reason"],
        "likes_count": 0,
        "created_at": datetime.utcnow().isoformat()
    }
    
    if supabase:
        try:
            insert_res = supabase.table("birthday_wishes").insert(wish_record).execute()
            if insert_res and insert_res.data:
                return {"success": True, "message": "Birthday wish approved and posted! 🎉", "data": insert_res.data[0]}
        except Exception as e:
            print(f"Supabase wish insert fallback: {e}")
            
    # Fallback memory insertion
    if player_id not in IN_MEMORY_WISHES:
        IN_MEMORY_WISHES[player_id] = []
    wish_record["id"] = f"w-{len(IN_MEMORY_WISHES[player_id]) + 1}"
    IN_MEMORY_WISHES[player_id].insert(0, wish_record)
    
    return {"success": True, "message": "Birthday wish approved and posted! 🎉", "data": wish_record}
