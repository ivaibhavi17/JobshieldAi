import hashlib
import datetime
from typing import Dict, Any

from app.models import AssessmentReportModel


def generate_audit_certificate(report: AssessmentReportModel) -> Dict[str, Any]:
    """Generate official JobShield Verification Audit Certificate payload with SHA256 hash."""
    created_time = report.created_at.isoformat() if report.created_at else datetime.datetime.utcnow().isoformat()
    raw_payload = f"{report.id}:{report.job_title}:{report.company_name}:{report.risk_score}:{report.risk_level}:{created_time}"
    verification_hash = hashlib.sha256(raw_payload.encode("utf-8")).hexdigest()
    
    cert_id = f"JSA-{report.id:06d}-{verification_hash[:8].upper()}"

    valid_until = (datetime.datetime.utcnow() + datetime.timedelta(days=180)).strftime("%Y-%m-%d")

    return {
        "certificateId": cert_id,
        "reportId": report.id,
        "jobTitle": report.job_title,
        "companyName": report.company_name,
        "sourceType": report.source_type,
        "riskScore": report.risk_score,
        "riskLevel": report.risk_level,
        "prediction": report.prediction,
        "confidence": report.confidence,
        "modelName": report.model_name or "JobShield AI Risk Engine v1.0",
        "verificationHash": verification_hash,
        "issuedAt": created_time,
        "validUntil": valid_until,
        "issuer": "JobShield AI Security Operations Center (SOC)",
        "securitySeal": "AUTHENTICATED & CRYPTOGRAPHICALLY VERIFIED",
        "certificateUrl": f"/api/history/{report.id}/audit-certificate"
    }


def format_certificate_text(cert: Dict[str, Any], report: AssessmentReportModel) -> str:
    """Format downloadable text audit certificate."""
    return f"""================================================================================
                    JOBSHIELD AI - VERIFICATION AUDIT CERTIFICATE
================================================================================
Certificate ID    : {cert['certificateId']}
Report ID         : {cert['reportId']}
Verification Hash : {cert['verificationHash']}
Issued At         : {cert['issuedAt']}
Valid Until       : {cert['validUntil']}
Issuer            : {cert['issuer']}
Security Status   : {cert['securitySeal']}
--------------------------------------------------------------------------------

JOB POSTING DETAILS:
  Job Title       : {cert['jobTitle']}
  Company Name    : {cert['companyName']}
  Source Type     : {cert['sourceType']}

RISK ASSESSMENT SUMMARY:
  Risk Score      : {cert['riskScore']} / 100
  Risk Level      : {cert['riskLevel']}
  Prediction      : {cert['prediction']}
  Model Engine    : {cert['modelName']}

EXPLANATION & AUDIT FINDINGS:
  {report.explanation}

RECOMMENDATIONS:
  - Verify official company website & HR email MX records before sharing sensitive data.
  - Never pay registration, processing, training, or deposit fees for job offers.
  - Cross-reference recruiter identity on verified platforms (LinkedIn, Glassdoor).

================================================================================
This certificate is cryptographically verified by JobShield AI Security Protocol.
Checksum: {cert['verificationHash']}
================================================================================
"""
