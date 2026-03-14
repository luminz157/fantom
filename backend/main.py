from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import auth, issues, volunteers, messages, admin, ai

app = FastAPI(title="Civic Issue Management API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(issues.router, prefix="/issues", tags=["Issues"])
app.include_router(volunteers.router, prefix="/volunteers", tags=["Volunteers"])
app.include_router(messages.router, prefix="/messages", tags=["Messages"])
app.include_router(admin.router, prefix="/admin", tags=["Admin"])
app.include_router(ai.router, prefix="/ai", tags=["AI"])

@app.get("/")
def root():
    return {"message": "CivicFix API is running!"}