from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
<<<<<<< HEAD
=======
from app.api import employees, ittickets, tickets, leaveapplications, induction, troubleshootingDocs, summary #, #training, feedback
>>>>>>> 79e3963f5bc3aba2bacb62802aa676affa7c87ea

from app.api import employees, ittickets, tickets,  leaveapplications, feedback, itaassets, induction, troubleshootingDocs, summary
from app.api import itaassets 
app = FastAPI()

# CORS config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Your frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include feature routers
app.include_router(employees.router, prefix="/api")

app.include_router(summary.router, prefix="/api")
app.include_router(tickets.router, prefix="/api")
app.include_router(leaveapplications.router, prefix="/api")
app.include_router(induction.router, prefix="/api")
app.include_router(ittickets.router, prefix="/api")
<<<<<<< HEAD
app.include_router(feedback.router, prefix="/api")
app.include_router(troubleshootingDocs.router, prefix="/api")
app.include_router(itaassets.router, prefix="/api")
app.include_router(training.router, prefix="/api")  # uncomment if ready
=======
app.include_router(summary.router, prefix="/api")
#app.include_router(feedback.router, prefix="/api"))
app.include_router(troubleshootingDocs.router, prefix="/api")
# app.include_router(training.router, prefix="/api")
>>>>>>> 79e3963f5bc3aba2bacb62802aa676affa7c87ea
