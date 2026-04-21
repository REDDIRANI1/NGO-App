# Deployment Guide (Render + Vercel)

## 1) Deploy Backend + Postgres on Render

1. Push this repository to GitHub.
2. In Render, click **New +** -> **Blueprint**.
3. Select this repo and deploy using `render.yaml`.
4. Wait for both services to finish:
   - `ngo-app-db` (Postgres)
   - `ngo-app-backend` (Web service)
5. Open backend health URL:
   - `https://<your-render-backend>/health`
   - Expected: `{"status":"healthy"}`

Notes:
- The app auto-normalizes Render database URLs to the async SQLAlchemy format.
- No manual `DATABASE_URL` editing is required if deployed via `render.yaml`.

## 2) Deploy Frontend on Vercel

1. In Vercel, click **Add New Project** and import this repo.
2. Set **Root Directory** to `frontend`.
3. Add environment variable:
   - `NEXT_PUBLIC_API_URL=https://<your-render-backend>`
4. Deploy.

## 3) Verify End-to-End

1. Open frontend URL from Vercel.
2. Submit a single report from `/submit`.
3. Upload a valid CSV from `/upload`.
4. Open `/dashboard` and confirm aggregated metrics load.

## CSV Format

Use this exact header and month format:

```csv
ngo_id,region,month,people_helped,events_conducted,funds_utilized
NGO-001,North,2026-03,150,5,25000.00
```
