/**
 * 🎨 Renderiza os itens na lista.
 * @function
 * @param {Array<Object>} itensFiltrados - Lista de itens filtrados para renderização.
 * @param {string} categoria - Categoria atual (ex: "todos", "x-ray", "influencer").
 */
function renderItens(itensFiltrados, categoria) {
    const textureList = document.getElementById('texture-list');
    textureList.innerHTML = ''; // Limpa a lista antes de renderizar

    itensFiltrados.forEach((item, index) => {
        if (item.content === 'textura') {
            // Renderiza uma textura
            const texturaItem = document.createElement('div');
            texturaItem.className = 'texture-item';

            // Gera o ID da textura
            const texturaId = `# <span class="mc-yellow">${item.ct.toLowerCase()}-${index + 1}</span>`;

            // Verifica se a URL tem hash (ou seja, se não é a categoria "todos")
            const mostrarInfo = window.location.hash !== '';

            // Verifica se há observações (obs) para a textura
            const hasObs = item.obs ? true : false;

            // Renderiza os ícones dos blocos, se existirem
            const blocksHTML = item.blocks
                ? item.blocks.map(block => `<img src="${block}" alt="Bloco" class="block-icon">`).join('')
                : '';

            texturaItem.innerHTML = `
                <div class="texture-content">
                    <div class="texture-icon-container">
                        <div class="version-badge">${item.v}</div>
                        <div>
                            <img src="${item.icone}" class="texture-icon" alt="${item.nome}">
                            ${mostrarInfo ? `<div class="texture-info-btn">i<div class="info-tooltip">${texturaId}</div></div>` : ''}
                        </div>
                    </div>
                    <div class="texture-details">
                        <h3 class="texture-title">${parseMCString(item.nome)}</h3>
                        <p class="texture-description">${parseMCString(item.desc)}</p>
                    </div>
                    <button class="download-btn" onclick="window.open('${item.link}', '_blank')">
                        <svg class="download-icon" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M5 20h14v-2H5v2zm7-18L5.33 8.67 6 10l6-5 6 5 0.67-1.33L12 2z"/>
                            <path d="M11 10v6h2v-6h3l-4-4-4 4h3z"/>
                        </svg>
                        Download
                    </button>
                </div>
                ${hasObs ? `
                    <div class="texture-obs-container">
                        <div class="texture-obs">
                            ${parseMCString(item.obs)}
                            <div class="block-icons">${blocksHTML}</div>
                            <br>
                        </div>
                    </div>
                ` : ''}
            `;

            // Adiciona os eventos ao botão de informações das texturas (se existir)
            if (mostrarInfo) {
                const infoBtn = texturaItem.querySelector('.texture-info-btn');
                const tooltip = infoBtn.querySelector('.info-tooltip');

                // Mostra/oculta o tooltip ao passar o mouse (desktop)
                infoBtn.addEventListener('mouseover', () => showInfoTooltip(tooltip));
                infoBtn.addEventListener('mouseout', () => hideInfoTooltip(tooltip));

                // Mostra/oculta o tooltip ao tocar (mobile)
                infoBtn.addEventListener('click', () => toggleInfoTooltip(tooltip));
            }

            textureList.appendChild(texturaItem);
        } else if (item.content === 'influencer') {
            // Renderiza um influenciador
            const influencerItem = document.createElement('div');
            influencerItem.className = 'texture-item2';
            const username = item.mc_username;
            const u1 = item.username.split(' ')[1];
            const iconURL = getIconURL(username, item.hasMinecraftOriginal);
            let btv = item.platform;
            let bt = "";

            if (btv.includes("Discord")) {
                bt = `<button class="bt-dc" onclick="window.open('${item.link}', '_blank')">
                    <div class="svg-wrapper-1">
                        <div class="svg-wrapper">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="40" height="40">
                                <path fill="none" d="M0 0h24v24H0z"></path>
                                <path fill="currentColor" d="M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051 0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.02-.066.051.051 0 0 1 .015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1-.004.085 8.254 8.254 0 0 1-1.249.594.05.05 0 0 0-.03.03.052.052 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.235 13.235 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Zm-8.198 7.307c-.789 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612Zm5.316 0c-.788 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612Z"></path>
                            </svg>
                        </div>
                    </div>
                    <span>Discord</span>
                </button>`;
            } else if (btv.includes("YouTube")) {
                bt = `<button class="bt-dc youtube-button" onclick="window.open('${item.link}', '_blank')">
                  <div class="svg-wrapper-1">
                        <div class="svg-wrapper">
                            <svg viewBox="0 0 576 512" fill="white" height="1.6em" xmlns="http://www.w3.org/2000/svg">
                                 <path d="M549.7 124.1c-6.3-23.7-24.8-42.3-48.3-48.6C458.8 64 288 64 288 64S117.2 64 74.6 75.5c-23.5 6.3-42 24.9-48.3 48.6-11.4 42.9-11.4 132.3-11.4 132.3s0 89.4 11.4 132.3c6.3 23.7 24.8 41.5 48.3 47.8C117.2 448 288 448 288 448s170.8 0 213.4-11.5c23.5-6.3 42-24.2 48.3-47.8 11.4-42.9 11.4-132.3 11.4-132.3s0-89.4-11.4-132.3zm-317.5 213.5V175.2l142.7 81.2-142.7 81.2z"></path>
                            </svg>
                        </div>
                    </div>
                    <span>Youtube</span>
                </button>`;
            } else if (btv.includes("Twitch")) {
                bt = `<button class="bt-dc twitch-button" onclick="window.open('${item.link}', '_blank')">
                  <div class="svg-wrapper-1">
                        <div class="svg-wrapper">
                            <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" id="twitch" class="icons-social-media">
                                 <path d="M391.17,103.47H352.54v109.7h38.63ZM285,103H246.37V212.75H285ZM120.83,0,24.31,91.42V420.58H140.14V512l96.53-91.42h77.25L487.69,256V0ZM449.07,237.75l-77.22,73.12H294.61l-67.6,64v-64H140.14V36.58H449.07Z"></path>
                            </svg>
                        </div>
                    </div>
                    <span>Twitch</span>
                </button>`;
            }

            // Gera o ID do influenciador
            const influencerId = `# <span class="mc-yellow">${u1.includes("zone.gg") ? "nerdzone" : u1.toLowerCase()}</span>`;

            influencerItem.innerHTML = `
                <div class="texture-icon-container">
                        <img src="${iconURL}" class="texture-icon" alt="${username}" style="border: none;">
                        <div class="texture-info-btn">i<div class="info-tooltip">${influencerId}</div></div>
                </div>
                <div class="texture-content">
                    <h3 class="texture-title">${parseMCString(item.username)}</h3>
                </div>
                ${bt}
            `;

            // Adiciona os eventos ao botão de informações do influenciador
            const infoBtn = influencerItem.querySelector('.texture-info-btn');
            const tooltip = infoBtn.querySelector('.info-tooltip');

            // Mostra/oculta o tooltip ao passar o mouse (desktop)
            infoBtn.addEventListener('mouseover', () => showInfoTooltip(tooltip));
            infoBtn.addEventListener('mouseout', () => hideInfoTooltip(tooltip));

            // Mostra/oculta o tooltip ao tocar (mobile)
            infoBtn.addEventListener('click', () => toggleInfoTooltip(tooltip));

            textureList.appendChild(influencerItem);
        }
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
 * Obtém a URL do ícone do influenciador.
 * @function
 * @param {string} username - Nome de usuário do influenciador.
 * @param {boolean} hasMinecraftOriginal - Indica se o influenciador tem uma skin original do Minecraft.
 * @returns {string} URL do ícone.
 */
function getIconURL(username, hasMinecraftOriginal) {
    if (hasMinecraftOriginal) {
        if(username.includes("nerdzone")) return 'mc/img/base/icon.png';
        return `https://starlightskins.lunareclipse.studio/render/head/${username}/full`;
    } else {
        if (username.includes("matheussponchi")) return 'mc/img/staff/matheussponchi.png';
        return 'mc/img/staff/p.png';
    }
}


/**
 * 🚀 Ativa o filtro e adiciona a classe "active" ao botão correto.
 * @function
 * @param {string} categoria - Categoria a ser ativada.
 */
function ativarFiltro(categoria) {
    const previewContainer = document.getElementById('preview-container');

    // Mostra ou esconde o preview-container baseado na categoria
    if (categoria === 'influencer') {
        previewContainer.style.display = 'none';
    } else {
        previewContainer.style.display = '';
    }

    // Remove a classe 'active' de todos os botões
    document.querySelectorAll('.filtro-btn').forEach(btn => btn.classList.remove('active'));

    // Seleciona o botão correto e adiciona 'active'
    const botaoFiltro = document.querySelector(`.filtro-btn[data-ct="${categoria}"]`);
    if (botaoFiltro) {
        botaoFiltro.classList.add('active');
    }

    // Filtra os itens com base na categoria
    let itensFiltrados;
    if (categoria === 'todos') {
        itensFiltrados = data; // Mostra todos os itens (texturas e influenciadores)
    } else if (categoria === 'influencer') {
        itensFiltrados = data.filter(item => item.content === 'influencer'); // Mostra apenas influenciadores
    } else {
        itensFiltrados = data.filter(item => item.content === 'textura' && item.ct.toLowerCase() === categoria); // Mostra texturas da categoria
    }

    // Renderiza os itens filtrados
    renderItens(itensFiltrados, categoria);
}

/**
 * 🔍 Aplica o filtro com base no hash da URL.
 * @function
 */
/**
 * 🔍 Aplica o filtro com base no hash da URL.
 * @function
 */
function aplicarFiltroPorHash() {
    const hash = window.location.hash.substring(1).toLowerCase(); // Obtém o hash sem o '#'

    const previewContainer = document.getElementById('preview-container');

    // Mostra ou esconde o preview-container baseado no hash
    if (hash === 'influencer') {
        previewContainer.style.display = 'none';
    } else {
        previewContainer.style.display = ''; // Volta ao valor padrão
    }

    // Se não houver hash, ativa "todos"
    if (!hash) {
        ativarFiltro('todos');
        return;
    }

    // Verifica se o hash é um nome de influenciador
    const influencer = data.find(item => item.content === 'influencer' && item.username.split(' ')[1].toLowerCase() === hash);
    if (influencer) {
        ativarFiltro('influencer'); // Ativa a categoria "influencer"

        // Redireciona automaticamente para o link do influencer
        if (influencer.link) {
            window.open(influencer.link, '_blank');
        }
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

    const categoriasValidas = ['todos', 'x-ray', 'skygrid', 'pvp', 'influencer', 'outros'];

    // Verifica se a categoria é válida
    if (categoriasValidas.includes(categoria)) {
        ativarFiltro(categoria); // Ativa a categoria

        // Filtra as texturas da categoria
        const texturasFiltradas = data.filter(item => item.content === 'textura' && item.ct.toLowerCase() === categoria);

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

        // Ativa o filtro com base na categoria
        ativarFiltro(categoria);
    });
});

// Aplicar o filtro ao carregar a página
document.addEventListener('DOMContentLoaded', aplicarFiltroPorHash);

// Aplicar o filtro quando o hash da URL mudar
window.addEventListener('hashchange', aplicarFiltroPorHash);