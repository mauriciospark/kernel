/*
  ============================================================================
  PROPRIETÁRIO: Mauricio Spark
  MARCA:        Spark Mauricio
  PROJETO:      Kernel
  VERSÃO:       v1.0.0
  LINHAGEM:     SPARK
  ============================================================================
  Documento de Planejamento de Escopo
  COPYRIGHT: © 2026 / Mauricio Spark. Todos os direitos reservados.
  ============================================================================
*/
let booksData = [];
let filteredBooks = [];

// Extrair metadados do nome do arquivo
function extractMetadataFromFilename(filename) {
    // Remove extensão
    const nameWithoutExt = filename.replace(/\.(pdf|epub|mobi|djvu)$/i, '');

    // Tenta extrair autor se estiver no formato "Título - Autor" ou "Título - Autor - Ano"
    let title = nameWithoutExt;
    let author = 'Autor desconhecido';
    let year = '';

    const dashIndex = nameWithoutExt.indexOf(' - ');
    if (dashIndex > 0) {
        title = nameWithoutExt.substring(0, dashIndex).trim();
        const rest = nameWithoutExt.substring(dashIndex + 3).trim();

        const secondDash = rest.indexOf(' - ');
        if (secondDash > 0) {
            author = rest.substring(0, secondDash).trim();
            year = rest.substring(secondDash + 3).trim();
        } else {
            author = rest;
        }
    }

    // Detectar gênero baseado em palavras-chave
    let genre = 'Geral';
    const lowerTitle = title.toLowerCase();

    if (lowerTitle.includes('algorithm') || lowerTitle.includes('algoritmo')) genre = 'Algoritmos';
    else if (lowerTitle.includes('pattern') || lowerTitle.includes('design')) genre = 'Arquitetura de Software';
    else if (lowerTitle.includes('network') || lowerTitle.includes('rede')) genre = 'Redes de Computadores';
    else if (lowerTitle.includes('ai') || lowerTitle.includes('artificial') || lowerTitle.includes('machine learning')) genre = 'Inteligência Artificial';
    else if (lowerTitle.includes('security') || lowerTitle.includes('segurança')) genre = 'Segurança';
    else if (lowerTitle.includes('data') || lowerTitle.includes('database')) genre = 'Banco de Dados';
    else if (lowerTitle.includes('web') || lowerTitle.includes('frontend') || lowerTitle.includes('backend')) genre = 'Desenvolvimento Web';
    else if (lowerTitle.includes('python') || lowerTitle.includes('java') || lowerTitle.includes('javascript') || lowerTitle.includes('c++')) genre = 'Linguagens de Programação';
    else if (lowerTitle.includes('code') || lowerTitle.includes('programming') || lowerTitle.includes('programação')) genre = 'Programação';

    return {
        title: title,
        author: author,
        year: year || 'N/A',
        genre: genre,
        description: `Arquivo: ${filename}`,
        cover: null,
        file: filename,
        download_url: null
    };
}

// Carregar dados dos livros via GitHub API
async function loadBooks() {
    try {
        // Tenta carregar metadados do books.json primeiro
        let metadata = {};
        try {
            const metaResponse = await fetch('json/books.json');
            if (metaResponse.ok) {
                const meta = await metaResponse.json();
                metadata = meta.books || {};
            }
        } catch (e) {
            console.log('Arquivo books.json não encontrado, usando metadados dos nomes de arquivo');
        }

        // Carrega lista de arquivos do GitHub API
        const apiUrl = typeof GITHUB_API_BASE !== 'undefined' ? GITHUB_API_BASE : 'json/books.json';

        let files = [];

        if (apiUrl.includes('github.com')) {
            // Usa GitHub API
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Erro ao acessar GitHub API');
            }
            const data = await response.json();

            if (Array.isArray(data)) {
                files = data.filter(file => {
                    const ext = file.name.split('.').pop().toLowerCase();
                    return ['pdf', 'epub', 'mobi', 'djvu'].includes(ext);
                }).map(file => ({
                    name: file.name,
                    download_url: file.download_url
                }));
            }
        } else {
            // Fallback para JSON local
            const response = await fetch(apiUrl);
            const data = await response.json();
            booksData = data.books;
            filteredBooks = [...booksData];
            populateGenreFilter();
            displayBooks(filteredBooks);
            return;
        }

        // Combina metadados com lista de arquivos
        booksData = files.map((file, index) => {
            const fileMetadata = extractMetadataFromFilename(file.name);

            // Se existir metadado no books.json para este arquivo, usa ele
            const metaEntry = Object.values(metadata).find(m =>
                m.file && m.file.includes(file.name)
            );

            if (metaEntry) {
                return {
                    id: index + 1,
                    ...metaEntry,
                    download_url: file.download_url
                };
            }

            return {
                id: index + 1,
                ...fileMetadata,
                download_url: file.download_url
            };
        });

        filteredBooks = [...booksData];
        populateGenreFilter();
        displayBooks(filteredBooks);

    } catch (error) {
        console.error('Erro ao carregar livros:', error);

        // Fallback para JSON local se GitHub API falhar
        try {
            const response = await fetch('json/books.json');
            const data = await response.json();
            booksData = data.books;
            filteredBooks = [...booksData];
            populateGenreFilter();
            displayBooks(filteredBooks);
        } catch (fallbackError) {
            document.getElementById('booksGrid').innerHTML = `
                <p class="no-books">
                    Erro ao carregar livros.<br>
                    Configure seu usuário e repositório no arquivo config.js<br>
                    ou verifique se o arquivo books.json existe.
                </p>
            `;
        }
    }
}

// Preencher filtro de gêneros
function populateGenreFilter() {
    const genreFilter = document.getElementById('genreFilter');
    const genres = [...new Set(booksData.map(book => book.genre))];

    genres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre;
        option.textContent = genre;
        genreFilter.appendChild(option);
    });
}

// Exibir livros na grade
function displayBooks(books) {
    const booksGrid = document.getElementById('booksGrid');

    if (books.length === 0) {
        booksGrid.innerHTML = '<p class="no-books">Nenhum livro encontrado.</p>';
        return;
    }

    booksGrid.innerHTML = books.map(book => `
        <div class="book-card" onclick="openBookModal(${book.id})">
            <div class="book-cover">
                ${book.cover ? `<img src="${book.cover}" alt="${book.title}" onerror="this.style.display='none'; this.parentElement.innerHTML='📚'">` : '📚'}
            </div>
            <div class="book-info">
                <h3 class="book-title">${book.title}</h3>
                <p class="book-author">${book.author}</p>
                <span class="book-genre">${book.genre}</span>
                <p class="book-year">${book.year}</p>
            </div>
        </div>
    `).join('');
}

// Abrir modal com detalhes do livro
function openBookModal(bookId) {
    const book = booksData.find(b => b.id === bookId);
    if (!book) return;

    const modal = document.getElementById('bookModal');
    const modalBody = document.getElementById('modalBody');

    // Usa download_url do GitHub API ou file local como fallback
    const bookUrl = book.download_url || book.file;

    modalBody.innerHTML = `
        <div class="modal-book-details">
            <div class="modal-book-cover">
                ${book.cover ? `<img src="${book.cover}" alt="${book.title}" onerror="this.style.display='none'">` : '<div style="width:100%;height:350px;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);display:flex;align-items:center;justify-content:center;color:white;font-size:4rem;border-radius:8px;">📚</div>'}
            </div>
            <div class="modal-book-info">
                <h2>${book.title}</h2>
                <p class="author">Por ${book.author}</p>
                <span class="genre">${book.genre}</span>
                <p class="year">Publicado em ${book.year}</p>
                <p class="description">${book.description}</p>
                ${bookUrl ? `<a href="${bookUrl}" class="read-button" target="_blank">📖 Ler Livro</a>` : ''}
            </div>
        </div>
    `;

    modal.style.display = 'block';
}

// Fechar modal
function closeModal() {
    document.getElementById('bookModal').style.display = 'none';
}

// Filtrar livros por busca e gênero
function filterBooks() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const selectedGenre = document.getElementById('genreFilter').value;

    filteredBooks = booksData.filter(book => {
        const matchesSearch = book.title.toLowerCase().includes(searchTerm) ||
            book.author.toLowerCase().includes(searchTerm);
        const matchesGenre = !selectedGenre || book.genre === selectedGenre;

        return matchesSearch && matchesGenre;
    });

    displayBooks(filteredBooks);
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    loadBooks();

    // Search input
    document.getElementById('searchInput').addEventListener('input', filterBooks);

    // Genre filter
    document.getElementById('genreFilter').addEventListener('change', filterBooks);

    // Close modal
    document.querySelector('.close').addEventListener('click', closeModal);

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('bookModal');
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
});