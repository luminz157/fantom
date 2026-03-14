from google import genai
from google.genai import types
import httpx
import json
from core.config import settings

client = genai.Client(api_key=settings.GEMINI_API_KEY)

async def analyze_image(image_url: str, description: str = ""):
    async with httpx.AsyncClient() as http:
        response = await http.get(image_url)
        image_data = response.content

    prompt = f"""
    You are a civic issue analyzer. Analyze this image of a civic problem.
    Description from citizen: {description}

    Return ONLY a JSON object with these fields:
    {{
        "issue_type": "one of: garbage, pothole, streetlight, drainage, other",
        "severity": "one of: low, medium, high, critical",
        "urgency_score": "number between 1 and 10",
        "volunteers_needed": "number between 1 and 10",
        "summary": "one sentence description of the issue"
    }}

    Return only the JSON, no extra text.
    """

    response = client.models.generate_content(
        model="gemini-1.5-flash",
        contents=[
            types.Part.from_bytes(data=image_data, mime_type="image/jpeg"),
            prompt
        ]
    )

    text = response.text.strip()
    text = text.replace("```json", "").replace("```", "").strip()
    return json.loads(text)


async def verify_completion(before_url: str, after_url: str):
    async with httpx.AsyncClient() as http:
        before_data = (await http.get(before_url)).content
        after_data = (await http.get(after_url)).content

    prompt = """
    You are verifying if a civic issue has been resolved.
    Compare the before and after images and tell me if the issue is fixed.

    Return ONLY a JSON object:
    {
        "is_resolved": true or false,
        "confidence": "number between 1 and 10",
        "notes": "one sentence explanation"
    }

    Return only the JSON, no extra text.
    """

    response = client.models.generate_content(
        model="gemini-1.5-flash",
        contents=[
            types.Part.from_bytes(data=before_data, mime_type="image/jpeg"),
            types.Part.from_bytes(data=after_data, mime_type="image/jpeg"),
            prompt
        ]
    )

    text = response.text.strip()
    text = text.replace("```json", "").replace("```", "").strip()
    return json.loads(text)