from sqlalchemy import Table, Column, Integer, String, Text, DECIMAL, Enum, TIMESTAMP, MetaData
import enum

metadata = MetaData()

# --------------------------
# Modelo de Usuarios
# --------------------------
Usuario = Table(
    "usuarios",
    metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("nombre", String(100), nullable=False),
    Column("email", String(100), unique=True, nullable=False),
    Column("password", String(255), nullable=False),
    Column("rol", String(10), nullable=False),  # También puedes usar Enum si lo deseas
    Column("reset_token", String(255), nullable=True)
)

# --------------------------
# Modelo de Productos
# --------------------------
class CategoriaEnum(str, enum.Enum):
    Dulces = "Dulces"
    Granizadoras = "Granizadoras"
    Insumos = "Insumos"
    Ofertas = "Ofertas"

Producto = Table(
    "productos",
    metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("nombre", String(100), nullable=False),
    Column("imagen", Text),  # Solo guarda el nombre o la URL
    Column("descripcion", Text, nullable=False),
    Column("precio", DECIMAL(10, 2), nullable=False),
    Column("cantidad", Integer, nullable=False),
    Column("categoria", Enum(CategoriaEnum), nullable=False)
)
