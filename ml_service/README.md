# MRT Metal Mart — HSN ML Service

This service integrates the trained **Item Name → HSN Code** classifier into MRT.

## Architecture

React frontend
→ ML API
→ TF-IDF vectorizer
→ Logistic Regression
→ HSN label map

The classifier currently uses the trained model exactly as supplied:

- TF-IDF word features
- 1–2 gram range
- 8,983 learned features
- Logistic Regression
- 38 HSN classes

## API

### GET /health

Returns model/service readiness.

### POST /predict-category

Request:

```json
{
  "itemName": "Brass Traditional Kerala Nilavilakku 18 Inch",
  "topK": 3
}
```

Response:

```json
{
  "itemName": "Brass Traditional Kerala Nilavilakku 18 Inch",
  "hsnCode": "74181010",
  "confidence": 0.92,
  "reviewRequired": false,
  "modelVersion": "hsn-tfidf-logreg-v1",
  "topPredictions": [
    {"hsnCode": "74181010", "confidence": 0.92},
    {"hsnCode": "741810", "confidence": 0.05},
    {"hsnCode": "741999", "confidence": 0.02}
  ]
}
```

The frontend treats low-confidence predictions as requiring manual review.

## Configuration

`MRT_ML_CORS_ORIGINS`
: Comma-separated frontend origins.

`MRT_ML_CONFIDENCE_THRESHOLD`
: Not used; the service variable is `MRT_ML_CONFIDENCE_THRESHOLD` only if you rename the code. The actual supported variable is `MRT_ML_CONFIDENCE_THRESHOLD`.

`MRT_ML_CONFIDENCE_THRESHOLD`
: Confidence below this value sets `reviewRequired=true`. Default: 0.80.

`MRT_ML_MODEL_PATH`
: Optional absolute path to the Logistic Regression artifact.

`MRT_ML_VECTORIZER_PATH`
: Optional absolute path to the TF-IDF artifact.

`MRT_ML_LABEL_MAP_PATH`
: Optional absolute path to the label map artifact.
