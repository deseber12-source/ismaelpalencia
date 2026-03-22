const API_URL = 'http://localhost:5500/api';

document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('post-container');
    
    // Obtener slug de la URL
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('slug');
    
    if (!slug) {
        container.innerHTML = '<p class="error">No se especificó el artículo.</p>';
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/posts/${slug}`);
        if (!response.ok) {
            throw new Error('Post no encontrado');
        }
        const post = await response.json();
        
        const html = `
            <article>
                <h1>${post.titulo}</h1>
                <p class="post-meta">${new Date(post.fecha_publicacion).toLocaleDateString('es-MX')} · ${post.autor}</p>
                ${post.imagen_destacada ? `<img src="${post.imagen_destacada}" alt="${post.titulo}" class="post-image">` : ''}
                <div class="post-body">${post.contenido}</div>
                <a href="blog.html" class="btn">← Volver al blog</a>
            </article>
        `;
        container.innerHTML = html;
    } catch (error) {
        console.error(error);
        container.innerHTML = '<p class="error">Artículo no encontrado.</p>';
    }
});