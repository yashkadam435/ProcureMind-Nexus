# 🚀 ProcureMind Nexus — Deployment Guide

This guide covers deploying ProcureMind Nexus to **Vercel** (backend + frontend) for a production-ready demo.

---

## Architecture Overview

ProcureMind Nexus is a **Python FastAPI backend** that serves the frontend as static files. Vercel supports Python serverless functions, so we deploy the FastAPI app as a serverless function and the frontend as static assets.

```
Vercel Project
├── /api          → FastAPI serverless function (Python)
├── /frontend     → Static assets (HTML, CSS, JS)
└── vercel.json   → Routing configuration
```

---

## Step 1: Prepare the Project

### 1.1 Create `vercel.json` in the project root

Create this file to configure Vercel routing:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/main.py",
      "use": "@vercel/python",
      "config": {
        "maxLambdaSize": "50mb"
      }
    },
    {
      "src": "frontend/**",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/main.py"
    },
    {
      "src": "/(css|js)/(.*)",
      "dest": "frontend/$1/$2"
    },
    {
      "src": "/",
      "dest": "frontend/index.html"
    },
    {
      "src": "/(.*)",
      "dest": "frontend/$1"
    }
  ]
}
```

### 1.2 Create `backend/requirements.txt` (already exists)

Verify it contains:
```
fastapi>=0.115.0
uvicorn[standard]>=0.32.0
python-multipart>=0.0.12
pydantic>=2.10.0
pydantic-settings>=2.6.0
google-genai>=1.0.0
aiohttp>=3.11.0
python-dotenv>=1.0.0
```

---

## Step 2: Set Up Vercel

### 2.1 Install Vercel CLI

```bash
npm install -g vercel
```

### 2.2 Login to Vercel

```bash
vercel login
```

### 2.3 Link to the Project

```bash
cd ProcureMind-Nexus
vercel link
```

When prompted:
- **Set up and deploy?** → Yes
- **Which scope?** → Your account
- **Link to existing project?** → No (create new)
- **Project name?** → `procuremind-nexus`
- **In which directory is your code?** → `./`

---

## Step 3: Configure Environment Variables

### 3.1 Via Vercel Dashboard

Go to **https://vercel.com** → Your Project → **Settings** → **Environment Variables**

Add the following:

| Name | Value | Environment |
|---|---|---|
| `GEMINI_API_KEY` | `your-gemini-api-key` | Production, Preview, Development |
| `SPEECHMATICS_API_KEY` | `your-speechmatics-key` | Production, Preview, Development |
| `APP_ENV` | `production` | Production |
| `LOG_LEVEL` | `WARNING` | Production |
| `HUMAN_APPROVAL_THRESHOLD_EUR` | `10000` | All |

### 3.2 Via CLI (alternative)

```bash
vercel env add GEMINI_API_KEY
# Enter your key when prompted

vercel env add SPEECHMATICS_API_KEY
vercel env add APP_ENV production
```

---

## Step 4: Deploy

### 4.1 Preview Deployment

```bash
vercel
```

This creates a preview URL like `https://procuremind-nexus-xxxx.vercel.app`.

### 4.2 Production Deployment

```bash
vercel --prod
```

Your app is now live at `https://procuremind-nexus.vercel.app` 🎉

---

## Step 5: Verify Deployment

### 5.1 Health Check

```bash
curl https://your-deployment-url.vercel.app/api/health
```

Expected response:
```json
{
  "status": "ok",
  "version": "1.0.0",
  "gemini_connected": true,
  "ai_engine": "Neural Core",
  "timestamp": "2026-05-19T12:00:00.000000"
}
```

### 5.2 Frontend

Open `https://your-deployment-url.vercel.app` in your browser. You should see the ProcureMind Nexus dashboard.

### 5.3 Voice Config

```bash
curl https://your-deployment-url.vercel.app/api/voice/config
```

Verify `"mode": "speechmatics"` if the API key is configured.

---

## Alternative: Docker Deployment

If you prefer Docker (e.g., on a VPS like Vultr, AWS EC2, or DigitalOcean):

### Using Docker Compose

```bash
# Clone the repo
git clone https://github.com/yashkadam435/ProcureMind-Nexus.git
cd ProcureMind-Nexus

# Create .env file
cp .env.example .env
nano .env  # Add your API keys

# Build and run
docker-compose up --build -d
```

The app will be available at `http://your-server-ip:8000`.

### Using Docker directly

```bash
cd backend
docker build -t procuremind-nexus .
docker run -d \
  -p 8000:8000 \
  -e GEMINI_API_KEY=your-key \
  -e SPEECHMATICS_API_KEY=your-key \
  --name procuremind \
  procuremind-nexus
```

---

## Alternative: Local Development

```bash
# Clone
git clone https://github.com/yashkadam435/ProcureMind-Nexus.git
cd ProcureMind-Nexus

# Environment
cp .env.example .env
# Edit .env with your GEMINI_API_KEY

# Install & Run
cd backend
pip install -r requirements.txt
python main.py

# Open http://localhost:8000
```

---

## Troubleshooting

### "Gemini connected: false"
- Verify `GEMINI_API_KEY` is set in Vercel environment variables
- Check that the key is valid at https://aistudio.google.com/apikey

### Speechmatics shows "Browser Fallback"
- Verify `SPEECHMATICS_API_KEY` is set
- The app gracefully falls back to Web Speech API — this is expected behavior

### Database errors on Vercel
- Vercel serverless functions use `/tmp` for writable storage
- SQLite database is recreated on cold starts with seed data
- For persistent data, consider upgrading to PostgreSQL (Vercel Postgres)

### Build fails on Vercel
- Ensure `backend/requirements.txt` has no conflicting versions
- Check Vercel build logs at Dashboard → Deployments → View Logs

### Static files not loading
- Verify `vercel.json` routing rules are correct
- Check that `frontend/` directory exists with `index.html`

---

## Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project → **Settings** → **Domains**
2. Add your custom domain (e.g., `procuremind.yourdomain.com`)
3. Update DNS records as instructed by Vercel
4. SSL is automatically provisioned

---

## Performance Notes

- **Cold starts**: First request after inactivity may take 2-3 seconds (Vercel serverless)
- **SQLite on Vercel**: Works for demos; for production use Vercel Postgres or PlanetScale
- **Gemini API**: Responses typically take 1-3 seconds depending on model (Flash vs Pro)
- **Voice streaming**: Requires HTTPS (Vercel provides this automatically)

---

## Environment Summary

| Setting | Development | Production (Vercel) |
|---|---|---|
| `APP_ENV` | `development` | `production` |
| `LOG_LEVEL` | `INFO` | `WARNING` |
| Database | Local `procuremind.db` | `/tmp/procuremind.db` (ephemeral) |
| Voice | Speechmatics or Browser | Speechmatics (recommended) |
| Payments | Simulation mode | Live (with x402 key) |
