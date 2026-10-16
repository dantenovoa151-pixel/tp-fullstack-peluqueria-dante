TP Full-Stack  Gestión de Turnos para Peluquería

database: Configura la conexión a la base de datos SQLite y la creación inicial de las tablas.
models: Define los esquemas de Pydantic para validar tipos de datos y restricciones de los turnos.
managers: Contiene la lógica de negocio y ejecuta las consultas SQL directas (CRUD).
main.py (Backend): Inicializa FastAPI, define los endpoints/rutas HTTP y configura el middleware de CORS.
index.html y style.css: Define la estructura visual de la página y aplican la presentación visual/estilos.
api.js: Realiza las peticiones asíncronas (fetch) para enviar y pedir datos al servidor.
ui.js: Modifica el DOM directamente (renderiza las tarjetas, muestra errores y resetea el formulario).
main.js (Frontend): Es el controlador principal. Captura eventos (clicks, envíos de formulario) y coordina a api.js con ui.js

holaa este proyecto trata de una pagina pra pedir y registrar turnos en una peluqueria, usando FastAPI en el backend y HTML, CSS y JavaScript Vanilla en el frontend.

1. hacemos el paso a paso de como levantar este super proyecto

Para probar el proyecto en tu compu tenes que hacer estos comandos en la terminal

Paso 1 Entrar a la carpeta

cd tp-fullstackpeluqueria

Paso 2 Activar el entorno virtual e instalar librerías

 Activar el entorno 
.\venv\Scripts\activate

 Instalar las librerías necesarias
pip install -r backend/requirements.txt

Paso 3 Iniciar el Backend servidor de FastAPI

En la primera terminal ejecutás:

uvicorn backend.main:app --reload

La API va a quedar corriendo en: http://127.0.0.1:8000

Paso 4 Iniciar el Frontend 

Abrís otra terminal nueva y ejecutás

python -m http.server 5500 --directory frontend

Abrís tu navegador web y entrás a: http://localhost:5500

2. Endpoints del Backend rutas de la API

Esta es la lista de rutas que armé en FastAPI para manejar los turnos

Método HTTP ruta/endpoint

que hace?
GET
/turnos
Trae la lista de todos los turnos. Permite filtrar por cliente, fecha o rango de precio.

POST
/turnos
Crea un turno nuevo validando los datos con Pydantic.

GET
/turnos/{id}
Busca y devuelve los datos de un solo turno por su ID.

PUT
/turnos/{id}
Modifica los datos de un turno que ya existe.

DELETE
/turnos/{id}
Elimina un turno del sistema.

3 Justificación de arquitectura y respuestas teóricas

Ahora explico las decisiones de diseño que tomé para armar el super proyecto

1 ¿Cómo impacta la arquitectura en capas en el mantenimiento y escalabilidad?

Al separar el proyecto en dos capas claras backend para los datos y lógica Frontend para la pantalla el código queda mucho más ordenado si el día de mañana quiero cambiar el diseño visual o agregar un framework como react no tengo que tocar para nada el código de Python y si decido cambiar la forma de guardar los datos, el frontend ni se entera.

2 ¿Qué ventajas ofrece separar el JavaScript en distintos archivoss?

Dividí el código del navegador en tres archivos para no tener un solo script gigante e inentendible

api.js: Se encarga únicamente de hacer los fetch comunicarse con el servidor.

ui.js: Se encarga solo de tocar el HTML dibujar las tarjetas mostrar mensajes de error limpiar el formulario

main.js: Es el que junta a los dos escucha cuando el usuario hace un clic o manda un formulario llama a la API y luego a la UI para actualizar la pantalla.

3. ¿Por qué es importante validar tanto en el Frontend como en el Backend?

En el Frontend valida para darle una respuesta rápida al usuario por ejemplo, si se olvidó de llenar un campo se lo aviso al instante sin hacer viajar los datos por internet
Pero la validación del Backend es la verdaderamente importante por seguridad porque cualquiera podría saltearse la página web y mandarme datos falsos o rotos usando herramientas externas como Postman.

4. ¿Cómo maneja FastAPI la validación de datos con Pydantic y qué error devuelve?

En models.pydefiní con Pydantic los límites de cada dato por ejemplo que el precio sea mayor a cero o el nombre no esté vacío FastAPI revisa automáticamente todo lo que llega si alguien manda un dato mal por ejemplo precio -500 Pydantic lo frena de entrada y el servidor responde con un código de error 422 Unprocessable Entity explicando exactamente qué campo falló

5. ¿Qué rol cumplen los códigos de estado HTTP?

Sirven para que el Backend le avise al Frontend qué pasó con la consulta de forma estandarizada
200 OK / 201 Created: Salió todo perfecto.
400 Bad Request / 422 Unprocessable Entity: Hubo un error en los datos que envió el usuario.
404 Not Found: Se buscó o intentó editar/borrar un turno con un ID que no existe.
500 Internal Server Error: Ocurrió un error no esperado dentro del servidor.

6. ¿Qué función cumple CORS y por qué es necesario?

CORS es una protección que traen los navegadores por segurdad un navegador no deja que una página web cargada desde una dirección (localhost:5500) le pida datos a un servidor que está en otra dirección o puerto (localhost:8000) Para arreglar esto agregué el middleware de CORS en FastAPI dándole permiso explícito al puerto 5500 para que se puedan comunicar sin problemas

7. Si tuviera que pasar de la lista en memoria a una Base de Datos real, ¿qué cambiaría?

No tendría que tocar casi nada del Frontend En el Backend tendría que:
Conectar una base de datos (como PostgreSQL o SQLite) usando una librería como SQLAlchemy reemplazar la lista de Python (turnos_db = []) por consultas a tablas reales haciendo los INSERT, SELECT, UPDATE y DELETE en la base de datos