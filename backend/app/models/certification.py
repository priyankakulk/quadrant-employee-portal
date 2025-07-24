from pydantic import BaseModel
from typing import List
from datetime import datetime

class Certification(BaseModel):
    id: int
    name: str
    description: str
    resources: List[str] #from the provided image in the OneNote

class Exam(BaseModel):
    id: int
    certification_id: int #to link to certification
    questions: List[int]

class Badge(BaseModel):
    id: int
    employee_id: int
    certification_id: int
    date_earned: datetime


