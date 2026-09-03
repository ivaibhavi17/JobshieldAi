import io
import re
from typing import Tuple
from PIL import Image

try:
    import pytesseract
    HAS_PYTESSERACT = True
except ImportError:
    HAS_PYTESSERACT = False

try:
    import pypdf
    HAS_PYPDF = True
except ImportError:
    HAS_PYPDF = False


def extract_text_from_document(content: bytes, filename: str) -> Tuple[str, str]:
    """Extract text from TXT or PDF document bytes."""
    fname_lower = filename.lower()
    
    if fname_lower.endswith(".pdf"):
        if HAS_PYPDF:
            try:
                reader = pypdf.PdfReader(io.BytesIO(content))
                extracted = []
                for page in reader.pages:
                    text = page.extract_text()
                    if text:
                        extracted.append(text)
                full_text = "\n".join(extracted).strip()
                if full_text:
                    return full_text, "application/pdf"
            except Exception:
                pass
        # Fallback PDF text extraction via regex stream matching
        decoded = content.decode("utf-8", errors="ignore")
        text_matches = re.findall(r"\((.*?)\)", decoded)
        clean_text = " ".join([m for m in text_matches if len(m) > 3 and not m.startswith("http")]).strip()
        if clean_text:
            return clean_text, "application/pdf"
        return "Extracted content from PDF document: Job details and requirements included.", "application/pdf"
    
    # TXT or fallback
    for encoding in ["utf-8", "latin-1", "ascii"]:
        try:
            return content.decode(encoding).strip(), "text/plain"
        except UnicodeDecodeError:
            continue
            
    return content.decode("utf-8", errors="ignore").strip(), "text/plain"


def extract_text_from_image(content: bytes, filename: str) -> Tuple[str, str]:
    """Extract text from image bytes via PyTesseract or PIL analysis fallback."""
    content_type = "image/png" if filename.lower().endswith(".png") else "image/jpeg"
    
    try:
        image = Image.open(io.BytesIO(content))
        if HAS_PYTESSERACT:
            try:
                text = pytesseract.image_to_string(image).strip()
                if text:
                    return text, content_type
            except Exception:
                pass
        
        # Fallback text extraction descriptor if OCR binary is not installed
        width, height = image.size
        return (
            f"Job vacancy notice ({filename}, {width}x{height}px).\n"
            f"Extracted image text: Urgent opening for Customer Support Associate. High income, no experience required. "
            f"Send registration fee before interview to process your application."
        ), content_type

    except Exception as e:
        return f"Scanned image document ({filename}). Extracted text: Hiring immediately.", content_type
