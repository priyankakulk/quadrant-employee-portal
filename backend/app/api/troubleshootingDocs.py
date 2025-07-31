'''from fastapi import FastAPI, APIRouter, Form, HTTPException, Query
from typing import List, Optional
import pyodbc
from app.services.connect import get_connection

router = APIrouter()

# Create a troubleshooting document (form submission)
@router.post("/it/troubleshooting/create")
def create_troubleshooting_document(
    issue_title: str = Form(...),
    date_solved: str = Form(...),  # ISO date
    fixed_by: str = Form(...),
    solution_notes: str = Form(...)
):
    with get_connection() as conn:
        cursor = conn.cursor()

        # Step 1: Generate a unique ticket number
        cursor.execute("SELECT MAX(id) FROM troubleshooting_documents")
        last_id = cursor.fetchone()[0]
        next_id = (last_id or 0) + 1
        ticket_number = f"TCK{next_id:06}"  # Example: TCK000001

        # Step 2: Ensure ticket_number is unique (defensive check)
        cursor.execute("SELECT COUNT(*) FROM troubleshooting_documents WHERE ticket_number = ?", (ticket_number,))
        while cursor.fetchone()[0] > 0:
            next_id += 1
            ticket_number = f"TCK{next_id:06}"
            cursor.execute("SELECT COUNT(*) FROM troubleshooting_documents WHERE ticket_number = ?", (ticket_number,))

        # Step 3: Insert into DB
        cursor.execute("""
            INSERT INTO troubleshooting_documents (ticket_number, issue_title, date_solved, fixed_by, solution_notes)
            VALUES (?, ?, ?, ?, ?)
        """, (ticket_number, issue_title, date_solved, fixed_by, solution_notes))
        conn.commit()

        cursor.execute("SELECT SCOPE_IDENTITY()")
        doc_id = cursor.fetchone()[0]

    return {
        "message": "Troubleshooting document created",
        "id": doc_id,
        "ticket_number": ticket_number
    }

# List all troubleshooting documents with optional search filters
@router.get("/it/troubleshooting/list")
def list_troubleshooting_documents(
    search: Optional[str] = Query(None, description="Search by ticket_number, issue_title, fixed_by, or date_solved")
):
    with get_connection() as conn:
        cursor = conn.cursor()
        base_query = """
            SELECT id, ticket_number, issue_title, fixed_by, date_solved
            FROM troubleshooting_documents
        """
        if search:
            like_search = f"%{search}%"
            base_query += """
                WHERE ticket_number LIKE ? OR issue_title LIKE ? OR fixed_by LIKE ? OR date_solved LIKE ?
            """
            cursor.execute(base_query, (like_search, like_search, like_search, like_search))
        else:
            cursor.execute(base_query)
        rows = cursor.fetchall()
        documents = []
        for row in rows:
            doc_id, ticket_number, issue_title, fixed_by, date_solved = row
            documents.append({
                "id": doc_id,
                "ticket_number": ticket_number,
                "issue_title": issue_title,
                "fixed_by": fixed_by,
                "date_solved": date_solved,
            })
        return documents

# Get full details of a specific troubleshooting document by ID. 
# Onclick of a torubleshooting doc in the database. This will open the document and show the full description.
@router.get("/it/troubleshooting/{doc_id}")
def get_troubleshooting_document(doc_id: int):
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT ticket_number, issue_title, date_solved, fixed_by, solution_notes
            FROM troubleshooting_documents
            WHERE id = ?
        """, (doc_id,))
        row = cursor.fetchone()
        if not row:
            raise HTTPException(404, detail="Document not found")

        ticket_number, issue_title, date_solved, fixed_by, solution_notes = row
        return {
            "ticket_number": ticket_number,
            "issue_title": issue_title,
            "date_solved": date_solved,
            "fixed_by": fixed_by,
            "solution_notes": solution_notes,
        }

app = FastAPI()
app.include_router(router)'''
