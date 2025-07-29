from fastapi import APIRouter, Query, HTTPException
from app.services.connect import get_connection
from typing import Optional

router = APIRouter()

@router.get("/ittickets")
def get_tickets(
    user: Optional[int] = Query(None),
    status: Optional[str] = Query(None),
    handled_by: Optional[int] = Query(None),
    ticket_number: Optional[str] = Query(None)
):
    query = """
        SELECT *
        FROM ITTickets
        WHERE 1=1
    """
    params = []

    filters = {
        "employeeId = ?": user,
        "Status = ?": status,
        "HandledBy = ?": handled_by,
        "ticketNumber = ?": ticket_number
    }

    for clause, value in filters.items():
        if value is not None:
            query += f" AND {clause}"
            params.append(value)

    try:
        with get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(query, params)
            rows = cursor.fetchall()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")

    try:
        results = [
            {
                "ticket_number": row.ticketNumber,
                "work_email": row.workEmail,
                "first_name": row.firstName,
                "last_name": row.lastName,
                "message": row.message,
                "status": row.Status,
                "employee_id": row.employeeId,
                "handled_by": row.HandledBy
            }
            for row in rows
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Data parsing error: {e}")

    cursor.close()
    conn.close()
    return results
