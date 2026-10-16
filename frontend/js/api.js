const API_URL = "http://127.0.0.1:8000/turnos";

async function pedir(url, opciones) { //async permite que una funcion maneje operacionse asincronas esto le avisa a JavaScript que dentro de ella se van a realizar tareas
  const respuesta = await fetch(url, opciones); //await pausa la ejecucion  de la funci hasta q se resuelva y devuelve el resul //envia peticiones HTTP al backend
  const datos = await respuesta.json(); //lo convierte en json
  if (!respuesta.ok) //lanza un error si la respuesta del backend no es exitosa 
  {
    throw { status: respuesta.status, data: datos }; //Fuerza manualmente un error en JavaScript
  }
  return datos;
}

export function getTurnos(filtros) { //exporta la funcion para obtener turnos desde el frontded 
  const params = new URLSearchParams(); //es paraq construir y manipular cadenas de consulta
  for (const clave in filtros) {
    if (filtros[clave] !== "") {  //Verifica que el campo del formulario de filtros no esté vacío.
      params.append(clave, filtros[clave]); // si tiene algun parametro escrito por el usuario lo guarda   
    }
  }
  return pedir(`${API_URL}?${params}`); //unimos la direccion de la api con los parametros formateados
}

//envia los datos de un nuevo turno al backend para crearlo y duvuelve la respuiesta 
export function createTurno(turno) {
  return pedir(API_URL, {
    method: "POST",   //method define el tipo de peticion HTTP que esta realizando  //esta solicitando crear un nuevo recurso 
    headers: { "Content-Type": "application/json" }, //le avisamos al servidor en q formato viaja
    body: JSON.stringify(turno) //lo psas a json
  });
}

export function modificar_turnoTurno(id, turno) { //le envia las modificaciones al servidor undando HTTp
  return pedir(`${API_URL}/${id}`, {
    method: "PUT", //para actualizar o modificar un recurso existente en el backend
    headers: { "Content-Type": "application/json" }, //le inidca fastapi que q los datos modificados viajan en json
    body: JSON.stringify(turno)
  });
}
//exportamos la funcion para eliminar un turno por su id
export function deleteTurno(id) {
  return pedir(`${API_URL}/${id}`, { method: "DELETE" });
}