# train.py
import pandas as pd
import numpy as np
import joblib  # <--- The Tool to Save/Load models
from sklearn.datasets import make_blobs
from sklearn.model_selection import train_test_split
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.cluster import KMeans
from sklearn.ensemble import RandomForestClassifier, VotingClassifier
from sklearn.svm import SVC
from xgboost import XGBClassifier, XGBRegressor

# --- 1. GENERATE DATA (Same as before) ---
def generate_data():
    print("Generating Data...")
    np.random.seed(42)
    n = 2000
    coords, c_ids = make_blobs(n_samples=n, centers=8, cluster_std=0.4, random_state=42)
    lat, lon = coords[:, 0] * 0.1 - 37.81, coords[:, 1] * 0.1 + 144.96
    rooms = np.random.randint(1, 6, n)
    base_price = 300000
    price = base_price + (rooms * 150000) + (c_ids * 50000) + np.random.normal(0, 50000, n)
    
    df = pd.DataFrame({
        'Rooms': rooms,
        'Price': price,
        'Distance': np.random.uniform(2, 15, n),
        'Bedroom2': rooms,
        'Bathroom': np.random.randint(1, 4, n),
        'Car': np.random.randint(0, 3, n),
        'Landsize': np.abs(np.random.normal(400, 100, n)),
        'BuildingArea': np.random.normal(150, 50, n),
        'YearBuilt': np.random.randint(1900, 2020, n),
        'Lattitude': lat,
        'Longtitude': lon,
        'Regionname': [f"Region_{c%3}" for c in c_ids]
    })
    
    # Tier Target
    p33, p66 = np.percentile(price, [33, 66])
    df['Price_Tier'] = df['Price'].apply(lambda x: 'High' if x > p66 else ('Mid' if x > p33 else 'Low'))
    return df

# --- 2. TRAIN ---
def train():
    # df = pd.read_csv('data/final_melb_housing_data.csv')
    # print("Data Loaded. Starting Training...")
    # df.drop('Source', axis=1, inplace=True)  # Drop unnecessary columns if any
    
    df = generate_data()
    
    # A. Preprocessing
    imputer = SimpleImputer(strategy='median')
    scaler = StandardScaler()
    le_region = LabelEncoder()
    le_tier = LabelEncoder()
    
    # Fill & Encode
    df['BuildingArea'] = imputer.fit_transform(df[['BuildingArea']])
    df['Regionname'] = le_region.fit_transform(df['Regionname'])
    
    # B. Layer 1: KMeans
    kmeans = KMeans(n_clusters=10, random_state=42)
    df['Location_Cluster'] = kmeans.fit_predict(df[['Lattitude', 'Longtitude']])
    
    # Prepare X, y
    X = df.drop(columns=['Price', 'Price_Tier'])
    y_reg = df['Price']
    y_cls = le_tier.fit_transform(df['Price_Tier'])
    
    # Scale Features
    X_scaled = scaler.fit_transform(X)
    
    # C. Layer 2: Classifier
    clf = XGBClassifier(use_label_encoder=False, eval_metric='mlogloss', random_state=42)
    clf.fit(X_scaled, y_cls)
    
    # D. Layer 3: Regressor
    reg = XGBRegressor(n_estimators=100, random_state=42)
    reg.fit(X_scaled, y_reg)
    
    print("✅ Model Trained Successfully.")

    # --- 3. SAVE THE BRAIN ---
    # We pack everything into a dictionary so we don't lose any part
    brain = {
        'imputer': imputer,
        'scaler': scaler,
        'le_region': le_region,
        'le_tier': le_tier,
        'kmeans': kmeans,
        'classifier': clf,
        'regressor': reg,
        'feature_names': list(X.columns) # Save col names to ensure order matches
    }
    
    joblib.dump(brain, 'titan_brain.pkl')
    print("✅ Brain saved to 'titan_brain.pkl'")

if __name__ == "__main__":
    train()