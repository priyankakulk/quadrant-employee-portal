from fastapi import APIRouter, Query
from fastapi.responses import JSONResponse
from app.services.connect import get_connection

router = APIRouter(prefix="/who", tags=["who"])

@router.get("/superiors")
def get_superiors(EID: int = Query(..., description="Employee ID")):
    query = """
        SELECT e.employeeId, e.firstName, e.lastName, e.workEmail
        FROM employeesHierarchy h
        JOIN Employees e ON h.ancestor = e.employeeId
        WHERE h.descendant = ? AND h.depth > 0
        ORDER BY h.depth DESC;
    """
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(query, (EID,))
        rows = cursor.fetchall()
        cursor.close()

    results = [
        {"id": row[0], "firstName": row[1], "lastName": row[2], "workEmail": row[3]}
        for row in rows
    ]
    return JSONResponse(content=results)

@router.get("/subordinates")
def get_subordinates(EID: int = Query(..., description="Employee ID")):
    query = """
        SELECT e.employeeId, e.firstName, e.lastName, e.workEmail
        FROM employeesHierarchy h
        JOIN Employees e ON h.descendant = e.employeeId
        WHERE h.ancestor = ? AND h.depth > 0
        ORDER BY h.depth ASC;
    """
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(query, (EID,))
        rows = cursor.fetchall()
        cursor.close()

    results = [
        {"id": row[0], "firstName": row[1], "lastName": row[2], "workEmail": row[3]}
        for row in rows
    ]
    return JSONResponse(content=results)
