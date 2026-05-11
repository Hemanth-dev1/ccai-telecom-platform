from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database.db import (
    engine,
    Base,
)

from database.models import *

from routers.chat import (
    router as chat_router
)

from routers.webhook import (
    router as webhook_router
)

from routers.analytics import (
    router as analytics_router
)

from routers.events import (
    router as events_router
)
from routers.agent_desk import (
    router as agent_desk_router
)

# ==========================================
# CREATE DATABASE TABLES
# ==========================================

Base.metadata.create_all(
    bind=engine
)

# ==========================================
# FASTAPI
# ==========================================

app = FastAPI(
    title="Telecom AI Platform"
)

# ==========================================
# CORS
# ==========================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# ROUTERS
# ==========================================

app.include_router(chat_router)

app.include_router(webhook_router)

app.include_router(
    analytics_router
)

app.include_router(
    events_router
)

app.include_router(
    agent_desk_router
)

# ==========================================
# ROOT
# ==========================================

@app.get("/")
async def root():

    return {
        "status": "running"
    }