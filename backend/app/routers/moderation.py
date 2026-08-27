from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.moderation import moderate_text

router = APIRouter(prefix="/moderation", tags=["Content Moderation"])

class ModerationRequest(BaseModel):
    text: str

class ModerationResponse(BaseModel):
    status: str
    score: float
    reason: str

@router.post("/check", response_model=ModerationResponse)
async def check_moderation(req: ModerationRequest):
    result = await moderate_text(req.text)
    return ModerationResponse(**result)
