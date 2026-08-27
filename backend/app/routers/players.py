from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
from app.core.supabase import supabase

router = APIRouter(prefix="/players", tags=["Star Players & Wiki"])

# Pre-seeded fallback catalog for high-availability offline operation
FALLBACK_PLAYERS = [
    {
        "id": "tsdb-osimhen",
        "external_id": "tsdb-osimhen",
        "name": "Victor Osimhen",
        "sport": "SOCCER",
        "position": "Striker (CF)",
        "jersey_number": 45,
        "team_name": "Galatasaray",
        "team_logo": "https://r2.thesportsdb.com/images/media/team/badge/7lfxq21546777855.png",
        "league": "Turkish Süper Lig",
        "country": "Nigeria",
        "country_flag": "🇳🇬",
        "date_of_birth": "1998-12-29",
        "birth_month": 12,
        "birth_day": 29,
        "bio": "African Player of the Year, Capocannoniere Serie A champion, elite athletic pressing forward leading Galatasaray and the Nigerian Super Eagles.",
        "market_value": "€75,000,000",
        "foot": "Right",
        "cutout_url": "https://r2.thesportsdb.com/images/media/player/cutout/b16vvh1726053896.png",
        "trophies": ["Serie A Champion (Napoli 2023)", "Capocannoniere Top Scorer", "African Footballer of the Year 2023"],
        "career_stats": {"goals": 26, "assists": 5, "appearances": 30, "rating": 8.6}
    },
    {
        "id": "tsdb-haaland",
        "external_id": "tsdb-haaland",
        "name": "Erling Haaland",
        "sport": "SOCCER",
        "position": "Striker (CF)",
        "jersey_number": 9,
        "team_name": "Manchester City",
        "team_logo": "https://r2.thesportsdb.com/images/media/team/badge/vwpvry1467462651.png",
        "league": "English Premier League",
        "country": "Norway",
        "country_flag": "🇳🇴",
        "date_of_birth": "2000-07-21",
        "birth_month": 7,
        "birth_day": 21,
        "bio": "Premier League Golden Boot record breaker and UEFA Champions League treble winner with Manchester City.",
        "market_value": "€180,000,000",
        "foot": "Left",
        "cutout_url": "https://r2.thesportsdb.com/images/media/player/cutout/i7t6241724401037.png",
        "trophies": ["UEFA Champions League Winner 2023", "Premier League Record 36 Goals", "European Golden Shoe 2023"],
        "career_stats": {"goals": 38, "assists": 6, "appearances": 35, "rating": 8.9}
    },
    {
        "id": "tsdb-mbappe",
        "external_id": "tsdb-mbappe",
        "name": "Kylian Mbappé",
        "sport": "SOCCER",
        "position": "Forward (LW/ST)",
        "jersey_number": 9,
        "team_name": "Real Madrid",
        "team_logo": "https://r2.thesportsdb.com/images/media/team/badge/8p1v0m1712852230.png",
        "league": "Spanish La Liga",
        "country": "France",
        "country_flag": "🇫🇷",
        "date_of_birth": "1998-12-20",
        "birth_month": 12,
        "birth_day": 20,
        "bio": "FIFA World Cup Winner, Golden Boot recipient, and Real Madrid galáctico forward.",
        "market_value": "€180,000,000",
        "foot": "Right",
        "cutout_url": "https://r2.thesportsdb.com/images/media/player/cutout/2q1lts1724400922.png",
        "trophies": ["FIFA World Cup Winner 2018", "World Cup Final Hat-Trick 2022", "6x Ligue 1 Golden Boot"],
        "career_stats": {"goals": 32, "assists": 9, "appearances": 34, "rating": 8.8}
    },
    {
        "id": "tsdb-bellingham",
        "external_id": "tsdb-bellingham",
        "name": "Jude Bellingham",
        "sport": "SOCCER",
        "position": "Attacking Midfielder",
        "jersey_number": 5,
        "team_name": "Real Madrid",
        "team_logo": "https://r2.thesportsdb.com/images/media/team/badge/8p1v0m1712852230.png",
        "league": "Spanish La Liga",
        "country": "England",
        "country_flag": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
        "date_of_birth": "2003-06-29",
        "birth_month": 6,
        "birth_day": 29,
        "bio": "Golden Boy winner, UEFA Champions League champion, and centerpiece of Real Madrid midfield.",
        "market_value": "€180,000,000",
        "foot": "Right",
        "cutout_url": "https://r2.thesportsdb.com/images/media/player/cutout/dsq9211724401140.png",
        "trophies": ["UEFA Champions League Winner 2024", "La Liga Player of the Year 2024", "Kopa Trophy Winner"],
        "career_stats": {"goals": 23, "assists": 13, "appearances": 42, "rating": 8.7}
    },
    {
        "id": "tsdb-yamal",
        "external_id": "tsdb-yamal",
        "name": "Lamine Yamal",
        "sport": "SOCCER",
        "position": "Right Winger (RW)",
        "jersey_number": 19,
        "team_name": "Barcelona",
        "team_logo": "https://r2.thesportsdb.com/images/media/team/badge/e016911546777789.png",
        "league": "Spanish La Liga",
        "country": "Spain",
        "country_flag": "🇪🇸",
        "date_of_birth": "2007-07-13",
        "birth_month": 7,
        "birth_day": 13,
        "bio": "UEFA Euro 2024 Champion, Young Player of the Tournament, and generational wonderkid from La Masia.",
        "market_value": "€150,000,000",
        "foot": "Left",
        "cutout_url": "https://r2.thesportsdb.com/images/media/player/cutout/xsw3291724401290.png",
        "trophies": ["UEFA Euro 2024 Champion", "Euro 2024 Young Player of the Tournament", "La Liga Champion 2023"],
        "career_stats": {"goals": 12, "assists": 17, "appearances": 44, "rating": 8.8}
    },
    {
        "id": "tsdb-lookman",
        "external_id": "tsdb-lookman",
        "name": "Ademola Lookman",
        "sport": "SOCCER",
        "position": "Winger / Forward",
        "jersey_number": 11,
        "team_name": "Atalanta",
        "team_logo": "https://r2.thesportsdb.com/images/media/team/badge/5k1k9r1546777901.png",
        "league": "Italian Serie A",
        "country": "Nigeria",
        "country_flag": "🇳🇬",
        "date_of_birth": "1997-10-20",
        "birth_month": 10,
        "birth_day": 20,
        "bio": "UEFA Europa League Final hat-trick hero and talismanic forward for Atalanta and Nigeria Super Eagles.",
        "market_value": "€40,000,000",
        "foot": "Right",
        "cutout_url": "https://r2.thesportsdb.com/images/media/player/cutout/a67r811724401340.png",
        "trophies": ["UEFA Europa League Winner (Final Hat-trick 2024)", "Ballon d Or Top 14 Nominee 2024", "AFCON Silver Medalist"],
        "career_stats": {"goals": 17, "assists": 10, "appearances": 36, "rating": 8.6}
    }
]

@router.get("")
async def get_players(
    query: Optional[str] = None,
    sport: Optional[str] = None,
    team: Optional[str] = None,
    limit: int = 20,
    offset: int = 0
):
    if supabase:
        try:
            req = supabase.table("players").select("*")
            if sport:
                req = req.eq("sport", sport.upper())
            if team:
                req = req.ilike("team_name", f"%{team}%")
            if query:
                req = req.ilike("name", f"%{query}%")
            data = req.limit(limit).offset(offset).execute()
            if data and data.data:
                return {"success": True, "count": len(data.data), "data": data.data}
        except Exception as e:
            print(f"Supabase player fetch fallback: {e}")
            
    # Fallback in-memory search
    filtered = FALLBACK_PLAYERS
    if query:
        filtered = [p for p in filtered if query.lower() in p["name"].lower() or query.lower() in p["team_name"].lower()]
    if sport:
        filtered = [p for p in filtered if p["sport"].lower() == sport.lower()]
    if team:
        filtered = [p for p in filtered if team.lower() in p["team_name"].lower()]
        
    return {"success": True, "count": len(filtered), "data": filtered[offset:offset+limit]}

@router.get("/birthdays/today")
async def get_todays_birthdays():
    now = datetime.utcnow()
    current_month = now.month
    current_day = now.day
    
    if supabase:
        try:
            data = supabase.table("players").select("*").eq("birth_month", current_month).eq("birth_day", current_day).execute()
            if data and data.data:
                return {"success": True, "count": len(data.data), "data": data.data}
        except Exception as e:
            print(f"Supabase birthday fetch fallback: {e}")
            
    # Fallback
    matches = [p for p in FALLBACK_PLAYERS if p.get("birth_month") == current_month and p.get("birth_day") == current_day]
    if not matches:
        # If no exact match today, return featured upcoming stars
        matches = FALLBACK_PLAYERS[:3]
    return {"success": True, "count": len(matches), "data": matches}

@router.get("/{player_id}")
async def get_player_by_id(player_id: str):
    if supabase:
        try:
            data = supabase.table("players").select("*").or_(f"id.eq.{player_id},external_id.eq.{player_id}").execute()
            if data and data.data:
                return {"success": True, "data": data.data[0]}
        except Exception as e:
            print(f"Supabase get_player fallback: {e}")
            
    # Fallback search
    player = next((p for p in FALLBACK_PLAYERS if p["id"] == player_id or p["external_id"] == player_id), None)
    if not player:
        raise HTTPException(status_code=404, detail="Player not found in sports wiki.")
    return {"success": True, "data": player}
