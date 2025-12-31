# 🚀 Free Deployment Guide: 100% Working & Live

This guide uses the **Easiest & Completely Free** stack recommended for your React + Python app.

### 🏗️ The Stack
1.  **Database**: **TiDB Cloud** (Free forever Serverless MySQL).
    *   *Why?* SQLite (local file) gets deleted on free hosting services like Render every time the app sleeps. You need a real cloud database.
2.  **Backend**: **Render** (Free Web Service).
3.  **Frontend**: **Vercel** (Free Static Hosting).

---

### Step 1: Set up the Database (TiDB Cloud)
1.  Go to [TiDB Cloud](https://tidbcloud.com/) and Sign Up (Free).
2.  Create a **Serverless Tier** cluster (Free).
3.  Give it a name (e.g., `aakrittii-db`) and set a root password.
4.  Once created, click **"Connect"**.
5.  Select "SQLAlchemy" or "General" to get the connection string.
6.  **Copy the URL**. It will look like:
    `mysql+pymysql://<user>:<password>@<host>:4000/test`
7.  **IMPORTANT:** Add `?ssl_mode=VERIFY_IDENTITY` (or `?ssl={"ca": "/etc/ssl/cert.pem"}` depending on driver) to the end if needed, but usually for Python `mysql+aiomysql` (which we use), a standard URL works.
    *   *Our code automatically handles the SSL conversion for TiDB!* Just copy the standard `mysql://...` url.

---

### Step 2: Deploy Backend (Render)
1.  Push your code to **GitHub**.
2.  Go to [Render.com](https://render.com/) and Sign Up.
3.  Click **New +** -> **Web Service**.
4.  Connect your GitHub repository.
5.  **Settings**:
    *   **Runtime**: Python 3
    *   **Build Command**: `pip install -r requirements.txt`
    *   **Start Command**: `gunicorn asgi:app -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT`
6.  **Environment Variables** (Scroll down to "Advanced"):
    Add these keys and values:
    *   `DATABASE_URL` -> (Paste your TiDB URL from Step 1)
        *   *Format*: `mysql://...`
    *   `CLOUDINARY_CLOUD_NAME` -> (Your Cloudinary Name)
    *   `CLOUDINARY_API_KEY` -> (Your Key)
    *   `CLOUDINARY_API_SECRET` -> (Your Secret)
    *   `ALLOWED_ORIGINS` -> `*` (Or your Vercel URL later)
    *   `PYTHON_VERSION` -> `3.11.5`
7.  Click **Create Web Service**.
8.  **Wait** for it to deploy. Once "Live", copy the **backend URL** (e.g., `https://aakrittii-api.onrender.com`).

---

### Step 3: Deploy Frontend (Vercel)
1.  Go to [Vercel.com](https://vercel.com/) and Sign Up.
2.  Click **Add New...** -> **Project**.
3.  Import your GitHub repository.
4.  **Build Settings**:
    *   Framework Preset: **Vite** (Should auto-detect).
    *   Build Command: `npm run build`
    *   Output Directory: `dist`
5.  **Environment Variables**:
    *   `VITE_API_URL` -> (Paste your Render Backend URL from Step 2)
        *   *Example*: `https://aakrittii-api.onrender.com` (No trailing slash)
6.  Click **Deploy**.

---

### Step 4: Verify
1.  Open your Vercel URL (e.g., `https://aak-ngo.vercel.app`).
2.  Go to `/login`.
3.  Login with: `admin` / `admin`.
4.  If it works, you are **LIVE**!
