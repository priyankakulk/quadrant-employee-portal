from fastapi import APIRouter, Query
from app.services.connect import get_connection
from typing import Optional
from datetime import date
from fastapi.responses import JSONResponse


router = APIRouter()

#need to make sure these are in order once database is acessible again 
@router.get("/onboard")
def onboard_user(firstName: str,
    lastName: str,
    role: str,
    gender: str,
    worksFor: Optional[int] = Query(None)
):
    try:
        with get_connection() as conn:
            cursor = conn.cursor()

            # Get the current max EmployeeId
            cursor.execute("SELECT MAX(employeeId) FROM Employees")
            max_id = cursor.fetchone()[0]
            new_id = (max_id or 0) + 1

            # Insert new employee
            cursor.execute("""
                INSERT INTO Employees (employeeId, firstName, lastName, role, gender, worksFor)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (new_id, firstName, lastName, role, gender, worksFor))

            conn.commit()

        return JSONResponse(status_code=201, content={
            "message": "Employee onboarded successfully.",
            "employeeId": new_id
        })
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
