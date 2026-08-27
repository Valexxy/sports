import re
import httpx
from typing import Dict, Any, Tuple
from app.core.config import settings

# Strict multi-lingual & Nigerian Pidgin profanity, abuse, and spam blocklist
STRICT_BLOCKLIST = [
    # General Abuse & Harassment
    "hate", "kill", "die", "murder", "racist", "terrorist", "nazi", "scam", "fraud",
    "bitch", "bastard", "idiot", "stupid", "moron", "fool", "dumb", "useless", "trash",
    # NSFW & Profanity
    "fuck", "shit", "cunt", "pussy", "dick", "cock", "asshole", "slut", "whore",
    # Nigerian Pidgin / Local Slurs & Fraud terminology
    "mumu", "ode", "werey", "oloriburuku", "ashewo", "oloshi", "bariga", "419",
    "yahoo yahoo", "wire wire", "send account details", "free money", "crypto double",
    # URL & Spam patterns
    "http://", "https://", "t.me/", "wa.me/", "bit.ly", ".xyz", "t.co"
]

def check_local_blocklist(text: str) -> Tuple[bool, str]:
    cleaned = text.lower()
    for word in STRICT_BLOCKLIST:
        # Check whole words or suspicious substrings
        if word in cleaned:
            return False, f"Message contains restricted term or spam pattern: '{word}'"
    
    # Check repeated exclamation/character spam
    if re.search(r'(.)\1{7,}', cleaned):
        return False, "Message rejected due to character flood spam."
        
    return True, "Passed local safety filter."

async def moderate_text(text: str) -> Dict[str, Any]:
    trimmed = text.strip()
    if not trimmed:
        return {
            "status": "REJECTED",
            "score": 1.0,
            "reason": "Wish message cannot be empty."
        }
        
    if len(trimmed) > 500:
        return {
            "status": "REJECTED",
            "score": 0.9,
            "reason": "Wish message exceeds the 500 characters limit."
        }
        
    # Tier 1: Local Strict Blocklist (Sub-millisecond rejection)
    local_passed, local_reason = check_local_blocklist(trimmed)
    if not local_passed:
        return {
            "status": "REJECTED",
            "score": 0.95,
            "reason": local_reason
        }
        
    # Tier 2: OpenAI Moderation API (If API key provided)
    if settings.OPENAI_API_KEY and settings.OPENAI_API_KEY.startswith("sk-"):
        try:
            async with httpx.AsyncClient(timeout=3.0) as client:
                res = await client.post(
                    "https://api.openai.com/v1/moderations",
                    headers={
                        "Authorization": f"Bearer {settings.OPENAI_API_KEY}",
                        "Content-Type": "application/json"
                    },
                    json={"input": trimmed}
                )
                if res.status_code == 200:
                    data = res.json()
                    results = data.get("results", [])
                    if results and results[0].get("flagged"):
                        categories = results[0].get("categories", {})
                        flagged_cats = [cat for cat, val in categories.items() if val]
                        return {
                            "status": "REJECTED",
                            "score": 0.99,
                            "reason": f"Automated moderation flagged for: {', '.join(flagged_cats)}"
                        }
        except Exception as e:
            # Fallback gracefully to local blocklist result if API is unreachable
            print(f"OpenAI Moderation API fallback: {e}")
            
    return {
        "status": "APPROVED",
        "score": 0.00,
        "reason": "Message passed automated moderation."
    }
