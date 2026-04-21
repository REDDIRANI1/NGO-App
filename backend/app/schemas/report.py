from typing import Optional
from pydantic import BaseModel, Field
from datetime import datetime


class ReportCreate(BaseModel):
    ngo_id: str = Field(..., max_length=100)
    month: str = Field(..., pattern=r"^\d{4}-(0[1-9]|1[0-2])$")
    region: Optional[str] = Field(None, max_length=50)
    people_helped: int = Field(..., ge=0)
    events_conducted: int = Field(..., ge=0)
    funds_utilized: float = Field(..., ge=0)


class ReportResponse(BaseModel):
    id: int
    ngo_id: str
    month: str
    region: Optional[str]
    people_helped: int
    events_conducted: int
    funds_utilized: float
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
