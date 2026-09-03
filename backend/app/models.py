import datetime
from sqlalchemy import Boolean, Column, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from app.database import Base


class UserModel(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(255), default="")
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), default="jobseeker")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    api_keys = relationship("ApiKeyModel", back_populates="user", cascade="all, delete-orphan")


class ApiKeyModel(Base):
    __tablename__ = "api_keys"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(100), default="Default Key")
    key = Column(String(255), unique=True, index=True, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("UserModel", back_populates="api_keys")


class AssessmentReportModel(Base):
    __tablename__ = "assessment_reports"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    job_title = Column(String(255), default="")
    company_name = Column(String(255), default="")
    company_website = Column(String(255), default="")
    recruiter_information = Column(Text, default="")
    source_type = Column(String(50), default="paste")
    reviewed_text = Column(Text, nullable=False)
    risk_score = Column(Float, nullable=False, default=0.0)
    risk_level = Column(String(50), nullable=False, default="LOW")
    prediction = Column(String(50), nullable=False, default="LOWER_RISK")
    confidence = Column(Float, nullable=True)
    model_name = Column(String(100), nullable=True)
    indicators_json = Column(Text, default="[]")
    explanation = Column(Text, default="")
    recommendations_json = Column(Text, default="[]")
    demo_mode = Column(Boolean, default=False)
    status = Column(String(50), default="ANALYZED")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
