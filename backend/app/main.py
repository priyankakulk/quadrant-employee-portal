from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import employees, tickets, onboarding, itaassets
from app.api.who import router as who_router

app = FastAPI(title="Gateway Backend API")

origins = [
    "http://localhost:3000",
    "https://gateway-app-bcemchh2ahf4htbg.eastus-01.azurewebsites.net",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(employees.router, prefix="/api")
app.include_router(tickets.router, prefix="/api")
app.include_router(onboarding.router, prefix="/api")
app.include_router(itaassets.router, prefix="/api")
app.include_router(who_router, prefix="/api")

@app.get("/", tags=["health"])
def root():
    return {"status": "ok"}

@app.get("/healthz", tags=["health"])
def healthz():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    for route in app.routes:
        print(f"Route: {route.path} Methods: {route.methods}")
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000)
