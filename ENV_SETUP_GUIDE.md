# 🔐 Environment Variables Quick Reference Card

## Copy-Paste Template for Your Hosting Platform

```bash
# ============================================================================
# REQUIRED - Your app will NOT work without these
# ============================================================================

# Cloudinary (Image Uploads) - Get from: https://cloudinary.com/console
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here

# Database - Get from your database provider (TiDB Cloud, PlanetScale, etc.)
DATABASE_URL=mysql://username:password@host:3306/database_name

# ============================================================================
# RECOMMENDED - Set these for production
# ============================================================================

# Environment Type
ENVIRONMENT=production

# Frontend API URL (set to your actual domain)
VITE_API_URL=https://yourdomain.com

# CORS Allowed Origins (for security, set to your domain)
# Use comma-separated list for multiple domains
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Port (usually auto-set by hosting platform, but can override)
# PORT=8000


# ============================================================================
# OPTIONAL - Only change if needed
# ============================================================================

# File Storage Paths (defaults are usually fine)
# UPLOAD_DIR=server/uploads
# THUMB_DIR=server/thumbnails
# CLIENT_BUILD_PATH=dist

# SQLite Database Path (only for local development)
# SQLITE_DB_PATH=server/database.sqlite
```

---

## Platform-Specific Instructions

### **Railway**
1. Go to your project → Variables tab
2. Click "New Variable"
3. Add each variable one by one
4. Railway will auto-deploy after you save

### **Render**
1. Go to your web service → Environment tab
2. Click "Add Environment Variable"
3. Add each variable
4. Click "Save Changes"

### **Heroku**
```bash
# Using Heroku CLI
heroku config:set CLOUDINARY_CLOUD_NAME="your_value"
heroku config:set CLOUDINARY_API_KEY="your_value"
heroku config:set CLOUDINARY_API_SECRET="your_value"
heroku config:set DATABASE_URL="your_value"
heroku config:set ENVIRONMENT="production"
```

Or use the Heroku Dashboard → Settings → Config Vars

### **PythonAnywhere**
1. Create a `.env` file in your project directory
2. Copy the template above
3. Fill in your actual values
4. Make sure `.env` is NOT committed to Git

### **Vercel**
1. Go to your project → Settings → Environment Variables
2. Add each variable
3. Select "Production" environment
4. Redeploy your project

---

## How to Get Your Credentials

### **Cloudinary**
1. Sign up at https://cloudinary.com (free tier available)
2. Go to Dashboard: https://cloudinary.com/console
3. Copy:
   - Cloud Name
   - API Key
   - API Secret

### **Database (TiDB Cloud - Recommended)**
1. Sign up at https://tidbcloud.com (free tier available)
2. Create a new cluster
3. Get connection string from "Connect" button
4. Format: `mysql://username:password@host:4000/database?ssl=true`

### **Database (PlanetScale - Alternative)**
1. Sign up at https://planetscale.com
2. Create a new database
3. Get connection string from "Connect" button
4. Format: `mysql://username:password@host/database?sslaccept=strict`

---

## Validation

After setting environment variables, you can validate locally:

```bash
# Create a .env file with your values
cp .env.example .env

# Edit .env with your actual credentials
# Then run validation
python check_env.py
```

---

## Security Notes

⚠️ **NEVER** commit your `.env` file to Git!
⚠️ **NEVER** share your API secrets publicly!
⚠️ Use different credentials for development vs production!

---

## Default Admin Credentials

**⚠️ CHANGE THESE IMMEDIATELY AFTER FIRST LOGIN!**

- **Email:** `admin`
- **Password:** `admin`

After logging in, go to the admin panel and change these credentials!
