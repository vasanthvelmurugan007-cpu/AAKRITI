import os
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List, Optional
import cloudinary
import cloudinary.uploader
from dotenv import load_dotenv
import sys
import asyncio
from PIL import Image
import io

# Helper to optimize images before upload (Fixes Cloudinary 10MB limit)
async def process_image(file: UploadFile) -> io.BytesIO:
    contents = await file.read()
    
    # Check size - if small enough (e.g. < 5MB), just return original
    if len(contents) < 5 * 1024 * 1024:
        return io.BytesIO(contents)
        
    try:
        img = Image.open(io.BytesIO(contents))
        
        # Convert RGBA to RGB if needed (for proper JPEG saving)
        if img.mode in ("RGBA", "P"):
            img = img.convert("RGB")
            
        # Resize if dimensions are massive (max 1920px width)
        max_width = 1920
        if img.width > max_width:
            ratio = max_width / img.width
            new_height = int(img.height * ratio)
            img = img.resize((max_width, new_height), Image.Resampling.LANCZOS)
            
        # Save to buffer with compression
        output = io.BytesIO()
        img.save(output, format="JPEG", quality=85, optimize=True)
        output.seek(0)
        return output
    except Exception as e:
        print(f"Image processing failed: {e}")
        # If processing fails (e.g. not an image), try returning original
        return io.BytesIO(contents)

if sys.platform == "win32":
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())

from .database import engine, Base, get_db
from . import models, schemas

load_dotenv()

app = FastAPI(title="Aakrittii API")

# CORS setup
# In production, set ALLOWED_ORIGINS to your domain (e.g., "https://yourdomain.com,https://www.yourdomain.com")
allowed_origins = os.getenv("ALLOWED_ORIGINS", "*")
if allowed_origins == "*":
    origins_list = ["*"]
else:
    origins_list = [origin.strip() for origin in allowed_origins.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Cloudinary Config
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

# Setup Local Storage folders (for thumbnails/fallback)
UPLOAD_DIR = os.getenv("UPLOAD_DIR", "server/uploads")
THUMB_DIR = os.getenv("THUMB_DIR", "server/thumbnails")
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(THUMB_DIR, exist_ok=True)

# Static files
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

@app.on_event("startup")
async def startup():
    # Create tables if they don't exist
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    # Seed default pillars and admin if needed
    async with AsyncSession(engine) as session:
        # Check pillars
        result = await session.execute(select(func.count()).select_from(models.Pillar))
        count = result.scalar()
        if count == 0:
            defaults = [
                models.Pillar(title="Education", description="Unlocking potential through foundational learning and life skills.", image_url="/pillar_education.jpg", icon="BookOpen"),
                models.Pillar(title="Support", description="Providing encouragement, capacity-building, and presence for self-reliance.", image_url="/pillar_nutrition.jpg", icon="HandHeart"),
                models.Pillar(title="Hope", description="Planting seeds of transformation through acts of kindness.", image_url="/pillar_livelihood.jpg", icon="Sun"),
                models.Pillar(title="Love", description="Driven by compassion, respect, and empathy.", image_url="/pillar_love.jpg", icon="Heart")
            ]
            session.add_all(defaults)
            print("Seeded Default Pillars")
        
        # Check admin
        result = await session.execute(select(models.AdminUser).where(models.AdminUser.email == "admin"))
        user = result.scalar_one_or_none()
        if not user:
            admin = models.AdminUser(email="admin", password_hash="Aakritii@2025", role="admin")
            session.add(admin)
            print("Default Admin User Created (admin/Aakritii@2025)")
            
        await session.commit()


# --- Auth ---
@app.post("/api/auth/login", response_model=dict)
async def login(request: schemas.LoginRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(models.AdminUser).where(
            models.AdminUser.email == request.email,
            models.AdminUser.password_hash == request.password
        )
    )
    user = result.scalar_one_or_none()
    if user:
        return {"user": {"email": user.email, "id": user.id, "role": user.role}}
    raise HTTPException(status_code=401, detail="Invalid Credentials")

# --- Gallery ---
@app.get("/api/folders", response_model=List[schemas.GalleryFolder])
async def get_folders(db: AsyncSession = Depends(get_db)):
    # Original SQL: SELECT f.*, (SELECT image_url FROM gallery_images WHERE folder_id = f.id ORDER BY created_at ASC LIMIT 1) as cover_image FROM gallery_folders f ORDER BY f.created_at DESC
    # We'll use a slightly different approach for the cover image in ORM if needed, 
    # or just execute a raw query or subquery.
    
    result = await db.execute(select(models.GalleryFolder).order_by(models.GalleryFolder.created_at.desc()))
    folders = result.scalars().all()
    
    # Enrich with cover image
    response = []
    for f in folders:
        img_result = await db.execute(
            select(models.GalleryImage.image_url)
            .where(models.GalleryImage.folder_id == f.id)
            .order_by(models.GalleryImage.created_at.asc())
            .limit(1)
        )
        cover_image = img_result.scalar_one_or_none()
        
        folder_data = schemas.GalleryFolder.model_validate(f)
        folder_data.cover_image = cover_image
        response.append(folder_data)
        
    return response

@app.post("/api/folders", response_model=schemas.GalleryFolder)
async def create_folder(folder: schemas.GalleryFolderCreate, db: AsyncSession = Depends(get_db)):
    new_folder = models.GalleryFolder(**folder.model_dump())
    db.add(new_folder)
    await db.commit()
    await db.refresh(new_folder)
    return new_folder

@app.delete("/api/folders/{folder_id}")
async def delete_folder(folder_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.GalleryFolder).where(models.GalleryFolder.id == folder_id))
    folder = result.scalar_one_or_none()
    if not folder:
        raise HTTPException(status_code=404, detail="Folder not found")
    await db.delete(folder)
    await db.commit()
    return {"message": "Deleted"}

@app.get("/api/images", response_model=List[schemas.GalleryImage])
async def get_images(folderId: Optional[int] = None, db: AsyncSession = Depends(get_db)):
    query = select(models.GalleryImage).order_by(models.GalleryImage.created_at.desc())
    if folderId:
        query = query.where(models.GalleryImage.folder_id == folderId)
    result = await db.execute(query)
    return result.scalars().all()

@app.post("/api/images", response_model=schemas.GalleryImage)
async def upload_image(
    folderId: int = Form(...),
    description: str = Form(None),
    image: UploadFile = File(...),
    db: AsyncSession = Depends(get_db)
):
    try:
        # Upload to Cloudinary
        processed_file = await process_image(image)
        upload_result = cloudinary.uploader.upload(
            processed_file,
            folder="aakrittii_uploads"
        )
        url = upload_result.get("secure_url")
        
        new_image = models.GalleryImage(
            folder_id=folderId,
            image_url=url,
            description=description
        )
        db.add(new_image)
        await db.commit()
        await db.refresh(new_image)
        return new_image
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/images/{image_id}")
async def delete_image(image_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.GalleryImage).where(models.GalleryImage.id == image_id))
    image = result.scalar_one_or_none()
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")
    await db.delete(image)
    await db.commit()
    return {"message": "Deleted"}

# --- Pillars ---
@app.get("/api/pillars", response_model=List[schemas.Pillar])
async def get_pillars(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.Pillar))
    return result.scalars().all()

@app.post("/api/pillars", response_model=schemas.Pillar)
async def create_pillar(
    title: str = Form(...),
    description: str = Form(...),
    icon: str = Form(...),
    image_url: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: AsyncSession = Depends(get_db)
):
    url = image_url or ""
    if image:
        processed_file = await process_image(image)
        upload_result = cloudinary.uploader.upload(processed_file, folder="aakrittii_uploads")
        url = upload_result.get("secure_url")
    
    new_pillar = models.Pillar(title=title, description=description, icon=icon, image_url=url)
    db.add(new_pillar)
    await db.commit()
    await db.refresh(new_pillar)
    return new_pillar

@app.put("/api/pillars/{pillar_id}")
async def update_pillar(
    pillar_id: int,
    title: str = Form(...),
    description: str = Form(...),
    icon: str = Form(...),
    image: Optional[UploadFile] = File(None),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(models.Pillar).where(models.Pillar.id == pillar_id))
    pillar = result.scalar_one_or_none()
    if not pillar:
        raise HTTPException(status_code=404, detail="Pillar not found")
    
    pillar.title = title
    pillar.description = description
    pillar.icon = icon
    if image:
        processed_file = await process_image(image)
        upload_result = cloudinary.uploader.upload(processed_file, folder="aakrittii_uploads")
        pillar.image_url = upload_result.get("secure_url")
        
    await db.commit()
    return {"message": "Updated"}

@app.delete("/api/pillars/{pillar_id}")
async def delete_pillar(pillar_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.Pillar).where(models.Pillar.id == pillar_id))
    pillar = result.scalar_one_or_none()
    if not pillar:
        raise HTTPException(status_code=404, detail="Pillar not found")
    await db.delete(pillar)
    await db.commit()
    return {"message": "Deleted"}

# --- Press Releases ---
@app.get("/api/press-releases", response_model=List[schemas.PressRelease])
async def get_press_releases(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.PressRelease).order_by(models.PressRelease.date.desc()))
    return result.scalars().all()

@app.post("/api/press-releases", response_model=schemas.PressRelease)
async def create_press_release(
    title: str = Form(...),
    date: str = Form(...),
    content: str = Form(...),
    image: Optional[UploadFile] = File(None),
    db: AsyncSession = Depends(get_db)
):
    url = ""
    if image:
        processed_file = await process_image(image)
        upload_result = cloudinary.uploader.upload(processed_file, folder="aakrittii_uploads")
        url = upload_result.get("secure_url")
    
    new_pr = models.PressRelease(title=title, date=date, content=content, image_url=url)
    db.add(new_pr)
    await db.commit()
    await db.refresh(new_pr)
    return new_pr

@app.put("/api/press-releases/{pr_id}")
async def update_press_release(
    pr_id: int,
    title: str = Form(...),
    date: str = Form(...),
    content: str = Form(...),
    image: Optional[UploadFile] = File(None),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(models.PressRelease).where(models.PressRelease.id == pr_id))
    pr = result.scalar_one_or_none()
    if not pr:
        raise HTTPException(status_code=404, detail="Press Release not found")
    
    pr.title = title
    pr.date = date
    pr.content = content
    if image:
        processed_file = await process_image(image)
        upload_result = cloudinary.uploader.upload(processed_file, folder="aakrittii_uploads")
        pr.image_url = upload_result.get("secure_url")
        
    await db.commit()
    return {"message": "Updated"}

@app.delete("/api/press-releases/{pr_id}")
async def delete_press_release(pr_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.PressRelease).where(models.PressRelease.id == pr_id))
    pr = result.scalar_one_or_none()
    if not pr:
        raise HTTPException(status_code=404, detail="Press Release not found")
    await db.delete(pr)
    await db.commit()
    return {"message": "Deleted"}

# --- Clientele ---
@app.get("/api/clientele", response_model=List[schemas.Clientele])
async def get_clientele(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.Clientele))
    return result.scalars().all()

@app.post("/api/clientele", response_model=schemas.Clientele)
async def create_clientele(
    name: str = Form(...),
    description: Optional[str] = Form(None),
    logo: Optional[UploadFile] = File(None),
    db: AsyncSession = Depends(get_db)
):
    url = ""
    if logo:
        processed_file = await process_image(logo)
        upload_result = cloudinary.uploader.upload(processed_file, folder="aakrittii_uploads")
        url = upload_result.get("secure_url")
    
    new_client = models.Clientele(name=name, description=description, logo_url=url)
    db.add(new_client)
    await db.commit()
    await db.refresh(new_client)
    return new_client

@app.put("/api/clientele/{client_id}")
async def update_clientele(
    client_id: int,
    name: str = Form(...),
    description: Optional[str] = Form(None),
    logo: Optional[UploadFile] = File(None),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(models.Clientele).where(models.Clientele.id == client_id))
    client = result.scalar_one_or_none()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    
    client.name = name
    client.description = description
    if logo:
        processed_file = await process_image(logo)
        upload_result = cloudinary.uploader.upload(processed_file, folder="aakrittii_uploads")
        client.logo_url = upload_result.get("secure_url")
        
    await db.commit()
    return {"message": "Updated"}

@app.delete("/api/clientele/{client_id}")
async def delete_clientele(client_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.Clientele).where(models.Clientele.id == client_id))
    client = result.scalar_one_or_none()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    await db.delete(client)
    await db.commit()
    return {"message": "Deleted"}

# --- Activities ---
@app.get("/api/activities", response_model=List[schemas.Activity])
async def get_activities(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.Activity).order_by(models.Activity.date.desc()))
    return result.scalars().all()

@app.post("/api/activities", response_model=schemas.Activity)
async def create_activity(
    title: str = Form(...),
    date: str = Form(...),
    location: str = Form(...),
    description: str = Form(...),
    image: Optional[UploadFile] = File(None),
    db: AsyncSession = Depends(get_db)
):
    url = ""
    if image:
        processed_file = await process_image(image)
        upload_result = cloudinary.uploader.upload(processed_file, folder="aakrittii_uploads")
        url = upload_result.get("secure_url")
    
    new_activity = models.Activity(title=title, date=date, location=location, description=description, image_url=url)
    db.add(new_activity)
    await db.commit()
    await db.refresh(new_activity)
    return new_activity

@app.put("/api/activities/{activity_id}")
async def update_activity(
    activity_id: int,
    title: str = Form(...),
    date: str = Form(...),
    location: str = Form(...),
    description: str = Form(...),
    image: Optional[UploadFile] = File(None),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(models.Activity).where(models.Activity.id == activity_id))
    activity = result.scalar_one_or_none()
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")
    
    activity.title = title
    activity.date = date
    activity.location = location
    activity.description = description
    if image:
        processed_file = await process_image(image)
        upload_result = cloudinary.uploader.upload(processed_file, folder="aakrittii_uploads")
        activity.image_url = upload_result.get("secure_url")
        
    await db.commit()
    return {"message": "Updated"}

@app.delete("/api/activities/{activity_id}")
async def delete_activity(activity_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.Activity).where(models.Activity.id == activity_id))
    activity = result.scalar_one_or_none()
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")
    await db.delete(activity)
    await db.commit()
    return {"message": "Deleted"}

# --- CSR Connect ---
@app.get("/api/csr-connects", response_model=List[schemas.CSRConnect])
async def get_csr_connects(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.CSRConnect))
    return result.scalars().all()

@app.post("/api/csr-connects", response_model=schemas.CSRConnect)
async def create_csr_connect(
    company_name: str = Form(...),
    description: str = Form(...),
    website_url: Optional[str] = Form(None),
    logo: Optional[UploadFile] = File(None),
    db: AsyncSession = Depends(get_db)
):
    url = ""
    if logo:
        processed_file = await process_image(logo)
        upload_result = cloudinary.uploader.upload(processed_file, folder="aakrittii_uploads")
        url = upload_result.get("secure_url")
    
    new_csr = models.CSRConnect(company_name=company_name, description=description, website_url=website_url, logo_url=url)
    db.add(new_csr)
    await db.commit()
    await db.refresh(new_csr)
    return new_csr

@app.put("/api/csr-connects/{csr_id}")
async def update_csr_connect(
    csr_id: int,
    company_name: str = Form(...),
    description: str = Form(...),
    website_url: Optional[str] = Form(None),
    logo: Optional[UploadFile] = File(None),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(models.CSRConnect).where(models.CSRConnect.id == csr_id))
    csr = result.scalar_one_or_none()
    if not csr:
        raise HTTPException(status_code=404, detail="CSR Connect not found")
    
    csr.company_name = company_name
    csr.description = description
    csr.website_url = website_url
    if logo:
        processed_file = await process_image(logo)
        upload_result = cloudinary.uploader.upload(processed_file, folder="aakrittii_uploads")
        csr.logo_url = upload_result.get("secure_url")
        
    await db.commit()
    return {"message": "Updated"}

@app.delete("/api/csr-connects/{csr_id}")
async def delete_csr_connect(csr_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.CSRConnect).where(models.CSRConnect.id == csr_id))
    csr = result.scalar_one_or_none()
    if not csr:
        raise HTTPException(status_code=404, detail="CSR Connect not found")
    await db.delete(csr)
    await db.commit()
    return {"message": "Deleted"}

# --- Volunteers ---
@app.get("/api/volunteers", response_model=List[schemas.Volunteer])
async def get_volunteers(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.Volunteer).order_by(models.Volunteer.submitted_at.desc()))
    return result.scalars().all()

@app.post("/api/volunteers")
async def create_volunteer(volunteer: schemas.VolunteerCreate, db: AsyncSession = Depends(get_db)):
    new_v = models.Volunteer(**volunteer.model_dump())
    db.add(new_v)
    await db.commit()
    return {"message": "Application Submitted"}

@app.delete("/api/volunteers/{v_id}")
async def delete_volunteer(v_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(models.Volunteer).where(models.Volunteer.id == v_id))
    v = result.scalar_one_or_none()
    if not v:
        raise HTTPException(status_code=404, detail="Volunteer not found")
    await db.delete(v)
    await db.commit()
    return {"message": "Deleted"}

# Serve Frontend
CLIENT_BUILD_PATH = os.getenv("CLIENT_BUILD_PATH", "dist")
if os.path.exists(CLIENT_BUILD_PATH):
    app.mount("/assets", StaticFiles(directory=os.path.join(CLIENT_BUILD_PATH, "assets")), name="assets")
    
    @app.get("/{rest_of_path:path}")
    async def serve_frontend(rest_of_path: str):
        # If the request is for an API or file that exists, let it through
        # Otherwise, serve index.html
        if rest_of_path.startswith("api/") or rest_of_path.startswith("uploads/"):
            raise HTTPException(status_code=404)
        
        index_file = os.path.join(CLIENT_BUILD_PATH, "index.html")
        if os.path.exists(index_file):
            from fastapi.responses import FileResponse
            return FileResponse(index_file)
        raise HTTPException(status_code=404)
else:
    print(f"Warning: {CLIENT_BUILD_PATH} not found. Frontend will not be served.")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 3000))
    uvicorn.run(app, host="0.0.0.0", port=port)

