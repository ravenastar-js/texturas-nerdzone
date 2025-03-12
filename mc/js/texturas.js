/**
 * 🌟 Renderiza todas as texturas inicialmente.
 * @function
 * @param {Array<Object>} texturas - Lista de texturas a serem renderizadas.
 */
renderTexturas(texturas);

/**
 * 🎨 Renderiza as texturas na lista de texturas.
 * @function
 * @param {Array<Object>} texturasFiltradas - Lista de texturas filtradas para renderização.
 */
function renderTexturas(texturasFiltradas) {
    const textureList = document.getElementById('texture-list');
    textureList.innerHTML = ''; // Limpa a lista antes de renderizar

    texturasFiltradas.forEach(textura => {
        const item = document.createElement('div');
        item.className = 'texture-item';

        item.innerHTML = `
            <div class="texture-icon-container">
                <div class="version-badge">${textura.v}</div>
                <img src="${textura.icone}" class="texture-icon" alt="${textura.nome}">
            </div>
            <div class="texture-content">
                <h3 class="texture-title">${parseMCString(textura.nome)}</h3>
                <p class="texture-description">${parseMCString(textura.desc)}</p>
            </div>
            <button class="download-btn" onclick="window.open('${textura.link}', '_blank')">
                <svg class="download-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M5 20h14v-2H5v2zm7-18L5.33 8.67 6 10l6-5 6 5 0.67-1.33L12 2z"/>
                    <path d="M11 10v6h2v-6h3l-4-4-4 4h3z"/>
                </svg>
                Download
            </button>
        `;

        textureList.appendChild(item);
    });
}

/**
 * 🔍 Aplica o filtro com base no hash da URL.
 * @function
 */
function aplicarFiltroPorHash() {
    const hash = window.location.hash; // Obtém o hash da URL (#xray, #skygrid, #outros)

    // Remove o "#" do hash
    const categoria = hash.substring(1);

    // Verifica se a categoria é válida
    if (categoria && ['xray', 'skygrid', 'outros', 'todos'].includes(categoria.toLowerCase())) {
        // Encontra o botão correspondente e simula o clique
        const botaoFiltro = document.querySelector(`.filtro-btn[data-ct="${categoria}"]`);
        if (botaoFiltro) {
            botaoFiltro.click(); // Aplica o filtro
        }
    } else {
        // Se não houver hash ou for inválido, mostra todas as texturas
        const botaoTodos = document.querySelector('.filtro-btn[data-ct="todos"]');
        if (botaoTodos) {
            botaoTodos.click(); // Aplica o filtro "todos"
        }
    }
}

// Adicionar eventos aos botões de filtro
document.querySelectorAll('.filtro-btn').forEach(botao => {
    botao.addEventListener('click', () => {
        // Remove a classe 'active' de todos os botões
        document.querySelectorAll('.filtro-btn').forEach(btn => btn.classList.remove('active'));
        // Adiciona a classe 'active' ao botão clicado
        botao.classList.add('active');

        // Obtém a categoria do botão clicado
        const categoria = botao.getAttribute('data-ct');

        // Atualiza o hash da URL sem recarregar a página
        if (categoria === 'todos') {
            history.replaceState(null, '', window.location.pathname); // Remove o hash da URL
        } else {
            history.replaceState(null, '', `#${categoria.toLowerCase()}`); // Atualiza o hash
        }

        // Filtra as texturas com base na categoria
        let texturasFiltradas;
        if (categoria === 'todos') {
            texturasFiltradas = texturas; // Mostra todas as texturas
        } else {
            texturasFiltradas = texturas.filter(textura => textura.ct.toLowerCase() === categoria.toLowerCase());
        }

        // Renderiza as texturas filtradas
        renderTexturas(texturasFiltradas);
    });
});

// Aplicar o filtro ao carregar a página
window.addEventListener('load', aplicarFiltroPorHash);

// Aplicar o filtro quando o hash da URL mudar
window.addEventListener('hashchange', aplicarFiltroPorHash);