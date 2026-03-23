const CLIENTE_ID = null; // o el valor que corresponda

let currentPage = 1;
let currentSearch = '';
let totalPages = 1;
let isLoading = false;

const postsContainer = document.getElementById('posts-container');
const paginationDiv = document.getElementById('pagination-controls');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');

async function fetchPosts() {
    if (isLoading) return;
    isLoading = true;

    postsContainer.innerHTML = '<div class="loading">Cargando...</div>';

    try {
        const url = new URL(`${API_URL}/posts`);
        url.searchParams.append('page', currentPage);
        url.searchParams.append('limit', 6);
        if (CLIENTE_ID) url.searchParams.append('cliente_id', CLIENTE_ID);
        if (currentSearch) url.searchParams.append('q', currentSearch);

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) throw new Error(data.error || 'Error al cargar');

        totalPages = data.pages;
        renderPosts(data.posts);
        renderPagination();
    } catch (error) {
        console.error(error);
        postsContainer.innerHTML = '<p class="error">Error al cargar los artículos.</p>';
    } finally {
        isLoading = false;
    }
}

function renderPosts(posts) {
    if (!posts.length) {
        postsContainer.innerHTML = '<p class="no-posts">No se encontraron artículos.</p>';
        return;
    }

    let html = '';
    posts.forEach(post => {
        // Calcular tiempo de lectura aproximado
        const words = (post.contenido || '').split(/\s+/).length;
        const readTime = Math.ceil(words / 200);

        html += `
            <article class="post-card">
                ${post.imagen_destacada ? `<img src="${post.imagen_destacada}" alt="${escapeHtml(post.titulo)}" loading="lazy">` : ''}
                <h2><a href="post.html?slug=${post.slug}">${escapeHtml(post.titulo)}</a></h2>
                <p class="post-meta">
                    ${new Date(post.fecha_publicacion).toLocaleDateString('es-MX')} · 
                    ${readTime} min de lectura · 
                    ${escapeHtml(post.autor)}
                </p>
                <p class="post-resumen">${escapeHtml(post.resumen)}</p>
                <a href="post.html?slug=${post.slug}" class="btn">Leer más</a>
            </article>
        `;
    });
    postsContainer.innerHTML = html;
}

function renderPagination() {
    if (totalPages <= 1) {
        paginationDiv.innerHTML = '';
        return;
    }

    let html = '';
    for (let i = 1; i <= totalPages; i++) {
        html += `<button class="${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
    }
    paginationDiv.innerHTML = html;

    // Agregar event listeners
    document.querySelectorAll('.pagination button').forEach(btn => {
        btn.addEventListener('click', () => {
            currentPage = parseInt(btn.dataset.page);
            fetchPosts();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}

function escapeHtml(str) {
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// Búsqueda
function buscar() {
    currentSearch = searchInput.value.trim();
    currentPage = 1;
    fetchPosts();
}

searchBtn.addEventListener('click', buscar);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') buscar();
});

// Carga inicial
fetchPosts();