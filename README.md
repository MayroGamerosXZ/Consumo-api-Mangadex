<div align="center">
  <h1>📚 Buscador de Manga (MangaDex API)</h1>
  <p>Una aplicación web moderna y asíncrona para buscar mangas, manejando estados de interfaz y consumo seguro de datos.</p>

  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
</div>

<br/>

## 🎯 Descripción del Desarrollo

Este proyecto fue desarrollado para cumplir estrictamente con los criterios de evaluación sobre consumo de APIs y manejo del DOM. Utiliza la [API pública de MangaDex](https://api.mangadex.org/docs/) (una de las bases de datos de manga más grandes) para permitir al usuario buscar títulos específicos y visualizar sus metadatos (estado, géneros y clasificación) en tiempo real.

El desarrollo se enfocó fuertemente en la **experiencia de usuario (UX)** y la **seguridad**. La aplicación nunca deja al usuario a ciegas: siempre hay retroalimentación visual (spinners de carga, mensajes de error) y el código previene de manera activa vulnerabilidades como XSS (Cross-Site Scripting).

---

## ✅ Requerimientos Cumplidos (Rúbrica)

1. 📝 **Formulario HTML y Validación:** 
   - Diseño semántico.
   - Dos controles: Búsqueda por texto (requerido) y Límite de resultados (opcional).
   - Validaciones nativas: equired, minlength, maxlength y rangos min/max.
   - Extracción de datos usando FormData interceptando el evento submit.
2. 🌐 **Consumo de API y Tipado TypeScript:** 
   - Consumo asíncrono con etch y sync/await.
   - Validación estricta usando if (!response.ok) antes de procesar el JSON.
   - Creación de interfaces de TypeScript complejas para mapear la estructura anidada de MangaDex.
3. 🛡️ **Estados de Interfaz y Seguridad:** 
   - Los **5 estados** están cubiertos: Inicial, Cargando (bloquea múltiples submits), Éxito, Sin Resultados y Error (atrapado en el bloque catch).
   - El DOM se construye de forma 100% segura mediante document.createElement() y asignación por .textContent, anulando el riesgo de inyección de código.
4. 📁 **Organización:** 
   - Separación estricta de responsabilidades: HTML, CSS y TypeScript (compilado).

---

## 🚀 Instrucciones de Ejecución (Importante)

Debido a las políticas de seguridad (CORS) de la API de MangaDex, es obligatorio ejecutar esta aplicación en un servidor local y acceder a ella a través del dominio localhost, **no** mediante la IP cruda 127.0.0.1.

### Pasos paso a paso:
1. Asegúrate de tener **Node.js** instalado.
2. Abre la terminal en la carpeta del proyecto.
3. Inicia el servidor local ejecutando:
   `ash
   npx http-server -p 8080 -c-1
   `
4. **⚠️ CRÍTICO PARA EL CORS:** Abre tu navegador e ingresa **exclusivamente** a este enlace:
   👉 **[http://localhost:8080/](http://localhost:8080/)**

Si ingresas usando *127.0.0.1*, la API de MangaDex rechazará la conexión por seguridad. Usar localhost está en la lista blanca (whitelist) de la API.

---

## 🎨 Estados de la Interfaz Implementados

La interfaz reacciona a los distintos momentos de interacción, guiando al usuario:
- 🔵 **Inicial:** Pantalla de espera amigable invitando a la primera búsqueda.
- 🟡 **Cargando:** Muestra un indicador giratorio (spinner) y deshabilita el botón *Buscar* temporalmente.
- 🔴 **Error:** Si se corta el internet o la API falla, notifica el problema sin colapsar la página web.
- ⚪ **Sin resultados:** Informa amablemente cuando una búsqueda no coincide con ningún manga.
- 🟢 **Éxito:** Renderiza tarjetas individuales con el título, iconos de FontAwesome, insignias (badges) para el estado, su clasificación y la descripción oficial acortada para mantener el diseño limpio.
