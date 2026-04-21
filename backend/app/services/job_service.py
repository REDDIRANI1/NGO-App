from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.job import Job
from app.schemas.job import JobResponse
import uuid


async def create_job(db: AsyncSession, total: int) -> Job:
    job = Job(
        id=str(uuid.uuid4()),
        status="pending",
        total=total,
        processed=0,
        failed=0,
        errors=[],
    )
    db.add(job)
    await db.commit()
    await db.refresh(job)
    return job


async def update_job_status(
    db: AsyncSession,
    job_id: str,
    status: str = None,
    processed: int = None,
    failed: int = None,
    errors: list = None,
):
    stmt = select(Job).where(Job.id == job_id)
    result = await db.execute(stmt)
    job = result.scalar_one_or_none()
    if job:
        if status:
            job.status = status
        if processed is not None:
            job.processed = processed
        if failed is not None:
            job.failed = failed
        if errors is not None:
            job.errors = errors
        await db.commit()
        await db.refresh(job)
    return job


async def get_job(db: AsyncSession, job_id: str) -> Job:
    stmt = select(Job).where(Job.id == job_id)
    result = await db.execute(stmt)
    return result.scalar_one_or_none()
