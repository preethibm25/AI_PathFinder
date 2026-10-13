"""
ML Feature Engineering Reference Module.
"""
import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), "..", "backend"))
from app.ai.feature_engineering import FeaturePipeline

__all__ = ["FeaturePipeline"]
