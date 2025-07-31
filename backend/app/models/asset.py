from pydantic import BaseModel

class Asset(BaseModel):
    id: int
    asset_name: str
    asset_id: str
    asset_category: str
    quantity_total: int
    quantity_left: int
