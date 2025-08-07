#from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
from fastapi import APIRouter, Query, Request, HTTPException
from typing import Optional
import bcrypt
from app.services.connect import get_connection
from pydantic import BaseModel

router = APIRouter()

# # Enable CORS so React frontend can connect
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:3000"],  # React's address
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )



class LoginRequest(BaseModel):
    username: str
    password: str

@router.post("/employees")
async def get_employee_by_username(login: LoginRequest):
    username = login.username
    password = login.password

    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT employeeId, username, passwordHash
            FROM Users
            WHERE username = ?
        """, (username,))

        cred_row = cursor.fetchone()
        if not cred_row:
            raise HTTPException(status_code=401, detail="User not found")

        employee_id, _, hashed_pw = cred_row
        if not bcrypt.checkpw(password.encode(), hashed_pw.encode()):
            raise HTTPException(status_code=401, detail="Incorrect password")

        cursor.execute("""
            SELECT employeeID, firstName, lastName, workEmail, role
            FROM Employees
            WHERE employeeId = ?
        """, (employee_id,))

        emp_row = cursor.fetchone()
        if not emp_row:
            raise HTTPException(status_code=404, detail="Employee record not found")

        return {
            "id": emp_row[0],
            "first_name": emp_row[1],
            "last_name": emp_row[2],
            "email": emp_row[3],
            "role": emp_row[4]
        }


@router.get("/hashAll")
def hashAll():
    conn = get_connection()
    cursor = conn.cursor()
    # 1. Fetch all user IDs and current (plaintext) passwords
    cursor.execute("SELECT employeeId, unhashed_password FROM Users")
    users = cursor.fetchall()
    for user in users:
        user_id, plain_password = user

        # Skip if password looks like it's already hashed
        if plain_password.startswith('$2b$'):
            continue

        hashed_password = hash_password(plain_password)

        # 2. Update hashed password back in the database
        cursor.execute(
            "UPDATE Users SET passwordHash = ? WHERE employeeId = ?",
            hashed_password, user_id
        )

    # 3. Commit changes and clean up
    conn.commit()
    cursor.close()
    conn.close()


def hash_password(plain_password: str) -> str:
    hashed = bcrypt.hashpw(plain_password.encode('utf-8'), bcrypt.gensalt())
    return hashed.decode('utf-8')  # Store as string in SQL

#check to make sure all columns are labeled correctly cause this code didn't run last time
@router.get("/registerUser")
def register_employee(id: int, username: str, password: str):
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT employeeId, username, passwordHash
            FROM Users
            WHERE username = ?
        """, (username,))

        cred_row = cursor.fetchone()
        if cred_row:
            return {"error": "User already exists"}
        
        cursor.execute("""
            SELECT employeeID, role
            FROM Employees
            WHERE employeeID = ?
        """, (id,))
        cred_row = cursor.fetchone()
        if not cred_row:
            return{"error": "Employee not recognized"}
        
        #get role
        #this is probably not 1 if we get more information
        role = cred_row[1]
        #hash_password
        hashed_pass = hash_password(password)
        #insert row
        cursor.execute('''
            INSERT INTO Users (employeeID, username, passwordHash, role, unhashed_password)
            VALUES (?, ?, ?, ?)
        ''', (id, username, hashed_pass, role, password))

        # 3. Commit the transaction
        conn.commit()

        # 4. Close the connection
        cursor.close()
        conn.close()
