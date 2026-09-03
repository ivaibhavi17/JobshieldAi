import json
import os
import urllib.request
from typing import Dict, Any, Optional

GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "")
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

# List of models to try in order
GROQ_MODELS = [
    "llama-3.3-70b-versatile",
    "llama3-70b-8192",
    "llama3-8b-8192",
    "mixtral-8x7b-32768",
    "gemma2-9b-it"
]


def generate_llm_risk_analysis(job_title: str, company_name: str, job_text: str) -> Optional[Dict[str, Any]]:
    """Use Groq LLM API to generate deep AI risk analysis and explanation."""
    api_key = os.environ.get("GROQ_API_KEY", GROQ_API_KEY)
    if not api_key:
        return None

    prompt = f"""You are JobShield AI, an expert AI job fraud & scam risk detection engine.
Analyze the following job posting for suspicious patterns, fraud indicators, upfront payment traps, or phishing risks.

Job Title: {job_title or 'Not provided'}
Company: {company_name or 'Not provided'}
Posting Content:
\"\"\"
{job_text[:2000]}
\"\"\"

Provide your response ONLY as valid JSON matching this schema:
{{
  "llmExplanation": "A clear 2-3 sentence AI risk summary for the job seeker.",
  "detectedRedFlags": ["Red flag 1", "Red flag 2"],
  "recommendedAction": "Primary advice for the student/applicant."
}}
"""

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }

    for model_name in GROQ_MODELS:
        payload = {
            "model": model_name,
            "messages": [
                {"role": "system", "content": "You analyze job postings for security risks and output ONLY raw JSON."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.2,
            "max_tokens": 300,
            "response_format": {"type": "json_object"}
        }

        try:
            req = urllib.request.Request(GROQ_API_URL, data=json.dumps(payload).encode("utf-8"), headers=headers)
            with urllib.request.urlopen(req, timeout=5) as response:
                if response.status == 200:
                    raw_data = json.loads(response.read().decode("utf-8"))
                    content = raw_data["choices"][0]["message"]["content"]
                    parsed = json.loads(content)
                    return {
                        "explanation": parsed.get("llmExplanation"),
                        "redFlags": parsed.get("detectedRedFlags", []),
                        "recommendedAction": parsed.get("recommendedAction"),
                        "model": f"Groq LLM ({model_name})"
                    }
        except Exception:
            continue

    return None
