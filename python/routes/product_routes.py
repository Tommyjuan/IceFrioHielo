from fastapi import APIRouter, UploadFile, Form, File, HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy import select, insert, update, delete
from database import SessionLocal
from models.item import Producto
import shutil, os

router = APIRouter()
UPLOAD_FOLDER = "static/uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/api/productos")
async def crear_producto(
    nombre: str = Form(...),
    descripcion: str = Form(...),
    precio: float = Form(...),
    cantidad: int = Form(...),
    categoria: str = Form(...),
    imagen: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    nombre_archivo = None
    if imagen:
        nombre_archivo = imagen.filename.replace(" ", "_")
        ruta = os.path.join(UPLOAD_FOLDER, nombre_archivo)
        with open(ruta, "wb") as buffer:
            shutil.copyfileobj(imagen.file, buffer)

    query = insert(Producto).values(
        nombre=nombre,
        descripcion=descripcion,
        precio=precio,
        cantidad=cantidad,
        categoria=categoria,
        imagen=nombre_archivo
    )
    db.execute(query)
    db.commit()
    return {"mensaje": "Producto creado"}

@router.get("/api/productos")
def obtener_productos(db: Session = Depends(get_db)):
    query = select(Producto)
    result = db.execute(query)
    productos = result.mappings().all()
    return productos

@router.get("/api/productos/{id}")
def obtener_producto(id: int, db: Session = Depends(get_db)):
    query = select(Producto).where(Producto.c.id == id)
    result = db.execute(query).mappings().fetchone()
    if result is None:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return result


@router.put("/api/productos/{id}")
async def actualizar_producto(
    id: int,
    nombre: str = Form(...),
    descripcion: str = Form(...),
    precio: float = Form(...),
    cantidad: int = Form(...),
    categoria: str = Form(...),
    imagen: UploadFile = File(None),
    imagen_actual: str = Form(None),  # ✅ NUEVO CAMPO
    db: Session = Depends(get_db)
):
    query = select(Producto).where(Producto.c.id == id)
    producto_actual = db.execute(query).fetchone()
    if producto_actual is None:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    nombre_archivo = producto_actual.imagen
    if imagen:
        nombre_archivo = imagen.filename.replace(" ", "_")
        ruta = os.path.join(UPLOAD_FOLDER, nombre_archivo)
        with open(ruta, "wb") as buffer:
            shutil.copyfileobj(imagen.file, buffer)
    elif imagen_actual:
        nombre_archivo = imagen_actual  # ✅ IMAGEN EXISTENTE

    update_query = (
        update(Producto)
        .where(Producto.c.id == id)
        .values(
            nombre=nombre,
            descripcion=descripcion,
            precio=precio,
            cantidad=cantidad,
            categoria=categoria,
            imagen=nombre_archivo
        )
    )
    db.execute(update_query)
    db.commit()
    return {"mensaje": "Producto actualizado"}

@router.delete("/api/productos/{id}")
def eliminar_producto(id: int, db: Session = Depends(get_db)):
    query = delete(Producto).where(Producto.c.id == id)
    result = db.execute(query)
    db.commit()
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return {"mensaje": "Producto eliminado"}
