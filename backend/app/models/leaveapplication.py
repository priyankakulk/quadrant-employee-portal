from pydantic import BaseModel, Field, EmailStr
from typing import Literal, Optional
from datetime import date

#  Employee 
class Employee(BaseModel):
    id: int
    name: str
    email: EmailStr
    gender: Optional[Literal['Male', 'Female']]
    department: Optional[str]

# Leave Balance
class LeaveBalance(BaseModel):
    employee_id: int
    leave_type: Literal['Sick Leave', 'Vacation', 'Maternity Leave', 'Paternity Leave']
    total_days: int
    balance: int
    year: int

# Leave Application 
class LeaveApplication(BaseModel):
    employee_id: int
    leave_type: Literal['Sick Leave', 'Vacation', 'Maternity Leave', 'Paternity Leave']
    start_date: date
    end_date: date
    days_gone: int
    reason: Optional[str] = Field(None, max_length=1000)
    status: Optional[Literal["Pending", "Approved", "Rejected"]] = "Pending"
