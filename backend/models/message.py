from pydantic import BaseModel

class MessageCreate(BaseModel):
    issue_id: str
    sender_id: str
    content: str