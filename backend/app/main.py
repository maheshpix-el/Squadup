from fastapi import FastAPI

app = FastAPI(
    title="SquadUp API",
    description="Backend API for the SquadUp sports activity platform",
    version="1.0.0"
)


@app.get("/")
def root():
    return {
        "message": "Welcome to SquadUp API",
        "status": "running"
    }


@app.get("/api/v1/health")
def health_check():
    return {
        "status": "healthy"
    }