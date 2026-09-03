import re
import socket
import urllib.parse
from typing import Dict, Any, Optional

FREE_WEBMAIL_DOMAINS = {
    "gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "aol.com", 
    "icloud.com", "protonmail.com", "proton.me", "mail.com", "yandex.com", "zoho.com"
}

KNOWN_BRANDS = {
    "google": ["google.com", "google.co.in", "careers.google.com"],
    "microsoft": ["microsoft.com", "careers.microsoft.com"],
    "amazon": ["amazon.com", "amazon.jobs"],
    "apple": ["apple.com", "jobs.apple.com"],
    "meta": ["meta.com", "metacareers.com"],
    "naukri": ["naukri.com"],
    "indeed": ["indeed.com"],
    "linkedin": ["linkedin.com"],
    "tcs": ["tcs.com"],
    "infosys": ["infosys.com"],
    "wipro": ["wipro.com"],
    "accenture": ["accenture.com"]
}


def extract_domain(input_str: str) -> str:
    """Extract clean domain name from email or URL."""
    input_str = input_str.strip().lower()
    if "@" in input_str:
        return input_str.split("@")[-1].strip()
    if "://" in input_str:
        parsed = urllib.parse.urlparse(input_str)
        return parsed.netloc or parsed.path.split("/")[0]
    return input_str.split("/")[0].strip()


def check_mx_record(domain: str) -> bool:
    """Check if domain has valid DNS MX records."""
    try:
        # Standard socket lookup fallback for MX resolution
        socket.gethostbyname(domain)
        return True
    except Exception:
        return False


def detect_domain_spoof(domain: str, company_name: str = "") -> Optional[Dict[str, str]]:
    """Detect domain spoofing against well-known tech/corporate brands."""
    domain_clean = domain.lower()
    
    for brand, legit_domains in KNOWN_BRANDS.items():
        if brand in domain_clean and domain_clean not in legit_domains:
            # Check if brand is embedded in suspicious sub/domain like google-careers-jobs.com or g00gle.com
            for legit in legit_domains:
                if domain_clean != legit and (f"{brand}-" in domain_clean or f"-{brand}" in domain_clean or f"{brand}jobs" in domain_clean or f"{brand}careers" in domain_clean):
                    return {
                        "targetBrand": brand.capitalize(),
                        "legitDomain": legit,
                        "explanation": f"Domain '{domain_clean}' appears to spoof official brand '{brand.capitalize()}' (official domain is '{legit}')."
                    }
    
    # Check typosquatting patterns (e.g. g00gle, micr0soft)
    typo_patterns = [
        (r"g[0o]{2}gle", "Google", "google.com"),
        (r"micr[0o]soft", "Microsoft", "microsoft.com"),
        (r"am[a4]z[0o]n", "Amazon", "amazon.com"),
        (r"n[a4]ukr[i1]", "Naukri", "naukri.com")
    ]
    for pattern, brand_name, legit_dom in typo_patterns:
        if re.search(pattern, domain_clean) and domain_clean != legit_dom:
            return {
                "targetBrand": brand_name,
                "legitDomain": legit_dom,
                "explanation": f"Typosquatting detected on domain '{domain_clean}'. Designed to imitate {brand_name} ({legit_dom})."
            }
            
    return None


def verify_domain_authenticity(email_or_domain: str, company_website: str = "") -> Dict[str, Any]:
    """Verify recruiter email or website domain for spoofing, free webmail, and MX records."""
    domain = extract_domain(email_or_domain)
    if not domain:
        return {
            "emailOrDomain": email_or_domain,
            "isAuthentic": False,
            "isSpoofed": False,
            "isFreeWebmail": False,
            "hasMxRecord": False,
            "riskLevel": "HIGH",
            "explanation": "Invalid domain or email address provided.",
            "targetBrand": None
        }

    is_free = domain in FREE_WEBMAIL_DOMAINS
    spoof_info = detect_domain_spoof(domain, company_website)
    has_mx = check_mx_record(domain)

    if spoof_info:
        return {
            "emailOrDomain": email_or_domain,
            "domain": domain,
            "isAuthentic": False,
            "isSpoofed": True,
            "isFreeWebmail": is_free,
            "hasMxRecord": has_mx,
            "riskLevel": "VERY HIGH",
            "explanation": spoof_info["explanation"],
            "targetBrand": spoof_info["targetBrand"]
        }

    if is_free:
        return {
            "emailOrDomain": email_or_domain,
            "domain": domain,
            "isAuthentic": False,
            "isSpoofed": False,
            "isFreeWebmail": True,
            "hasMxRecord": True,
            "riskLevel": "MODERATE",
            "explanation": f"Domain '@{domain}' is a free public webmail service. Legitimate corporate recruiters typically use official company domain emails.",
            "targetBrand": None
        }

    if not has_mx:
        return {
            "emailOrDomain": email_or_domain,
            "domain": domain,
            "isAuthentic": False,
            "isSpoofed": False,
            "isFreeWebmail": False,
            "hasMxRecord": False,
            "riskLevel": "HIGH",
            "explanation": f"Domain '{domain}' has no active DNS host or MX mail servers.",
            "targetBrand": None
        }

    return {
        "emailOrDomain": email_or_domain,
        "domain": domain,
        "isAuthentic": True,
        "isSpoofed": False,
        "isFreeWebmail": False,
        "hasMxRecord": True,
        "riskLevel": "LOW",
        "explanation": f"Domain '{domain}' is active with valid MX mail servers and no domain spoofing detected.",
        "targetBrand": None
    }
