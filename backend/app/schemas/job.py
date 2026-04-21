from pydantic import BaseModel
from datetime import datetime
from typing import List, Dict, Union


class JobResponse(BaseModel):
    job_id: str
    status: str
    total: int
    processed: int
    failed: int
    errors: List[Dict[str, Union[int, str]]]
    created_at: datetime

    class Config:
        from_attributes = True
