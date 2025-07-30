from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import employees, tickets, onboarding, ittickets #, #training, leaveapplications

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
app.include_router(onboarding.router, prefix="/api")
app.include_router(ittickets.router, prefix="/api")
# app.include_router(training.router, prefix="/api")
# app.include_router(leaveapplications.router, prefix="/api")
>>>>>>> a1d18acbd0d9aab01cd1e3d4b16700ff18a4116f
