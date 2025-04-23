/**
 * 🔀 Embaralha um array usando o algoritmo Fisher-Yates
 * @param {Array} array - O array a ser embaralhado
 * @returns {Array} - O array embaralhado
 */
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

/**
 * 🎨 Mapeamento de cores do Minecraft para classes CSS
 * @type {Object<string, string>}
 * @description Contém o mapeamento de todos os códigos de cores do Minecraft (formatos § e &)
 */
const colorMap = (() => {
    const baseColors = {
        '§0': 'mc-black',
        '§1': 'mc-dark-blue',
        '§2': 'mc-dark-green',
        '§3': 'mc-dark-aqua',
        '§4': 'mc-dark-red',
        '§5': 'mc-dark-purple',
        '§6': 'mc-gold',
        '§7': 'mc-gray',
        '§8': 'mc-dark-gray',
        '§9': 'mc-blue',
        '§a': 'mc-green',
        '§b': 'mc-aqua',
        '§c': 'mc-red',
        '§d': 'mc-light-purple',
        '§e': 'mc-yellow',
        '§f': 'mc-white'
    };

    // Adiciona variações com & (alternativa ao §)
    const extendedColors = {};
    for (const [key, value] of Object.entries(baseColors)) {
        extendedColors[key] = value;
        extendedColors['&' + key[1]] = value;
    }

    return extendedColors;
})();

/**
 * ✨ Converte string formatada do Minecraft em HTML com spans coloridos
 * @param {string} text - A string formatada do Minecraft
 * @returns {string} - String HTML com spans coloridos
 * @description Converte códigos de cores do Minecraft (§ ou &) para spans HTML com classes apropriadas
 */
function parseMCString(text) {
    if (!text) return '';

    // Substitui caracteres especiais para evitar XSS
    const withEntities = text.replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // Processa os códigos de cores
    const result = withEntities
        .replace(/[§&][0-9a-f]/g, match => {
            const normalizedKey = '§' + match[1];
            return `</span><span class="${colorMap[normalizedKey] || ''}">`;
        })
        .replace(/<\/span>/g, '', 1) + '</span>';

    // Remove spans vazios
    return result.replace(/<span class=""><\/span>/g, '');
}

// Constantes do aplicativo
const STARRED_KEY = 'starredCommands';
let starredCommands = JSON.parse(localStorage.getItem(STARRED_KEY)) || [];
const commandsContainer = document.getElementById('commands-container');
const searchInput = document.getElementById('search');
const modal = document.getElementById('modal');
const modalCommand = document.getElementById('modal-command');
const modalDescription = document.getElementById('modal-description');
const closeModalBtn = document.getElementById('close-modal');
const captureBtn = document.getElementById('capture-btn');
const captureArea = document.getElementById('capture-area');
let currentCommandId = null;

/**
 * ⭐ Alterna o status de estrela de um comando
 * @param {string} cmdId - O ID do comando
 * @description Adiciona ou remove o comando da lista de favoritos e atualiza o localStorage
 */
function toggleStar(cmdId) {
    const index = starredCommands.indexOf(cmdId);
    
    if (index === -1) {
        // Adiciona estrela
        starredCommands.push(cmdId);
        updateStarButtonUI(cmdId, true);
    } else {
        // Remove estrela
        starredCommands.splice(index, 1);
        updateStarButtonUI(cmdId, false);
    }

    localStorage.setItem(STARRED_KEY, JSON.stringify(starredCommands));
    renderCommands(searchInput.value);
}

/**
 * 🎨 Atualiza a interface do botão de estrela
 * @param {string} cmdId - O ID do comando
 * @param {boolean} isStarred - Se o comando está marcado com estrela
 */
function updateStarButtonUI(cmdId, isStarred) {
    const starBtn = document.querySelector(`.star-btn[data-id="${cmdId}"]`);
    if (!starBtn) return;

    if (isStarred) {
        starBtn.innerHTML = '<i class="fas fa-star text-xl"></i>';
        starBtn.classList.replace('text-gray-400', 'text-yellow-400');
        starBtn.classList.remove('hover:text-yellow-200');
        
        // Efeito de destaque
        starBtn.style.transform = 'scale(1.3)';
        setTimeout(() => starBtn.style.transform = 'scale(1)', 300);
    } else {
        starBtn.innerHTML = '<i class="far fa-star text-xl"></i>';
        starBtn.classList.replace('text-yellow-400', 'text-gray-400');
        starBtn.classList.add('hover:text-yellow-200');
    }
}

/**
 * 🌟 Verifica se um comando está marcado com estrela
 * @param {string} cmdId - O ID do comando
 * @returns {boolean} - True se o comando está marcado
 */
function isStarred(cmdId) {
    return starredCommands.includes(cmdId);
}

/**
 * 🖼️ Renderiza os cartões de comando com base no filtro de pesquisa
 * @param {string} [filter=''] - O texto de filtro
 * @description Exibe todos os comandos que correspondem ao filtro, com os favoritos primeiro
 */
function renderCommands(filter = '') {
    commandsContainer.innerHTML = '';

    // Filtra comandos
    let filteredCommands = commands.filter(cmd =>
        cmd.command.toLowerCase().includes(filter.toLowerCase()) ||
        cmd.description.toLowerCase().includes(filter.toLowerCase())
    );

    // Separa comandos favoritos
    const starredCmds = filteredCommands.filter(cmd => isStarred(cmd.id));
    let unstarredCmds = filteredCommands.filter(cmd => !isStarred(cmd.id));

    // Embaralha comandos não favoritos se não houver filtro
    if (filter === '') {
        unstarredCmds = shuffleArray(unstarredCmds);
    }

    // Combina comandos (favoritos primeiro)
    filteredCommands = [...starredCmds, ...unstarredCmds];

    // Atualiza contador
    updateCommandCounter(filteredCommands.length);

    // Exibe mensagem se nenhum comando for encontrado
    if (filteredCommands.length === 0) {
        showNoResultsMessage(filter);
        return;
    }

    // Renderiza cada comando
    filteredCommands.forEach((cmd, index) => {
        createCommandCard(cmd, index);
    });
}

/**
 * 🔢 Atualiza o contador de comandos
 * @param {number} count - Número de comandos exibidos
 */
function updateCommandCounter(count) {
    const counterWidget = document.getElementById('command-count');
    if (counterWidget) {
        counterWidget.textContent = `${count}`;
    }
}

/**
 * 📭 Exibe mensagem quando nenhum comando é encontrado
 * @param {string} filter - O texto de filtro usado
 */
function showNoResultsMessage(filter) {
    commandsContainer.innerHTML = `
        <div class="col-span-full text-center py-8 mc-gray">
            <i class="fas fa-search-minus text-5xl mb-4 block"></i>
            <p class="text-xl">Nenhum comando encontrado para "${filter}"</p>
            <p class="text-sm mt-2">Tente usar termos diferentes</p>
        </div>
    `;
}

/**
 * 🃏 Cria um cartão de comando
 * @param {Object} cmd - O objeto do comando
 * @param {number} index - Índice para animação
 */
function createCommandCard(cmd, index) {
    const commandElement = document.createElement('div');
    commandElement.className = `command-card rounded-lg transition-all duration-300 animate-fade-in delay-${index}`;

    // Destaca comandos favoritos
    if (isStarred(cmd.id)) {
        commandElement.classList.add('starred');
        commandElement.style.order = '-1';
    }

    // Prepara conteúdo
    const parsedCommand = parseMCString(cmd.command);
    const parsedDescription = parseMCString(cmd.description);

    // Estrutura do cartão
    commandElement.innerHTML = `
        <div class="p-5 cursor-pointer command-header">
            <div class="flex justify-between items-start">
                <div class="flex-1 command-text">
                    <h3 class="text-xl font-bold mb-2">${parsedCommand}</h3>
                </div>
                <div class="flex items-center gap-2">
                    <div class="tooltip-container">
                        <button class="star-btn ml-2 p-1 ${isStarred(cmd.id) ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-200'} transition-colors duration-300" data-id="${cmd.id}">
                            <i class="${isStarred(cmd.id) ? 'fas' : 'far'} fa-star text-xl"></i>
                        </button>
                        <span class="tooltip">${isStarred(cmd.id) ? 'Remover estrela' : 'Adicionar estrela'}</span>
                    </div>
                    <div class="tooltip-container">
                        <button class="info-btn ml-2 p-1 text-gray-400 hover:text-yellow-400 transition-colors duration-300" data-id="${cmd.id}">
                            <i class="fas fa-info-circle text-xl"></i>
                        </button>
                        <span class="tooltip">Mais detalhes</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="command-drawer">
            <div class="command-drawer-content p-4">
                <p class="text-gray-300 mb-4 command-text">${parsedDescription}</p>
                <div class="flex justify-between items-center text-sm mc-gray">
                    <span class="bg-[#2e2d2d] px-2 py-1 rounded flex items-center gap-1">
                        <span class="text-white">ID:</span>
                        <span class="text-yellow-400 font-mono">${cmd.id}</span>
                    </span>
                    <div class="tooltip-container">
                        <button class="copy-btn px-3 py-1 bg-[#2e2d2d] text-white hover:bg-gray-600 rounded text-xs" data-command="${cmd.command.replace(/&[0-9a-f]/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>')}">
                            <i class="fas fa-copy mr-1"></i>Copiar comando
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Configura interações
    setupCommandCardInteractions(commandElement, cmd);
    commandsContainer.appendChild(commandElement);
}

/**
 * 🎮 Configura as interações do cartão de comando
 * @param {HTMLElement} element - O elemento do cartão
 * @param {Object} cmd - O objeto do comando
 */
function setupCommandCardInteractions(element, cmd) {
    // Abrir/fechar drawer
    element.addEventListener('click', (e) => {
        if (e.target.closest('.info-btn') || e.target.closest('.copy-btn') || 
            e.target.closest('.tooltip') || e.target.closest('.star-btn')) {
            return;
        }

        const drawer = element.querySelector('.command-drawer');
        drawer.classList.toggle('open');

        // Fecha outros drawers abertos
        document.querySelectorAll('.command-drawer').forEach(d => {
            if (d !== drawer && d.classList.contains('open')) {
                d.classList.remove('open');
            }
        });
    });

    // Botão de informações
    const infoBtn = element.querySelector('.info-btn');
    infoBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openModal(cmd.id);
    });

    // Botão de estrela
    const starBtn = element.querySelector('.star-btn');
    starBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleStar(cmd.id);
    });

    // Botão de copiar
    const copyBtn = element.querySelector('.copy-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            copyCommandText(copyBtn);
        });
    }
}

/**
 * 📋 Copia o texto do comando
 * @param {HTMLElement} button - O botão de copiar
 */
function copyCommandText(button) {
    const commandText = button.getAttribute('data-command');
    navigator.clipboard.writeText(commandText);

    // Feedback visual
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-check mr-1"></i>Copiado!';
    button.classList.replace('bg-[#2e2d2d]', 'bg-green-600');
    button.classList.replace('hover:bg-gray-600', 'hover:bg-green-700');

    setTimeout(() => {
        button.innerHTML = originalText;
        button.classList.replace('bg-green-600', 'bg-[#2e2d2d]');
        button.classList.replace('hover:bg-green-700', 'hover:bg-gray-600');
    }, 2000);
}

/**
 * 🪟 Abre o modal com detalhes do comando
 * @param {string} cmdId - O ID do comando
 * @description Exibe um modal com informações detalhadas e atualiza o histórico do navegador
 */
function openModal(cmdId) {
    currentCommandId = cmdId;
    const command = commands.find(cmd => cmd.id === cmdId);

    if (!command) {
        closeModal();
        return;
    }

    // Atualiza histórico
    history.pushState({ modal: true, cmdId }, null, `?m=${cmdId}`);

    // Prepara conteúdo
    const parsedCommand = parseMCString(command.command);
    const parsedDescription = parseMCString(command.description);

    // Atualiza modal
    modalCommand.innerHTML = parsedCommand;
    modalDescription.innerHTML = parsedDescription;

    // Atualiza URL no rodapé
    document.getElementById('modal-command-url').textContent =
        `texturas-nerdzone.pages.dev/comandos?m=${cmdId}`;

    // Exibe modal
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

/**
 * ❌ Fecha o modal
 * @description Oculta o modal e restaura o estado do histórico do navegador
 */
function closeModal() {
    modal.classList.remove('open');
    history.pushState(null, null, window.location.pathname);
    document.body.style.overflow = '';
}

/**
 * 📋 Copia a URL do comando para a área de transferência
 */
function copyCommandUrl() {
    if (!currentCommandId) return;

    const url = `${window.location.origin}${window.location.pathname}?m=${currentCommandId}`;

    navigator.clipboard.writeText(url).then(() => {
        const copyUrlBtn = document.getElementById('copy-url-btn');
        if (copyUrlBtn) {
            const originalText = copyUrlBtn.innerHTML;
            copyUrlBtn.innerHTML = '<i class="fas fa-check mr-2"></i> URL copiada!';
            copyUrlBtn.classList.replace('bg-blue-600', 'btn-capture');
            copyUrlBtn.disabled = true;
            copyUrlBtn.classList.add('opacity-50', 'cursor-not-allowed');
            
            setTimeout(() => {
                copyUrlBtn.innerHTML = originalText;
                copyUrlBtn.classList.replace('btn-capture', 'bg-blue-600');
                copyUrlBtn.disabled = false;
                copyUrlBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            }, 2000);
        }
    }).catch(err => {
        console.error('Erro ao copiar URL:', err);
    });
}

/**
 * 📸 Captura os detalhes do comando como imagem PNG
 * @description Cria uma captura de tela estilizada dos detalhes do comando para compartilhamento
 */
function captureModal() {
    if (!currentCommandId) return;

    // Feedback visual
    const originalText = captureBtn.innerHTML;
    captureBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Processando...';
    captureBtn.disabled = true;
    captureBtn.classList.add('opacity-50', 'cursor-not-allowed');

    // Cria área de captura temporária
    const tempCaptureArea = document.createElement('div');
    tempCaptureArea.innerHTML = captureArea.innerHTML;
    tempCaptureArea.style.position = 'fixed';
    tempCaptureArea.style.left = '-9999px';
    tempCaptureArea.style.width = '800px';
    tempCaptureArea.style.padding = '30px';
    tempCaptureArea.style.backgroundColor = '#1e1e1e';
    tempCaptureArea.style.backgroundImage = `url("data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23374151' fill-opacity='0.2'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
    document.body.appendChild(tempCaptureArea);

    // Captura a imagem
    setTimeout(() => {
        html2canvas(tempCaptureArea, {
            scale: 2,
            logging: false,
            useCORS: true
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = `comando-${currentCommandId}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();

            // Limpeza
            document.body.removeChild(tempCaptureArea);
            resetCaptureButton(originalText);
        }).catch(err => {
            console.error('Erro ao capturar:', err);
            document.body.removeChild(tempCaptureArea);
            resetCaptureButton(originalText);
        });
    }, 300);
}

/**
 * 🔄 Restaura o botão de captura ao estado original
 * @param {string} originalText - O texto original do botão
 */
function resetCaptureButton(originalText) {
    captureBtn.innerHTML = originalText;
    captureBtn.disabled = false;
    captureBtn.classList.remove('opacity-50', 'cursor-not-allowed');
}

/**
 * 🔍 Verifica a URL por parâmetros de modal ao carregar a página
 * @description Abre um modal de comando se a URL contiver um ID de comando
 */
function checkUrlForModal() {
    const params = new URLSearchParams(window.location.search);
    const cmdId = params.get('m');
    if (cmdId) {
        openModal(cmdId);
    }
}

// Configuração de eventos
function setupEventListeners() {
    // Pesquisa
    searchInput.addEventListener('input', (e) => renderCommands(e.target.value));
    
    // Modal
    closeModalBtn.addEventListener('click', closeModal);
    captureBtn.addEventListener('click', captureModal);
    modal.addEventListener('click', (e) => e.target === modal && closeModal());
    
    // Teclado
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('open')) {
            closeModal();
        }
    });
    
    
    // Copiar URL
    document.getElementById('copy-url-btn')?.addEventListener('click', copyCommandUrl);
}

// Inicialização
function init() {
    // Cria estilos para animações
    const style = document.createElement('style');
    for (let i = 0; i < commands.length; i++) {
        style.innerHTML += `.delay-${i} { animation-delay: ${i * 0.02}s; }`;
    }
    document.head.appendChild(style);

    // Configura eventos e renderiza
    setupEventListeners();
    renderCommands();
    checkUrlForModal();
}

// Inicia o aplicativo
init();