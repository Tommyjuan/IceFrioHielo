from pydantic import BaseModel, EmailStr
from typing import Optional

class UserRegister(BaseModel):
    nombre: str
    email: EmailStr
    password: str
    rol: Optional[str] = "cliente"  # ✅ Por defecto será 'cliente'

class UserLogin(BaseModel):
    email: EmailStr
    password: str

# ✅ Agrega este nuevo esquema para la recuperación
class EmailOnly(BaseModel):
    email: EmailStr
