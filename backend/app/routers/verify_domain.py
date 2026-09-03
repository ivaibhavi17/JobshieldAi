from fastapi import APIRouter
from app.schemas import DomainVerificationRequest, DomainVerificationResult
from app.services.domain_authenticator import verify_domain_authenticity

router = APIRouter(prefix="/api", tags=["verify-domain"])


@router.post("/verify-domain", response_model=DomainVerificationResult)
def verify_domain(payload: DomainVerificationRequest):
    result = verify_domain_authenticity(
        email_or_domain=payload.email_or_domain,
        company_website=payload.company_website or ""
    )
    return DomainVerificationResult(**result)
