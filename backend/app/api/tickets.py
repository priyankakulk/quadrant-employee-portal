from fastapi import APIRouter, Query
from app.services.connect import get_connection
from typing import Optional
from datetime import date
from fastapi.responses import JSONResponse
import traceback

router = APIRouter()

@router.get("/tickets")
def get_tickets(user: Optional[int] = Query(None),
    severity: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    from_date: Optional[date] = Query(None),
    to_date: Optional[date] = Query(None)
):
    #get all the tickets if no filter
    query = """
        SELECT *
        FROM HRTickets
        WHERE 1=1
    """
    #keeps track of the values used by the SQL command (the ?)
    params = []

    # Map query params to SQL column names and operators
    filters = {
        "employeeID = ?": user,
        "severity = ?": severity,
        "ticket_status = ?": status,
        "startDate >= ?": from_date,
        "startDate <= ?": to_date
    }

     #for every clause and value, if the value exists (filter is there)
     #add a AND SQL command that only gets those items
    for clause, value in filters.items():
        if value is not None:
            query += f" AND {clause}"
            params.append(value)

    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(query, params)
        rows = cursor.fetchall()
    
    #formats the results
    results = [
            {
                "ticketNumber": row.ticketNumber,
                "employeeId": row.employeeId,
                "severity": row.severity,
                "status": row.status,
                "startDate": row.startDate,
            }
            for row in rows
        ]
    cursor.close()
    conn.close()
    return results

@router.get("/addTicket")
def add_ticket(user: int,
    severity: str,
    message: str,
    from_date: date,
    to_date: Optional[date] = Query(None)
):
    try:
        with get_connection() as conn:
            cursor = conn.cursor()

            # Generate next ticket_id
            cursor.execute("SELECT MAX(ticketNumber) FROM HRTickets")
            max_id = cursor.fetchone()[0]
            new_ticket_id = (max_id if max_id is not None else 0) + 1

            # Insert new ticket
            cursor.execute("""
                INSERT INTO HRTickets (ticketNumber, employeeId, severity, ticket_status, startDate, message)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (
                new_ticket_id,
                user,
                severity,
                "incomplete",
                date.today().isoformat(),
                message
            ))

            conn.commit()

        return JSONResponse(status_code=201, content={
            "message": "Ticket created successfully.",
            "ticket_id": new_ticket_id
        })
    except Exception as e:
        print("".join(traceback.format_exception(None, e, e.__traceback__)))
        return JSONResponse(status_code=500, content={"error": str(e)})
    
# def who_can_handle_tickets():
#     #code here
#     with get_connection as conn:
#         cursor = conn.cursor()
#         cursor.execute("""
#             SELECT * FROM Employees WHERE role = HR
#                        """)
#     #then find a way to format with columns to return information

@router.get("/updateHRTickets")
def update_ticket_status(TicketId: int, newStatus: str):
    conn = get_connection()
    cursor = conn.cursor()
    
    # Check if the ticket exists
    cursor.execute("""
        SELECT ticket_status
        FROM HRTickets
        WHERE ticketNumber = ?
    """, (TicketId,))
    
    cred_row = cursor.fetchone()
    if not cred_row:
        return {"error": "Ticket not found"}

    # Update the ticket status
    cursor.execute("""
        UPDATE HRTickets
        SET ticket_status = ?
        WHERE ticketNumber = ?
    """, (newStatus, TicketId))

    conn.commit()
    conn.close()

    return {"message": f"Ticket {TicketId} updated successfully to status '{newStatus}'"}
    

def update_ticket_handler(newHandler: int, TicketNum: int):
    conn = get_connection()
    cursor = conn.cursor()

    # Check if the new handler exists and has the 'HR' role
    cursor.execute("""
        SELECT role
        FROM Employees
        WHERE id = ?
    """, (newHandler,))
    
    employee = cursor.fetchone()

    if not employee:
        conn.close()
        return {"error": "Employee not found"}

    if employee[0] != "HR":
        conn.close()
        return {"error": "Employee does not have HR role"}

    # Update the handledBy column for the given ticket
    cursor.execute("""
        UPDATE HRTickets
        SET handledBy = ?
        WHERE ticketNumber = ?
    """, (newHandler, TicketNum))

    if cursor.rowcount == 0:
        conn.close()
        return {"error": "Ticket not found"}

    conn.commit()
    conn.close()

    return {"message": f"Ticket {TicketNum} is now handled by employee {newHandler}"}

    
