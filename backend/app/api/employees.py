#from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
from fastapi import APIRouter, Query
from typing import Optional
import bcrypt
from app.services.connect import get_connection


router = APIRouter()

# # Enable CORS so React frontend can connect
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:3000"],  # React's address
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )


@router.get("/employees")
def get_employee_by_username(username: Optional[str] = Query(None), password: Optional[str] = Query(None)):
    #hashAll()
    print("hello", username)
    if(username):
        with get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT EmployeeId, Username, PasswordHash
                FROM Users
                WHERE Username = ?
            """, (username,))

            cred_row = cursor.fetchone()
            if not cred_row:
                return {"error": "User not found"}
            
            hashed_pw = cred_row[2]
            print(hashed_pw)
            employee_id = cred_row[0]
            if not bcrypt.checkpw(password.encode(), hashed_pw.encode()):   
            # if hashed_pw != password:
                return {"error": "Incorrect password"}
            cursor.execute("""
                SELECT EmployeeID, FirstName, LastName, WorkEmail
                FROM Employees
                WHERE EmployeeId = ?
            """, employee_id)

            emp_row = cursor.fetchone()
            if not emp_row:
                return {"error": "Employee record not found"}
            
            return {
                "id": emp_row[0],
                "first_name": emp_row[1],
                "last_name": emp_row[2],
                "email": emp_row[3]
            }
    cursor.close()
    conn.close()
    return {"error": "Username query parameter not provided"}


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

# @router.get("/registerUser")
# def register_employee(id: int, username: str, password: str):
#     with get_connection as conn:
#         cursor = conn.cursor()
#         cursor.execute("""
#             SELECT EmployeeId, Username, PasswordHash
#             FROM Users
#             WHERE Username = ?
#         """, username)

#         cred_row = cursor.fetchone()
#         if cred_row:
#             return {"error": "User already exists"}
        
#         cursor.execute("""
#             SELECT EmployeeID, Role
#             FROM Employees
#             WHERE EmployeeID = ?
#         """, id)
#         cred_row = cursor.fetchone()
#         if not cred_row:
#             return{"error": "Employee not recognized"}
        
#         #get role
#         role = cred_row[1]
#         #hash_password
#         hashed_pass = hash_password(password)
#         #insert row
#         cursor.execute('''
#             INSERT INTO Users (EmployeeID, Username, PasswordHash, Role)
#             VALUES (?, ?, ?, ?)
#         ''', (id, username, hashed_pass, role))

#         # 3. Commit the transaction
#         conn.commit()

#         # 4. Close the connection
#         cursor.close()
#         conn.close()
