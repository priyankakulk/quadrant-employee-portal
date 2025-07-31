from fastapi import APIRouter, Query
from app.services.connect import get_connection
from fastapi.responses import JSONResponse
from typing import Optional
import openai
import os
from openai import AzureOpenAI
from dotenv import load_dotenv
load_dotenv()
 
 
router = APIRouter()
 
# Configure Azure OpenAI
 
'''
openai.api_type = "azure"
openai.api_base = os.getenv("AZURE_OPENAI_ENDPOINT")
openai.api_key = os.getenv("AZURE_OPENAI_API_KEY")
openai.api_version = os.getenv("AZURE_OPENAI_API_VERSION")
DEPLOYMENT_NAME = os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME") '''
client = AzureOpenAI(
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),
    api_version=os.getenv("AZURE_OPENAI_API_VERSION"),
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT")
)
 
DEPLOYMENT_NAME = os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME")
 
 
'''
def summarize_text(text: str) -> str:
    try:
        response = openai.ChatCompletion.create(
            engine=DEPLOYMENT_NAME,
            messages=[
                {"role": "system", "content": "You are a helpful assistant that summarizes ticket messages for readability."},
                {"role": "user", "content": f"Summarize the following ticket:\n\n{text}"}
            ],
            max_tokens=150,
            temperature=0.5,
        )
        return response.choices[0].message["content"].strip()
    except Exception as e:
        return f"Error summarizing: {str(e)}"
 
'''
def summarize_text(text: str) -> str:
    try:
        response = client.chat.completions.create(
            model=DEPLOYMENT_NAME,
            messages=[
                {"role": "system", "content": "You are a helpful assistant that summarizes ticket messages for readability."},
                {"role": "user", "content": f"Summarize the following ticket:\n\n{text}"}
            ],
            max_tokens=150,
            temperature=0.5,
        )
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
    query = "SELECT ticket_number, employeeId, status, handled_by, message FROM ITTickets WHERE 1=1"
    params = []
 
    filters = {
        "employeeId = ?": user,
        "status = ?": status,
        "handled_by = ?": handled_by,
        "ticket_number = ?": ticket_number
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
                "ticket_number": row.ticket_number,
                "employeeId": row.employeeId,
                "status": row.status,
                "handled_by": row.handled_by,
                "original_message": row.message,
                "summary": summarize_text(row.message)
            }
            tickets.append(ticket)
 
    return JSONResponse(content=tickets)
 
 
@router.get("/summarized-hr-tickets")
def get_summarized_hr_tickets(
    ticket_number: Optional[int] = Query(None),
):
    query = "SELECT ticketNumber, employeeID, severity, ticket_status, message FROM HRTickets WHERE ticketNumber = ?"
    # params = []
 
    # filters = {
    #     "EmployeeID = ?": user,
    #     "Severity = ?": severity,
    #     "Status = ?": status
    # }
 
    # for clause, value in filters.items():
    #     if value is not None:
    #         query += f" AND {clause}"
    #         params.append(value)
 
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(query, ticket_number)
        rows = cursor.fetchall()
 
        tickets = []
        for row in rows:
            ticket = {
                "ticket_number": row.ticketNumber,
                "employeeId": row.employeeID,
                "severity": row.severity,
                "status": row.ticket_status,
                "original_message": row.message,
                "summary": summarize_text(row.message)
            }
            tickets.append(ticket)
 
    return JSONResponse(content=tickets)