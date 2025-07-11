from sqlalchemy import Table, Column, Integer, String, MetaData

metadata = MetaData()

Usuario = Table(
    "usuarios",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("nombre", String(100), nullable=False),
    Column("email", String(100), unique=True, nullable=False),
    Column("password", String(255), nullable=False),
    Column("rol", String(10), nullable=False),  # ✅ Podrías usar Enum también
    Column("reset_token", String(255), nullable=True)
)



"""from pydantic import BaseModel


class Item(BaseModel):
    id: int 
    nombre: str """