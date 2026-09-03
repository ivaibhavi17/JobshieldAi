# JobShield AI — Enterprise Risk & Scam Protection Platform

**Check Before You Apply.**

JobShield AI is an AI-assisted preliminary risk assessment and domain security verification platform for job seekers, students, freshers, and university placement cells. It identifies deceptive job postings, upfront fee traps, domain spoofing, and recruiter identity risks.

---

## 🚀 Key Features

- **FastAPI & SQLite Backend**: RESTful API backend with SQLite database persistence for assessment reports and user accounts.
- **Machine Learning Risk Engine**: Hybrid classifier combining Scikit-Learn TF-IDF + Logistic Regression with 5 warning indicator regex detectors (`FINANCIAL_REQUEST`, `UNREALISTIC_CLAIM`, `URGENCY`, `SENSITIVE_INFORMATION`, `SUSPICIOUS_COMMUNICATION`).
- **Groq LLM Integration**: Enriches job risk evaluations with Groq LLM explanations and personalized advice.
- **Recruiter Email & Domain Authenticator**: Real-time domain verification detecting domain spoofing (e.g. `google-careers-india.com` vs `google.com`), typosquatting, free webmail addresses (`@gmail.com`), and DNS MX mail server status.
- **Verification Audit Certificates**: Downloadable cryptographically hashed audit certificates (`SHA-256`) for students and career offices.
- **Document & Image Text Extractor**: Extract text from PDF documents, plain text files, and scanned image notices via OCR.
- **User Auth & API Key Portal**: User sign up, login, JWT token auth, and developer API key management.
- **Interactive React Frontend**: Responsive dashboard with Recharts visualizations, history table with previews, model evaluation stats, and single-click exports.
- **Vercel Deployment**: Configured for automated serverless builds.

---

## 📦 One-Command Production Launch

To run the unified application (FastAPI backend + React frontend) on `http://localhost:8000`:

```bash
python start_production.py
```

---

## 🐳 Docker Deployment

```bash
docker build -t jobshield-ai .
docker run -d -p 8000:8000 jobshield-ai
```

---

## 💻 Local Development Setup

### Backend (Python FastAPI)
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```

### Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```

---

## 🧪 Running Unit Tests & Verification

### Backend Tests
```bash
python -m pytest backend/tests
```

### Frontend Tests & Linting
```bash
cd frontend
npm run test
npm run lint
npm run build
```

---

## 📄 License & Responsible Use

Always independently verify an employer before making payments or sharing sensitive personal information.
