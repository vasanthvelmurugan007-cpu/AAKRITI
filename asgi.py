"""
ASGI Entry Point for Production Deployment
This file is used by production ASGI servers like Gunicorn, Uvicorn, or Hypercorn
"""
import os
import sys

# Add the parent directory to the path so we can import the app module
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.main import app

# This is what the ASGI server will import
# Usage examples:
# - Gunicorn: gunicorn asgi:app -k uvicorn.workers.UvicornWorker
# - Uvicorn: uvicorn asgi:app --host 0.0.0.0 --port 8000
