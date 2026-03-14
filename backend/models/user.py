from pydantic import BaseModel
from typing import Optional

class ProfileCreate(BaseModel):
    id: str
    full_name: str
    role: str = "citizen"
    phone: Optional[str] = None
    city: Optional[str] = None

class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    phone: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    city: Optional[str] = None
    notifications_enabled: Optional[bool] = None
    notifications_radius: Optional[int] = None
    last_login: Optional[str] = None
    status: Optional[str] = None

class VolunteerJoin(BaseModel):
    issue_id: str
    volunteer_id: str