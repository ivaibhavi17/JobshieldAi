# JobShield AI - Deployment Guide

This guide details how to deploy **JobShield AI** in production using local executable scripts, Docker containers, or cloud platform providers (Render, Railway, AWS, Heroku, etc.).

---

## Option 1: One-Command Local Production Deployment

You can run both the frontend UI and the FastAPI backend service together as a single unified service:

```bash
# From the project root directory
python start_production.py
```

Open `http://localhost:8000` in your web browser. The backend FastAPI server automatically serves the React production UI and processes API endpoints under `/api/*`.

---

## Option 2: Docker Container Deployment

JobShield AI includes a multi-stage `Dockerfile` that builds the React frontend assets and runs the Python FastAPI service in a single container.

### 1. Build the Docker image:
```bash
docker build -t jobshield-ai .
```

### 2. Run the container:
```bash
docker run -d -p 8000:8000 --name jobshield-app jobshield-ai
```

Access the application at `http://localhost:8000`.

---

## Option 3: Deploy to Render / Railway / Cloud Services

### Render.com Deployment:
1. Connect your GitHub repository to Render.
2. Create a new **Web Service**.
3. Set Environment runtime to **Docker** (Render will use the included `Dockerfile` automatically).
4. Set Port to `8000`.
5. Click **Deploy Web Service**.

### Railway Deployment:
1. Create a new project on Railway.
2. Connect your repository. Railway automatically detects `Dockerfile`.
3. Set `PORT=8000`.
4. Deploy!

---

## Verification & Health Check

- **Health Endpoint**: `http://localhost:8000/api/health`
- **Swagger API Docs**: `http://localhost:8000/docs`
- **Web UI Application**: `http://localhost:8000/`
