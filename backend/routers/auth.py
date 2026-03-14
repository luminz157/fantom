from fastapi import APIRouter
from services.supabase_service import supabase
from models.user import ProfileUpdate

router = APIRouter()

# Get user profile
@router.get("/profile/{user_id}")
def get_profile(user_id: str):
    response = supabase.table("profiles").select("*").eq("id", user_id).single().execute()
    return response.data

# Update user profile
@router.patch("/profile/{user_id}")
def update_profile(user_id: str, data: ProfileUpdate):
    response = supabase.table("profiles").update(data.dict(exclude_none=True)).eq("id", user_id).execute()
    return response.data

# Get all issues reported by a user
@router.get("/profile/{user_id}/issues")
def get_user_issues(user_id: str):
    response = supabase.table("issues").select("*").eq("reported_by", user_id).order("created_at", desc=True).execute()
    return response.data

# Get user stats
@router.get("/profile/{user_id}/stats")
def get_user_stats(user_id: str):
    profile = supabase.table("profiles").select(
        "reports_submitted, reports_resolved, tasks_completed, points"
    ).eq("id", user_id).single().execute()

    volunteer_tasks = supabase.table("issue_volunteers").select("id").eq("volunteer_id", user_id).execute()

    return {
        "reports_submitted": profile.data["reports_submitted"],
        "reports_resolved": profile.data["reports_resolved"],
        "volunteer_tasks_joined": len(volunteer_tasks.data),
        "tasks_completed": profile.data["tasks_completed"],
        "points": profile.data["points"]
    }
# Get notification settings
@router.get("/profile/{user_id}/notifications")
def get_notifications(user_id: str):
    response = supabase.table("profiles").select(
        "notifications_enabled, notifications_radius"
    ).eq("id", user_id).single().execute()
    return {
        "enabled": response.data["notifications_enabled"],
        "radius": f"{response.data['notifications_radius']}km"
    }

# Update notification settings
@router.patch("/profile/{user_id}/notifications")
def update_notifications(user_id: str, enabled: bool, radius: int):
    response = supabase.table("profiles").update({
        "notifications_enabled": enabled,
        "notifications_radius": radius
    }).eq("id", user_id).execute()
    return {
        "enabled": enabled,
        "radius": f"{radius}km"
    }
 