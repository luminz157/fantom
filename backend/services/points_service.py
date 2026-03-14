from services.supabase_service import supabase

def award_points(issue_id: str):
    # Get all volunteers for this issue
    volunteers = supabase.table("issue_volunteers").select("volunteer_id, is_leader").eq("issue_id", issue_id).execute()

    for v in volunteers.data:
        # Leader gets 20 points, others get 10
        points = 20 if v["is_leader"] else 10

        # Get current points
        profile = supabase.table("profiles").select("points, tasks_completed").eq("id", v["volunteer_id"]).single().execute()

        new_points = profile.data["points"] + points
        new_tasks = profile.data["tasks_completed"] + 1

        # Update profile
        supabase.table("profiles").update({
            "points": new_points,
            "tasks_completed": new_tasks
        }).eq("id", v["volunteer_id"]).execute()

    return {"message": "Points awarded successfully"}