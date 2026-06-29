from datetime import datetime, UTC
from sqlalchemy import Column, DateTime, Integer, String
from app.core.database import Base

class User(Base):
    __tablename__="users"
    id = Column(Integer,primary_key=True,index=True)
    username = Column(String,unique=True,nullable=False)
    email = Column(String,unique=True,nullable=False)
    password_hash = Column(String, nullable= False)
    created_at = Column(DateTime,default=lambda:datetime.now(UTC))
