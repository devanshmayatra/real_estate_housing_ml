from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.schemas import HouseInput, PredictionOutput
from app.services import predict_price
import uvicorn

app = FastAPI(title="Real Estate Titan API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Change this to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/predict", response_model=PredictionOutput)
def predict(data: HouseInput):
    return predict_price(data.dict())

# Render requires this to start
if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000)