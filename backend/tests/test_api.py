import io
import pytest
from fastapi.testclient import TestClient

from app.database import init_db
from app.main import app

init_db()

client = TestClient(app)


def test_root_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert data["version"] == "2.0.0"


def test_domain_verification_spoofed():
    payload = {
        "emailOrDomain": "recruiter@google-careers-india.com",
        "companyWebsite": "https://google.com"
    }
    response = client.post("/api/verify-domain", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["isSpoofed"] is True
    assert data["riskLevel"] == "VERY HIGH"
    assert data["targetBrand"] == "Google"


def test_domain_verification_free_webmail():
    payload = {
        "emailOrDomain": "hr.recruiter2026@gmail.com"
    }
    response = client.post("/api/verify-domain", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["isFreeWebmail"] is True
    assert data["riskLevel"] == "MODERATE"


def test_auth_signup_login():
    signup_payload = {
        "email": "testuser2026@example.com",
        "password": "securepassword123",
        "fullName": "Test User"
    }
    signup_res = client.post("/api/auth/signup", json=signup_payload)
    assert signup_res.status_code in [200, 400]  # 400 if already created in previous run
    
    login_payload = {
        "email": "testuser2026@example.com",
        "password": "securepassword123"
    }
    login_res = client.post("/api/auth/login", json=login_payload)
    assert login_res.status_code == 200
    auth_data = login_res.json()
    assert "accessToken" in auth_data
    assert auth_data["user"]["email"] == "testuser2026@example.com"

    # Test GET /api/auth/me
    token = auth_data["accessToken"]
    headers = {"Authorization": f"Bearer {token}"}
    me_res = client.get("/api/auth/me", headers=headers)
    assert me_res.status_code == 200
    assert me_res.json()["fullName"] == "Test User"


def test_audit_certificate_generation():
    payload = {
        "jobTitle": "Lead Security Engineer",
        "companyName": "CyberCorp",
        "sourceType": "paste",
        "text": "CyberCorp hiring security engineers. Great salary and benefits."
    }
    post_res = client.post("/api/analyze", json=payload)
    report_id = post_res.json()["id"]

    cert_res = client.get(f"/api/history/{report_id}/audit-certificate")
    assert cert_res.status_code == 200
    cert_data = cert_res.json()
    assert "certificateId" in cert_data
    assert "verificationHash" in cert_data
    assert cert_data["reportId"] == report_id

    download_res = client.get(f"/api/history/{report_id}/audit-certificate/download")
    assert download_res.status_code == 200
    assert "JOBSHIELD AI - VERIFICATION AUDIT CERTIFICATE" in download_res.text


def test_analyze_suspicious_job():
    payload = {
        "jobTitle": "Customer Support Associate",
        "companyName": "BrightPath Careers",
        "companyWebsite": "https://brightpath.example",
        "recruiterInformation": "Recruiter via Telegram",
        "sourceType": "paste",
        "text": "Earn high income no experience required! $500 per day working from home. Registration fee of $50 required before interview. Send bank account details immediately."
    }
    response = client.post("/api/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "id" in data
    assert data["jobTitle"] == "Customer Support Associate"
    assert data["companyName"] == "BrightPath Careers"
    assert data["riskLevel"] in ["HIGH", "VERY HIGH"]
    assert data["prediction"] == "SUSPICIOUS"
    assert len(data["indicators"]) >= 2
    assert data["demoMode"] is False


def test_analyze_legitimate_job():
    payload = {
        "jobTitle": "Senior Python Engineer",
        "companyName": "Tech Corp",
        "companyWebsite": "https://techcorp.example",
        "recruiterInformation": "HR Team",
        "sourceType": "paste",
        "text": "We are seeking a Senior Python Engineer with 5 years experience in FastAPI and PostgreSQL. Full time role with competitive salary and healthcare benefits."
    }
    response = client.post("/api/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["prediction"] == "LOWER_RISK"
    assert data["riskLevel"] in ["LOW", "MODERATE"]


def test_extract_document():
    content = b"Operations Assistant job posting. Requirements: Bachelor degree, office skills."
    files = {"file": ("test_job.txt", io.BytesIO(content), "text/plain")}
    response = client.post("/api/extract/document", files=files)
    assert response.status_code == 200
    data = response.json()
    assert data["sourceType"] == "document"
    assert "Operations Assistant" in data["text"]


def test_extract_image():
    png_bytes = b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15c4\x00\x00\x00\rIDATx\x9cc`\x00\x00\x00\x02\x00\x01H\xaf\xa4q\x00\x00\x00\x00IEND\xaeB`\x82"
    files = {"file": ("job_flyer.png", io.BytesIO(png_bytes), "image/png")}
    response = client.post("/api/extract/image", files=files)
    assert response.status_code == 200
    data = response.json()
    assert data["sourceType"] == "image"
    assert len(data["text"]) > 0


def test_history_and_export_and_delete():
    payload = {
        "jobTitle": "Data Entry Analyst",
        "companyName": "QuickData Inc",
        "sourceType": "paste",
        "text": "Quick cash data entry job. Pay $20 deposit today to get hired immediately."
    }
    post_res = client.post("/api/analyze", json=payload)
    report_id = post_res.json()["id"]

    history_res = client.get("/api/history")
    assert history_res.status_code == 200
    history_data = history_res.json()
    assert history_data["total"] >= 1
    assert any(item["id"] == report_id for item in history_data["items"])

    get_res = client.get(f"/api/history/{report_id}")
    assert get_res.status_code == 200
    assert get_res.json()["id"] == report_id

    export_res = client.get(f"/api/history/{report_id}/export")
    assert export_res.status_code == 200
    assert "JOBSHIELD AI - RISK ASSESSMENT REPORT" in export_res.text

    del_res = client.delete(f"/api/history/{report_id}")
    assert del_res.status_code == 204

    get_after_del = client.get(f"/api/history/{report_id}")
    assert get_after_del.status_code == 404


def test_dashboard():
    response = client.get("/api/dashboard")
    assert response.status_code == 200
    data = response.json()
    assert "totals" in data
    assert "jobsOverTime" in data
    assert "riskDistribution" in data


def test_model_performance():
    response = client.get("/api/model-performance")
    assert response.status_code == 200
    data = response.json()
    assert data["available"] is True
    assert len(data["models"]) >= 1
    assert data["confusionMatrix"] is not None
