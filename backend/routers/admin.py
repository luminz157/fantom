from fastapi import APIRouter
from services.supabase_service import supabase
from models.resource import ResourceCreate

router = APIRouter()

# Get all issues with full details for admin
@router.get("/issues")
def get_all_issues():
    response = supabase.table("issues").select("*, profiles(full_name)").order("created_at", desc=True).execute()
    return response.data

# Get overview stats
@router.get("/stats")
def get_stats():
    all_issues = supabase.table("issues").select("status").execute()
    total = len(all_issues.data)
    open_issues = len([i for i in all_issues.data if i["status"] == "open"])
    in_progress = len([i for i in all_issues.data if i["status"] == "in_progress"])
    completed = len([i for i in all_issues.data if i["status"] == "completed"])

    volunteers = supabase.table("profiles").select("id").eq("role", "volunteer").execute()

    return {
        "total_issues": total,
        "open": open_issues,
        "in_progress": in_progress,
        "completed": completed,
        "total_volunteers": len(volunteers.data)
    }

# Dispatch a resource
@router.post("/dispatch")
def dispatch_resource(resource: ResourceCreate):
    response = supabase.table("resources").insert(resource.dict()).execute()
    # Update issue status
    supabase.table("issues").update({"status": "in_progress"}).eq("id", resource.issue_id).execute()
    return response.data

# Get all dispatched resources
@router.get("/resources")
def get_resources():
    response = supabase.table("resources").select("*, issues(title), profiles(full_name)").execute()
    return response.data

from services.points_service import award_points

@router.post("/complete/{issue_id}")
def complete_issue(issue_id: str):
    # Mark issue as completed
    supabase.table("issues").update({"status": "completed"}).eq("id", issue_id).execute()
    # Award points to all volunteers
    result = award_points(issue_id)
    return result