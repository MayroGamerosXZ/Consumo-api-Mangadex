# Buscador de Manga (MangaDex API)

Esta aplicación web es un buscador interactivo que consume la [API pública de MangaDex](https://api.mangadex.org/docs/) para encontrar mangas por título, demostrando el manejo de datos complejos, estados de interfaz y seguridad.

## Requerimientos Cumplidos

1.  **Formulario HTML y Validación:** Formulario accesible y semántico con validaciones nativas como "required", "minlength", "maxlength" y "min"/"max" para el límite. El evento "submit" es procesado y los datos se extraen utilizando "FormData".
2.  **Consumo de API:** Se consume la API de MangaDex (/manga?title=...) mediante "fetch" asíncrono con manejo de promesas "async/await". Se valida "response.ok" antes de transformar la respuesta a JSON. Se utilizan interfaces estrictas en TypeScript para tipar la estructura anidada que devuelve MangaDex (ttributes.title, description, etc).
3.  **Estados de Interfaz y Seguridad:** Maneja exitosamente 5 estados de la interfaz:
    - **Inicial:** Mensaje de bienvenida.
    - **Cargando:** Spinner visual y bloqueo del botón submit para evitar consultas duplicadas.
    - **Error:** Si falla la red o MangaDex rechaza la petición.
    - **Sin Resultados:** Si el título de manga buscado no existe en la base de datos.
    - **Éxito:** Muestra los resultados de forma dinámica.
    *Seguridad:* Los resultados se insertan en el DOM utilizando la API segura "document.createElement()" y ".textContent", previniendo ataques de inyección XSS que podrían ocurrir al usar "innerHTML" con datos externos.
4.  **Organización:** Archivos HTML, CSS y TypeScript estructurados en carpetas/archivos independientes. 

## Cómo Ejecutar la Aplicación

Debido a que el código fuente incluye TypeScript, debe ser compilado antes de usarse. Hemos configurado un entorno sencillo usando "npx".

### Prerrequisitos
- Node.js instalado (para poder usar npx y tsc)

### Pasos
1. Clona el repositorio.
2. Abre una terminal en la raíz del proyecto.
3. Para compilar el TypeScript manualmente a JavaScript, ejecuta:
   `ash
   npx tsc
   `
4. Para iniciar el servidor local y ver la app, ejecuta:
   `ash
   npx http-server -p 8080 -c-1
   `
5. Ingresa a http://localhost:8080/ en tu navegador.
