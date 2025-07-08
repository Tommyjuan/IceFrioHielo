from fastapi import FastAPI, HTTPException
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
   
 
##USUARIOS