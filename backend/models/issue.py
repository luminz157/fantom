from pydantic import BaseModel
from typing import Optional

class IssueCreate(BaseModel):
    reported_by: Optional[str] = None
    title: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    lat: float
    lng: float
    address: Optional[str] = None
    issue_type: Optional[str] = None
    severity: Optional[str] = "medium"
    urgency_score: Optional[int] = 5
    volunteers_needed: Optional[int] = 2
    status: Optional[str] = "open"

class AIAnalyzeRequest(BaseModel):
    image_url: str
    description: Optional[str] = None

class AIVerifyRequest(BaseModel):
    before_url: str
    after_url: str
    issue_id: str