# Agenda de Contactos (Tarea 3 - Multicapas)

Aplicación web para la gestión de contactos telefónicos desarrollada con **HTML, CSS y JavaScript** nativo bajo una **Arquitectura Multicapas**, consumiendo la API de contactos vía `fetch` (**GET** y **POST**).

---

## Estructura del Proyecto

* `index.html`: Estructura principal en la raíz del repositorio. Carga los scripts en el `<head>` utilizando el atributo `defer`.
* `css/`:
  * `css/styles.css`: Estilos visuales.
* `js/`:
  * `js/Contacto.js`: Capa de Modelo (entidad Contacto, validación y serialización).
  * `js/AgendaService.js`: Capa de Acceso a Datos (peticiones fetch GET y POST hacia `http://www.raydelto.org/agenda.php`).
  * `js/AgendaController.js`: Capa de Lógica y Controlador (interacción de interfaz, búsqueda y paginación).
  * `js/app.js`: Inicialización de la aplicación.