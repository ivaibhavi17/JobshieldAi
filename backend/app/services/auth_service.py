import base64
import hashlib
import hmac
import json
import os
import secrets
import time
from typing import Dict, Any, Optional

SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "jobshield-ai-super-secret-production-key-2026")


def hash_password(password: str) -> str:
    """Hash password using SHA256 with salt."""
    salt = secrets.token_hex(16)
    key = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 100000)
    return f"{salt}${key.hex()}"


def verify_password(password: str, hashed: str) -> bool:
    """Verify password against stored salt$hash."""
    try:
        salt, key_hex = hashed.split("$")
        key = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 100000)
        return hmac.compare_digest(key.hex(), key_hex)
    except Exception:
        return False


def create_access_token(user_id: int, email: str, role: str = "user") -> str:
    """Create lightweight JWT access token."""
    header = base64.b64encode(json.dumps({"alg": "HS256", "typ": "JWT"}).encode()).decode().rstrip("=")
    payload_data = {
        "sub": user_id,
        "email": email,
        "role": role,
        "iat": int(time.time()),
        "exp": int(time.time()) + 86400 * 30  # 30 days validity
    }
    payload = base64.b64encode(json.dumps(payload_data).encode()).decode().rstrip("=")
    signature = hmac.new(SECRET_KEY.encode(), f"{header}.{payload}".encode(), hashlib.sha256).digest()
    sig_b64 = base64.b64encode(signature).decode().rstrip("=")
    return f"{header}.{payload}.{sig_b64}"


def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    """Decode and verify JWT access token."""
    try:
        parts = token.split(".")
        if len(parts) != 3:
            return None
        header, payload, sig = parts
        
        # Verify signature
        expected_sig = hmac.new(SECRET_KEY.encode(), f"{header}.{payload}".encode(), hashlib.sha256).digest()
        sig_b64 = base64.b64encode(expected_sig).decode().rstrip("=")
        if not hmac.compare_digest(sig_b64, sig):
            return None

        # Decode payload
        rem = len(payload) % 4
        if rem > 0:
            payload += "=" * (4 - rem)
        data = json.loads(base64.b64decode(payload).decode())

        if data.get("exp", 0) < time.time():
            return None

        return data
    except Exception:
        return None


def generate_api_key() -> str:
    """Generate secure API key for B2B/developers."""
    return f"sk_live_{secrets.token_urlsafe(32)}"
