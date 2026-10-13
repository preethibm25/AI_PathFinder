"""
ML Recommendation Engine Reference Module.
Imports core implementation from backend app.ai.recommendation_engine.
"""
import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), "..", "backend"))
from app.ai.recommendation_engine import (
    RecommendationEngineBase,
    WeightedRecommendationEngine,
    MLRecommendationEngineStub,
    recommendation_engine
)

__all__ = [
    "RecommendationEngineBase",
    "WeightedRecommendationEngine",
    "MLRecommendationEngineStub",
    "recommendation_engine"
]
