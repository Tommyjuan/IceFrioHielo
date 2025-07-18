import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from routes import user_routes, product_routes  # 👈 Se añade la parte de productos

app = FastAPI()

# Definir rutas de páginas HTML
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PAGES_DIR = os.path.join(BASE_DIR, "..", "pages")

app.mount("/pages", StaticFiles(directory=PAGES_DIR), name="pages")

# Servir archivos de imágenes (subidas)
UPLOADS_DIR = os.path.join(BASE_DIR, "static", "uploads")
os.makedirs(UPLOADS_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Cambiar en producción
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir rutas
app.include_router(user_routes.router)         # ✅ Tu login/registro intacto
app.include_router(product_routes.router)      # ✅ Ahora se incluye la parte de productos








"""from fastapi import FastAPI, HTTPException
from models.item import Item
import os
import json
 
app = FastAPI()
 
DB_FILE="items_db.json"
 
def CargarDB():
    if os.path.exists(DB_FILE):
        with open(DB_FILE, 'r') as f:
            data = json.load(f)
            print(f"Cargando base de datos desde {DB_FILE}")
            return {int(k): Item(**v) for k,v in data.items()}
    else:
        return {}
   
def guardarDB():
    with open(DB_FILE, 'w') as f:
        json.dump({str(k): v.model_dump() for k, v in items_db.items()}, f, indent=4)
 
 
items_db = CargarDB()
 
##ITEMS
 
@app.get('/items', response_model=list[Item])
async def items():
    return list(items_db.values())
 
@app.post('/item/add', response_model=Item)
async def AddItem(i:Item):
    i.id = len(items_db) + 1
    items_db[i.id]=i
    guardarDB()
    return i
 
@app.delete('/item/{item_id}', response_model=Item)
async def DeleteItem(item_id:int):
    if item_id in items_db:
        i = items_db[item_id]
        del items_db[item_id]
        guardarDB()
        return i
    else:
        raise HTTPException(status_code=404, detail="ID no existe")
   
@app.put('/item/{item_id}', response_model=Item)
async def PutItem(item_id:int, item:Item):
    if item_id in items_db:
        if item_id == item.id:
            items_db[item_id] = item
            guardarDB()
            return item
        else:
            raise HTTPException(status_code=400, detail="Se fumo la RQ")
    else:
        raise HTTPException(status_code=404, detail="ID no existe")
   """
 
##USUARIOS