from fastapi import APIRouter, Query
from app.services.connect import get_connection
from fastapi.responses import JSONResponse
from typing import Optional
import os
from dotenv import load_dotenv
from openai import AzureOpenAI

# Load env variables early
load_dotenv()

router = APIRouter()

# Load and strip env vars to avoid invisible/trailing chars issues
api_key = os.getenv("AZURE_OPENAI_API_KEY")
if api_key:
    api_key = api_key.strip()
azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
if azure_endpoint:
    azure_endpoint = azure_endpoint.strip()
api_version = os.getenv("AZURE_OPENAI_API_VERSION")
if api_version:
    api_version = api_version.strip()
deployment_name = os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME")
if deployment_name:
    deployment_name = deployment_name.strip()

# Validate required vars
if not (api_key and azure_endpoint and api_version and deployment_name):
    raise ValueError("Missing one or more required Azure OpenAI environment variables")

# Create AzureOpenAI client passing the correct parameter names
client = AzureOpenAI(
    api_key=api_key,
    azure_endpoint=azure_endpoint,
    api_version=api_version,
)

def summarize_text(text: str) -> str:
    try:
        response = client.chat.completions.create(
            model=deployment_name,  # Deployment name as model parameter
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful assistant that summarizes ticket messages for readability."
                },
                {
                    "role": "user",
                    "content": f"Summarize the following ticket:\n\n{text}"
                }
            ],
            max_tokens=150,
            temperature=0.5,
        )
        # Access the content properly from the choice
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"Error summarizing: {str(e)}"

@router.get("/summarized-it-tickets")
def get_summarized_it_tickets(
    user: Optional[int] = Query(None),
    status: Optional[str] = Query(None),
    handled_by: Optional[int] = Query(None),
    ticket_number: Optional[int] = Query(None)
):
    query = "SELECT ticketNumber, employeeId, Status, HandledBy, message FROM ITTickets WHERE 1=1"
    params = []

    filters = {
        "employeeId = ?": user,
        "Status = ?": status,
        "HandledBy = ?": handled_by,
        "ticketNumber = ?": ticket_number
    }

    for clause, value in filters.items():
        if value is not None:
            query += f" AND {clause}"
            params.append(value)

    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(query, params)
        rows = cursor.fetchall()

        tickets = []
        for row in rows:
            ticket = {
                "ticketNumber": row.ticketNumber,
                "employeeId": row.employeeId,
                "Status": row.Status,
                "HandledBy": row.HandledBy,
                "original_message": row.message,
                "summary": summarize_text(row.message)
            }
            tickets.append(ticket)

    return JSONResponse(content=tickets)

@router.get("/summarized-hr-tickets")
def get_summarized_hr_tickets(
    ticket_number: Optional[int] = Query(None),
):
    query = "SELECT ticketNumber, employeeId, severity, ticket_status, message FROM HRTickets WHERE ticketNumber = ?"

    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(query, (ticket_number,))
        rows = cursor.fetchall()

        tickets = []
        for row in rows:
            ticket = {
                "ticket_number": row.ticketNumber,
                "employeeId": row.employeeId,
                "severity": row.severity,
                "status": row.ticket_status,
                "original_message": row.message,
                "summary": summarize_text(row.message)
            }
            tickets.append(ticket)

    return JSONResponse(content=tickets)
