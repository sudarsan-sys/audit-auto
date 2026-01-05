from pydantic import BaseModel
from typing import List, Optional

class AuditResponse(BaseModel):
    filename: str
    score: int
    status: str
    summary: str
    risks: List[str]
    recommendations: List[str]