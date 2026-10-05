# MRT HSN model artifacts

Place the three trained artifacts in this directory:

- `baseline_model.pkl` — trained scikit-learn Logistic Regression model
- `vectorizer.pkl` — trained TF-IDF vectorizer
- `label_map.pkl` — integer class ID → HSN code mapping

These are the artifacts produced by the current MRT HSN classification model.

The service intentionally does not retrain the model at runtime.

## Run

From the repository root:

```powershell
cd ml_service
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m uvicorn app:app --host 0.0.0.0 --port 8000
```

Health check:

```
GET http://localhost:8000/health
```

Prediction:

```
POST http://localhost:8000/predict-category
Content-Type: application/json

{
  "itemName": "Kerala Traditional Brass Nilavilakku 18 Inch",
  "topK": 3
}
```

The model files are binary artifacts. Keep them in this directory and do not
modify or regenerate them unless you intentionally retrain the model.
