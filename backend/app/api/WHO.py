from fastapi import APIRouter, Query
from app.services.connect import get_connection

router = APIRouter()

@router.get("/superiors")
def get_superiors(EID: int):
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute()
        query = """
            SELECT e.id, e.name, e.role
            FROM employee_hierarchy h
            JOIN Employees e ON h.ancestor_id = e.id
            WHERE h.descendant_id = ? AND h.depth > 0
            ORDER BY h.depth ASC;
        """
        cursor.execute(query, EID)
        cursor.close()
        conn.close()

@router.get("/subordinates")
def get_subordinates(EID: int):
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute()
        query = """
            SELECT e.id, e.name, e.role
            FROM employee_hierarchy h
            JOIN employees e ON h.descendant_id = e.id
            WHERE h.ancestor_id = ? AND h.depth > 0
            ORDER BY h.depth ASC;
        """
        cursor.execute(query, EID)
        cursor.close()
        conn.close()
