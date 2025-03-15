/**
 * 🎨 Renderiza as texturas na lista de texturas.
 * @function
 * @param {Array<Object>} texturasFiltradas - Lista de texturas filtradas para renderização.
 */
function renderTexturas(texturasFiltradas) {
    const textureList = document.getElementById('texture-list');
    textureList.innerHTML = ''; // Limpa a lista antes de renderizar

    texturasFiltradas.forEach((textura, index) => {
        const item = document.createElement('div');
        item.className = 'texture-item';

        // Gera o ID da textura
        const texturaId = `# <span class="mc-yellow">${textura.ct.toLowerCase()}-${index + 1}</span>`;

        // Verifica se a URL tem hash (ou seja, se não é a categoria "todos")
        const mostrarInfo = window.location.hash !== '';

        item.innerHTML = `
            <div class="texture-icon-container">
                <div class="version-badge">${textura.v}</div>
                <div>
                    <img src="${textura.icone}" class="texture-icon" alt="${textura.nome}">
                    ${mostrarInfo ? `<div class="texture-info-btn">i<div class="info-tooltip">${texturaId}</div></div>` : ''}
                </div>
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

        // Adiciona os eventos ao botão de informações das texturas (se existir)
        if (mostrarInfo) {
            const infoBtn = item.querySelector('.texture-info-btn');
            const tooltip = infoBtn.querySelector('.info-tooltip');

            // Mostra/oculta o tooltip ao passar o mouse (desktop)
            infoBtn.addEventListener('mouseover', () => showInfoTooltip(tooltip));
            infoBtn.addEventListener('mouseout', () => hideInfoTooltip(tooltip));

            // Mostra/oculta o tooltip ao tocar (mobile)
            infoBtn.addEventListener('click', () => toggleInfoTooltip(tooltip));
        }

        textureList.appendChild(item);
    });
}

/**
 * 🛠️ Mostra o tooltip de informações.
 * @function
 * @param {HTMLElement} tooltip - Elemento do tooltip.
 */
function showInfoTooltip(tooltip) {
    tooltip.style.visibility = 'visible';
    tooltip.style.opacity = '1';
}

/**
 * 🛠️ Oculta o tooltip de informações.
 * @function
 * @param {HTMLElement} tooltip - Elemento do tooltip.
 */
function hideInfoTooltip(tooltip) {
    tooltip.style.visibility = 'hidden';
    tooltip.style.opacity = '0';
}

/**
 * 🛠️ Alterna a visibilidade do tooltip de informações.
 * @function
 * @param {HTMLElement} tooltip - Elemento do tooltip.
 */
function toggleInfoTooltip(tooltip) {
    if (tooltip.style.visibility === 'visible') {
        hideInfoTooltip(tooltip);
    } else {
        showInfoTooltip(tooltip);
    }
}

/**
 * 🔍 Aplica o filtro com base no hash da URL.
 * @function
 */
function aplicarFiltroPorHash() {
    const hash = window.location.hash.substring(1).toLowerCase(); // Obtém o hash sem o '#'

    // Se não houver hash, ativa "todos"
    if (!hash) {
        ativarFiltro('todos');
        return;
    }

    // Divide o hash em categoria e número usando regex
    const match = hash.match(/^([a-z-]+)(?:-(\d+))?$/);
    if (!match) { // Se o hash for inválido
        ativarFiltro('todos');
        return;
    }

    const categoria = match[1]; // Captura a categoria (ex: "x-ray")
    const numero = match[2] ? parseInt(match[2], 10) : null; // Captura o número (ex: "1") e converte para número

    // Lista de categorias válidas
    const categoriasValidas = ['x-ray', 'skygrid', 'outros', 'pvp','todos'];

    // Verifica se a categoria é válida
    if (categoriasValidas.includes(categoria)) {
        ativarFiltro(categoria); // Ativa a categoria

        // Filtra as texturas da categoria
        const texturasFiltradas = texturas.filter(textura => textura.ct.toLowerCase() === categoria);

        // Se houver um número e ele for inválido (fora do intervalo), redireciona para a categoria sem número
        if (numero && (numero < 1 || numero > texturasFiltradas.length)) {
            history.replaceState(null, '', `#${categoria}`);
            return;
        }

        // Se o número for válido, tenta abrir o link da textura correspondente
        if (numero) {
            const texturaSelecionada = texturasFiltradas[numero - 1];
            if (texturaSelecionada) {
                window.open(texturaSelecionada.link, '_blank');
            }
        }
    } else {
        ativarFiltro('todos'); // Categoria inválida, ativa "todos"
    }
}


/**
 * 🚀 Ativa o filtro e adiciona a classe "active" ao botão correto.
 * @function
 */
function ativarFiltro(categoria) {
    // Remove a classe 'active' de todos os botões
    document.querySelectorAll('.filtro-btn').forEach(btn => btn.classList.remove('active'));

    // Seleciona o botão correto e adiciona 'active'
    const botaoFiltro = document.querySelector(`.filtro-btn[data-ct="${categoria}"]`);
    if (botaoFiltro) {
        botaoFiltro.classList.add('active');
    }

    // Filtra as texturas
    const texturasFiltradas = (categoria === 'todos')
        ? texturas
        : texturas.filter(textura => textura.ct.toLowerCase() === categoria);

    // Renderiza
    renderTexturas(texturasFiltradas);
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
            history.pushState(null, '', window.location.pathname); // Remove o hash da URL
        } else {
            history.pushState(null, '', `#${categoria.toLowerCase()}`); // Atualiza o hash
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
document.addEventListener('DOMContentLoaded', aplicarFiltroPorHash);

// Aplicar o filtro quando o hash da URL mudar
window.addEventListener('hashchange', aplicarFiltroPorHash);