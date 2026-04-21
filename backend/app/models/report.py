from sqlalchemy import Column, Integer, String, Numeric, DateTime, UniqueConstraint
from sqlalchemy.sql import func
from app.models import Base


class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    ngo_id = Column(String(100), nullable=False, index=True)
    month = Column(String(7), nullable=False, index=True)
    region = Column(String(50), nullable=True, index=True)
    people_helped = Column(Integer, nullable=False)
    events_conducted = Column(Integer, nullable=False)
    funds_utilized = Column(Numeric(12, 2), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    __table_args__ = (UniqueConstraint("ngo_id", "month", name="uq_ngo_month"),)
