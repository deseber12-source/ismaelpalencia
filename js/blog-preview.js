// js/blog-preview.js

function showToast(message, type, duration) { /* si quieres notificaciones, pero no es necesario aquí */ }

async function cargarVistaPreviaBlog() {
    const container = document.getElementById('blog-grid');
    if (!container) return;

    try {
        const response = await fetch(`${API_URL}/posts`); // Sin filtro, trae todos los publicados
        const posts = await response.json();

        if (posts.length === 0) {
            container.innerHTML = '<p class="no-posts">Próximamente más artículos.</p>';
            return;
        }

        // Tomar solo los 2 más recientes (ya vienen ordenados por fecha descendente)
        const ultimos = posts.slice(0, 2);

        let html = '';
        ultimos.forEach(post => {
            html += `
                <div class="blog-card">
                    ${post.imagen_destacada ? `<img src="${post.imagen_destacada}" alt="${post.titulo}" loading="lazy">` : ''}
                    <h3>${escapeHtml(post.titulo)}</h3>
                    <p>${escapeHtml(post.resumen)}</p>
                    <a href="post.html?slug=${post.slug}" class="btn">Leer más</a>
                </div>
            `;
        });
        container.innerHTML = html;
    } catch (error) {
        console.error('Error cargando posts:', error);
        container.innerHTML = '<p class="error">No se pudieron cargar los artículos.</p>';
    }
}

function escapeHtml(str) {
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// Esperar a que los componentes estén cargados (evento que ya tenemos)
document.addEventListener('componentesCargados', cargarVistaPreviaBlog);