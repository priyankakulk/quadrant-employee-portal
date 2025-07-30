from fastapi import APIRouter, Query
from app.services.connect import get_connection
from fastapi.responses import JSONResponse
from typing import Optional
from datetime import date

router = APIRouter()

# ✅ GET tickets with filters
@router.get("/it-tickets")
def get_it_tickets(
    user: Optional[int] = Query(None),
    status: Optional[str] = Query(None),
    handled_by: Optional[int] = Query(None),
    ticket_number: Optional[int] = Query(None)
):
    query = "SELECT * FROM ITTickets WHERE 1=1"
    params = []

    filters = {
        "employeeId = ?": user,
        "status = ?": status,
        "handled_by = ?": handled_by,
        "ticket_number = ?": ticket_number
    }

    for clause, value in filters.items():
        if value is not None:
            query += f" AND {clause}"
            params.append(value)

    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(query, params)
        rows = cursor.fetchall()
        cursor.close()

    results = [
        {
            "ticket_number": row.ticket_number,
            "employeeId": row.employeeId,
            "status": row.status,
            "message": row.message,
            "handled_by": row.handled_by
        }
        for row in rows
    ]
    return results

# ✅ POST new IT ticket
@router.post("/it-tickets")
def create_it_ticket(
    user: int,
    message: str
):
    try:
        with get_connection() as conn:
            cursor = conn.cursor()

            # Generate new ticket number
            cursor.execute("SELECT MAX(ticket_number) FROM ITTickets")
            max_ticket = cursor.fetchone()[0]
            new_ticket_number = (max_ticket or 0) + 1

            # Insert ticket
            cursor.execute("""
                INSERT INTO ITTickets (ticket_number, employeeId, status, message)
                VALUES (?, ?, ?, ?)
            """, (
                new_ticket_number,
                user,
                "pending",  # default status
                message
            ))

            conn.commit()
            cursor.close()

        return JSONResponse(status_code=201, content={
            "message": "Ticket created successfully.",
            "ticket_number": new_ticket_number
        })
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

# ✅ PUT update ticket status
@router.put("/it-tickets/status")
def update_ticket_status(ticket_number: int, new_status: str):
    try:
        if new_status not in ["pending", "completed", "not completed"]:
            return JSONResponse(status_code=400, content={"error": "Invalid status value."})

        with get_connection() as conn:
            cursor = conn.cursor()

            cursor.execute("""
                UPDATE ITTickets
                SET status = ?
                WHERE ticket_number = ?
            """, (new_status, ticket_number))

            if cursor.rowcount == 0:
                return JSONResponse(status_code=404, content={"error": "Ticket not found."})

            conn.commit()
            cursor.close()

        return {"message": f"Ticket #{ticket_number} status updated to '{new_status}'."}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})