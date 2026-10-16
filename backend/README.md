TP Full-Stack  Gestión de Turnos para Peluquería
Dante Novoa 6to5ta G1

database: Configura la conexión a la base de datos SQLite y la creación inicial de las tablas.
models: Define los esquemas de Pydantic para validar tipos de datos y restricciones de los turnos.
managers: Contiene la lógica de negocio y ejecuta las consultas SQL directas CRUD
main.py Backend: Inicializa FastAPI define los endpoints rutas HTTP y configura el middleware de CORS
api.js: Realiza las peticiones asincronas fetch para enviar y pedir datos al servidor
ui.js: Modifica el DOM directamente renderiza las tarjetas muestra errores y resetea el formulario
main.js Frontend: Es el controlador principal Captura eventos clicks envíos de formulario y coordina a api.js con ui.js

holaa este proyecto trata de una pagina pra pedir y registrar turnos en una peluqueria, usando FastAPI en el backend y HTML, CSS y JavaScript en el frontend

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

Método HTTP ruta endpoint

que hace?
GET
/turnos
Trae la lista de todos los turnos permite filtrar por cliente fecha o rango de precio

POST
/turnos
Crea un turno nuevo validando los datos con Pydantic

GET
/turnos/{id}
Busca y devuelve los datos de un solo turno por su ID

PUT
/turnos/{id}
Modifica los datos de un turno que ya existe

DELETE
/turnos/{id}
Elimina un turno del sistema

3 Justificación de arquitectura y respuestas teoricas

Ahora explico las decisiones de diseño que tome para armar el super proyecto

Pregunta1 El ciclo de vida de una petición
Cuando alguien hace clic en guardar el JavaScript de main.js frena el envio por defecto del formulario con e.preventDefault() ahi junta los datos de los inputs y llama a api.js, que manda un POST con los datos en formato JSON a FastAPI

En el backend fastAPI recibe el JSON y Pydantic valida que todo este en regla si los datos estan bien el controlador llama al manager que se encarga de hacer la consulta INSERT para guardar el turno en la base de datos SQLite una vez guardado el servidor responde con un código 201 y el objeto recien creado api.js recibe esa confirmacion main.js le avisa a ui.js para limpiar el formulario y volvemos a cargar la lista para que el nuevo turno aparezca al instante en la pantalla

Pregunta2 ¿Quién es el cliente y quién es el servidor?
en mi super app el cliente es el navegador web que corre en el puerto 5500 se encarga unicamente de mostrar la interfaz visual html y css y reaccionar a lo que hace el usuario con JavaScript el servidor es la API en Python con FastAPI corriendo en el puerto 800 que es la que maneja la logica valida y se conecta a la base de datos

Pregunta3 HTTP como lenguaje comun
usamos los metodos HTTP para indicarle al servidor qur queremos hacer con los datos get para pedir o traer turnos ppost para crear uno nuevo put para editarlo y delete para borrarlo

Para saber que paso con cada pedido usamos los codigos
200 OK Cuando pedimos modificamos o borramos algo y salio bien
201 Created Cuando creamos un turno nuevo con exito
404 Not Found si intentamos buscar editar o borrar un turno con un id que no existe en la base de datos
422 Unprocessable Entity cuando el usuario manda datos mal cargados por ejemplo un precio negativo o un campo obligatorio vacio y Pydantic los rebota

Pregunta4 cors
el Same-Origin Policy es una seguridad que traen los navegadores para evitar que una paghina web le pida datos a un servidor que esta en otra direccion o puerto

En mi proyecto el frontend esta en localhost:5500 y la API en localhost:8000 Como son puertos distintos el navegador lo detecta como origenes diferentes y por defecto te bloquea ns que para arreglarlo configurr el middleware de CORS en FastAPI agregando permisos explicitos para que el servidor le diga al navegador que dale permiso a localhost:5500 para pedirme datos que está todo bien

Pregunta5  Separación de responsabilidades
Separr el Manager de los endpoints de FastAPI para no mezclar la logica de la bas de datos con las rutas HTTP esto hace que el codigo sea mucho msa limpio si orto dia cambio las consultas SQL o la base de datos solo toco el Manager y las rutas de FastAPI ni se enteran

La inyección de dependencias la uso para manejar las conexiones a la base de datos de forma eficiente abriendo y cerrando la conexion en cada peticion si abriera una conexion manualmente en cada linea de codigo la memoria de la compu explotariaa y la bse de datos se terminaria bloqueando

Pregunta6  JSON como formato de intercambio
va JSON porque es facil de entender tanto para las personas como para el codigo JavaScript y Python lo entienden facilmente

Cuando mandamos un JSON en el body de una peticio Pydantic lo recibe en el backend y revisa campo por campo que todo cumpla con los tipos y limites que le fijamos

Pregunta7  Statelessness (sin estado)
que HTTP sea stateless significa que el servidor no guarda ningun recuerdo de las peticiones que le hicimos ante cada consulta que viaja es totalmente independiente y tiene que llevar toda la informacion necesaria para procesarse

En mi proyecto el estado con la informacion guardada no vive en el servidor de Python sino en la base de datos SQLite

La ventaja gigante de esto es que si el dia de mañana la pagina crece mucho y necesito poner 3 servidores en paralelo para soportar mas usuarios cualquier servidor le va a poder responder a cualquier cliente sin importar cual lo atendio antes porque ninguno guarda datos en su memoria interna
