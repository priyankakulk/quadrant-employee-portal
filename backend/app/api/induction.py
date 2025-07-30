from fastapi import FastAPI, APIRouter, Depends, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy import Column, Integer, String, ForeignKey, create_engine
from sqlalchemy.orm import relationship, sessionmaker, Session, declarative_base
from typing import List, Optional
import shutil, os
from uuid import uuid4

router = APIRouter()

# === Config ===
DATABASE_URL = "sqlite:///./modules.db"  # Replace with actual SQL Server URL if needed
UPLOAD_FOLDER = "induction_uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# === FastAPI Setup ===
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount("/induction_uploads", StaticFiles(directory=UPLOAD_FOLDER), name="induction_uploads")

# === Database Setup ===
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# === ORM Models ===
class InductionModule(Base):
    __tablename__ = "induction_modules"
    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String, nullable=False)
    description = Column(String)
    target_role = Column(String, nullable=False)
    files = relationship("InductionFile", back_populates="module", cascade="all, delete")

class InductionFile(Base):
    __tablename__ = "induction_files"
    id = Column(Integer, primary_key=True, autoincrement=True)
    filename = Column(String, nullable=False)
    content = Column(String, nullable=True)  # For text-based files
    module_id = Column(Integer, ForeignKey("induction_modules.id", ondelete="CASCADE"))
    module = relationship("InductionModule", back_populates="files")

# Base.metadata.create_all(bind=engine)  # Only run once to create tables

# === API Router ===
router = APIRouter(prefix="/induction", tags=["Induction"])

# === Read-only module views for each role ===
@router.get("/hr/modules")
def view_hr_modules(db: Session = Depends(get_db)):
    return get_modules_by_role("HR", db)

@router.get("/it/modules")
def view_it_modules(db: Session = Depends(get_db)):
    return get_modules_by_role("IT", db)

@router.get("/employee/modules")
def view_employee_modules(db: Session = Depends(get_db)):
    return get_modules_by_role("Employee", db)

def get_modules_by_role(role: str, db: Session):
    modules = db.query(InductionModule).filter_by(target_role=role).all()
    return [
        {
            "id": m.id,
            "title": m.title,
            "description": m.description,
            "files": [
                {"id": f.id, "filename": f.filename, "is_text": bool(f.content)}
                for f in m.files
            ]
        }
        for m in modules
    ]

# === HR: Admin Panel Routes ===
@router.post("/hr/manage/modules")
def create_module_admin(title: str = Form(...), description: str = Form(""), target_role: str = Form(...), db: Session = Depends(get_db)):
    if target_role not in ["HR", "IT", "Employee"]:
        raise HTTPException(400, detail="Invalid role")
    module = InductionModule(title=title, description=description, target_role=target_role)
    db.add(module)
    db.commit()
    db.refresh(module)
    return {"message": "Module created", "id": module.id}

@router.put("/hr/manage/modules/{module_id}")
def update_module(module_id: int, title: str = Form(...), description: str = Form(...), target_role: str = Form(...), db: Session = Depends(get_db)):
    module = db.query(InductionModule).filter_by(id=module_id).first()
    if not module:
        raise HTTPException(404, detail="Module not found")
    module.title = title
    module.description = description
    module.target_role = target_role
    db.commit()
    return {"message": "Module updated"}

@router.delete("/hr/manage/modules/{module_id}")
def delete_module(module_id: int, db: Session = Depends(get_db)):
    module = db.query(InductionModule).filter_by(id=module_id).first()
    if not module:
        raise HTTPException(404, detail="Module not found")
    for file in module.files:
        if file.filename and not file.content:
            try:
                os.remove(os.path.join(UPLOAD_FOLDER, file.filename))
            except FileNotFoundError:
                pass
    db.delete(module)
    db.commit()
    return {"message": "Module deleted"}

# === File Actions ===
@router.post("/hr/manage/modules/{module_id}/upload-file")
def upload_file(module_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    filename = f"{uuid4()}_{file.filename}"
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    db.add(InductionFile(filename=filename, module_id=module_id))
    db.commit()
    return {"message": "File uploaded"}

@router.post("/hr/manage/modules/{module_id}/text-file")
def create_text_file(module_id: int, filename: str = Form(...), content: str = Form(...), db: Session = Depends(get_db)):
    db.add(InductionFile(filename=filename, content=content, module_id=module_id))
    db.commit()
    return {"message": "Text file created"}

@router.put("/hr/manage/files/{file_id}")
def update_text_file(file_id: int, filename: str = Form(...), content: str = Form(...), db: Session = Depends(get_db)):
    file = db.query(InductionFile).filter_by(id=file_id).first()
    if not file:
        raise HTTPException(404, detail="File not found")
    file.filename = filename
    file.content = content
    db.commit()
    return {"message": "File updated"}

@router.delete("/hr/manage/files/{file_id}")
def delete_file(file_id: int, db: Session = Depends(get_db)):
    file = db.query(InductionFile).filter_by(id=file_id).first()
    if not file:
        raise HTTPException(404, detail="File not found")
    if file.filename and not file.content:
        try:
            os.remove(os.path.join(UPLOAD_FOLDER, file.filename))
        except FileNotFoundError:
            pass
    db.delete(file)
    db.commit()
    return {"message": "File deleted"}

# === File Read Routes ===
@router.get("/files/{filename}")
def download_file(filename: str):
    path = os.path.join(UPLOAD_FOLDER, filename)
    if not os.path.exists(path):
        raise HTTPException(404, detail="File not found")
    return FileResponse(path, media_type="application/octet-stream", filename=filename)

@router.get("/files/text/{file_id}")
def read_text_file(file_id: int, db: Session = Depends(get_db)):
    file = db.query(InductionFile).filter_by(id=file_id).first()
    if not file or not file.content:
        raise HTTPException(404, detail="Text file not found")
    return {"filename": file.filename, "content": file.content}

# === Register Router ===
app.include_router(router)
