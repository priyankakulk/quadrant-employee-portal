from pydantic import BaseModel
from typing import Optional
from datetime import date

class Assignment(BaseModel):
    assignment_id: str
    asset_id: str
    employee_id: int
    employee_name: str
    assigned_on: date
    due_date: date
    returned_on: Optional[date] = None
    #status: from pydantic import BaseModel
from typing import Optional
from datetime import date

class Assignment(BaseModel):
    assignment_id: str
    asset_id: str
    employee_id: int
    employee_name: str
    assigned_on: date
    due_date: date
    returned_on: Optional[date] = None
    status: Optional[str] = None 


