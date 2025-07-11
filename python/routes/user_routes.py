from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from schemas.user_schema import UserRegister, UserLogin
from models.item import Usuario
from database import conn
from uuid import uuid4

router = APIRouter(prefix="/api/auth")

# REGISTRO
@router.post("/register")
def register(user: UserRegister):
    existing = conn.execute(Usuario.select().where(Usuario.c.email == user.email)).fetchone()
    if existing:
        raise HTTPException(status_code=400, detail="El correo ya está registrado")

    nuevo = Usuario.insert().values(
        nombre=user.nombre,
        email=user.email,
        password=user.password,
        rol="cliente"  # ✅ Se fuerza rol cliente
    )
    conn.execute(nuevo)
    conn.commit()  # ✅ Guarda en la base de datos
    return {"message": "Usuario registrado correctamente"}


# ✅ REGISTRAR ADMINISTRADOR CON TOKEN
@router.post("/register-admin")
def register_admin(user: UserRegister, token: str = ""):
    if token != "CLAVE-SECRETA-123":  # Puedes cambiar esta clave secreta
        raise HTTPException(status_code=403, detail="Token inválido")

    existing = conn.execute(Usuario.select().where(Usuario.c.email == user.email)).fetchone()
    if existing:
        raise HTTPException(status_code=400, detail="El correo ya está registrado")

    # ✅ Insertar sin transacción duplicada
    conn.execute(
        Usuario.insert().values(
            nombre=user.nombre,
            email=user.email,
            password=user.password,
            rol="admin"
        )
    )

    # ✅ Forzar commit si tu motor lo necesita
    conn.commit()

    return {"message": "Administrador registrado correctamente"}



# LOGIN
@router.post("/login")
def login(user: UserLogin):
    usuario = conn.execute(
        Usuario.select().where(
            (Usuario.c.email == user.email) & (Usuario.c.password == user.password)
        )
    ).fetchone()

    if not usuario:
        raise HTTPException(status_code=401, detail="Correo o contraseña incorrectos")
    
    return {"message": usuario.rol}


# ✅ Nuevo esquema limpio
class EmailOnly(BaseModel):
    email: EmailStr

# ✅ RECUPERAR CONTRASEÑA
@router.post("/forgot-password")
def forgot_password(data: EmailOnly):
    usuario = conn.execute(Usuario.select().where(Usuario.c.email == data.email)).fetchone()
    if not usuario:
        raise HTTPException(status_code=404, detail="Correo no encontrado")

    token = str(uuid4())
    conn.execute(
        Usuario.update().where(Usuario.c.id == usuario.id).values(reset_token=token)
    )
    conn.commit()  # ⚠️ Necesario
    return {"message": "Token generado", "token": token}

# ✅ VERIFICAR TOKEN
@router.get("/verify-token")
def verify_token(token: str):
    usuario = conn.execute(Usuario.select().where(Usuario.c.reset_token == token)).fetchone()
    if not usuario:
        raise HTTPException(status_code=400, detail="Token inválido")
    return {"message": "Token válido"}

# ✅ CAMBIAR CONTRASEÑA
@router.post("/reset-password")
def reset_password(data: dict):
    usuario = conn.execute(Usuario.select().where(Usuario.c.reset_token == data["token"])).fetchone()
    if not usuario:
        raise HTTPException(status_code=400, detail="Token inválido")

    conn.execute(
        Usuario.update()
        .where(Usuario.c.id == usuario.id)
        .values(password=data["nueva_contrasena"], reset_token=None)
    )
    conn.commit()
    return {"message": "Contraseña cambiada exitosamente"}