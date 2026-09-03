from fastapi import APIRouter
from app.schemas import ModelPerformanceData
from app.services.nlp_engine import nlp_engine

router = APIRouter(prefix="/api/model-performance", tags=["model-performance"])


@router.get("", response_model=ModelPerformanceData)
def get_model_performance():
    data = nlp_engine.get_model_evaluation()
    return ModelPerformanceData(**data)
