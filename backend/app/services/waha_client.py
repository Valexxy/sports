import httpx
import os
from typing import Dict, Any, Optional
from app.core.config import settings

class WahaClient:
    def __init__(self, base_url: Optional[str] = None, session: Optional[str] = None):
        self.base_url = (base_url or settings.WAHA_API_URL or "http://localhost:3008").rstrip("/")
        self.session = session or settings.WAHA_SESSION or "default"

    async def send_text_message(self, phone_number: str, message: str) -> Dict[str, Any]:
        """
        Send WhatsApp text notification via WAHA HTTP API.
        phone_number must be E.164 without '+' or '@c.us' (e.g. 2348012345678)
        """
        clean_phone = phone_number.replace("+", "").replace(" ", "").replace("-", "")
        chat_id = f"{clean_phone}@c.us" if not clean_phone.endswith("@c.us") else clean_phone
        
        endpoint = f"{self.base_url}/api/sendText"
        payload = {
            "session": self.session,
            "chatId": chat_id,
            "text": message
        }
        
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.post(endpoint, json=payload)
                if res.status_code in [200, 201]:
                    return {"success": True, "data": res.json()}
                else:
                    return {"success": False, "status_code": res.status_code, "error": res.text}
        except Exception as e:
            print(f"WAHA WhatsApp dispatch error for {phone_number}: {e}")
            return {"success": False, "error": str(e)}

    async def send_match_kickoff_alert(
        self,
        phone_number: str,
        player_name: str,
        team_name: str,
        opponent_name: str,
        league: str,
        kickoff_time: str,
        match_url: str = "https://mivaj.com"
    ) -> Dict[str, Any]:
        message = (
            f"⚡ *MIVAJ SPORTS KICKOFF ALERT* ⚡\n\n"
            f"🔔 Your followed star *{player_name}* is starting in 15 minutes!\n\n"
            f"🏆 *League:* {league}\n"
            f"⚽ *Match:* {team_name} vs {opponent_name}\n"
            f"⏱️ *Kickoff:* {kickoff_time}\n\n"
            f"🎙️ *Listen to Live Female Warri Audio Commentary & Scores:*\n"
            f"{match_url}\n\n"
            f"Good luck and enjoy the match! 🔥"
        )
        return await self.send_text_message(phone_number, message)

waha_client = WahaClient()
