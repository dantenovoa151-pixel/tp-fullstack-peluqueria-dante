import sqlite3 

ruta_base = "turnos.db" 

def conectar_base():
    conn = sqlite3.connect(ruta_base, check_same_thread=False) #abrimos la conexion  y check lo usamos para recibir varias peticiones 
    conn.row_factory = sqlite3.Row #lo pasamos a diccionario
    try:
        yield conn # entrega la conexion y la pasua la funcion mientras se ejecuta la consulta
    finally:        #la intruccion siempre se va ejecutar
        conn.close()  #cerramos la conexion

def preparar_base():
    conn = sqlite3.connect(ruta_base)  #abrimos la conexion con turnos.db 
    cursor = conn.cursor() #creamos el objeto cursor 
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS turnos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cliente TEXT NOT NULL,
            telefono TEXT NOT NULL,
            servicio TEXT NOT NULL,
            fecha TEXT NOT NULL,
            hora TEXT NOT NULL,
            precio REAL NOT NULL,
            activo INTEGER DEFAULT 1
        )
    """)
    conn.commit()
    conn.close()


