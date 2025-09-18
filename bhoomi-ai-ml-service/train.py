# File: train_master.py (Final version, no rainfall)
import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import r2_score, mean_absolute_error
import sys

# --- 1. CONFIGURATION ---
DATASET_PATH = 'odisha_master_data_final.csv'
MODEL_FILENAME = 'bhoomi_ai_final_model.joblib'

# --- The final, powerful feature set for our model ---
# Note: 'Annual_Rainfall' has been removed.
FEATURES = [
    'Year', 
    'Area', 
    'N', 
    'P', 
    'K', 
    'Cropping_Intensity',
    'Live_Temperature', 
    'Live_Humidity',
    # These will be created by get_dummies
    'Season_Autumn', 
    'Season_Kharif',
    'Season_Winter'
]
TARGET = 'Yield'

# --- 2. DATA LOADING & FEATURE ENGINEERING ---
print("--- Training the Final BhoomiAI Model ---")
try:
    print(f"STEP 1: Loading master dataset from '{DATASET_PATH}'...")
    df = pd.read_csv(DATASET_PATH)
except FileNotFoundError:
    print(f"FATAL ERROR: Master dataset not found. Please run master_preprocess.py first.")
    sys.exit()

print("STEP 2: Performing final feature engineering (One-Hot Encoding)...")
# Convert the 'Season' text column into numerical columns the model can understand
df = pd.get_dummies(df, columns=['Season'], prefix='Season', dtype=int)

# Just in case, we'll check if any columns are missing.
for feature in FEATURES:
    if feature not in df.columns:
        print(f"FATAL ERROR: Expected feature '{feature}' not found in the dataset after processing.")
        sys.exit()

print("Feature engineering complete.")

# --- 3. MODEL TRAINING & EVALUATION ---
print("STEP 3: Splitting data and training the Random Forest model...")
X = df[FEATURES]
y = df[TARGET]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Using a robust configuration for the final model
model = RandomForestRegressor(n_estimators=150, random_state=42, n_jobs=-1, min_samples_leaf=3)
model.fit(X_train, y_train)

print("STEP 4: Evaluating final model performance...")
y_pred = model.predict(X_test)
r2 = r2_score(y_test, y_pred)
mae = mean_absolute_error(y_test, y_pred)

print("\n--- FINAL MODEL EVALUATION METRICS ---")
print(f"  R-squared (R2 Score): {r2:.4f}")
print(f"  Mean Absolute Error (MAE): {mae:.2f} kg/ha")
print("--------------------------------------\n")

# --- 4. SAVING THE MODEL ---
print(f"STEP 5: Saving final trained model to '{MODEL_FILENAME}'...")
joblib.dump(model, MODEL_FILENAME)
print(f"--- Mission Complete! Final Model '{MODEL_FILENAME}' is ready for deployment. ---")