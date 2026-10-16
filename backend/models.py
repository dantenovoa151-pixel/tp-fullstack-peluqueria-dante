from pydantic import BaseModel, Field  

class TurnoBase(BaseModel): #definimos la base para crear un turno 
    cliente: str = Field(min_length=2)
    telefono: str = Field(min_length=6)
    servicio: str = Field(min_length=2)
    fecha: str
    hora: str
    precio: float = Field(gt=0)
    activo: bool = True

class TurnoCreate(TurnoBase):
    pass

class TurnoUpdate(BaseModel): # permite actualizar solo los campos que el usuario quierwe 
    cliente: str | None = Field(default=None, min_length=2)   
    telefono: str | None = Field(default=None, min_length=6)
    servicio: str | None = Field(default=None, min_length=2)
    fecha: str | None = None
    hora: str | None = None
    precio: float | None = Field(default=None, gt=0)
    activo: bool | None = None

class TurnoResponse(TurnoBase):
    id: int  