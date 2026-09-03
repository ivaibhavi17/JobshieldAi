from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field


def to_camel(string: str) -> str:
    components = string.split('_')
    return components[0] + ''.join(x.title() for x in components[1:])


class BaseSchema(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        serialize_by_alias=True,
    )


class JobDetails(BaseSchema):
    job_title: str = Field(default='', alias='jobTitle')
    company_name: str = Field(default='', alias='companyName')
    company_website: str = Field(default='', alias='companyWebsite')
    recruiter_information: str = Field(default='', alias='recruiterInformation')


class AnalysisRequest(JobDetails):
    source_type: str = Field(..., alias='sourceType')
    text: str = Field(...)
    demo_scenario: Optional[str] = Field(default=None, alias='demoScenario')


class Indicator(BaseSchema):
    id: str
    category: str
    title: str
    matched_phrase: Optional[str] = Field(default=None, alias='matchedPhrase')
    explanation: str
    severity: str
    start_offset: Optional[int] = Field(default=None, alias='startOffset')
    end_offset: Optional[int] = Field(default=None, alias='endOffset')


class Recommendation(BaseSchema):
    id: str
    text: str


class AssessmentReport(BaseSchema):
    id: int
    job_title: str = Field(..., alias='jobTitle')
    company_name: str = Field(..., alias='companyName')
    source_type: str = Field(..., alias='sourceType')
    reviewed_text: str = Field(..., alias='reviewedText')
    risk_score: float = Field(..., alias='riskScore')
    risk_level: str = Field(..., alias='riskLevel')
    prediction: str = Field(..., alias='prediction')
    confidence: Optional[float] = Field(default=None)
    model_name: Optional[str] = Field(default=None, alias='modelName')
    indicators: List[Indicator] = Field(default_factory=list)
    explanation: str = Field(...)
    recommendations: List[Recommendation] = Field(default_factory=list)
    demo_mode: bool = Field(default=False, alias='demoMode')
    status: str = Field(default='ANALYZED')
    created_at: str = Field(..., alias='createdAt')


class ExtractionResult(BaseSchema):
    source_type: str = Field(..., alias='sourceType')
    text: str = Field(...)
    filename: Optional[str] = Field(default=None)
    content_type: Optional[str] = Field(default=None, alias='contentType')
    demo_mode: bool = Field(default=False, alias='demoMode')


class DashboardTotals(BaseSchema):
    analyzed: int
    low: int
    moderate: int
    high: int
    very_high: int = Field(..., alias='veryHigh')


class JobsOverTime(BaseSchema):
    date: str
    count: int


class RiskDistributionItem(BaseSchema):
    level: str
    count: int
    percentage: float


class CommonIndicatorItem(BaseSchema):
    label: str
    count: int


class ScoreDistributionItem(BaseSchema):
    band: str
    count: int
    min: int
    max: int


class DashboardData(BaseSchema):
    demo_mode: bool = Field(default=False, alias='demoMode')
    totals: DashboardTotals
    jobs_over_time: List[JobsOverTime] = Field(..., alias='jobsOverTime')
    risk_distribution: List[RiskDistributionItem] = Field(..., alias='riskDistribution')
    common_indicators: List[CommonIndicatorItem] = Field(..., alias='commonIndicators')
    score_distribution: List[ScoreDistributionItem] = Field(..., alias='scoreDistribution')


class HistoryRowIndicator(BaseSchema):
    id: str
    category: str
    title: str
    matched_phrase: Optional[str] = Field(default=None, alias='matchedPhrase')


class HistoryRow(BaseSchema):
    id: int
    job_title: str = Field(..., alias='jobTitle')
    company_name: str = Field(..., alias='companyName')
    risk_score: float = Field(..., alias='riskScore')
    risk_level: str = Field(..., alias='riskLevel')
    date: str
    status: str
    demo_mode: bool = Field(default=False, alias='demoMode')
    indicators: List[HistoryRowIndicator] = Field(default_factory=list)
    explanation: Optional[str] = Field(default=None)


class HistoryResponse(BaseSchema):
    items: List[HistoryRow]
    total: int


class ModelMetrics(BaseSchema):
    model_name: str = Field(..., alias='modelName')
    accuracy: Optional[float] = Field(default=None)
    precision: Optional[float] = Field(default=None)
    recall: Optional[float] = Field(default=None)
    f1_score: Optional[float] = Field(default=None, alias='f1Score')
    status: str
    selected: bool


class ConfusionMatrixData(BaseSchema):
    labels: List[str]
    values: List[List[Optional[int]]]


class ModelPerformanceData(BaseSchema):
    demo_mode: bool = Field(default=False, alias='demoMode')
    available: bool
    models: List[ModelMetrics]
    confusion_matrix: Optional[ConfusionMatrixData] = Field(default=None, alias='confusionMatrix')
    selected_model: Optional[str] = Field(default=None, alias='selectedModel')
    explanation: str


# --- NEW STARTUP & ENTERPRISE SCHEMAS ---

class DomainVerificationRequest(BaseSchema):
    email_or_domain: str = Field(..., alias='emailOrDomain')
    company_website: Optional[str] = Field(default='', alias='companyWebsite')


class DomainVerificationResult(BaseSchema):
    email_or_domain: str = Field(..., alias='emailOrDomain')
    domain: Optional[str] = Field(default=None)
    is_authentic: bool = Field(..., alias='isAuthentic')
    is_spoofed: bool = Field(..., alias='isSpoofed')
    is_free_webmail: bool = Field(..., alias='isFreeWebmail')
    has_mx_record: bool = Field(..., alias='hasMxRecord')
    risk_level: str = Field(..., alias='riskLevel')
    explanation: str = Field(...)
    target_brand: Optional[str] = Field(default=None, alias='targetBrand')


class UserSignUp(BaseSchema):
    email: str
    password: str
    full_name: Optional[str] = Field(default='', alias='fullName')


class UserLogin(BaseSchema):
    email: str
    password: str


class UserResponse(BaseSchema):
    id: int
    email: str
    full_name: str = Field(default='', alias='fullName')
    role: str
    created_at: str = Field(..., alias='createdAt')


class AuthResponse(BaseSchema):
    access_token: str = Field(..., alias='accessToken')
    token_type: str = Field(default='bearer', alias='tokenType')
    user: UserResponse


class ApiKeyCreate(BaseSchema):
    name: str = Field(default='Default Key')


class ApiKeyResponse(BaseSchema):
    id: int
    name: str
    key: str
    created_at: str = Field(..., alias='createdAt')


class AuditCertificate(BaseSchema):
    certificate_id: str = Field(..., alias='certificateId')
    report_id: int = Field(..., alias='reportId')
    job_title: str = Field(..., alias='jobTitle')
    company_name: str = Field(..., alias='companyName')
    source_type: str = Field(..., alias='sourceType')
    risk_score: float = Field(..., alias='riskScore')
    risk_level: str = Field(..., alias='riskLevel')
    prediction: str = Field(...)
    confidence: Optional[float] = Field(default=None)
    model_name: str = Field(..., alias='modelName')
    verification_hash: str = Field(..., alias='verificationHash')
    issued_at: str = Field(..., alias='issuedAt')
    valid_until: str = Field(..., alias='validUntil')
    issuer: str = Field(...)
    security_seal: str = Field(..., alias='securitySeal')
    certificate_url: str = Field(..., alias='certificateUrl')
