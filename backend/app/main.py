from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import time

from app.core.config import settings
from app.routers import players, wishes, moderation, follows

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Mivaj.com Sports Wiki, Player Radar, Moderated Birthday Pro & WhatsApp Alerts API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request Timing Middleware
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(round(process_time * 1000, 2)) + "ms"
    return response

# Include Sub-Routers
app.include_router(players.router, prefix=settings.API_V1_STR)
app.include_router(wishes.router, prefix=settings.API_V1_STR)
app.include_router(moderation.router, prefix=settings.API_V1_STR)
app.include_router(follows.router, prefix=settings.API_V1_STR)

@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "service": "mivaj-backend",
        "timestamp": time.time()
    }

@app.get("/", tags=["Root"])
async def root():
    return {
        "message": "Welcome to Mivaj.com Sports Wiki & Social Engagement Engine",
        "docs": "/docs",
        "version": "1.0.0"
    }
