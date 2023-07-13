from fastapi import FastAPI, APIRouter, Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pymongo import MongoClient
from passlib.context import CryptContext
from pydantic import BaseModel
from datetime import datetime, timedelta
import jwt
from jwt import PyJWTError

# Define an API router
router = APIRouter()

# Set up a password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Define a Pydantic model for the user data


class User(BaseModel):
    username: str
    password: str
    email: str


class Login(BaseModel):
    username: str
    password: str


# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['exmo']
collection = db['users']

# Define a function to create access tokens
JWT_SECRET = "mysecretkey"
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_TIME_MINUTES = 30


def create_access_token(username: str) -> str:
    expiration = datetime.utcnow() + timedelta(minutes=JWT_EXPIRATION_TIME_MINUTES)
    payload = {"username": username, "exp": expiration}
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return token

# Define a function to verify access tokens


def verify_token(token: str = Depends(HTTPBearer())) -> dict:
    try:
        payload = jwt.decode(token.credentials, JWT_SECRET,
                             algorithms=[JWT_ALGORITHM])
        return payload
    except PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Define an endpoint to create a new user


@router.post("/users")
def create_user(user: User):
    # Check if the username already exists
    if collection.find_one({"username": user.username}):
        raise HTTPException(status_code=400, detail="Username already taken")
    # Hash the password
    hashed_password = pwd_context.hash(user.password)
    user_dict = user.dict()
    user_dict['password'] = hashed_password
    # Insert the new user
    result = collection.insert_one(user_dict)
    user_dict['_id'] = str(result.inserted_id)
    # Return a success message
    return {"message": "User added successfully"}

# Define an endpoint to authenticate a user


@router.post("/login")
def authenticate_user(login: Login):
    # Find the user in the database
    login_dict = collection.find_one({"username": login.username})
    if not login_dict:
        raise HTTPException(
            status_code=400, detail="Invalid username or password")
    # Check the password
    if not pwd_context.verify(login.password, login_dict['password']):
        raise HTTPException(
            status_code=400, detail="Invalid username or password")
    # Generate a JWT
    access_token = create_access_token(login.username)
    # Return the JWT
    return { access_token}

# Define an endpoint to get the current user's name


@router.get("/me")
def get_current_user(token: dict = Depends(verify_token)):
    return {"username": token['username']}
