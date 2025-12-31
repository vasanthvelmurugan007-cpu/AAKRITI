import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# Determine if we are using MySQL (TiDB Cloud) or SQLite
if DATABASE_URL and "mysql" in DATABASE_URL:
    # Convert mysql:// to mysql+aiomysql:// for async support
    if "mysql+aiomysql://" not in DATABASE_URL:
        DATABASE_URL = DATABASE_URL.replace("mysql://", "mysql+aiomysql://")
    
    # Handle SSL for TiDB Cloud
    connect_args = {}
    if "ssl" in DATABASE_URL:
        # TiDB Cloud works well with a simple ssl=True or an SSLContext
        import ssl
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE  # In production, use real CA
        connect_args["ssl"] = ctx
        
        # Clean URL to avoid issues with query params being passed twice
        if "?" in DATABASE_URL:
            DATABASE_URL = DATABASE_URL.split("?")[0]

    engine = create_async_engine(DATABASE_URL, connect_args=connect_args, echo=True)
else:
    # Default to local SQLite
    DB_PATH = os.path.join(os.path.dirname(__file__), "..", "server", "database.sqlite")
    DATABASE_URL = f"sqlite+aiosqlite:///{DB_PATH}"
    engine = create_async_engine(DATABASE_URL, echo=True)

AsyncSessionLocal = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
