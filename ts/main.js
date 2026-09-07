"use strict";
// ts/main.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos del DOM
    const searchForm = document.getElementById('search-form');
    const submitBtn = document.getElementById('submit-btn');
    // Contenedores de estado
    const stateInitial = document.getElementById('state-initial');
    const stateLoading = document.getElementById('state-loading');
    const stateError = document.getElementById('state-error');
    const stateEmpty = document.getElementById('state-empty');
    const resultsList = document.getElementById('results-list');
    const errorText = document.getElementById('error-text');
    // Función para manejar la visibilidad de los estados
    const showState = (stateToShow) => {
        stateInitial.classList.add('hidden');
        stateLoading.classList.add('hidden');
        stateError.classList.add('hidden');
        stateEmpty.classList.add('hidden');
        resultsList.classList.add('hidden');
        switch (stateToShow) {
            case 'initial':
                stateInitial.classList.remove('hidden');
                break;
            case 'loading':
                stateLoading.classList.remove('hidden');
                break;
            case 'error':
                stateError.classList.remove('hidden');
                break;
            case 'empty':
                stateEmpty.classList.remove('hidden');
                break;
            case 'success':
                resultsList.classList.remove('hidden');
                break;
        }
    };
    // Función auxiliar para obtener el título principal (MangaDex usa varios idiomas)
    const getMainTitle = (titleObj) => {
        if (!titleObj)
            return 'Título Desconocido';
        // Preferir inglés, si no existe tomar el primer idioma disponible
        if (titleObj['en'])
            return titleObj['en'];
        const firstKey = Object.keys(titleObj)[0];
        return firstKey ? titleObj[firstKey] : 'Título Desconocido';
    };
    // Función para crear y agregar un elemento de manga al DOM de forma segura
    const renderManga = (manga) => {
        const li = document.createElement('li');
        li.className = 'manga-card';
        const titleEl = document.createElement('h3');
        const titleText = getMainTitle(manga.attributes.title);
        const yearText = manga.attributes.year ? ` (${manga.attributes.year})` : '';
        titleEl.innerHTML = `<i class="fa-solid fa-book-open"></i> ${titleText}${yearText}`; // Usamos innerHTML SOLO para el icono, el texto lo inyectamos de forma segura después o lo escapamos.
        // Mejor práctica: Crear elemento i, y luego añadir texto
        titleEl.innerHTML = '<i class="fa-solid fa-book-open"></i> ';
        titleEl.appendChild(document.createTextNode(`${titleText}${yearText}`));
        // Contenedor de metadatos (badges)
        const metaContainer = document.createElement('div');
        metaContainer.className = 'meta-container';
        // Badge Estado
        const statusEl = document.createElement('span');
        statusEl.className = `status-badge ${manga.attributes.status}`;
        statusEl.innerHTML = '<i class="fa-solid fa-signal"></i> ';
        statusEl.appendChild(document.createTextNode(`Estado: ${manga.attributes.status}`));
        // Badge Rating
        const ratingEl = document.createElement('span');
        ratingEl.className = `rating-badge ${manga.attributes.contentRating}`;
        ratingEl.innerHTML = '<i class="fa-solid fa-shield-halved"></i> ';
        ratingEl.appendChild(document.createTextNode(`Clasificación: ${manga.attributes.contentRating}`));
        metaContainer.appendChild(statusEl);
        metaContainer.appendChild(ratingEl);
        // Tags
        const tagsContainer = document.createElement('div');
        tagsContainer.className = 'tags-container';
        if (manga.attributes.tags && manga.attributes.tags.length > 0) {
            // Mostrar solo los primeros 5 tags para no saturar
            manga.attributes.tags.slice(0, 5).forEach(tag => {
                const tagEl = document.createElement('span');
                tagEl.className = 'tag-badge';
                const tagName = tag.attributes.name.en || 'Tag';
                tagEl.innerHTML = '<i class="fa-solid fa-tag"></i> ';
                tagEl.appendChild(document.createTextNode(tagName));
                tagsContainer.appendChild(tagEl);
            });
        }
        const descEl = document.createElement('p');
        descEl.className = 'manga-description';
        const descText = manga.attributes.description && manga.attributes.description['en']
            ? manga.attributes.description['en']
            : 'Sin descripción disponible en inglés.';
        descEl.textContent = descText.length > 250 ? descText.substring(0, 250) + '...' : descText;
        li.appendChild(titleEl);
        li.appendChild(metaContainer);
        li.appendChild(tagsContainer);
        li.appendChild(descEl);
        resultsList.appendChild(li);
    };
    // Manejador del evento submit
    searchForm.addEventListener('submit', (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        // Evitar duplicidades bloqueando el botón
        if (submitBtn.disabled)
            return;
        // Obtener datos del formulario usando FormData
        const formData = new FormData(searchForm);
        const title = formData.get('title').trim();
        let limit = formData.get('limit');
        // Validación extra por si acaso
        if (!limit || parseInt(limit) < 1)
            limit = '10';
        if (!title)
            return;
        // Cambiar estado a cargando y deshabilitar botón
        submitBtn.disabled = true;
        showState('loading');
        resultsList.innerHTML = ''; // Limpiar resultados anteriores
        try {
            // Consumo de la API de MangaDex
            const url = `https://api.mangadex.org/manga?title=${encodeURIComponent(title)}&limit=${limit}`;
            const response = yield fetch(url);
            // Comprobación explícita de response.ok
            if (!response.ok) {
                throw new Error(`Error en la petición: ${response.status} ${response.statusText}`);
            }
            // Tipado de la respuesta JSON
            const jsonResponse = yield response.json();
            // Decidir qué estado mostrar basado en los resultados
            if (!jsonResponse.data || jsonResponse.data.length === 0) {
                showState('empty');
            }
            else {
                // Renderizar los resultados
                jsonResponse.data.forEach(renderManga);
                showState('success');
            }
        }
        catch (error) {
            console.error('Error fetching data:', error);
            errorText.textContent = `Hubo un problema al conectar con MangaDex: ${error.message}`;
            showState('error');
        }
        finally {
            // Restaurar el botón independientemente del resultado
            submitBtn.disabled = false;
        }
    }));
});
