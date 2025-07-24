from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from datetime import datetime, timedelta
from typing import Literal
from app.services.connect import get_connection

router = APIRouter()

# Step 1: Define a Leave Application Model
class LeaveApplication(BaseModel):
    employee_id: int
    leave_type: Literal["Sick Leave", "Maternity Leave", "Paternity Leave", "Vacation", "Other"]
    start_date: str  # Format: YYYY-MM-DD
    days_gone: int = Field(gt=0, description="Number of leave days (must be > 0)")
    reason: str

# Step 2: Submit Leave Application
@router.post("/leave/apply")
def apply_leave(application: LeaveApplication):
    try:
        # Parse and calculate end_date
        start_date_obj = datetime.strptime(application.start_date, "%Y-%m-%d")
        end_date_obj = start_date_obj + timedelta(days=application.days_gone - 1)
        end_date_str = end_date_obj.strftime("%Y-%m-%d")
        print(f"[DEBUG] Calculated end date: {end_date_str}")

    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD.")
    try:
        with get_connection() as conn:
            cursor = conn.cursor()
            print("[DEBUG] Connected to database")
            cursor.execute("""
                INSERT INTO LeaveApplications (EmployeeID, LeaveType, StartDate, DaysGone, EndDate, Reason, Status)
                VALUES (?, ?, ?, ?, ?, ?, 'Pending')
            """, (
                application.employee_id,
                application.leave_type,
                application.start_date,
                application.days_gone,
                end_date_str,
                application.reason
             ))
        conn.commit()
        print("[DEBUG] Leave application inserted")
    except Exception as e:
        print("[ERROR]", e)
        raise HTTPException(status_code=500, detail=str(e))  # Show the error in browser

    return {"message": "Leave application submitted and pending manager approval"}

# Step 3: Approve or Reject Leave
@router.post("/leave/approve")
def approve_leave(request_id: int, approve: bool):
    new_status = "Approved" if approve else "Rejected"

    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE LeaveApplications
            SET Status = ?
            WHERE RequestID = ?
        """, (new_status, request_id))
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Leave request not found.")
        conn.commit()

    return {"message": f"Leave has been {new_status.lower()}."}

# Step 4: Check Leave Status
@router.get("/leave/status/{employee_id}")
def check_leave_status(employee_id: int):
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT RequestID, LeaveType, StartDate, EndDate, Status
            FROM LeaveApplications
            WHERE EmployeeID = ?
        """, (employee_id,))
        rows = cursor.fetchall()

    return [
        {
            "request_id": row[0],
            "type": row[1],
            "from": row[2],
            "to": row[3],
            "status": row[4]
        } for row in rows
    ]
