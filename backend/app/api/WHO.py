from fastapi import APIRouter, Query
from app.services.connect import get_connection
from fastapi.responses import JSONResponse

router = APIRouter()


#returns the data in order
@router.get("/superiors")
def get_superiors(EID: int):
    query = """
        SELECT e.employeeId, e.firstName, e.lastName, e.workEmail
        FROM employeesHierarchy h
        JOIN Employees e ON h.ancestor = e.employeeId
        WHERE h.descendant = ? AND h.depth > 0
        ORDER BY h.depth ASC;
    """
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(query, (EID,))
        rows = cursor.fetchall()
        cursor.close()
        
    # Transform results to list of dicts
    results = [{"id": row[0], "firstName": row[1], "lastName": row[2], "workEmail": row[3]} for row in rows]
    conn.close()
    return JSONResponse(content=results)

@router.get("/subordinates")
def get_subordinates(EID: int):
    with get_connection() as conn:
        cursor = conn.cursor()
        #cursor.execute()
        query = """
            SELECT e.EmployeeId, e.firstName, e.lastName, e.workEmail
            FROM employeesHierarchy h
            JOIN employees e ON h.descendant = e.EmployeeId
            WHERE h.ancestor = ? AND h.depth > 0
            ORDER BY h.depth ASC;
        """
        cursor.execute(query, EID)
        rows = cursor.fetchall()
        cursor.close()
        
    # Transform results to list of dicts
    results = [{"id": row[0], "firstName": row[1], "lastName": row[2], "workEmail": row[3]} for row in rows]
    conn.close()
    return JSONResponse(content=results)

