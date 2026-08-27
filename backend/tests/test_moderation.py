import pytest
import asyncio
from app.services.moderation import moderate_text, check_local_blocklist

@pytest.mark.asyncio
async def test_safe_birthday_wish():
    result = await moderate_text("Happy Birthday Victor Osimhen! Keep flying the Nigerian flag high! 🇳🇬🎂")
    assert result["status"] == "APPROVED"
    assert result["score"] == 0.0

@pytest.mark.asyncio
async def test_abusive_wish_rejection():
    result = await moderate_text("You are a useless fool and I hate you")
    assert result["status"] == "REJECTED"
    assert result["score"] > 0.8

@pytest.mark.asyncio
async def test_pidgin_slur_rejection():
    result = await moderate_text("Happy birthday you ode and werey player")
    assert result["status"] == "REJECTED"

@pytest.mark.asyncio
async def test_spam_link_rejection():
    result = await moderate_text("Join my free crypto VIP channel at https://t.me/fakechannel")
    assert result["status"] == "REJECTED"
