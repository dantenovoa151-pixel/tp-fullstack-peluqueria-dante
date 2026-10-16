import sqlite3
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware

from backend.database import conectar_base, preparar_base
from backend.models import TurnoCreate, TurnoUpdate, TurnoResponse
from backend.managers import TurnoManager

# Creamos la app y creamos la tabla si no existe
app = FastAPI(title="API Turnos Peluquería")
preparar_base()

# CORS permite que el frontend otro puerto hable con la API
app.add_middleware( # middleware es para permitir peticiones desde otros dominios 
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#recuperamos todos los turnps aplicando filtros opcionale s
@app.get("/turnos", response_model=list[TurnoResponse])
def listar_turnos(
    cliente: str | None = None,
    fecha: str | None = None,
    precio_min: float | None = None,
    precio_max: float | None = None,
    db: sqlite3.Connection = Depends(conectar_base),
):
    manager = TurnoManager(db)
    return manager.obtener_todos()  #Llama correctamente a la función que devuelve la lista

#obtiiene un turno espesifico por su id y devueve el erro 404 si no se encuentra
@app.get("/turnos/{id}", response_model=TurnoResponse)
def obtener_turno(id: int, db: sqlite3.Connection = Depends(conectar_base)):
    manager = TurnoManager(db)
    turno = manager.obtener_por_id(id)
    if turno is None:
        raise HTTPException(status_code=404, detail="Turno no encontrado")
    return turno

#cramos un nuevo turno con los datos proporcionados y lo devuelve 
@app.post("/turnos", response_model=TurnoResponse, status_code=201)
def crear_turno(data: TurnoCreate, db: sqlite3.Connection = Depends(conectar_base)):
    manager = TurnoManager(db)
    return manager.create(data)

#actualiza los fatos existents y devuelve el turno modificado
@app.put("/turnos/{id}", response_model=TurnoResponse)
def actualizar_turno(id: int, data: TurnoUpdate, db: sqlite3.Connection = Depends(conectar_base)):
    manager = TurnoManager(db)
    turno = manager.modificar_turno(id, data)
    if turno is None:
        raise HTTPException(status_code=404, detail="Turno no encontrado")
    return turno

#elimina un turno espesifico por su id
@app.delete("/turnos/{id}")
def eliminar_turno(id: int, db: sqlite3.Connection = Depends(conectar_base)):
    manager = TurnoManager(db)
    if not manager.delete(id):
        raise HTTPException(status_code=404, detail="Turno no encontrado")
    return {"mensaje": "Turno eliminado correctamente"}