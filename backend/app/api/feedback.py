# app/api/anonymous_feedback.py
 
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.connect import get_connection
import datetime
 
router = APIRouter()
 
# 🧾 Model for incoming feedback
class AnonymousFeedbackRequest(BaseModel):
    sender_employee: str
    employee_id: str
    name: str
    subject: str
    message: str
    submit_date: datetime.date
    severity: str         # "Low", "Medium", or "High"
    category: str         # "Manager" or "HR"
 
# 📤 Endpoint to submit feedback
@router.post("/submit-anonymous-feedback")
def submit_anonymous_feedback(feedback: AnonymousFeedbackRequest):
    try:
        with get_connection() as conn:
            cursor = conn.cursor()
 
            cursor.execute("""
                INSERT INTO AnonymousFeedback
                (SenderEmployee, EmployeeID, Name, Subject, Message, SubmitDate, Severity, Category)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                feedback.sender_employee,
                feedback.employee_id,
                feedback.name,
                feedback.subject,
                feedback.message,
                feedback.submit_date,
                feedback.severity,
                feedback.category
            ))
 
            conn.commit()
            return {"message": "Feedback submitted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
 
# 🛠️ Optional route to init DB and populate with sample data
@router.get("/init-feedback-db")
def init_feedback_db():
    try:
        with get_connection() as conn:
            cursor = conn.cursor()
 
            # Create table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS AnonymousFeedback (
                    FeedbackID INTEGER PRIMARY KEY AUTOINCREMENT,
                    SenderEmployee TEXT,
                    EmployeeID TEXT,
                    Name TEXT,
                    Subject TEXT,
                    Message TEXT,
                    SubmitDate DATE,
                    Severity TEXT,
                    Category TEXT
                );
            """)
 
            # Insert sample entries
            sample_entries = [
                ("emp101", "E001", "John Doe", "Unfair treatment", "Felt isolated by manager", "2025-07-24", "High", "Manager"),
                ("emp102", "E002", "Jane Smith", "Late approvals", "HR delayed my leave request", "2025-07-22", "Medium", "HR"),
                ("emp103", "E003", "Raj Patel", "Verbal aggression", "Manager raised voice in meeting", "2025-07-20", "High", "Manager"),
                ("emp104", "E004", "Anna Liu", "Ignored requests", "Team requests repeatedly ignored by HR", "2025-07-18", "Low", "HR"),
                ("emp105", "E005", "Carlos Ramirez", "Disrespectful comments", "Inappropriate joke from team lead", "2025-07-16", "Medium", "Manager")
            ]
 
            cursor.executemany("""
                INSERT INTO AnonymousFeedback
                (SenderEmployee, EmployeeID, Name, Subject, Message, SubmitDate, Severity, Category)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, sample_entries)
 
            conn.commit()
            return {"message": "Table created and data populated"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
