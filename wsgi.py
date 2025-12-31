"""
WSGI Entry Point for Production Deployment (Alternative to ASGI)
Note: FastAPI is built on ASGI, so ASGI (asgi.py) is preferred.
This WSGI wrapper is provided for compatibility with WSGI-only hosting providers.
"""
import os
import sys

# Add the parent directory to the path so we can import the app module
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.main import app

# For WSGI servers that don't support ASGI natively
# Usage: gunicorn wsgi:application
try:
    from asgiref.wsgi import WsgiToAsgi
    application = WsgiToAsgi(app)
except ImportError:
    # If asgiref is not available, note that ASGI is preferred
    print("Warning: asgiref not installed. Please use ASGI entry point (asgi.py) instead.")
    print("Install with: pip install asgiref")
    application = None
