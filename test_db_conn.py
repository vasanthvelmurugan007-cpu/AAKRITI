import asyncio
import os
import ssl
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
from dotenv import load_dotenv

load_dotenv()

async def test_conn():
    url = os.getenv("DATABASE_URL")
    print(f"Original URL: {url}")
    
    if url and "mysql" in url:
        url = url.replace("mysql://", "mysql+aiomysql://")
        
        connect_args = {}
        if "ssl" in url:
            ctx = ssl.create_default_context()
            ctx.check_hostname = False
            ctx.verify_mode = ssl.CERT_NONE
            connect_args["ssl"] = ctx
            
            # Clean URL
            if "?" in url:
                base, query = url.split("?", 1)
                params = [p for p in query.split("&") if not p.startswith("ssl=")]
                url = base + ("?" + "&".join(params) if params else "")
        
        print(f"Connecting to: {url}")
        engine = create_async_engine(url, connect_args=connect_args, echo=True)
        try:
            async with engine.connect() as conn:
                res = await conn.execute(text("SELECT 1"))
                print(f"Result: {res.scalar()}")
        except Exception as e:
            print(f"Error: {e}")
        finally:
            await engine.dispose()
    else:
        print("No MySQL URL found or already SQLite")

if __name__ == "__main__":
    asyncio.run(test_conn())
