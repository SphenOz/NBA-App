from sqlalchemy import Boolean, Column, Integer, String
from database import Base

class Users(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    user_name = Column(String, unique=True, index=True)
    password = Column(String, index=True)
    team = Column(String, index=True)