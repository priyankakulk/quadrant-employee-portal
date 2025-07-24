from fastapi import APIRouter, Query
from app.services.connect import get_connection
from typing import Optional
from datetime import date


router = APIRouter()

@router.get("/onboard")
def onboard_user(user: Optional[int] = Query(None),
    severity: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    from_date: Optional[date] = Query(None),
    to_date: Optional[date] = Query(None)
):
    print("person")
