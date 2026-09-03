import json
from typing import List
from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import AssessmentReportModel
from app.schemas import (
    AssessmentReport,
    AuditCertificate,
    HistoryResponse,
    HistoryRow,
    HistoryRowIndicator,
    Indicator,
    Recommendation,
)
from app.services.audit_certificate import format_certificate_text, generate_audit_certificate

router = APIRouter(prefix="/api/history", tags=["history"])


@router.get("", response_model=HistoryResponse)
def get_history(db: Session = Depends(get_db)):
    records = db.query(AssessmentReportModel).order_by(AssessmentReportModel.created_at.desc()).all()
    
    rows: List[HistoryRow] = []
    for r in records:
        raw_indicators = json.loads(r.indicators_json or "[]")
        indicator_list = [
            HistoryRowIndicator(
                id=ind.get("id", ""),
                category=ind.get("category", ""),
                title=ind.get("title", ""),
                matched_phrase=ind.get("matchedPhrase") or ind.get("matched_phrase")
            )
            for ind in raw_indicators
        ]
        
        created_str = r.created_at.isoformat() + "Z" if r.created_at else ""

        rows.append(
            HistoryRow(
                id=r.id,
                job_title=r.job_title,
                company_name=r.company_name,
                risk_score=r.risk_score,
                risk_level=r.risk_level,
                date=created_str,
                status=r.status,
                demo_mode=r.demo_mode,
                indicators=indicator_list,
                explanation=r.explanation
            )
        )

    return HistoryResponse(items=rows, total=len(rows))


@router.get("/{id}", response_model=AssessmentReport)
def get_report_by_id(id: int, db: Session = Depends(get_db)):
    r = db.query(AssessmentReportModel).filter(AssessmentReportModel.id == id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Assessment report not found.")

    indicators_data = json.loads(r.indicators_json or "[]")
    recommendations_data = json.loads(r.recommendations_json or "[]")

    indicators = [
        Indicator(
            id=ind.get("id", ""),
            category=ind.get("category", ""),
            title=ind.get("title", ""),
            matched_phrase=ind.get("matchedPhrase") or ind.get("matched_phrase"),
            explanation=ind.get("explanation", ""),
            severity=ind.get("severity", "LOW"),
            start_offset=ind.get("startOffset") or ind.get("start_offset"),
            end_offset=ind.get("endOffset") or ind.get("end_offset")
        )
        for ind in indicators_data
    ]

    recommendations = [
        Recommendation(
            id=rec.get("id", ""),
            text=rec.get("text", "")
        )
        for rec in recommendations_data
    ]

    created_str = r.created_at.isoformat() + "Z" if r.created_at else ""

    return AssessmentReport(
        id=r.id,
        job_title=r.job_title,
        company_name=r.company_name,
        source_type=r.source_type,
        reviewed_text=r.reviewed_text,
        risk_score=r.risk_score,
        risk_level=r.risk_level,
        prediction=r.prediction,
        confidence=r.confidence,
        model_name=r.model_name,
        indicators=indicators,
        explanation=r.explanation,
        recommendations=recommendations,
        demo_mode=r.demo_mode,
        status=r.status,
        created_at=created_str
    )


@router.get("/{id}/audit-certificate", response_model=AuditCertificate)
def get_audit_certificate_data(id: int, db: Session = Depends(get_db)):
    r = db.query(AssessmentReportModel).filter(AssessmentReportModel.id == id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Assessment report not found.")
    cert_data = generate_audit_certificate(r)
    return AuditCertificate(**cert_data)


@router.get("/{id}/audit-certificate/download")
def download_audit_certificate(id: int, db: Session = Depends(get_db)):
    r = db.query(AssessmentReportModel).filter(AssessmentReportModel.id == id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Assessment report not found.")
    cert_data = generate_audit_certificate(r)
    cert_text = format_certificate_text(cert_data, r)
    headers = {
        "Content-Disposition": f'attachment; filename="jobshield_audit_certificate_{id}.txt"'
    }
    return Response(content=cert_text, media_type="text/plain", headers=headers)


@router.get("/{id}/export")
def export_report(id: int, db: Session = Depends(get_db)):
    r = db.query(AssessmentReportModel).filter(AssessmentReportModel.id == id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Assessment report not found.")

    export_content = f"""JOBSHIELD AI - RISK ASSESSMENT REPORT
==================================================
Report ID: {r.id}
Created At: {r.created_at.isoformat() if r.created_at else 'N/A'}
Job Title: {r.job_title}
Company Name: {r.company_name}
Risk Score: {r.risk_score} / 100
Risk Level: {r.risk_level}
Prediction: {r.prediction}
Confidence: {r.confidence if r.confidence is not None else 'N/A'}
Model Name: {r.model_name or 'JobShield AI Engine'}

EXPLANATION:
--------------------------------------------------
{r.explanation}

REVIEWED JOB TEXT:
--------------------------------------------------
{r.reviewed_text}
"""
    headers = {
        "Content-Disposition": f'attachment; filename="jobshield_report_{id}.txt"'
    }
    return Response(content=export_content, media_type="text/plain", headers=headers)


@router.delete("/{id}", status_code=204)
def delete_report(id: int, db: Session = Depends(get_db)):
    r = db.query(AssessmentReportModel).filter(AssessmentReportModel.id == id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Assessment report not found.")

    db.delete(r)
    db.commit()
    return None
