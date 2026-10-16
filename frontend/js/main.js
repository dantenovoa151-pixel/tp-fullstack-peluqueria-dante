import * as api from './api.js';
import * as ui from './ui.js';
//importamos la dependensias de los otrros modulos 

async function cargarTurnos() { //espera la respuesta de la api
  const filtros = { //leee el contenido de cada una 
    cliente: document.getElementById('filtro-cliente').value,
    fecha: document.getElementById('filtro-fecha').value,
    precio_min: document.getElementById('filtro-precio-min').value,
    precio_max: document.getElementById('filtro-precio-max').value
  };

  ui.mostrarLoading(true); //esto le avisa aL usuario que se etsa prosesando su solisitud 
  try {
    const turnos = await api.getTurnos(filtros); //Pausa la ejecución de la función hasta que el servidor FastAPI devuelve la respuesta
    ui.mostrarTurnos(turnos, editarTurno, borrarTurno); // si fue exitosa da cod 200
  } catch (error) {
    ui.mostrarMensaje('No se pudo conectar con la API.', true);
  } finally {
    ui.mostrarLoading(false); //se encarga q se apage
  }
}

function editarTurno(turno) {
  ui.cargarFormulario(turno);
}

async function borrarTurno(id) { 
  if (!confirm('¿Seguro que querés eliminar este turno?')) return;

  ui.mostrarLoading(true); //Enciende el spinner de carga antes de comunicarse con la API para dar feedback visual de que el sistema está procesando la solicitud
  try {
    await api.deleteTurno(id); //envia la solisitud http al servidor
    ui.mostrarMensaje('Turno eliminado');
    await cargarTurnos(); //se borra de la pantalla 
  } catch (error) { 
    ui.mostrarMensaje('No se pudo eliminar el turno.', true);
  } finally {
    ui.mostrarLoading(false);
  }
}

async function guardarTurno(evento) { // se prende cuando el usuario da guardar 
  evento.preventDefault(); //evita q se recarge la pag 
  ui.limpiarErrores();

  const id = document.getElementById('turno-id').value;
  const turno = {
    cliente: document.getElementById('cliente').value,
    telefono: document.getElementById('telefono').value,
    servicio: document.getElementById('servicio').value,
    fecha: document.getElementById('fecha').value,
    hora: document.getElementById('hora').value,
    precio: parseFloat(document.getElementById('precio').value),
    activo: document.getElementById('activo').checked
  };

  ui.mostrarLoading(true); // la peticion htp se esta procesando en segundo plano 
  try {
    if (id) {
      await api.modificar_turnoTurno(id, turno);
      ui.mostrarMensaje('Turno actualizado');
    } else {
      await api.createTurno(turno);
      ui.mostrarMensaje('Turno creado');
    }
    ui.resetFormulario();
    await cargarTurnos(); //Vuelve a consultar la API para actualizar el listado
  } catch (error) {
    if (error.status === 422) { // se activa cuando algo esta mal como un precio en negativo 
      ui.mostrarErrores(error.data);
    } else if (error.status) {
      ui.mostrarMensaje('Error del servidor (' + error.status + ')', true);
    } else {
      ui.mostrarMensaje('No se pudo conectar con la API.', true);
    }
  } finally {
    ui.mostrarLoading(false);
  }
}

// Eventos de botones 
document.getElementById('form-turno').addEventListener('submit', guardarTurno);
document.getElementById('btn-cancelar').addEventListener('click', ui.resetFormulario);

document.getElementById('form-filtros').addEventListener('submit', function(e) {
  e.preventDefault();
  cargarTurnos();
});

document.getElementById('btn-limpiar-filtros').addEventListener('click', () => { // Busca en el DOM el botón asignado a la acción de resetear
  document.getElementById('form-filtros').reset();
  cargarTurnos();
});

cargarTurnos();