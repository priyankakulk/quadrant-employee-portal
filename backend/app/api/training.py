from fastapi import APIRouter, HTTPException
from typing import List
from app.models.certification import Certification, CertificationResources, Exams, Questions, Badges
from app.services.connect import get_connection

router = APIRouter()

@router.get("/certifications", response_model=List[Certifications])
def get_certifications():
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id, name, description, resources FROM Certifications")
        rows = cursor.fetchall()
        certifications = []
        for row in rows:
            cursor.execute("SELECT resource FROM CertificationResources WHERE certification_id = ?", (row[0],)) 
            resources = [r[0] for r in cursor.fetchall()]
            certifications.append(Certifications(id=row[0], name=row[1], description=row[2], resources=resources))
        return certifications
    

# Define a GET endpoint for specific certifications, gets a single certification by id 
# and all its resources from the database and returns a complete Certification object to the client
@router.get("/certifications/{certification_id}", response_model=Certifications)
def get_certification(certification_id: int):
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id, name, description FROM Certifications WHERE id = ?", (certification_id,))
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Certification not found")
        cursor.execute("SELECT resource FROM CertificationResources WHERE certification_id = ?", (certification_id,))
        resources = [r[0] for r in cursor.fetchall()]
        return Certifications(id=row[0], name=row[1], description=row[2], resources=resources)
    

# Get exam for a certification
@router.get("/certifications/{certification_id}/exam", response_model=Exams)
def get_exam(certification_id: int):
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id, certification_id, name, description FROM Exams WHERE certification_id = ?", (certification_id,))
        exam_row = cursor.fetchone()
        if not exam_row:
            raise HTTPException(status_code=404, detail="Exam not found for this certification")
        exam_id = exam_row[0]
        cursor.execute("SELECT id FROM Questions WHERE exam_id = ?", (exam_id,))
        questions = [q[0] for q in cursor.fetchall()]
        return Exams(id=exam_id, certification_id=certification_id, questions=questions)
    
@router.get("/badges/{employee_id}", response_model=List[Badges])
def get_badges(employee_id: int):  # Fixed: Added type annotation with colon
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id, employee_id, certification_id, date_earned FROM Badges WHERE employee_id = ?", (employee_id,))
        rows = cursor.fetchall()
        return [Badges(id=row[0], employee_id=row[1], certification_id=row[2], date_earned=row[3]) for row in rows]

# Get all questions for a specific exam
@router.get("/exams/{exam_id}/questions", response_model=List[Questions])
def get_exam_questions(exam_id: int):
    with get_connection() as conn:
        cursor = conn.cursor()
        # First verify the exam exists
        cursor.execute("SELECT id FROM Exams WHERE id = ?", (exam_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="Exam not found")
        
        # Get all questions for this exam
        cursor.execute("SELECT id, exam_id, question_text, correct_answer FROM Questions WHERE exam_id = ?", (exam_id,))
        rows = cursor.fetchall()
        return [Questions(id=row[0], exam_id=row[1], question_text=row[2], correct_answer=row[3]) for row in rows]


# Award a badge to an employee
@router.post("/badges", response_model=Badges)
def award_badge(employee_id: int, certification_id: int):
    with get_connection() as conn:
        cursor = conn.cursor()
        
        # Verify certification exists
        cursor.execute("SELECT id FROM Certifications WHERE id = ?", (certification_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="Certification not found")
        
        # Check if employee already has this badge
        cursor.execute("SELECT id FROM Badges WHERE employee_id = ? AND certification_id = ?", 
                      (employee_id, certification_id))
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="Employee already has this badge")
        
        # Award the badge
        from datetime import datetime
        date_earned = datetime.now().isoformat()
        cursor.execute("INSERT INTO Badges (employee_id, certification_id, date_earned) VALUES (?, ?, ?)",
                      (employee_id, certification_id, date_earned))
        conn.commit()
        
        # Get the newly created badge
        badge_id = cursor.lastrowid
        return Badges(id=badge_id, employee_id=employee_id, certification_id=certification_id, date_earned=date_earned)


# Get all certifications for an employee
@router.get("/employees/{employee_id}/certifications", response_model=List[Certifications])
def get_employee_certifications(employee_id: int):
    with get_connection() as conn:
        cursor = conn.cursor()
        
        # Get all certifications this employee has badges for
        cursor.execute("""
            SELECT DISTINCT c.id, c.name, c.description 
            FROM Certifications c
            INNER JOIN Badges b ON c.id = b.certification_id
            WHERE b.employee_id = ?
        """, (employee_id,))
        rows = cursor.fetchall()
        
        certifications = []
        for row in rows:
            # Get resources for each certification
            cursor.execute("SELECT resource FROM CertificationResources WHERE certification_id = ?", (row[0],))
            resources = [r[0] for r in cursor.fetchall()]
            certifications.append(Certifications(id=row[0], name=row[1], description=row[2], resources=resources))
        
        return certifications