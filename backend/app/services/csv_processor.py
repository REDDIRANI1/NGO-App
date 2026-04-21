import csv
import io
from sqlalchemy.ext.asyncio import AsyncSession
from app.services.job_service import update_job_status
from app.services.report_service import upsert_report
from app.schemas.report import ReportCreate
from pydantic import ValidationError

MAX_RETRIES = 3


async def process_csv(db: AsyncSession, job_id: str, csv_content: str):
    await update_job_status(db, job_id, status="processing")

    reader = csv.DictReader(io.StringIO(csv_content))
    rows = list(reader)
    total = len(rows)

    processed = 0
    failed = 0
    errors = []

    for idx, row in enumerate(rows):
        row_num = idx + 2

        for attempt in range(MAX_RETRIES):
            try:
                region = row.get("region", "").strip() or None
                report_data = ReportCreate(
                    ngo_id=row["ngo_id"],
                    month=row["month"],
                    region=region,
                    people_helped=int(row["people_helped"]),
                    events_conducted=int(row["events_conducted"]),
                    funds_utilized=float(row["funds_utilized"]),
                )
                await upsert_report(db, report_data)
                processed += 1
                break
            except ValidationError as e:
                if attempt == MAX_RETRIES - 1:
                    failed += 1
                    errors.append({"row": row_num, "message": str(e)})
                continue
            except Exception as e:
                if attempt == MAX_RETRIES - 1:
                    failed += 1
                    errors.append({"row": row_num, "message": str(e)})
                continue

        await update_job_status(
            db, job_id, processed=processed, failed=failed, errors=errors
        )

    final_status = "completed" if failed == 0 else "completed"
    await update_job_status(db, job_id, status=final_status)
