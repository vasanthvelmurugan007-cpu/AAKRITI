# Deployment Guide for Aakrittii NGO Website

## 📋 Overview
This guide will help you deploy the Aakrittii NGO website to a Python hosting service (e.g., Heroku, Railway, Render, PythonAnywhere, or any ASGI-compatible host).

## 🔧 Pre-Deployment Checklist

### 1. Build the Frontend
Before deploying, you need to build the React frontend:

```bash
npm install
npm run build
```

This creates a `dist` folder with the production-ready frontend.

### 2. Required Files
Ensure these files are present in your project root:
- ✅ `requirements.txt` - Python dependencies
- ✅ `asgi.py` - ASGI entry point for production servers
- ✅ `wsgi.py` - WSGI entry point (fallback)
- ✅ `Procfile` - Process configuration for hosting platforms
- ✅ `.env.example` - Environment variable template

## 🌍 Environment Variables to Set on Your Host

### **REQUIRED** Environment Variables

#### 1. **Database Configuration**
```bash
DATABASE_URL=mysql://username:password@host:port/database
```
- **Format**: `mysql://username:password@host:port/database`
- **Example**: `mysql://user:pass@db.example.com:3306/aakrittii`
- **Note**: For TiDB Cloud, use the connection string from your dashboard
- **SQLite Alternative** (Development only): Leave empty to use SQLite

#### 2. **Cloudinary Configuration** (Image Uploads)
```bash
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
- **Get from**: [Cloudinary Console](https://cloudinary.com/console)
- **Required for**: Image uploads in gallery, pillars, press releases, etc.

### **RECOMMENDED** Environment Variables

#### 3. **Server Configuration**
```bash
PORT=8000
VITE_API_URL=https://yourdomain.com
```
- **PORT**: Usually auto-set by hosting provider (Heroku, Railway, etc.)
- **VITE_API_URL**: Your production domain URL

#### 4. **File Storage Paths** (Optional)
```bash
UPLOAD_DIR=server/uploads
THUMB_DIR=server/thumbnails
CLIENT_BUILD_PATH=dist
```
- **Defaults**: These have sensible defaults, only override if needed

#### 5. **Environment Type**
```bash
ENVIRONMENT=production
```

### **OPTIONAL** Environment Variables

#### 6. **Security** (Future Enhancement)
```bash
SECRET_KEY=your-secret-key-here
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

## 🚀 Deployment Instructions

### Option A: Heroku

1. **Install Heroku CLI** and login:
   ```bash
   heroku login
   ```

2. **Create a new Heroku app**:
   ```bash
   heroku create aakrittii-ngo
   ```

3. **Set environment variables**:
   ```bash
   heroku config:set DATABASE_URL="mysql://user:pass@host:3306/db"
   heroku config:set CLOUDINARY_CLOUD_NAME="your_cloud_name"
   heroku config:set CLOUDINARY_API_KEY="your_api_key"
   heroku config:set CLOUDINARY_API_SECRET="your_api_secret"
   heroku config:set VITE_API_URL="https://aakrittii-ngo.herokuapp.com"
   heroku config:set ENVIRONMENT="production"
   ```

4. **Deploy**:
   ```bash
   git push heroku main
   ```

5. **Open your app**:
   ```bash
   heroku open
   ```

### Option B: Railway

1. **Install Railway CLI** and login:
   ```bash
   npm install -g @railway/cli
   railway login
   ```

2. **Initialize project**:
   ```bash
   railway init
   ```

3. **Set environment variables** in Railway dashboard or CLI:
   ```bash
   railway variables set DATABASE_URL="mysql://user:pass@host:3306/db"
   railway variables set CLOUDINARY_CLOUD_NAME="your_cloud_name"
   railway variables set CLOUDINARY_API_KEY="your_api_key"
   railway variables set CLOUDINARY_API_SECRET="your_api_secret"
   ```

4. **Deploy**:
   ```bash
   railway up
   ```

### Option C: Render

1. **Create a new Web Service** on [Render Dashboard](https://dashboard.render.com/)

2. **Connect your GitHub repository**

3. **Configure Build & Start Commands**:
   - **Build Command**: `pip install -r requirements.txt && npm install && npm run build`
   - **Start Command**: `gunicorn asgi:app -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT`

4. **Set Environment Variables** in Render dashboard:
   - `DATABASE_URL`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `VITE_API_URL` (your Render URL)
   - `ENVIRONMENT=production`

5. **Deploy** - Render will auto-deploy on git push

### Option D: PythonAnywhere

1. **Upload your code** to PythonAnywhere

2. **Create a virtual environment**:
   ```bash
   mkvirtualenv --python=/usr/bin/python3.10 aakrittii
   pip install -r requirements.txt
   ```

3. **Configure WSGI file** in Web tab:
   ```python
   import sys
   path = '/home/yourusername/aakrittii'
   if path not in sys.path:
       sys.path.append(path)
   
   from asgi import app as application
   ```

4. **Set environment variables** in WSGI file or using `.env`

5. **Reload web app**

### Option E: Generic ASGI Host

For any hosting provider that supports ASGI:

1. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Build frontend**:
   ```bash
   npm install && npm run build
   ```

3. **Run with Gunicorn**:
   ```bash
   gunicorn asgi:app -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000 --workers 2
   ```

4. **Or run with Uvicorn directly**:
   ```bash
   uvicorn asgi:app --host 0.0.0.0 --port 8000 --workers 2
   ```

## 🔍 Post-Deployment Verification

1. **Check health endpoint**: Visit `https://yourdomain.com/api/pillars`
2. **Test login**: Try logging in with default credentials (admin/admin)
3. **Upload test image**: Verify Cloudinary integration works
4. **Check database**: Ensure data persists across restarts

## 🐛 Troubleshooting

### Issue: "Module not found" errors
**Solution**: Ensure all dependencies are in `requirements.txt` and installed

### Issue: Database connection fails
**Solution**: 
- Verify `DATABASE_URL` format is correct
- Check database host allows external connections
- For TiDB Cloud, ensure SSL settings are correct

### Issue: Images not uploading
**Solution**: 
- Verify Cloudinary credentials are correct
- Check Cloudinary dashboard for quota limits
- Ensure `python-multipart` is installed

### Issue: Frontend not loading
**Solution**: 
- Ensure `npm run build` was executed
- Verify `CLIENT_BUILD_PATH` points to `dist` folder
- Check that `dist` folder exists and contains `index.html`

### Issue: CORS errors
**Solution**: 
- Update CORS settings in `app/main.py` if needed
- Set proper `VITE_API_URL` in environment variables

## 📊 Performance Optimization

1. **Use a production database** (MySQL/PostgreSQL, not SQLite)
2. **Enable database connection pooling** (already configured in SQLAlchemy)
3. **Use CDN for static assets** (Cloudinary handles images)
4. **Set appropriate worker count** (2-4 workers for most cases)
5. **Enable gzip compression** (most hosts enable this by default)

## 🔐 Security Checklist

- [ ] Change default admin password (admin/admin)
- [ ] Use strong database password
- [ ] Keep Cloudinary credentials secret
- [ ] Enable HTTPS on your domain
- [ ] Set `ENVIRONMENT=production`
- [ ] Restrict CORS origins in production
- [ ] Regular database backups
- [ ] Monitor error logs

## 📞 Support

For deployment issues:
1. Check hosting provider's documentation
2. Review application logs
3. Verify all environment variables are set correctly
4. Test locally first with production settings

---

**Last Updated**: 2025-12-30
**Version**: 1.0.0
