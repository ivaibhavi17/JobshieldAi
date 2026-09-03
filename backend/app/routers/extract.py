from fastapi import APIRouter, File, HTTPException, UploadFile
from app.schemas import ExtractionResult
from app.services.ocr_engine import extract_text_from_document, extract_text_from_image

router = APIRouter(prefix="/api/extract", tags=["extract"])


@router.post("/image", response_model=ExtractionResult)
async def extract_image(file: UploadFile = File(...)):
    if not file:
        raise HTTPException(status_code=400, detail="No file uploaded.")
    
    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="Uploaded image file is empty.")

    text, content_type = extract_text_from_image(content, file.filename or "image.png")

    return ExtractionResult(
        source_type="image",
        text=text,
        filename=file.filename or "image.png",
        content_type=content_type,
        demo_mode=False
    )


@router.post("/document", response_model=ExtractionResult)
async def extract_document(file: UploadFile = File(...)):
    if not file:
        raise HTTPException(status_code=400, detail="No file uploaded.")

    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="Uploaded document file is empty.")

    text, content_type = extract_text_from_document(content, file.filename or "document.txt")

    return ExtractionResult(
        source_type="document",
        text=text,
        filename=file.filename or "document.txt",
        content_type=content_type,
        demo_mode=False
    )
