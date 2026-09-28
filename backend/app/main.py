from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import users, activities, participants, auth


app = FastAPI(
    title="SquadUp API",
    description="Backend API for the SquadUp sports activity platform",
    version="1.0.0"
)


# ============================================================
# CORS CONFIGURATION
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "https://squadup-4hx2.onrender.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================
# ROUTERS
# ============================================================

app.include_router(users.router)
app.include_router(activities.router)
app.include_router(participants.router)
app.include_router(auth.router)


# ============================================================
# ROOT
# ============================================================

@app.get("/")
def root():
    return {
        "message": "Welcome to SquadUp API",
        "status": "running"
    }


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/api/v1/health")
def health_check():
    return {
        "status": "healthy"
    }