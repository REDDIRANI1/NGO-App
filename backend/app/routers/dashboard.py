from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.database import get_db
from app.models.report import Report
from app.schemas.dashboard import DashboardResponse

router = APIRouter()


@router.get("/dashboard", response_model=DashboardResponse)
async def get_dashboard(
    month: str = Query(..., pattern=r"^\d{4}-(0[1-9]|1[0-2])$"),
    ngo_id: Optional[str] = Query(None, max_length=100),
    region: Optional[str] = Query(None, max_length=50),
    db: AsyncSession = Depends(get_db),
):
    stmt = select(
        func.count(func.distinct(Report.ngo_id)).label("total_ngos"),
        func.coalesce(func.sum(Report.people_helped), 0).label("people_helped"),
        func.coalesce(func.sum(Report.events_conducted), 0).label("events"),
        func.coalesce(func.sum(Report.funds_utilized), 0).label("funds"),
    ).where(Report.month == month)

    if ngo_id:
        stmt = stmt.where(Report.ngo_id == ngo_id)
    if region:
        stmt = stmt.where(Report.region == region)

    result = await db.execute(stmt)
    row = result.one()

    return DashboardResponse(
        month=month,
        total_ngos_reporting=row.total_ngos or 0,
        total_people_helped=int(row.people_helped or 0),
        total_events_conducted=int(row.events or 0),
        total_funds_utilized=float(row.funds or 0),
    )
