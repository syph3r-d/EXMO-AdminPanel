from fastapi import APIRouter, HTTPException, Depends
from typing import List
from pydantic import BaseModel
from pymongo import MongoClient

from users import get_current_user

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["test"]
collection = db["projects"]

router = APIRouter()


class Project(BaseModel):
    name: str
    images: List[str]
    description: str
    department: str
    username: str


@router.post("/projects")
async def create_project(project: Project, user: dict = Depends(get_current_user)):
    # Add the username to the project before inserting it
    project.username = user["username"]

    # Check if a project with the same name already exists
    if collection.find_one({"name": project.name}):
        raise HTTPException(
            status_code=400, detail="Project with this name already exists")
    # Insert the new project
    project_dict = project.dict()
    result = collection.insert_one(project_dict)
    project_dict['_id'] = str(result.inserted_id)
    # Return a success message
    return {"message": "Project added successfully"}


@router.get("/projects")
async def get_projects(user: dict = Depends(get_current_user)):
    projects = []
    for project in collection.find({"username": user["username"]}):
        project_dict = project.copy()
        project_dict['_id'] = str(project_dict.pop('_id'))
        projects.append(project_dict)
    return {"projects": projects}


@router.get("/projects/{project_name}")
async def get_project(project_name: str, user: dict = Depends(get_current_user)):
    project = collection.find_one({"name": project_name})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if project["username"] != user["username"]:
        raise HTTPException(status_code=401, detail="Unauthorized access")
    project_dict = project.copy()
    project_dict['_id'] = str(project_dict.pop('_id'))
    return project_dict


@router.put("/projects/{project_name}")
async def update_project(project_name: str, project: Project, user: dict = Depends(get_current_user)):
    # Check if the project exists
    if not collection.find_one({"name": project_name}):
        raise HTTPException(status_code=404, detail="Project not found")
    # Check if the user is authorized to update the project
    old_project = collection.find_one({"name": project_name})
    if old_project["username"] != user["username"]:
        raise HTTPException(status_code=401, detail="Unauthorized access")
    # Update the project
    collection.update_one({"name": project_name},
                          {"$set": project.dict()})
    # Return a success message
    return {"message": "Project updated successfully"}


@router.delete("/projects/{project_name}")
async def delete_project(project_name: str, user: dict = Depends(get_current_user)):
    # Check if the project exists
    project = collection.find_one({"name": project_name})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    # Check if the user is authorized to delete the project
    if project["username"] != user["username"]:
        raise HTTPException(status_code=401, detail="Unauthorized access")
    # Delete the project
    result = collection.delete_one({"name": project_name})
    if result.deleted_count == 1:
        return {"message": "Project deleted successfully"}
    else:
        raise HTTPException(status_code=500, detail="Failed to delete project")
