from fastapi import APIRouter, HTTPException
from typing import List
from app.models.certification import Certification, Exam, Badge
from app.services.connect import get_connection

router = APIRouter()

@router.get("/certifications", response_model=List[Certification])
def get_certifications():
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id, name, description, resources FROM Certifications")
        rows = cursor.fetchall()
        certifications = []
        for row in rows:
            #make a seperate table for steps for easy modification
            cursor.execute("SELECT resource FROM CertificationResources WHERE certification_id = ?") 
            resources = [r[0] for r in cursor.fetchall()]
            certifications.append(Certification(id = row[0], name = row[1], description = row[2], resources = resources))
        return certifications
    

#define a GET endpoint for specific certifications, gets a single certification by id 
#and all its resources from the database and returns a complete Certification object to the client
@router.get("/certifications/{certification_id}", response_model = Certification)
def get_certification(certification_id: int):
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id, name, description FROM Certifications WHERE id = ?", certification_id)
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Certification not found")
        cursor.execute("SELECT resource FROM CertificationResources WHERE certification_id = ?", certification_id)
        resources = [r[0] for r in cursor.fetchall()]
        return Certification(id=row[0], name=row[1], description=row[2], resources=resources)
    

#get exam for a certification
@router.get("/certifications/{certification_id}/exam", response_model=Exam)
def get_exam(certification_id: int):
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id, certification_id, name, description FROM Exams WHERE certification_id = ?", certification_id)
        exam_row = cursor.fetchone()
        if not exam_row:
            raise HTTPException(status_code=404, detail="Exam not found for this certification")
        exam_id = exam_row[0]
        cursor.execute("SELECT id FROM Questions WHERE exam_id = ?", exam_id)
        questions = [q[0] for q in cursor.fetchall()]
        return Exam(id=exam_id, certification_id = certification_id, questions = questions)
    
@router.get("/badges/{employee_id}", response_model = List[Badge])
def get_badges(employee_id = int):
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id, employee_id, certification_id, date_earned FROM Badges WHERE employee_id = ?", employee_id)
        rows = cursor.fetchall()
        return [Badge(id=row[0], employee_id=row[1], certification_id=row[2], date_earned=row[3]) for row in rows]
