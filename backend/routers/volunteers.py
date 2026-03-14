from fastapi import APIRouter
from services.supabase_service import supabase
from models.user import VolunteerJoin

router = APIRouter()

# Get all volunteers for an issue
@router.get("/{issue_id}")
def get_issue_volunteers(issue_id: str):
    response = supabase.table("issue_volunteers").select("*, profiles(*)").eq("issue_id", issue_id).execute()
    return response.data

# Join an issue
@router.post("/join")
def join_issue(data: VolunteerJoin):
    # Add volunteer to team
    response = supabase.table("issue_volunteers").insert({
        "issue_id": data.issue_id,
        "volunteer_id": data.volunteer_id,
        "is_leader": False
    }).execute()

    # Increment volunteers_joined count
    issue = supabase.table("issues").select("volunteers_joined, volunteers_needed, team_formed").eq("id", data.issue_id).single().execute()
    new_count = issue.data["volunteers_joined"] + 1

    update_data = {"volunteers_joined": new_count}

    # Check if threshold is reached → form team + open chat
    if new_count >= issue.data["volunteers_needed"] and not issue.data["team_formed"]:
        update_data["team_formed"] = True
        update_data["status"] = "in_progress"

    supabase.table("issues").update(update_data).eq("id", data.issue_id).execute()

    return {
        "message": "Joined successfully",
        "team_formed": update_data.get("team_formed", False),
        "volunteers_joined": new_count,
        "chat_room_id": data.issue_id  # chat room id = issue id
    }

# Leave an issue
@router.delete("/leave/{issue_id}/{volunteer_id}")
def leave_issue(issue_id: str, volunteer_id: str):
    supabase.table("issue_volunteers").delete().eq("issue_id", issue_id).eq("volunteer_id", volunteer_id).execute()

    # Decrement volunteers_joined count
    issue = supabase.table("issues").select("volunteers_joined").eq("id", issue_id).single().execute()
    supabase.table("issues").update({
        "volunteers_joined": max(0, issue.data["volunteers_joined"] - 1)
    }).eq("id", issue_id).execute()

    return {"message": "Left issue successfully"}

# Get leader of an issue
@router.get("/{issue_id}/leader")
def get_leader(issue_id: str):
    response = supabase.table("issue_volunteers").select("*, profiles(*)").eq("issue_id", issue_id).eq("is_leader", True).single().execute()
    return response.data

# Get team details (volunteers + chat room id)
@router.get("/{issue_id}/team")
def get_team(issue_id: str):
    volunteers = supabase.table("issue_volunteers").select("*, profiles(full_name, avatar_url, points)").eq("issue_id", issue_id).execute()
    messages = supabase.table("messages").select("*, profiles(full_name, avatar_url)").eq("issue_id", issue_id).order("created_at").execute()
    issue = supabase.table("issues").select("team_formed, volunteers_needed, volunteers_joined").eq("id", issue_id).single().execute()

    return {
        "team_id": issue_id,
        "issue_id": issue_id,
        "team_formed": issue.data["team_formed"],
        "volunteers_needed": issue.data["volunteers_needed"],
        "volunteers_joined": issue.data["volunteers_joined"],
        "volunteers": volunteers.data,
        "chat_room_id": issue_id,
        "chat_messages": messages.data
    }
 