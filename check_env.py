#!/usr/bin/env python3
"""
Environment Variable Validation Script
Run this before deploying to ensure all required environment variables are set.

Usage:
    python check_env.py
"""

import os
import sys
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Color codes for terminal output
GREEN = '\033[92m'
RED = '\033[91m'
YELLOW = '\033[93m'
BLUE = '\033[94m'
RESET = '\033[0m'

def check_required_vars():
    """Check required environment variables"""
    required = {
        'CLOUDINARY_CLOUD_NAME': 'Cloudinary cloud name for image uploads',
        'CLOUDINARY_API_KEY': 'Cloudinary API key',
        'CLOUDINARY_API_SECRET': 'Cloudinary API secret',
    }
    
    print(f"\n{BLUE}{'='*60}{RESET}")
    print(f"{BLUE}Checking REQUIRED Environment Variables{RESET}")
    print(f"{BLUE}{'='*60}{RESET}\n")
    
    all_set = True
    for var, description in required.items():
        value = os.getenv(var)
        if value and value != f"your_{var.lower()}":
            print(f"{GREEN}✓{RESET} {var:30} {GREEN}SET{RESET}")
        else:
            print(f"{RED}✗{RESET} {var:30} {RED}NOT SET{RESET} - {description}")
            all_set = False
    
    return all_set

def check_recommended_vars():
    """Check recommended environment variables"""
    recommended = {
        'DATABASE_URL': 'Database connection string (mysql:// or leave empty for SQLite)',
        'VITE_API_URL': 'Frontend API URL',
        'ENVIRONMENT': 'Environment type (production/development)',
        'PORT': 'Server port',
    }
    
    print(f"\n{BLUE}{'='*60}{RESET}")
    print(f"{BLUE}Checking RECOMMENDED Environment Variables{RESET}")
    print(f"{BLUE}{'='*60}{RESET}\n")
    
    for var, description in recommended.items():
        value = os.getenv(var)
        if value:
            # Mask sensitive parts of DATABASE_URL
            display_value = value
            if var == 'DATABASE_URL' and 'mysql' in value:
                # Show only the host part
                try:
                    parts = value.split('@')
                    if len(parts) > 1:
                        display_value = f"mysql://***@{parts[1]}"
                except:
                    display_value = "mysql://***"
            
            print(f"{GREEN}✓{RESET} {var:30} {GREEN}SET{RESET} ({display_value})")
        else:
            print(f"{YELLOW}⚠{RESET} {var:30} {YELLOW}NOT SET{RESET} - {description}")

def check_optional_vars():
    """Check optional environment variables"""
    optional = {
        'UPLOAD_DIR': 'Upload directory (default: server/uploads)',
        'THUMB_DIR': 'Thumbnail directory (default: server/thumbnails)',
        'CLIENT_BUILD_PATH': 'Frontend build path (default: dist)',
    }
    
    print(f"\n{BLUE}{'='*60}{RESET}")
    print(f"{BLUE}Checking OPTIONAL Environment Variables{RESET}")
    print(f"{BLUE}{'='*60}{RESET}\n")
    
    for var, description in optional.items():
        value = os.getenv(var)
        if value:
            print(f"{GREEN}✓{RESET} {var:30} {GREEN}SET{RESET} ({value})")
        else:
            print(f"  {var:30} Using default - {description}")

def check_files():
    """Check required files exist"""
    required_files = {
        'requirements.txt': 'Python dependencies',
        'asgi.py': 'ASGI entry point',
        'Procfile': 'Process configuration',
        'dist/index.html': 'Built frontend (run: npm run build)',
    }
    
    print(f"\n{BLUE}{'='*60}{RESET}")
    print(f"{BLUE}Checking Required Files{RESET}")
    print(f"{BLUE}{'='*60}{RESET}\n")
    
    all_exist = True
    for file, description in required_files.items():
        if os.path.exists(file):
            print(f"{GREEN}✓{RESET} {file:30} {GREEN}EXISTS{RESET}")
        else:
            print(f"{RED}✗{RESET} {file:30} {RED}MISSING{RESET} - {description}")
            all_exist = False
    
    return all_exist

def check_database_connection():
    """Test database connection"""
    print(f"\n{BLUE}{'='*60}{RESET}")
    print(f"{BLUE}Testing Database Connection{RESET}")
    print(f"{BLUE}{'='*60}{RESET}\n")
    
    database_url = os.getenv('DATABASE_URL')
    
    if not database_url:
        print(f"{YELLOW}⚠{RESET} DATABASE_URL not set - will use SQLite (not recommended for production)")
        return True
    
    try:
        if 'mysql' in database_url:
            print(f"{BLUE}ℹ{RESET} MySQL/TiDB database detected")
            # Basic validation
            if '@' in database_url and ':' in database_url:
                print(f"{GREEN}✓{RESET} DATABASE_URL format appears valid")
                return True
            else:
                print(f"{RED}✗{RESET} DATABASE_URL format appears invalid")
                return False
        elif 'sqlite' in database_url:
            print(f"{YELLOW}⚠{RESET} SQLite database - not recommended for production")
            return True
        else:
            print(f"{YELLOW}⚠{RESET} Unknown database type")
            return True
    except Exception as e:
        print(f"{RED}✗{RESET} Error checking database: {e}")
        return False

def main():
    """Main validation function"""
    print(f"\n{BLUE}{'#'*60}{RESET}")
    print(f"{BLUE}# Aakrittii NGO - Environment Validation{RESET}")
    print(f"{BLUE}{'#'*60}{RESET}")
    
    # Check environment variables
    required_ok = check_required_vars()
    check_recommended_vars()
    check_optional_vars()
    
    # Check files
    files_ok = check_files()
    
    # Check database
    db_ok = check_database_connection()
    
    # Final summary
    print(f"\n{BLUE}{'='*60}{RESET}")
    print(f"{BLUE}Validation Summary{RESET}")
    print(f"{BLUE}{'='*60}{RESET}\n")
    
    if required_ok and files_ok and db_ok:
        print(f"{GREEN}✓ All required checks passed!{RESET}")
        print(f"{GREEN}✓ Your application is ready for deployment.{RESET}\n")
        print(f"Next steps:")
        print(f"  1. Review DEPLOYMENT.md for platform-specific instructions")
        print(f"  2. Set environment variables on your hosting platform")
        print(f"  3. Deploy your application")
        print(f"  4. Change default admin password (admin/admin)\n")
        return 0
    else:
        print(f"{RED}✗ Some checks failed.{RESET}\n")
        print(f"Please fix the issues above before deploying.")
        print(f"Refer to ENV_VARIABLES.md for environment variable details.\n")
        return 1

if __name__ == '__main__':
    sys.exit(main())
