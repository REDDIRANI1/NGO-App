from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import reports, jobs, dashboard
from app.database import init_db

app = FastAPI(title="NGO Impact Tracker")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(reports.router, prefix="/api", tags=["reports"])
app.include_router(jobs.router, prefix="/api", tags=["jobs"])
app.include_router(dashboard.router, prefix="/api", tags=["dashboard"])


@app.on_event("startup")
async def startup():
    await init_db()


@app.get("/")
def read_root():
    return {"message": "NGO Impact Tracker API"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}
