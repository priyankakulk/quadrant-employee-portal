from fastapi import APIRouter

router = APIRouter()

@router.get("/tickets")
def get_tickets():
    return [{"ticket_id": 1}, {"ticket_id": 2}]