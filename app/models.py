from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from .database import Base

class AdminUser(Base):
    __tablename__ = "admin_users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True)
    password_hash = Column(String(255))
    role = Column(String(50), default="volunteer")

class GalleryFolder(Base):
    __tablename__ = "gallery_folders"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255))
    description = Column(Text)
    created_at = Column(DateTime, server_default=func.now())

class GalleryImage(Base):
    __tablename__ = "gallery_images"
    id = Column(Integer, primary_key=True, index=True)
    folder_id = Column(Integer, ForeignKey("gallery_folders.id", ondelete="CASCADE"))
    image_url = Column(Text)
    description = Column(Text)
    created_at = Column(DateTime, server_default=func.now())

class PressRelease(Base):
    __tablename__ = "press_releases"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255))
    date = Column(String(50))
    content = Column(Text)
    image_url = Column(Text)
    created_at = Column(DateTime, server_default=func.now())

class Clientele(Base):
    __tablename__ = "clientele"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255))
    description = Column(Text)
    logo_url = Column(Text)

class Activity(Base):
    __tablename__ = "activities"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255))
    date = Column(String(50))
    location = Column(String(255))
    description = Column(Text)
    image_url = Column(Text)

class CSRConnect(Base):
    __tablename__ = "csr_connects"
    id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String(255))
    description = Column(Text)
    logo_url = Column(Text)
    website_url = Column(Text)

class Volunteer(Base):
    __tablename__ = "volunteers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255))
    email = Column(String(255))
    phone = Column(String(50))
    message = Column(Text)
    submitted_at = Column(DateTime, server_default=func.now())

class Pillar(Base):
    __tablename__ = "pillars"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255))
    description = Column(Text)
    image_url = Column(Text)
    icon = Column(String(50))
