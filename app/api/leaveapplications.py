from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from datetime import datetime, timedelta
from typing import Literal
from app.services.connect import get_connection

router = APIRouter()

# ---------------------- Models ----------------------
class LeaveApplication(BaseModel):
    employee_id: int
    leave_type: Literal["Sick Leave", "Maternity Leave", "Paternity Leave", "Vacation", "Personal Leave"]
    start_date: str  # Format: YYYY-MM-DD
    days_gone: int = Field(gt=0, description="Number of leave days (must be > 0)")
    reason: str

# ---------------------- Leave Balances Init ----------------------
def initialize_leave_balances(employee_id: int, gender: str):
    balances = {
        "Sick Leave": 10,
        "Vacation": 20,
        "Personal Leave": 10,
        "Maternity Leave": 84 if gender == "Female" else 0,
        "Paternity Leave": 84 if gender == "Male" else 0
    }

    with get_connection() as conn:
        cursor = conn.cursor()
        for leave_type, days in balances.items():
            cursor.execute("""
                SELECT 1 FROM LeaveBalances WHERE employee_id = ? AND leave_type = ? AND year = ?
            """, (employee_id, leave_type, datetime.now().year))
            exists = cursor.fetchone()

            if exists:
                cursor.execute("""
                    UPDATE LeaveBalances SET balance = ? WHERE employee_id = ? AND leave_type = ? AND year = ?
                """, (days, employee_id, leave_type, datetime.now().year))
            else:
                cursor.execute("""
                    INSERT INTO LeaveBalances (employee_id, leave_type, total_days, balance, year)
                    VALUES (?, ?, ?, ?, ?)
                """, (employee_id, leave_type, days, days, datetime.now().year))
        conn.commit()

# ---------------------- API Endpoints ----------------------

@router.post("/leave/init/{employee_id}")
def init_leave_balances(employee_id: int, gender: Literal["Male","Female"]):
    try:
        initialize_leave_balances(employee_id, gender)
        return {"message": "Leave balances initialized."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/leave/apply")
def apply_leave(application: LeaveApplication):
    try:
        start_date_obj = datetime.strptime(application.start_date, "%Y-%m-%d")
        end_date_obj = start_date_obj + timedelta(days=application.days_gone - 1)
        end_date_str = end_date_obj.strftime("%Y-%m-%d")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD.")

    with get_connection() as conn:
        cursor = conn.cursor()

        # 1. Check leave balance for employee, leave type, current year
        cursor.execute("""
            SELECT balance FROM LeaveBalances
            WHERE employee_id = ? AND leave_type = ? AND year = ?
        """, (application.employee_id, application.leave_type, start_date_obj.year))
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Leave balance not found for employee.")
        current_balance = row[0]

        if current_balance < application.days_gone:
            raise HTTPException(status_code=400, detail="Insufficient leave balance.")

        # 2. Check overlapping leaves (Pending or Approved)
        cursor.execute("""
            SELECT 1 FROM LeaveApplications
            WHERE EmployeeID = ?
              AND Status IN ('Pending', 'Approved')
              AND (
                    (StartDate <= ? AND EndDate >= ?) OR
                    (StartDate <= ? AND EndDate >= ?)
                  )
              AND LeaveType = ?
        """, (
            application.employee_id,
            application.start_date,
            application.start_date,
            end_date_str,
            end_date_str,
            application.leave_type
        ))
        overlap = cursor.fetchone()
        if overlap:
            raise HTTPException(status_code=400, detail="Overlapping leave request exists.")

        # 3. (Optional) Add max consecutive days check here if needed

        # 4. Insert leave application as Pending
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

    return {"message": "Leave application submitted and pending manager approval."}

@router.post("/leave/approve")
def approve_leave(request_id: int, approve: bool):
    new_status = "Approved" if approve else "Rejected"

    with get_connection() as conn:
        cursor = conn.cursor()

        # Fetch leave request
        cursor.execute("""
            SELECT EmployeeID, LeaveType, DaysGone FROM LeaveApplications WHERE RequestID = ?
        """, (request_id,))
        row = cursor.fetchone()

        if not row:
            raise HTTPException(status_code=404, detail="Leave request not found.")

        employee_id, leave_type, days_gone = row

        if approve:
            # Check current balance
            cursor.execute("""
                SELECT balance FROM LeaveBalances
                WHERE employee_id = ? AND leave_type = ? AND year = ?
            """, (employee_id, leave_type, datetime.now().year))
            balance_row = cursor.fetchone()

            if not balance_row:
                raise HTTPException(status_code=404, detail="Leave balance not initialized.")

            current_balance = balance_row[0]
            if current_balance < days_gone:
                raise HTTPException(status_code=400, detail="Insufficient leave balance.")

            # Deduct leave
            cursor.execute("""
                UPDATE LeaveBalances
                SET balance = balance - ?
                WHERE employee_id = ? AND leave_type = ? AND year = ?
            """, (days_gone, employee_id, leave_type, datetime.now().year))

        # Update leave status
        cursor.execute("""
            UPDATE LeaveApplications
            SET Status = ?
            WHERE RequestID = ?
        """, (new_status, request_id))

        conn.commit()

    return {"message": f"Leave has been {new_status.lower()}."}

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

@router.get("/leave/balances/{employee_id}")
def get_balances(employee_id: int):
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT leave_type, balance
            FROM LeaveBalances
            WHERE employee_id = ? AND year = ?
        """, (employee_id, datetime.now().year))
        data = cursor.fetchall()

    return {row[0]: row[1] for row in data}
