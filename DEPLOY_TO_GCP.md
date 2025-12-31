# Deploy AAKRITTI Backend to Google Cloud Run

This document describes how to build, push, and deploy the backend image to Cloud Run (managed).

Prerequisites
- gcloud CLI installed and authenticated: `gcloud auth login`
- Project selected: `gcloud config set project PROJECT_ID`
- Billing enabled for the project
- APIs enabled: Cloud Run, Cloud Build, Secret Manager (see commands below)

Enable APIs (one-time):
```bash
gcloud services enable run.googleapis.com cloudbuild.googleapis.com secretmanager.googleapis.com
```

Build & push with Cloud Build (recommended):
```bash
gcloud builds submit --tag gcr.io/PROJECT_ID/aakrittii-backend:latest -f Dockerfile.cloudrun .
```

Deploy to Cloud Run:
```bash
gcloud run deploy aakrittii-backend \
  --image gcr.io/PROJECT_ID/aakrittii-backend:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars ENV=production,PORT=8080 \
  --memory 512Mi \
  --concurrency 80 \
  --min-instances 0 \
  --max-instances 5
```

Deploy from source (Cloud Build will build the image for you):
```bash
gcloud run deploy aakrittii-backend --source . --region us-central1 --allow-unauthenticated --platform managed --set-env-vars ENV=production
```

Secrets
- Use Secret Manager for DB passwords, API keys, etc. Example:
```bash
gcloud secrets create DB_PASSWORD --data-file=-  <<< "supersecret"
```
- Then reference secrets at deploy-time or via `--set-secrets`.

Get service URL:
```bash
gcloud run services describe aakrittii-backend --region us-central1 --format 'value(status.url)'
```

Logs:
```bash
gcloud logs read --project PROJECT_ID --service=aakrittii-backend --limit 50
```

Rollbacks
- Re-deploy a previous image tag or update `--image` to a different tag.

Notes
- If you need higher concurrency or more memory, adjust flags above.
- For staged/prod environments, repeat with different service names or different project IDs.
