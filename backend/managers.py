class TurnoManager:
    # Recibe la conexión que le entrega conectar_base
    def __init__(self, db): #recibimos la conexion a la base de datos 
        self.db = db

    def obtener_todos(self, cliente=None, fecha=None, precio_min=None, precio_max=None): #obtenemos todo los turnos aplicadno filtros
        sql = "SELECT * FROM turnos WHERE 1=1" #añade filtro dinamicamnete 
        valores = []


#aplica filtros dinamicos a la consulta sql segun los parametros que recibimos 
        if cliente:
            sql += " AND cliente LIKE ?" #agrega el filtro de cliente a sql
            valores.append(cliente)
        if fecha:
            sql += " AND fecha = ?"
            valores.append(fecha)
        if precio_min is not None:
            sql += " AND precio >= ?"
            valores.append(precio_min)
        if precio_max is not None:
            sql += " AND precio <= ?"
            valores.append(precio_max)

        filas = self.db.execute(sql, valores).fetchall() #ejecutamos la consulta sql
        return [dict(fila) for fila in filas] #convierte cada fila en diccionario 

    def obtener_por_id(self, id: int):  
        fila = self.db.execute("SELECT * FROM turnos WHERE id = ?", (id,)).fetchone() # treae el turno espesifico con el id, fetchone recupera la primera fila de resultado id
        if fila is None:
            return None
        return dict(fila) # si se encontro lo devuelve en diccipnario 

    def create(self, data): #inserta los datos del nuevo turno en la tabla  de la base de datps y lo vevuelve con su id
        cursor = self.db.execute(
            "INSERT INTO turnos (cliente, telefono, servicio, fecha, hora, precio, activo) "
            "VALUES (?, ?, ?, ?, ?, ?, ?)",
            (data.cliente, data.telefono, data.servicio, data.fecha, data.hora, data.precio, data.activo),
        )
        self.db.commit()
        return self.obtener_por_id(cursor.lastrowid) #devuelve un id unico

    def modificar_turno(self, id: int, data):  # verificamos s el turno exixste con ese id y se interrumpes si no esta 
        turno = self.obtener_por_id(id)
        if turno is None:
            return None

        # Solo los campos que el cliente mando 
        cambios = data.model_dump(exclude_unset=True)
        turno.update(cambios) # Actualizamos el diccionario con los nuevos datos recibidos

        self.db.execute(  # Ejecutamos la sentencia SQL UPDATE obligatoria para guardar cambios en la base de datos
            "UPDATE turnos SET cliente = ?, telefono = ?, servicio = ?, fecha = ?, "
            "hora = ?, precio = ?, activo = ? WHERE id = ?",
            (turno["cliente"], turno["telefono"], turno["servicio"], turno["fecha"],
             turno["hora"], turno["precio"], turno["activo"], id),
        )
        self.db.commit()
        return self.obtener_por_id(id)

    def delete(self, id: int): #eliminasmos el registro de la base d datos correspondiente al id 
        cursor = self.db.execute("DELETE FROM turnos WHERE id = ?", (id,))
        self.db.commit()
        return cursor.rowcount > 0 #devuelve true si no se elimino nd