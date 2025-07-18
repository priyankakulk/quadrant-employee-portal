from fastapi import APIRouter, Query
from app.services.connect import get_connection
from typing import Optional
from datetime import date

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
                "ticket_id": row.TicketID,
                "employee_id": row.EmployeeID,
                "severity": row.Severity,
                "status": row.Status,
                "created_date": row.CreatedDate,
            }
            for row in rows
        ]
    cursor.close()
    conn.close()
    return results

@router.get("/addTicket")
def add_ticket():
    with get_connection() as conn:
        cursor = conn.cursor()
