from fastapi import APIRouter
from services.supabase_service import supabase
from models.message import MessageCreate

router = APIRouter()

# Get all messages for an issue
@router.get("/{issue_id}")
def get_messages(issue_id: str):
    response = supabase.table("messages").select(
        "id, issue_id, sender_id, content, created_at, profiles(full_name, avatar_url)"
    ).eq("issue_id", issue_id).order("created_at").execute()
    return response.data

# Send a message
@router.post("/")
def send_message(message: MessageCreate):
    response = supabase.table("messages").insert({
        "issue_id": message.issue_id,
        "sender_id": message.sender_id,
        "content": message.content
    }).execute()
    return response.data

# Delete a message
@router.delete("/{message_id}")
def delete_message(message_id: str):
    response = supabase.table("messages").delete().eq("id", message_id).execute()
    return {"message": "Message deleted successfully"}