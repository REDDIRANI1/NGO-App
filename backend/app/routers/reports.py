from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    BackgroundTasks,
    UploadFile,
    File,
    Form,
)
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.schemas.report import ReportCreate, ReportResponse
from app.services.report_service import upsert_report
from app.services.job_service import create_job
from app.services.csv_processor import process_csv
import io
import csv

router = APIRouter()


@router.post("/report")
async def submit_report(report: ReportCreate, db: AsyncSession = Depends(get_db)):
    result = await upsert_report(db, report)
    return {
        "message": "Report saved successfully",
        "report": {
            "id": result.id,
            "ngo_id": result.ngo_id,
            "month": result.month,
            "people_helped": result.people_helped,
            "events_conducted": result.events_conducted,
            "funds_utilized": float(result.funds_utilized),
            "created_at": result.created_at.isoformat() if result.created_at else None,
            "updated_at": result.updated_at.isoformat() if result.updated_at else None,
        },
    }


@router.post("/reports/upload")
async def upload_csv(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed")

    content = await file.read()
    text = content.decode("utf-8")

    reader = csv.reader(io.StringIO(text))
    rows = list(reader)

    if len(rows) < 2:
        raise HTTPException(
            status_code=422, detail="CSV must have headers and at least one row"
        )

    job = await create_job(db, total=len(rows) - 1)
    background_tasks.add_task(process_csv, db, job.id, text)

    return {
        "job_id": job.id,
        "message": "Upload accepted. Processing started.",
        "total_rows": len(rows) - 1,
    }
