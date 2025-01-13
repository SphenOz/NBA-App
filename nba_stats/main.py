from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import models as models
from database import engine, SessionLocal
from typing import Annotated
from sqlalchemy.orm import Session
from nbaAPI import *
import asyncio
import jwt
from jwt.exceptions import InvalidTokenError
from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone


async def lifespan(app):
    asyncio.create_task(update_players_team())
    yield
    print("goodnight")


app = FastAPI(lifespan=lifespan)
models.Base.metadata.create_all(bind=engine)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
TOKEN_EXPIRE_HOURS = 24*7
ALGORITHM = "HS256"
KEY_ENCRYPT = "d13a20db290fd63a29752e7c1b1d7e04a43d538ded7507d8013b8aafb66f621d"

# Define allowed origins (use ["*"] to allow all origins, though be careful with this in production)
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserTeam(BaseModel):
    email: str

class UserBase (BaseModel):
    user_name: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None

@app.get("/")
async def root():
    return {"message": "Hello World"}

async def update_players_team():
    while True:
        print("UPDATING")
        
        await asyncio.gather(
            update_game_boxscore(),
            updateJsongames()
        )
        await asyncio.sleep(10)
        await asyncio.gather(updateJsonplayers(), updateJsonCareerAvg())
        await asyncio.sleep(10)
        await asyncio.gather(updateJsonteam())
        print("FINISHED ALL")
        await asyncio.sleep(60*20)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
db_dependency = Annotated[Session, Depends(get_db)]

def get_user(username: str, db: db_dependency):
    user = db.query(models.Users).filter(models.Users.user_name == username).first()
    return user

def verify_passwrd(password, hashed_pwd):
    return pwd_context.verify(password, hashed_pwd)

def auth_user(db: db_dependency, username: str, password: str):
    user = get_user(db=db, username=username)
    if not user:
        return False
    if not verify_passwrd(password=password, hashed_pwd=user.password):
        return False
    return user

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=120)
    to_encode.update({"exp": expire})
    encode_jwt = jwt.encode(to_encode, KEY_ENCRYPT, algorithm=ALGORITHM)
    return encode_jwt


#Checks if Username is taken, if not Creates an Entry in Database given the username and the hashed password
@app.post("/api/signup")
async def signup(user: UserBase, db: db_dependency):
    print("method: POST, route: /api/signup, nba_api method: signup")
    print(
        "user_name: ", user.user_name, "\n",
        "password: ", user.password
    )
    exist_user = db.query(models.Users).filter(models.Users.user_name == user.user_name).first()
    if exist_user:
        raise HTTPException(status_code=400, detail="Username already exists")

    hashpwd = pwd_context.hash(user.password)
    db_user = models.Users(user_name=user.user_name, password=hashpwd)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return {"user_name: ": db_user.user_name}

#This will return a session token that expires within an hour
@app.post("/api/login")
async def login(user: UserBase, db: db_dependency) -> Token:
    a_user = auth_user(db=db, username=user.user_name, password=user.password) #Authenticate the existance of the user by checking, for username entry & correct password
    if not a_user:
        raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid authentication credentials",
        headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(hours=TOKEN_EXPIRE_HOURS)
    access_token = create_access_token(
        data={"sub": a_user.user_name}, expires_delta=access_token_expires
    )
    print(access_token)
    return Token(access_token=access_token, token_type="bearer")

async def get_current_user(db: db_dependency, token: Annotated[str, Depends(oauth2_scheme)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid authentication credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload =  jwt.decode(token, KEY_ENCRYPT, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        print(username)
        if username is None:
            raise credentials_exception
            #do something
        token_data = TokenData(username=username)
    except InvalidTokenError:
        raise credentials_exception
    user = get_user(db=db, username=token_data.username)
    if user is None:
        raise credentials_exception
    return user

@app.get("/api/stats")
def get_player(playername: str = "lebron james", season: int = -1):
    print('method: GET, route: /api/stats, nba_api method: search_player', playername)
    print(playername)
    try:
        return search_player(playername)
    except:
        raise IndexError

@app.get("/api/career")
def get_career(playername: str):
    print('method: GET, route: /api/career, nba_api method: search_player', playername)
    try:
        return search_career(playername)
    except:
        raise IndexError
    
@app.put("/api/set_team")
def set_team(db: db_dependency, team: str, user: Annotated[str, Depends(get_current_user)]):
    user.team = team
    db.commit()
    db.refresh(user)
    return user.team

@app.get("/api/get_team")
def get_team(db: db_dependency, user: Annotated[str, Depends(get_current_user)]):
    return user.team

@app.get("/api/playersOfTeam")
def getPlayers(teamToSearch: str, db: db_dependency, user: Annotated[str, Depends(get_current_user)]):
    try:
        listOfPlayers = get_players(teamToSearch)
        return listOfPlayers
    except IndexError:
        raise IndexError("Player Not Found")
    
@app.get("/api/player_names")
def player_names():
    return get_player_names()

@app.get("/api/team_games")
def team_games(db: db_dependency, team: str, user: Annotated[str, Depends(get_current_user)]):
    try:
        return get_team_games(team_input=team)
    except IndexError:
        raise IndexError("Team not Found")

@app.get("/api/boxscore")
def boxscore(db: db_dependency, game_id: str, user: Annotated[str, Depends(get_current_user)]):
    try:
        return get_boxscore(game_id)
    except IndexError:
        raise IndexError("Game not Found")