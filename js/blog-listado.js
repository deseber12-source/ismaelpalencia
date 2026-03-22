const API_URL = 'http://localhost:5500/api'; // Cambiar en producción

document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('posts-container');
    
    try {
        const response = await fetch(`${API_URL}/posts`); // sin cliente_id para posts generales
        const posts = await response.json();
        
        if (posts.length === 0) {
            container.innerHTML = '<p>No hay artículos aún.</p>';
            return;
        }
        
        let html = '';
        posts.forEach(post => {
            html += `
                <article class="post-card">
                    ${post.imagen_destacada ? `<img src="${post.imagen_destacada}" alt="${post.titulo}" loading="lazy">` : ''}
                    <h2><a href="post.html?slug=${post.slug}">${post.titulo}</a></h2>
                    <p class="post-meta">${new Date(post.fecha_publicacion).toLocaleDateString('es-MX')} · ${post.autor}</p>
                    <p class="post-resumen">${post.resumen}</p>
                    <a href="post.html?slug=${post.slug}" class="btn">Leer más</a>
                </article>
            `;
        });
        container.innerHTML = html;
    } catch (error) {
        console.error('Error cargando posts:', error);
        container.innerHTML = '<p>Error al cargar los artículos. Intenta más tarde.</p>';
    }
});