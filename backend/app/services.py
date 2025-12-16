import joblib
import pandas as pd
import os

# Load model relative to this file
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "titan_brain.pkl")

brain = joblib.load(MODEL_PATH)

def predict_price(data: dict):
    # Convert dict to DataFrame
    input_df = pd.DataFrame([data])
    
    # Feature Engineering Pipeline
    input_df['Regionname'] = brain['le_region'].transform(input_df['Regionname'])
    input_df['BuildingArea'] = brain['imputer'].transform(input_df[['BuildingArea']])
    input_df['Bedroom2'] = input_df['Rooms'] # Assumption
    input_df['Location_Cluster'] = brain['kmeans'].predict(input_df[['Lattitude', 'Longtitude']])
    
    # Scale
    X_input = input_df[brain['feature_names']]
    X_scaled = brain['scaler'].transform(X_input)
    
    # Predict
    price = float(brain['regressor'].predict(X_scaled)[0])
    tier_idx = brain['classifier'].predict(X_scaled)[0]
    tier_label = brain['le_tier'].inverse_transform([tier_idx])[0]
    
    print(
        {
        "predicted_price": price,
        "tier": tier_label,
        "cluster_id": int(input_df['Location_Cluster'][0])
    }
    )
    
    return {
        "predicted_price": price,
        "tier": tier_label,
        "cluster_id": int(input_df['Location_Cluster'][0])
    }