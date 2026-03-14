from pydantic import BaseModel
from typing import Optional

class ResourceCreate(BaseModel):
    issue_id: str
    dispatched_by: str
    resource_type: str
    notes: Optional[str] = None