from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import ApiKeyModel, UserModel
from app.schemas import ApiKeyCreate, ApiKeyResponse, AuthResponse, UserLogin, UserResponse, UserSignUp
from app.services.auth_service import (
    create_access_token,
    decode_access_token,
    generate_api_key,
    hash_password,
    verify_password,
)

router = APIRouter(prefix="/api/auth", tags=["auth"])


def get_current_user(authorization: str = Header(None), db: Session = Depends(get_db)) -> UserModel:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authentication credentials required.")
    token = authorization.split(" ")[1]
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired authentication token.")
    
    user = db.query(UserModel).filter(UserModel.id == payload["sub"]).first()
    if not user:
        raise HTTPException(status_code=401, detail="User account not found.")
    return user


@router.post("/signup", response_model=AuthResponse)
def signup(payload: UserSignUp, db: Session = Depends(get_db)):
    email_clean = payload.email.strip().lower()
    if not email_clean or "@" not in email_clean:
        raise HTTPException(status_code=400, detail="Invalid email address.")
    
    existing = db.query(UserModel).filter(UserModel.email == email_clean).first()
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email already exists.")

    if len(payload.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters.")

    user = UserModel(
        email=email_clean,
        full_name=payload.full_name or email_clean.split("@")[0].capitalize(),
        hashed_password=hash_password(payload.password),
        role="jobseeker"
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(user.id, user.email, user.role)
    created_str = user.created_at.isoformat() + "Z" if user.created_at else ""

    return AuthResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse(
            id=user.id,
            email=user.email,
            full_name=user.full_name,
            role=user.role,
            created_at=created_str
        )
    )


@router.post("/login", response_model=AuthResponse)
def login(payload: UserLogin, db: Session = Depends(get_db)):
    email_clean = payload.email.strip().lower()
    user = db.query(UserModel).filter(UserModel.email == email_clean).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    token = create_access_token(user.id, user.email, user.role)
    created_str = user.created_at.isoformat() + "Z" if user.created_at else ""

    return AuthResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse(
            id=user.id,
            email=user.email,
            full_name=user.full_name,
            role=user.role,
            created_at=created_str
        )
    )


@router.get("/me", response_model=UserResponse)
def get_me(user: UserModel = Depends(get_current_user)):
    created_str = user.created_at.isoformat() + "Z" if user.created_at else ""
    return UserResponse(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        role=user.role,
        created_at=created_str
    )


@router.post("/api-keys", response_model=ApiKeyResponse)
def create_api_key(payload: ApiKeyCreate, user: UserModel = Depends(get_current_user), db: Session = Depends(get_db)):
    key_str = generate_api_key()
    api_key_record = ApiKeyModel(
        user_id=user.id,
        name=payload.name,
        key=key_str
    )
    db.add(api_key_record)
    db.commit()
    db.refresh(api_key_record)

    created_str = api_key_record.created_at.isoformat() + "Z" if api_key_record.created_at else ""
    return ApiKeyResponse(
        id=api_key_record.id,
        name=api_key_record.name,
        key=api_key_record.key,
        created_at=created_str
    )
