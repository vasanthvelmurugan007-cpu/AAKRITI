from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# Auth
class LoginRequest(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    email: str
    id: int
    role: str

# Gallery
class GalleryFolderBase(BaseModel):
    name: str
    description: Optional[str] = None

class GalleryFolderCreate(GalleryFolderBase):
    pass

class GalleryFolder(GalleryFolderBase):
    id: int
    created_at: datetime
    cover_image: Optional[str] = None

    model_config = {"from_attributes": True}

class GalleryImageBase(BaseModel):
    folder_id: int
    description: Optional[str] = None

class GalleryImageCreate(GalleryImageBase):
    pass

class GalleryImage(GalleryImageBase):
    id: int
    image_url: str
    created_at: datetime

    model_config = {"from_attributes": True}

# Pillar
class PillarBase(BaseModel):
    title: str
    description: str
    icon: str
    image_url: Optional[str] = None

class PillarCreate(PillarBase):
    pass

class Pillar(PillarBase):
    id: int

    model_config = {"from_attributes": True}

# Press Release
class PressReleaseBase(BaseModel):
    title: str
    date: str
    content: str
    image_url: Optional[str] = None

class PressReleaseCreate(PressReleaseBase):
    pass

class PressRelease(PressReleaseBase):
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}

# Clientele
class ClienteleBase(BaseModel):
    name: str
    description: Optional[str] = None
    logo_url: Optional[str] = None

class ClienteleCreate(ClienteleBase):
    pass

class Clientele(ClienteleBase):
    id: int

    model_config = {"from_attributes": True}

# Activity
class ActivityBase(BaseModel):
    title: str
    date: str
    location: str
    description: str
    image_url: Optional[str] = None

class ActivityCreate(ActivityBase):
    pass

class Activity(ActivityBase):
    id: int

    model_config = {"from_attributes": True}

# CSR Connect
class CSRConnectBase(BaseModel):
    company_name: str
    description: str
    website_url: Optional[str] = None
    logo_url: Optional[str] = None

class CSRConnectCreate(CSRConnectBase):
    pass

class CSRConnect(CSRConnectBase):
    id: int

    model_config = {"from_attributes": True}

# Volunteer
class VolunteerBase(BaseModel):
    name: str
    email: str
    phone: str
    message: str

class VolunteerCreate(VolunteerBase):
    pass

class Volunteer(VolunteerBase):
    id: int
    submitted_at: datetime

    model_config = {"from_attributes": True}
