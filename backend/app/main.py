import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from app.database import init_db
from app.routers import analyze, auth, dashboard, extract, history, model_performance, verify_domain


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB tables on startup
    init_db()
    yield


app = FastAPI(
    title="JobShield AI Enterprise Platform",
    description="Risk Assessment, Warning Sign Extraction, Recruiter Domain Authenticator, User Auth, and Audit Certificate Platform for JobShield AI",
    version="2.0.0",
    lifespan=lifespan,
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(analyze.router)
app.include_router(extract.router)
app.include_router(history.router)
app.include_router(dashboard.router)
app.include_router(model_performance.router)
app.include_router(verify_domain.router)
app.include_router(auth.router)


@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "service": "JobShield AI Enterprise Platform",
        "version": "2.0.0",
        "docs": "/docs"
    }


# Frontend Production Static Files & SPA Catch-All Route
FRONTEND_DIST_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist"))

if os.path.exists(FRONTEND_DIST_DIR):
    app.mount("/assets", StaticFiles(directory=os.path.join(FRONTEND_DIST_DIR, "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        if full_path.startswith("api/"):
            return None
        file_path = os.path.join(FRONTEND_DIST_DIR, full_path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(FRONTEND_DIST_DIR, "index.html"))
else:
    @app.get("/")
    def root():
        return {
            "status": "online",
            "service": "JobShield AI Backend API Only",
            "note": "Build frontend with 'npm run build' inside frontend/ to serve static UI.",
            "docs": "/docs"
        }
