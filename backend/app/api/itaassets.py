from fastapi import APIRouter, HTTPException
from typing import List
from datetime import datetime
from app.services.connect import get_connection
from app.models.asset import Asset
from app.models.assignment import Assignment
from pydantic import BaseModel

router = APIRouter()

class StatusUpdate(BaseModel):
    status: str

def compute_status(returned_on, asset_id, due_date):
    today = datetime.now().date()
    if asset_id == "A1010":
        return "Exempt"
    if returned_on:
        if returned_on <= due_date:
            return "Returned"
        else:
            return "Overdue"  # Returned late
    else:
        if due_date < today:
            return "Overdue"  # Not returned and past due
        else:
            return "Pending"  # Not returned but still within due date

@router.patch("/assignments/{assignment_id}/status")
def update_assignment_status(assignment_id: str, status_update: StatusUpdate):
    """Update the status of an assignment"""
    print(f"Received request to update assignment {assignment_id} to status: {status_update.status}")
    
    try:
        with get_connection() as conn:
            cursor = conn.cursor()
            
            # Check if assignment exists
            cursor.execute("SELECT assignment_id FROM AssetAssignments WHERE assignment_id = ?", (assignment_id,))
            if not cursor.fetchone():
                raise HTTPException(status_code=404, detail="Assignment not found")
            
            if status_update.status == "Returned":
                # Set returned_on to current date
                cursor.execute("""
                    UPDATE AssetAssignments 
                    SET returned_on = ? 
                    WHERE assignment_id = ?
                """, (datetime.now().date(), assignment_id))
            else:
                # Clear returned_on if status is not 'Returned'
                cursor.execute("""
                    UPDATE AssetAssignments 
                    SET returned_on = NULL 
                    WHERE assignment_id = ?
                """, (assignment_id,))
            
            conn.commit()
            cursor.close()
        
        print(f"Successfully updated assignment {assignment_id} to status: {status_update.status}")
        return {"message": "Status updated successfully", "assignment_id": assignment_id, "new_status": status_update.status}
    
    except Exception as e:
        print(f"Error updating status: {e}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

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

@router.get("/assignments/{assignment_id}")
def get_assignment(assignment_id: str):
    """Get a specific assignment by ID"""
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT assignment_id, asset_id, employee_id, employee_name, assigned_on, due_date, returned_on
            FROM AssetAssignments
            WHERE assignment_id = ?
        """, (assignment_id,))
        row = cursor.fetchone()
        cursor.close()
        
        if not row:
            raise HTTPException(status_code=404, detail="Assignment not found")
        
        status = compute_status(row[6], row[1], row[5])
        return Assignment(
            assignment_id=row[0],
            asset_id=row[1],
            employee_id=row[2],
            employee_name=row[3],
            assigned_on=row[4],
            due_date=row[5],
            returned_on=row[6],
            status=status
        )

@router.get("/test")
def test_endpoint():
    """Simple test endpoint to verify the API is working"""
    return {"message": "Assets API is working", "timestamp": datetime.now().isoformat()}

@router.post("/test-status")
def test_status_update(status_update: StatusUpdate):
    """Test endpoint to verify StatusUpdate model parsing"""
    return {"received_status": status_update.status, "type": type(status_update.status).__name__}
