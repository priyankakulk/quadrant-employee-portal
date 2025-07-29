from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import employees, ittickets, tickets#, #training, leaveapplications

app = FastAPI()

# CORS config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include feature routers
app.include_router(employees.router, prefix="/api")
app.include_router(tickets.router, prefix="/api")
app.include_router(ittickets.router, prefix="/api")
# app.include_router(training.router, prefix="/api")
# app.include_router(leaveapplications.router, prefix="/api")