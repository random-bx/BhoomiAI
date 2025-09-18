# File: main.py (Final Version for Odisha Model)
import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import Literal
import sys

# --- 1. APP INITIALIZATION & MODEL LOADING ---
app = FastAPI(
    title="BhoomiAI Odisha Rice Yield Prediction API",
    description="An API to predict rice yield in Odisha based on historical data.",
    version="2.0.0"
)

try:
    # Load the new model and define the exact feature order it expects
    model = joblib.load('odisha_rice_model.joblib')
    MODEL_FEATURES = ['Start_Year', 'Area', 'Season_Autumn', 'Season_Kharif', 'Season_Winter']
    print("Odisha Rice prediction model loaded successfully.")
except FileNotFoundError:
    print("FATAL ERROR: Model file 'odisha_rice_model.joblib' not found. Please run train.py first.")
    sys.exit("Shutting down due to missing model file.")
except Exception as e:
    print(f"An error occurred loading the model: {e}")
    sys.exit("Shutting down due to model loading error.")

# --- 2. DEFINE THE NEW REQUEST BODY STRUCTURE ---
# This is what the Spring Boot backend or frontend will need to send
class OdishaPredictionRequest(BaseModel):
    Start_Year: int = Field(..., example=2024)
    Area: float = Field(..., example=1014.0)
    Season: Literal['Autumn', 'Winter', 'Kharif'] = Field(..., example='Kharif')

# --- 3. DEFINE API ENDPOINTS ---
@app.get("/")
def read_root():
    return {"status": "ok", "message": "BhoomiAI Odisha ML Service is running."}

@app.post("/predict_odisha_rice") # Using a specific endpoint name for our new model
def predict_yield(request: OdishaPredictionRequest):
    print(f"Received prediction request: {request.dict()}")

    # a. Create a dictionary from the input request
    input_data = {
        'Start_Year': [request.Start_Year],
        'Area': [request.Area]
    }
    
    # b. Perform One-Hot Encoding for the 'Season' feature, just like in training
    for season in ['Autumn', 'Winter', 'Kharif']:
        input_data[f'Season_{season}'] = [1 if request.Season == season else 0]

    # c. Convert the dictionary to a pandas DataFrame
    input_df = pd.DataFrame(input_data)

    # d. Ensure the columns are in the exact order the model expects
    input_df = input_df[MODEL_FEATURES]

    print(f"DataFrame sent to model:\n{input_df.to_string()}")

    # Make the prediction
    try:
        prediction = model.predict(input_df)
        predicted_yield = prediction[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Model prediction failed: {e}")


    # Return the prediction
    response_data = {
        "predicted_yield": round(predicted_yield, 2),
        "units": "kg/ha"
    }
    
    print(f"Sending response: {response_data}")
    return response_data