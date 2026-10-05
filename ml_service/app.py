"""MRT Metal Mart HSN classification service.

Loads the trained TF-IDF + Logistic Regression artifacts and exposes
a small HTTP API for the MRT frontend/backend.
"""

from __future__ import annotations

import os
from pathlib import Path
from typing import Any

import joblib
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


ROOT = Path(__file__).resolve().parent
MODEL_DIR = ROOT / "models"

MODEL_PATH = Path(os.getenv("MRT_ML_MODEL_PATH", MODEL_DIR / "baseline_model.pkl"))
VECTORIZER_PATH = Path(
    os.getenv("MRT_ML_VECTORIZER_PATH", MODEL_DIR / "vectorizer.pkl")
)
LABEL_MAP_PATH = Path(
    os.getenv("MRT_ML_LABEL_MAP_PATH", MODEL_DIR / "label_map.pkl")
)

CONFIDENCE_THRESHOLD = float(os.getenv("MRT_ML_CONFIDENCE_THRESHOLD", "0.80"))
TOP_K_DEFAULT = int(os.getenv("MRT_ML_TOP_K", "3"))

app = FastAPI(
    title="MRT Metal Mart ML Service",
    version="1.0.0",
    description="HSN classification from product/item names.",
)

origins = [
    item.strip()
    for item in os.getenv(
        "MRT_ML_CORS_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173",
    ).split(",")
    if item.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


class CategoryRequest(BaseModel):
    itemName: str = Field(..., min_length=1, max_length=500)
    topK: int = Field(default=TOP_K_DEFAULT, ge=1, le=10)


class Prediction(BaseModel):
    hsnCode: str
    confidence: float


class CategoryResponse(BaseModel):
    itemName: str
    hsnCode: str
    confidence: float
    reviewRequired: bool
    modelVersion: str
    topPredictions: list[Prediction]


model: Any = None
vectorizer: Any = None
label_map: dict[int, Any] = {}


@app.on_event("startup")
def load_artifacts() -> None:
    global model, vectorizer, label_map

    missing = [
        str(path)
        for path in (MODEL_PATH, VECTORIZER_PATH, LABEL_MAP_PATH)
        if not path.exists()
    ]
    if missing:
        raise RuntimeError(
            "ML artifacts are missing. Add baseline_model.pkl, vectorizer.pkl "
            f"and label_map.pkl under {MODEL_DIR}. Missing: {missing}"
        )

    # These files are trusted, locally-produced scikit-learn artifacts.
    model = joblib.load(MODEL_PATH)
    vectorizer = joblib.load(VECTORIZER_PATH)
    loaded_map = joblib.load(LABEL_MAP_PATH)

    label_map = {int(key): value for key, value in loaded_map.items()}


@app.get("/health")
def health() -> dict[str, Any]:
    return {
        "status": "healthy" if model is not None and vectorizer is not None else "not_ready",
        "modelLoaded": model is not None,
        "vectorizerLoaded": vectorizer is not None,
        "modelVersion": "hsn-tfidf-logreg-v1",
    }


@app.post("/predict-category", response_model=CategoryResponse)
def predict_category(request: CategoryRequest) -> CategoryResponse:
    if model is None or vectorizer is None:
        raise HTTPException(status_code=503, detail="ML model is not loaded.")

    item_name = " ".join(request.itemName.strip().split())
    if not item_name:
        raise HTTPException(status_code=422, detail="itemName cannot be empty.")

    features = vectorizer.transform([item_name])
    probabilities = model.predict_proba(features)[0]

    ranked = probabilities.argsort()[::-1][: request.topK]

    predictions = [
        Prediction(
            hsnCode=str(label_map.get(int(class_id), class_id)),
            confidence=round(float(probabilities[class_id]), 6),
        )
        for class_id in ranked
    ]

    top = predictions[0]

    return CategoryResponse(
        itemName=item_name,
        hsnCode=top.hsnCode,
        confidence=top.confidence,
        reviewRequired=top.confidence < CONFIDENCE_THRESHOLD,
        modelVersion="hsn-tfidf-logreg-v1",
        topPredictions=predictions,
    )
