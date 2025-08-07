# app/api/anonymous_feedback.py

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.services.connect import get_connection
import datetime

router = APIRouter()

# Model for incoming feedback
class AnonymousFeedbackRequest(BaseModel):
    date_lodged: datetime.date
    description: str
    involved_party: Optional[str] = None
    previously_reported: str  # "Yes", "No", "Prefer not to say"
    severity: str             # "Low", "Medium", or "High"
    is_women_specific: Optional[bool] = False  # NEW field

# General feedback submission (default: not women-specific)
@router.post("/submit-anonymous-feedback")
def submit_anonymous_feedback(feedback: AnonymousFeedbackRequest):
    return _insert_feedback(feedback)

# Women-specific feedback submission
@router.post("/submit-women-anonymous-feedback")
def submit_women_feedback(feedback: AnonymousFeedbackRequest):
    feedback.is_women_specific = True
    return _insert_feedback(feedback)

# Internal function to insert feedback
def _insert_feedback(feedback: AnonymousFeedbackRequest):
    try:
        with get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO AnonymousFeedback
                (DateLodged, Description, InvolvedParty, PreviouslyReported, Severity, IsWomenSpecific)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (
                feedback.date_lodged,
                feedback.description,
                feedback.involved_party,
                feedback.previously_reported,
                feedback.severity,
                feedback.is_women_specific
            ))
            conn.commit()
            return {"message": "Feedback submitted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Optional route to init DB and populate with fake data
@router.get("/init-feedback-db")
def init_feedback_db():
    try:
        with get_connection() as conn:
            cursor = conn.cursor()
            # Create table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS AnonymousFeedback (
                    FeedbackID INTEGER PRIMARY KEY AUTOINCREMENT,
                    DateLodged DATE,
                    Description TEXT,
                    InvolvedParty TEXT,
                    PreviouslyReported TEXT,
                    Severity TEXT,
                    IsWomenSpecific BOOLEAN DEFAULT 0
                );
            """)

            # Insert sample entries (some women-specific)
            sample_entries = [
                ("2025-07-24", "Inappropriate comments during a Zoom meeting.", "Sarah Thompson, IT Lead", "No", "High", True),
                ("2025-07-22", "Discriminatory remarks toward an intern.", "", "Prefer not to say", "Medium", True),
                ("2025-07-20", "Team member raises voice aggressively.", "Robert King, HR", "Yes", "Low", False),
                ("2025-07-19", "Dismissive behavior in meetings.", "Emily Davis, Project Manager", "No", "Medium", False),
                ("2025-07-18", "Unwelcome jokes at work.", "", "Prefer not to say", "Low", True)
            ]

            cursor.executemany("""
                INSERT INTO AnonymousFeedback 
                (DateLodged, Description, InvolvedParty, PreviouslyReported, Severity, IsWomenSpecific)
                VALUES (?, ?, ?, ?, ?, ?)
            """, sample_entries)

            conn.commit()
            return {"message": "Table created and data populated"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
