from fastapi import FastAPI, APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from typing import List
import os, shutil
import pyodbc
from uuid import uuid4
from app.services.connect import get_connection

router= APIRouter()

# === Configuration ===
UPLOAD_FOLDER = "induction_uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app = FastAPI()

# app.add_middleware(
#    CORSMiddleware,
#   allow_origins=["http://localhost:3000"],
#    allow_credentials=True,
 #   allow_methods=["*"],
 #   allow_headers=["*"],
#)

app.mount("/induction_uploads", StaticFiles(directory=UPLOAD_FOLDER), name="induction_uploads")

# == HR Module Management

# Create a new induction module for HR to manage
@router.post("/hr/manage/modules")
def create_module_admin(title: str = Form(...), description: str = Form(""), target_role: str = Form(...)):
    if target_role not in ["HR", "IT", "Employee"]:
        raise HTTPException(400, detail="Invalid target role")
    with get_connection() as conn:
        cursor = conn.cursor()

        # Check for duplicate module title
        cursor.execute("SELECT COUNT(*) FROM induction_modules WHERE title = ?", (title,))
        if cursor.fetchone()[0] > 0:
            raise HTTPException(400, detail="Module title already exists")

        cursor.execute("""
            INSERT INTO induction_modules (title, description, target_role)
            VALUES (?, ?, ?)
        """, (title, description, target_role))
        conn.commit()
        cursor.execute("SELECT SCOPE_IDENTITY()")
        module_id = cursor.fetchone()[0]
    return {"message": "Module created", "id": module_id}


# HR uploading a file into a module
@router.post("/hr/manage/modules/{module_id}/upload-file")
def upload_file(module_id: int, file: UploadFile = File(...)):
    filename = f"{uuid4()}_{file.filename}"
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO induction_files (filename, module_id)
            VALUES (?, ?)
        """, (filename, module_id))
        conn.commit()
    return {"message": "File uploaded"}

# Create a text-based file directly within the app interface
@router.post("/hr/manage/modules/{module_id}/text-file")
def create_text_file(module_id: int, filename: str = Form(...), content: str = Form(...)):
    with get_connection() as conn:
        cursor = conn.cursor()

        cursor.execute("SELECT id FROM induction_modules WHERE id = ?", (module_id,))
        if not cursor.fetchone():
            raise HTTPException(404, detail="Module not found")

        # Check for duplicate filename in the same module
        cursor.execute("""
            SELECT COUNT(*) FROM induction_files WHERE filename = ? AND module_id = ?
        """, (filename, module_id))
        if cursor.fetchone()[0] > 0:
            raise HTTPException(400, detail="File title already exists in this module")

        cursor.execute("""
            INSERT INTO induction_files (filename, module_id, content)
            VALUES (?, ?, ?)
        """, (filename, module_id, content))
        conn.commit()
    return {"message": "Text file created"}

#example for react code: The user will click a button to create a file and then submit the content through the form and then submit to add the file
#<form action="/induction/hr/manage/modules/1/text-file" method="POST">
#  <input type="text" name="filename" placeholder="Enter file name" required />
#  <textarea name="content" placeholder="Enter text content here..." rows="10" required></textarea>
#  <button type="submit">Create File</button>
#</form>

# Update an existing induction module's metadata
@router.post("/hr/manage/modules/{module_id}")
def update_module(module_id: int, title: str = Form(...), description: str = Form(...), target_role: str = Form(...)):
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE induction_modules SET title = ?, description = ?, target_role = ?
            WHERE id = ?
        """, (title, description, target_role, module_id))
        conn.commit()
    return {"message": "Module updated"}

# Edit a text-based file created in the system
@router.put("/hr/manage/files/{file_id}/edit")
def edit_text_file(file_id: int, new_content: str = Form(...)):
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("UPDATE induction_files SET content = ? WHERE id = ?", (new_content, file_id))
        if cursor.rowcount == 0:
            raise HTTPException(404, detail="File not found or not editable")
        conn.commit()
    return {"message": "File updated"}


# Delete an induction module and its associated files
@router.delete("/hr/manage/modules/{module_id}")
def delete_module(module_id: int):
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT filename FROM induction_files WHERE module_id = ?", (module_id,))
        for (filename,) in cursor.fetchall():
            filepath = os.path.join(UPLOAD_FOLDER, filename)
            if os.path.exists(filepath):
                os.remove(filepath)
        cursor.execute("DELETE FROM induction_modules WHERE id = ?", (module_id,))
        conn.commit()
    return {"message": "Module and files deleted"}

# === HR View Only ===
@router.get("/hr/modules")
def view_hr_modules():
    return get_modules_by_role("HR")

# === IT & Employee View ===
@router.get("/it/modules")
def view_it_modules():
    return get_modules_by_role("IT")

# getting the employee induction modules
@router.get("/employee/modules")
def view_employee_modules():
    return get_modules_by_role("Employee")

# Helper method to fetch all modules for a given role
def get_modules_by_role(role: str):
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id, title, description FROM induction_modules WHERE target_role = ?", (role,))
        modules = cursor.fetchall()
        module_data = []
        for module in modules:
            module_id, title, desc = module
            cursor.execute("SELECT id, filename FROM induction_files WHERE module_id = ?", (module_id,))
            files = [{"id": fid, "filename": fname} for fid, fname in cursor.fetchall()]
            module_data.append({"id": module_id, "title": title, "description": desc, "files": files})
        return module_data

# === File Access ===
@router.get("/files/download/{filename}")
def download_file(filename: str):
    path = os.path.join(UPLOAD_FOLDER, filename)
    if not os.path.exists(path):
        raise HTTPException(404, detail="File not found")
    return FileResponse(path, media_type="application/octet-stream", filename=filename)

@router.get("/files/text/{file_id}")
def read_text_file(file_id: int):
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT content FROM induction_files WHERE id = ?", (file_id,))
        result = cursor.fetchone()
        if not result or not result[0]:
            raise HTTPException(404, detail="Text content not found")
        return {"content": result[0]}

# === Mount Router ===
app.include_router(router)
