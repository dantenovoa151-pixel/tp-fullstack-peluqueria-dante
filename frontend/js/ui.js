export function mostrarLoading(mostrar) {  //mostramos o ocultamos el indicador de carga segun el valor inidaco
  document.getElementById('loading').style.display = mostrar ? 'block' : 'none';
}

export function mostrarMensaje(texto, esError = false) { //mustra si fue creado o no 
  const banner = document.getElementById('mensaje-general'); //capturamos el elemento html 
  banner.textContent = texto;
  banner.className = esError ? 'banner error' : 'banner exito';
  banner.style.display = 'block'; 
}
//limpia el contenedor en el dom verifica si hay turnos disponibles y si no hay mustra un mensaje 
export function mostrarTurnos(turnos, onEditar, onBorrar) {  
  const lista = document.getElementById('lista-turnos');
  lista.innerHTML = '';

  if (turnos.length === 0) {
    lista.innerHTML = '<p>No hay turnos para mostrar.</p>';
    return; 
  }
//aca le asignamos el estilo de la targeta insertat los datos del turno y agrega los botones pera editar y borrar antes de agregarla a la lista 
  for (const t of turnos) {  //es el responsable de generar dinámicamente cada tarjeta de turno en el DOM
    const card = document.createElement('div'); //Crea un nuevo elemento <div> en memoria antes de inyectarlo en la página.
    card.className = t.activo ? 'card' : 'card inactivo';
    card.innerHTML = `
      <h3>${t.cliente}</h3>
      <p>Teléfono: ${t.telefono}</p>
      <p>Servicio: ${t.servicio}</p>
      <p>Fecha y hora: ${t.fecha} ${t.hora}</p>
      <p>Precio: $${t.precio}</p>
      <p>Estado: ${t.activo ? 'Activo' : 'Inactivo'}</p>
      <button class="btn-editar">Editar</button>
      <button class="btn-borrar">Eliminar</button>
    `;
    card.querySelector('.btn-editar').addEventListener('click', () => onEditar(t));
    card.querySelector('.btn-borrar').addEventListener('click', () => onBorrar(t.id));
    lista.appendChild(card); // se adjunta al contenedor principal
  }
}

// Muestra los errores 422 debajo de cada campo
export function mostrarErrores(datos) {
  limpiarErrores();
  if (datos && Array.isArray(datos.detail)) { //si falla fastapi responde con un error 422
    for (const error of datos.detail) { //recorre cadda error enviado 
      const campo = error.loc[1]; //extraemos el nobre del campo q fallo 
      const span = document.getElementById('error-' + campo); //buscamoos en el html
      if (span) span.textContent = error.msg;
    }
  } else {
    mostrarMensaje('Hay datos inválidos en el formulario.', true);
  }
}

export function limpiarErrores() { 
  for (const span of document.querySelectorAll('.error-text')) { //busca todos los elementos HTML que tengan la clase CSS error-tex
    span.textContent = ''; //limpia el mensaje de error anterior que tuviera escrito.
  }
}
//rellena los campos del formulario con los datos de un turno existete para permitir su edicion 
export function cargarFormulario(t) {
  document.getElementById('turno-id').value = t.id;
  document.getElementById('cliente').value = t.cliente;
  document.getElementById('telefono').value = t.telefono;
  document.getElementById('servicio').value = t.servicio;
  document.getElementById('fecha').value = t.fecha;
  document.getElementById('hora').value = t.hora;
  document.getElementById('precio').value = t.precio;
  document.getElementById('activo').checked = t.activo;
  document.getElementById('form-titulo').textContent = 'Editar Turno';
  document.getElementById('btn-cancelar').style.display = 'inline';
}
