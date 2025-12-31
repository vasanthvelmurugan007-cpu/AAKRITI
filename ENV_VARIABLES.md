# 🔐 Environment Variables Quick Reference

## Required Environment Variables

| Variable | Description | Example | Where to Get |
|----------|-------------|---------|--------------|
| `DATABASE_URL` | Database connection string | `mysql://user:pass@host:3306/db` | Your database provider (TiDB Cloud, PlanetScale, etc.) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account name | `dovnibbl1` | [Cloudinary Console](https://cloudinary.com/console) → Dashboard |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `339475155876655` | [Cloudinary Console](https://cloudinary.com/console) → Dashboard |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `mbIuAjPCLthausKqvBkjAaa9eWw` | [Cloudinary Console](https://cloudinary.com/console) → Dashboard |

## Recommended Environment Variables

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `PORT` | Server port | `8000` | `8000` (usually auto-set by host) |
| `VITE_API_URL` | Frontend API URL | `http://localhost:3000` | `https://yourdomain.com` |
| `ENVIRONMENT` | Environment type | `development` | `production` |

## Optional Environment Variables

| Variable | Description | Default | Notes |
|----------|-------------|---------|-------|
| `UPLOAD_DIR` | Upload directory | `server/uploads` | Only change if host requires specific path |
| `THUMB_DIR` | Thumbnail directory | `server/thumbnails` | Only change if host requires specific path |
| `CLIENT_BUILD_PATH` | Frontend build directory | `dist` | Should point to React build output |

---

## 📝 How to Set Environment Variables

### On Heroku:
```bash
heroku config:set VARIABLE_NAME="value"
```

### On Railway:
```bash
railway variables set VARIABLE_NAME="value"
```

### On Render:
Set in the Render Dashboard → Environment tab

### On PythonAnywhere:
Add to `.env` file or set in WSGI configuration

### Locally (Development):
Create a `.env` file in project root:
```bash
cp .env.example .env
# Edit .env with your actual values
```

---

## ⚠️ Security Notes

1. **Never commit `.env` to Git** - It's already in `.gitignore`
2. **Keep credentials secret** - Don't share in public repositories
3. **Use different credentials** for development vs production
4. **Rotate secrets regularly** - Especially after team member changes
5. **Change default admin password** - Default is `admin/admin`

---

## 🔍 Verification

After setting environment variables, verify they're loaded:

```python
# In Python shell or script
import os
from dotenv import load_dotenv

load_dotenv()

print("DATABASE_URL:", os.getenv("DATABASE_URL", "NOT SET"))
print("CLOUDINARY_CLOUD_NAME:", os.getenv("CLOUDINARY_CLOUD_NAME", "NOT SET"))
```

---

## 📚 Related Documentation

- [Full Deployment Guide](./DEPLOYMENT.md)
- [Environment Variables Template](./.env.example)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [TiDB Cloud Documentation](https://docs.pingcap.com/tidbcloud/)
