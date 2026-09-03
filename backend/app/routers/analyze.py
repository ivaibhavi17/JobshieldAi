import json
import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import AssessmentReportModel
from app.schemas import AnalysisRequest, AssessmentReport, Indicator, Recommendation
from app.services.nlp_engine import nlp_engine

router = APIRouter(prefix="/api", tags=["analyze"])


@router.post("/analyze", response_model=AssessmentReport)
def analyze_job(payload: AnalysisRequest, db: Session = Depends(get_db)):
    text = payload.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Job description text cannot be empty.")

    # Execute NLP & Heuristic Risk Analysis
    risk_score, risk_level, prediction, confidence, indicators, explanation, recommendations = nlp_engine.analyze(
        text=text,
        job_title=payload.job_title,
        company_name=payload.company_name
    )

    indicators_dicts = [ind.model_dump(by_alias=True) for ind in indicators]
    recommendations_dicts = [rec.model_dump(by_alias=True) for rec in recommendations]

    created_dt = datetime.datetime.now(datetime.timezone.utc)
    created_iso = created_dt.isoformat()

    db_report = AssessmentReportModel(
        job_title=payload.job_title or "Untitled job posting",
        company_name=payload.company_name or "Company not provided",
        company_website=payload.company_website or "",
        recruiter_information=payload.recruiter_information or "",
        source_type=payload.source_type,
        reviewed_text=text,
        risk_score=risk_score,
        risk_level=risk_level,
        prediction=prediction,
        confidence=confidence,
        model_name="JobShield TF-IDF + LogisticRegression v1.0",
        indicators_json=json.dumps(indicators_dicts),
        explanation=explanation,
        recommendations_json=json.dumps(recommendations_dicts),
        demo_mode=False,
        status="ANALYZED",
        created_at=created_dt
    )

    db.add(db_report)
    db.commit()
    db.refresh(db_report)

    return AssessmentReport(
        id=db_report.id,
        job_title=db_report.job_title,
        company_name=db_report.company_name,
        source_type=db_report.source_type,
        reviewed_text=db_report.reviewed_text,
        risk_score=db_report.risk_score,
        risk_level=db_report.risk_level,
        prediction=db_report.prediction,
        confidence=db_report.confidence,
        model_name=db_report.model_name,
        indicators=indicators,
        explanation=db_report.explanation,
        recommendations=recommendations,
        demo_mode=False,
        status=db_report.status,
        created_at=created_iso
    )
