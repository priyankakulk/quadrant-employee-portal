from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
<<<<<<< HEAD
from app.api import employees, tickets, training
=======
from app.api import employees, tickets, leaveapplications
>>>>>>> efa6420f9534dd43557cf1d1d344c060c89b6198

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
<<<<<<< HEAD
#app.include_router(leaves.router)
app.include_router(training.router, prefix = "/api")
=======
app.include_router(leaveapplications.router, prefix="/api")  # ✅ ADD THIS LINE
>>>>>>> efa6420f9534dd43557cf1d1d344c060c89b6198

