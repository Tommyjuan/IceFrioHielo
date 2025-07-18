from pydantic import BaseModel
from typing import Optional

class ProductoBase(BaseModel):
    nombre: str
    descripcion: str
    precio: float
    cantidad: int
    categoria: str

class ProductoCreate(ProductoBase):
    pass

class ProductoResponse(ProductoBase):
    id: int
    imagen: Optional[str]

    class Config:
        orm_mode = True
