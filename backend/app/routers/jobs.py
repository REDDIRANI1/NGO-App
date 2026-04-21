from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.services.job_service import get_job
from app.schemas.job import JobResponse

router = APIRouter()


@router.get("/job-status/{job_id}", response_model=JobResponse)
async def job_status(job_id: str, db: AsyncSession = Depends(get_db)):
    job = await get_job(db, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return JobResponse(
        job_id=job.id,
        status=job.status,
        total=job.total,
        processed=job.processed,
        failed=job.failed,
        errors=job.errors or [],
        created_at=job.created_at,
    )
