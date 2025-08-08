from pydantic import BaseModel

class Employee(BaseModel):
    id: int
    Fname: str
    Lname: str
    email: str
    number: str
