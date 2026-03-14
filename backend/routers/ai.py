from fastapi import APIRouter
from services.ai_service import analyze_image, verify_completion
from models.issue import AIAnalyzeRequest, AIVerifyRequest

router = APIRouter()

# Analyze issue image
@router.post("/analyze")
async def analyze_issue(request: AIAnalyzeRequest):
    result = await analyze_image(request.image_url, request.description)
    return result

# Verify completion
@router.post("/verify")
async def verify_issue(request: AIVerifyRequest):
    result = await verify_completion(request.before_url, request.after_url)
    return result