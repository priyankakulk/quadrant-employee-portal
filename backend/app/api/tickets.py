from fastapi import APIRouter, Query
from app.services.connect import get_connection
from typing import Optional
from datetime import date
from fastapi.responses import JSONResponse

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
        "EmployeeID = ?": user,
        "Severity = ?": severity,
        "Status = ?": status,
        "CreatedDate >= ?": from_date,
        "CreatedDate <= ?": to_date
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
                "ticketNumber": row.TicketID,
                "employeeId": row.EmployeeID,
                "severity": row.Severity,
                "status": row.Status,
                "startDate": row.CreatedDate,
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
            cursor.execute("SELECT MAX(ticketNumber) FROM Tickets")
            max_id = cursor.fetchone()[0]
            new_ticket_id = (max_id or 0) + 1

            # Insert new ticket
            cursor.execute("""
                INSERT INTO Tickets (ticketNumber, employeeId, severity, status, startDate, message)
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
        return JSONResponse(status_code=500, content={"error": str(e)})
    
def who_can_handle_tickets():
    #code here
    with get_connection as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT * FROM Employees WHERE role = HR
                       """)
    #then find a way to format with columns to return information

def update_ticket_status(Id: int):
    #code here
    cursor = conn.cursor()
    cursor.execute("""
        SELECT role
        FROM Employees
        WHERE EmployeeId = ?
    """, Id)

    cred_row = cursor.fetchone()
    role = cred_row

