// ts/main.ts

// Interfaces para la respuesta de MangaDex API
interface MangaTitle {
    [key: string]: string; // Puede venir en 'en', 'ja', 'ja-ro', etc.
}

interface MangaDescription {
    [key: string]: string;
}

interface MangaAttributes {
    title: MangaTitle;
    description: MangaDescription;
    status: string;
    year: number | null;
}

interface MangaData {
    id: string;
    type: string;
    attributes: MangaAttributes;
}

interface MangaDexResponse {
    result: string;
    response: string;
    data: MangaData[];
    limit: number;
    offset: number;
    total: number;
}

document.addEventListener('DOMContentLoaded', () => {
    // Referencias a elementos del DOM
    const searchForm = document.getElementById('search-form') as HTMLFormElement;
    const submitBtn = document.getElementById('submit-btn') as HTMLButtonElement;
    
    // Contenedores de estado
    const stateInitial = document.getElementById('state-initial') as HTMLDivElement;
    const stateLoading = document.getElementById('state-loading') as HTMLDivElement;
    const stateError = document.getElementById('state-error') as HTMLDivElement;
    const stateEmpty = document.getElementById('state-empty') as HTMLDivElement;
    const resultsList = document.getElementById('results-list') as HTMLUListElement;
    const errorText = document.getElementById('error-text') as HTMLParagraphElement;

    // Función para manejar la visibilidad de los estados
    const showState = (stateToShow: 'initial' | 'loading' | 'error' | 'empty' | 'success') => {
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
    const getMainTitle = (titleObj: MangaTitle): string => {
        if (!titleObj) return 'Título Desconocido';
        // Preferir inglés, si no existe tomar el primer idioma disponible
        if (titleObj['en']) return titleObj['en'];
        const firstKey = Object.keys(titleObj)[0];
        return firstKey ? titleObj[firstKey] : 'Título Desconocido';
    };

    // Función para crear y agregar un elemento de manga al DOM de forma segura
    const renderManga = (manga: MangaData) => {
        const li = document.createElement('li');
        
        const titleEl = document.createElement('h3');
        const titleText = getMainTitle(manga.attributes.title);
        const yearText = manga.attributes.year ? ` (${manga.attributes.year})` : '';
        
        // Uso estricto de textContent para evitar vulnerabilidades XSS
        titleEl.textContent = `${titleText}${yearText}`;
        
        const statusEl = document.createElement('div');
        statusEl.className = 'status-badge';
        statusEl.textContent = `Estado: ${manga.attributes.status}`;
        statusEl.style.fontSize = '0.85em';
        statusEl.style.color = '#0056b3';
        statusEl.style.marginBottom = '10px';
        statusEl.style.fontWeight = 'bold';

        const descEl = document.createElement('p');
        // Usar descripción en inglés si existe, si no avisar que no hay
        const descText = manga.attributes.description && manga.attributes.description['en'] 
            ? manga.attributes.description['en'] 
            : 'Sin descripción disponible en inglés.';
            
        // Limitar la descripción para no colapsar la UI
        descEl.textContent = descText.length > 250 ? descText.substring(0, 250) + '...' : descText;

        li.appendChild(titleEl);
        li.appendChild(statusEl);
        li.appendChild(descEl);
        
        resultsList.appendChild(li);
    };

    // Manejador del evento submit
    searchForm.addEventListener('submit', async (e: Event) => {
        e.preventDefault();

        // Evitar duplicidades bloqueando el botón
        if (submitBtn.disabled) return;

        // Obtener datos del formulario usando FormData
        const formData = new FormData(searchForm);
        const title = (formData.get('title') as string).trim();
        let limit = formData.get('limit') as string;
        
        // Validación extra por si acaso
        if (!limit || parseInt(limit) < 1) limit = '10';

        if (!title) return;

        // Cambiar estado a cargando y deshabilitar botón
        submitBtn.disabled = true;
        showState('loading');
        resultsList.innerHTML = ''; // Limpiar resultados anteriores

        try {
            // Consumo de la API de MangaDex
            const url = `https://api.mangadex.org/manga?title=${encodeURIComponent(title)}&limit=${limit}`;
            const response = await fetch(url);

            // Comprobación explícita de response.ok
            if (!response.ok) {
                throw new Error(`Error en la petición: ${response.status} ${response.statusText}`);
            }

            // Tipado de la respuesta JSON
            const jsonResponse: MangaDexResponse = await response.json();

            // Decidir qué estado mostrar basado en los resultados
            if (!jsonResponse.data || jsonResponse.data.length === 0) {
                showState('empty');
            } else {
                // Renderizar los resultados
                jsonResponse.data.forEach(renderManga);
                showState('success');
            }

        } catch (error: any) {
            console.error('Error fetching data:', error);
            errorText.textContent = `Hubo un problema al conectar con MangaDex: ${error.message}`;
            showState('error');
        } finally {
            // Restaurar el botón independientemente del resultado
            submitBtn.disabled = false;
        }
    });
});
