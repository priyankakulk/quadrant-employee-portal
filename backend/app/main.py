from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# ⚠️ Use lowercase modules; rename files if needed: who.py instead of WHO.py
from app.api import employees, tickets, onboarding, itaassets
# If your file is WHO.py, rename it to who.py on disk and then:
from app.api import who  # make sure app/api/who.py exists

app = FastAPI(title="Gateway Backend API")

# CORS config
origins = [
    "http://localhost:3000",
    "https://gateway-app-bcemchh2ahf4htbg.eastus-01.azurewebsites.net",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,        # or ["*"] temporarily for debugging
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include feature routers
app.include_router(employees.router, prefix="/api")
app.include_router(tickets.router, prefix="/api")
app.include_router(onboarding.router, prefix="/api")
app.include_router(itaassets.router, prefix="/api")
app.include_router(who.router, prefix="/api")  # after confirming module name

# Optional health endpoints
@app.get("/", tags=["health"])
def root():
    return {"status": "ok"}

@app.get("/healthz", tags=["health"])
def healthz():
    return {"status": "healthy"}

# Optional: print routes only when running locally
if __name__ == "__main__":
    import uvicorn
    for route in app.routes:
        print(f"Route: {route.path} Methods: {route.methods}")
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000)