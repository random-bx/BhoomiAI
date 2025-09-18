# File: main.py (Corrected Typo)
import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field # <-- CORRECTED
from typing import Literal
import sys

# --- 1. APP INITIALIZATION ---
app = FastAPI(
    title="BhoomiAI Final Prediction API",
    description="The definitive API for Odisha state-level rice yield prediction.",
    version="Final"
)

# --- 2. ADD CORS MIDDLEWARE ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 3. LOAD THE FINAL MODEL ---
try:
    model = joblib.load('bhoomi_ai_final_model.joblib')
    MODEL_FEATURES = [
        'Year', 'Area', 'N', 'P', 'K', 'Cropping_Intensity',
        'Live_Temperature', 'Live_Humidity',
        'Season_Autumn', 'Season_Kharif', 'Season_Winter'
    ]
    print("BhoomiAI Final Model loaded successfully. API is online.")
except Exception as e:
    print(f"FATAL ERROR loading model: {e}")
    model = None
    sys.exit(1)

# --- 4. DEFINE THE FINAL API REQUEST BODY ---
class FinalPredictionRequest(BaseModel):
    Year: int = Field(..., example=2024, description="The year for which the prediction is being made.")
    Area: float = Field(..., example=3700.0, description="Area to be cultivated in hectares.")
    N: float = Field(..., example=95.0, description="Nitrogen consumption (state avg).")
    P: float = Field(..., example=28.0, description="Phosphorus consumption (state avg).")
    K: float = Field(..., example=17.0, description="Potassium consumption (state avg).")
    Cropping_Intensity: float = Field(..., example=160.0, description="Cropping intensity for the year (%).")
    Live_Temperature: float = Field(..., example=29.5, description="Current live temperature in Celsius.")
    Live_Humidity: float = Field(..., example=88.0, description="Current live humidity in percent.")
    Season: Literal['Autumn', 'Winter', 'Kharif']

# --- 5. DEFINE THE API ENDPOINT ---
@app.get("/")
def read_root():
    return {"status": "ok", "message": "BhoomiAI Final ML Service is running."}

@app.post("/predict")
def predict_yield(request: FinalPredictionRequest):
    if model is None:
        raise HTTPException(status_code=503, detail="Model is not available.")

    print(f"Received prediction request: {request.dict()}")

    input_df = pd.DataFrame([request.dict()])
    input_df['Season_Autumn'] = 1 if request.Season == 'Autumn' else 0
    input_df['Season_Winter'] = 1 if request.Season == 'Winter' else 0
    input_df['Season_Kharif'] = 1 if request.Season == 'Kharif' else 0
    
    input_df = input_df[MODEL_FEATURES]
    
    prediction = model.predict(input_df)
    predicted_yield = float(prediction[0])

    response_data = {
        "predicted_yield": round(predicted_yield, 2),
        "units": "kg/ha",
        "model_version": "odisha_final_v1.0"
    }
    print(f"Sending response: {response_data}")
    return response_data