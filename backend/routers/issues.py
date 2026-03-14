from fastapi import APIRouter
from services.supabase_service import supabase
from models.issue import IssueCreate
import math

router = APIRouter()

# Get all issues
@router.get("/")
def get_all_issues():
    response = supabase.table("issues").select("*").execute()
    return response.data

# Get nearby issues
@router.get("/nearby/{lat}/{lng}")
def get_nearby_issues(lat: float, lng: float, radius_km: float = 10):
    response = supabase.table("issues").select("*").eq("status", "open").execute()
    
    nearby = []
    for issue in response.data:
        R = 6371
        lat1, lon1 = math.radians(lat), math.radians(lng)
        lat2, lon2 = math.radians(issue["lat"]), math.radians(issue["lng"])
        dlat = lat2 - lat1
        dlon = lon2 - lon1
        a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
        distance = R * 2 * math.asin(math.sqrt(a))
        if distance <= radius_km:
            issue["distance_km"] = round(distance, 2)
            nearby.append(issue)
    
    nearby.sort(key=lambda x: x["distance_km"])
    return nearby

# Filter by issue type
@router.get("/filter/{issue_type}")
def get_issues_by_type(issue_type: str):
    response = supabase.table("issues").select("*").eq("issue_type", issue_type).execute()
    return response.data

# Get single issue
@router.get("/{issue_id}")
def get_issue(issue_id: str):
    response = supabase.table("issues").select("*").eq("id", issue_id).single().execute()
    return response.data

# Create issue
@router.post("/")
def create_issue(issue: IssueCreate):
    response = supabase.table("issues").insert(issue.dict()).execute()
    
    if issue.reported_by:
        profile = supabase.table("profiles").select("reports_submitted").eq("id", issue.reported_by).single().execute()
        supabase.table("profiles").update({
            "reports_submitted": profile.data["reports_submitted"] + 1
        }).eq("id", issue.reported_by).execute()

    return response.data

# Update issue status
@router.patch("/{issue_id}/status")
def update_status(issue_id: str, status: str):
    response = supabase.table("issues").update({"status": status}).eq("id", issue_id).execute()
    return response.data

# Delete issue
@router.delete("/{issue_id}")
def delete_issue(issue_id: str):
    response = supabase.table("issues").delete().eq("id", issue_id).execute()
    return {"message": "Issue deleted successfully"}