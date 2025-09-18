# File: master_preprocess.py (Final Version - NO RAINFALL)
import pandas as pd
import sys

print("--- Starting Final Master Data Fusion (No Rainfall) ---")

# --- 1. LOAD DATASETS ---
try:
    print("STEP 1: Loading required data files...")
    df_yield = pd.read_csv('odisha_yield_clean_seasonal.csv')
    df_fert = pd.read_csv('fertilizer_usage.csv', header=1)
    df_land = pd.read_csv('cropping_intensity.csv')
    print("All files loaded successfully.")
except FileNotFoundError as e:
    print(f"FATAL ERROR: A required data file is missing: {e}. Please ensure CSVs are in the folder.")
    sys.exit()

# --- 2. CLEAN & PREPARE EACH DATASET ---
print("\nSTEP 2: Cleaning and preparing datasets...\n")

# a) Prepare Land Usage Data
print("  - Processing Land Usage data...")
df_land.rename(columns=lambda col: col.strip(), inplace=True)
df_land.rename(columns={'SL.': 'SL', 'YEAR': 'Year', 'CROPPING INTENSITY (%)': 'Cropping_Intensity'}, inplace=True, errors='ignore')
df_land = df_land[['Year', 'Cropping_Intensity']]
print("    Land usage data cleaned.")

# b) Prepare Fertilizer Data
print("  - Processing Fertilizer data...")
df_fert.rename(columns=lambda col: col.strip(), inplace=True)
df_fert.rename(columns={'YEAR': 'Year', 'N': 'N', 'P': 'P', 'K': 'K'}, inplace=True, errors='ignore')
df_fert = df_fert[['Year', 'N', 'P', 'K']]
print("    Fertilizer data cleaned.")

# c) Standardize the 'Year' column across all dataframes
def format_year(df):
    # This robust function will find the 'Year' column regardless of its exact name
    year_col_name = [col for col in df.columns if 'YEAR' in col.upper()][0]
    df.rename(columns={year_col_name: 'Year'}, inplace=True, errors='ignore')
    
    if 'Year' in df.columns:
        df['Year'] = df['Year'].astype(str).str.split('-').str[0].str.strip()
        df['Year'] = pd.to_numeric(df['Year'], errors='coerce')
        df.dropna(subset=['Year'], inplace=True)
        df['Year'] = df['Year'].astype(int)
    return df

df_yield = format_year(df_yield)
df_fert = format_year(df_fert)
df_land = format_year(df_land)
print("  All 'Year' columns standardized to a single integer.\n")

# --- 3. FUSE THE DATASETS ---
print("STEP 3: Fusing datasets based on the year...")
master_df = df_yield.copy()
# Merge the remaining feature dataframes
master_df = pd.merge(master_df, df_fert, on='Year', how='left')
master_df = pd.merge(master_df, df_land, on='Year', how='left')

# --- 4. FINAL CLEANUP ---
print("\nSTEP 4: Finalizing the master dataset...")

# Add placeholders for live data a user might provide.
master_df['Live_Temperature'] = 27.5
master_df['Live_Humidity'] = 80.0

# Define which columns should be numeric
numeric_cols = ['Yield', 'Area', 'N', 'P', 'K', 'Cropping_Intensity']
for col in numeric_cols:
    master_df[col] = pd.to_numeric(master_df[col], errors='coerce')

original_rows = len(master_df)
master_df.dropna(inplace=True) 
cleaned_rows = len(master_df)
print(f"  Removed {original_rows - cleaned_rows} rows with missing data after merging.")

OUTPUT_PATH = 'odisha_master_data_final.csv'
master_df.to_csv(OUTPUT_PATH, index=False)

print(f"\n--- Mission Complete! Master dataset saved to '{OUTPUT_PATH}' ---")
print("First 5 rows of your master dataset:")
print(master_df.head())