from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Configura tu conexión a MySQL
DATABASE_URL = "mysql+pymysql://root:SEBASTIAN12@localhost/icefriohielo"

# Motor de la base de datos
engine = create_engine(DATABASE_URL, echo=True)

# Crea la sesión
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base para tus modelos
Base = declarative_base()
conn = engine.connect()
