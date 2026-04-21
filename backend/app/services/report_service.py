from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.report import Report
from app.schemas.report import ReportCreate, ReportResponse


async def upsert_report(db: AsyncSession, report_data: ReportCreate) -> Report:
    stmt = select(Report).where(
        Report.ngo_id == report_data.ngo_id, Report.month == report_data.month
    )
    result = await db.execute(stmt)
    existing = result.scalar_one_or_none()

    if existing:
        existing.people_helped = report_data.people_helped
        existing.events_conducted = report_data.events_conducted
        existing.funds_utilized = report_data.funds_utilized
        if report_data.region:
            existing.region = report_data.region
        report = existing
    else:
        report = Report(**report_data.model_dump())
        db.add(report)

    await db.commit()
    await db.refresh(report)
    return report
