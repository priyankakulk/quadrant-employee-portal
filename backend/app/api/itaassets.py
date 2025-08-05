from fastapi import APIRouter
from typing import List
from datetime import datetime
from app.services.connect import get_connection
from app.models.asset import Asset
from app.models.assignment import Assignment

router = APIRouter()

def compute_status(returned_on, asset_id, due_date):
    today = datetime.now().date()
    if returned_on:
        return "Returned"
    else:
        if asset_id == "A1010":  # Backpack exempt
            return "Exempt (Backpack)"
        elif due_date < today:
            return "Overdue"
        else:
            return "Pending"

@router.get("/assets", response_model=List[Asset])
def get_assets():
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id, asset_name, asset_id, asset_category, quantity_total, quantity_left
            FROM Assets
        """)
        rows = cursor.fetchall()
        cursor.close()

    return [Asset(
        id=row[0],
        asset_name=row[1],
        asset_id=row[2],
        asset_category=row[3],
        quantity_total=row[4],
        quantity_left=row[5]
    ) for row in rows]

@router.get("/assignments", response_model=List[Assignment])
def get_assignments():
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT assignment_id, asset_id, employee_id, employee_name, assigned_on, due_date, returned_on
            FROM AssetAssignments
        """)
        rows = cursor.fetchall()
        cursor.close()

    assignments = []
    for row in rows:
        status = compute_status(row[6], row[1], row[5])
        assignments.append(Assignment(
            assignment_id=row[0],
            asset_id=row[1],
            employee_id=row[2],
            employee_name=row[3],
            assigned_on=row[4],
            due_date=row[5],
            returned_on=row[6],
            status=status
        ))
    return assignments
