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
 
 
@router.post("/submit-anonymous-feedback")
def submit_anonymous_feedback(feedback: AnonymousFeedbackRequest):
    try:
        with get_connection() as conn:
            cursor = conn.cursor()
 
            cursor.execute("""
                INSERT INTO AnonymousFeedback
                (DateLodged, Description, InvolvedParty, PreviouslyReported, Severity)
                VALUES (?, ?, ?, ?, ?)
            """, (
                feedback.date_lodged,
                feedback.description,
                feedback.involved_party,
                feedback.previously_reported,
                feedback.severity
            ))
 
            conn.commit()
            return {"message": "Feedback submitted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
 
 
# 🔧 Optional route to init DB and populate with fake data
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
                    Severity TEXT
                );
            """)
 
            # Insert sample entries
            sample_entries = [
                ("2025-07-24", "Inappropriate comments during a Zoom meeting.", "Sarah Thompson, IT Lead", "No", "High"),
                ("2025-07-22", "Discriminatory remarks toward an intern.", "", "Prefer not to say", "Medium"),
                ("2025-07-20", "Team member raises voice aggressively.", "Robert King, HR", "Yes", "Low"),
                ("2025-07-19", "Dismissive behavior in meetings.", "Emily Davis, Project Manager", "No", "Medium"),
                ("2025-07-18", "Unwelcome jokes at work.", "", "Prefer not to say", "Low")
            ]
 
            cursor.executemany("""
                INSERT INTO AnonymousFeedback (DateLodged, Description, InvolvedParty, PreviouslyReported, Severity)
                VALUES (?, ?, ?, ?, ?)
            """, sample_entries)
 
            conn.commit()
            return {"message": "Table created and data populated"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))