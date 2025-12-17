Here is a professional, portfolio-ready description of your project. You can copy this directly into your GitHub `README.md` or use it as a case study on your CV/LinkedIn.

---

# 🏙️ Real Estate Titan: AI-Powered Property Valuation System

**Live Demo:** [https://real-estate-titan.netlify.app/](https://real-estate-titan.netlify.app/)

### 📖 Executive Summary

Real Estate Titan is a full-stack Machine Learning application designed to estimate property prices in Melbourne with high precision. Unlike simple calculators, it uses an ensemble of **XGBoost** and **Unsupervised Learning (K-Means)** to understand not just the house, but the *neighborhood*.

The system allows users to interactively select a location on a map, input property details, and receive an instant valuation along with a "Price Tier" classification (Budget, Mid-Market, Luxury).

---

### 🏗️ Architecture

The application follows a decoupled Microservices architecture:

* **Frontend:** A responsive **React (TypeScript)** application deployed on **Netlify**. It features a dynamic map interface using **Leaflet.js** for geospatial input.
* **Backend:** A high-performance **FastAPI** server deployed on **Render**. It handles data validation (Pydantic) and serves predictions via REST endpoints.
* **Intelligence Layer:** A hybrid ML pipeline built with **Scikit-Learn** and **XGBoost**. It features a custom "Brain" (`titan_brain.pkl`) that performs real-time feature engineering and inference.

---

### 🛠️ Technical Stack

| Component | Technologies Used |
| --- | --- |
| **Frontend** | React, TypeScript, Material UI (MUI), React-Leaflet, Axios |
| **Backend** | Python, FastAPI, Uvicorn, Pydantic |
| **Machine Learning** | XGBoost (Regressor + Classifier), K-Means Clustering, Scikit-Learn, Pandas, NumPy |
| **Deployment** | Netlify (Frontend), Render (Backend/Docker) |

---

### 🧠 The Machine Learning Pipeline

This project goes beyond basic regression by implementing a 3-stage pipeline:

1. **Spatial Clustering (Layer 1):**
* **Problem:** "Location" is vague. Lat/Lon coordinates are just numbers to a model.
* **Solution:** Applied **K-Means Clustering** on geospatial data to group properties into distinct "Neighborhood Clusters." This allows the model to learn that a house in Cluster #4 (Beachside) is inherently more valuable than Cluster #2 (Industrial), without needing zip codes.


2. **Price Tier Classification (Layer 2):**
* **Problem:** Predicting raw numbers can be volatile.
* **Solution:** Trained an **XGBoost Classifier** to first categorize the property into a Tier (Luxury vs. Standard vs. Budget). This adds context to the final number.


3. **Valuation Regression (Layer 3):**
* **Solution:** An **XGBoost Regressor** predicts the final dollar value, taking into account the Neighborhood Cluster and the Predicted Tier as engineered features.



---

### ✨ Key Features

* **📍 Geo-Spatial Intelligence:** Users can click anywhere on the map to set the property location. The AI instantly adjusts the valuation based on the coordinate's cluster.
* **⚡ Real-Time Inference:** The FastAPI backend delivers predictions in under 200ms.
* **🛡️ Robust Error Handling:** Full Type Safety with TypeScript (Frontend) and Pydantic (Backend) ensures data integrity.
* **📱 Responsive Design:** Built with Material UI to work seamlessly on mobile and desktop.

---

### 🚀 How to Run Locally

**1. Clone the Repository**

```bash
git clone https://github.com/devanshmayatra/real-estate-housing-ml-melbourn.git
cd real-estate-housing-ml-melbourn

```

**2. Start the Backend**

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload

```

**3. Start the Frontend**

```bash
cd frontend
npm install
npm start

```

*Open http://localhost:3000 to view the app.*

---

### 👨‍💻 Author

**Devansh**
*Computer Engineering Student & AI Developer*
*Mumbai, India*
