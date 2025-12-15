from pydantic import BaseModel

class HouseInput(BaseModel):
    Rooms: int
    Distance: float
    Bathroom: int
    Car: int
    Landsize: float
    BuildingArea: float
    YearBuilt: int
    Lattitude: float
    Longtitude: float
    Regionname: str

class PredictionOutput(BaseModel):
    predicted_price: float
    tier: str
    cluster_id: int