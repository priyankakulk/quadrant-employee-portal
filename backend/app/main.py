from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
<<<<<<< HEAD
=======
from app.api import employees, tickets, onboarding, ittickets, WHO , leaveapplications, induction, troubleshootingDocs, summary #, #training, feedback
>>>>>>> 79e3963f5bc3aba2bacb62802aa676affa7c87ea

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

app.include_router(summary.router, prefix="/api")
app.include_router(tickets.router, prefix="/api")
app.include_router(WHO.router, prefix = "/api")
app.include_router(onboarding.router, prefix = "/api")
#app.include_router(leaveapplications.router, prefix="/api")  # ✅ ADD THIS LINE
##app.include_router(induction.router, prefix="/api")
#app.include_router(ittickets.router, prefix="/api")
##app.include_router(feedback.router, prefix="/api"))
#app.include_router(troubleshootingDocs.router, prefix="/api")
# app.include_router(training.router, prefix="/api")
# app.include_router(leaveapplications.router, prefix="/api")

