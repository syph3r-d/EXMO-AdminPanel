from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from users import router as user_router
from projects import router as project_router
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
import os
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app_dir = os.path.dirname(os.path.abspath(__file__))
static_dir = os.path.join(app_dir, "static")
app.mount("/static", StaticFiles(directory="static"), name="static")
# Include the user and project routers
app.include_router(user_router)
app.include_router(project_router)

security = HTTPBasic()

# Define a root endpoint to render the login.html file


@app.get("/", response_class=HTMLResponse)
async def read_root():
    index_file = os.path.join(static_dir, "index.html")
    with open(index_file) as f:
        html = f.read()
    return html

# Define a /login endpoint to render the index.html file


@app.get("/register", response_class=HTMLResponse)
async def register():
    index_file = os.path.join(static_dir, "register.html")
    with open(index_file) as f:
        html = f.read()
    return html
