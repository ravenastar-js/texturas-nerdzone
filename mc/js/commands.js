/**
 * 🔀 Shuffles an array in place using Fisher-Yates algorithm
 * @param {Array} array - The array to shuffle
 * @returns {Array} - The shuffled array
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
 * 🎨 Color mapping object with Minecraft color codes to CSS class mapping
 * @type {Object<string, string>}
 * @description Contains mappings for all Minecraft color codes (both § and & formats)
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

    const extendedColors = {};
    for (const [key, value] of Object.entries(baseColors)) {
        extendedColors[key] = value;
        extendedColors['&' + key[1]] = value;
    }

    return extendedColors;
})();

/**
 * ✨ Parses Minecraft formatted string into HTML with color spans
 * @param {string} text - The Minecraft formatted string to parse
 * @returns {string} - HTML string with color spans
 * @description Converts Minecraft color codes (§ or &) to HTML spans with appropriate classes
 */
function parseMCString(text) {
    if (!text) return '';

    const withEntities = text.replace(/</g, '&lt;').replace(/>/g, '&gt;');

    const result = withEntities
        .replace(/[§&][0-9a-f]/g, match => {
            const normalizedKey = '§' + match[1];
            return `</span><span class="${colorMap[normalizedKey] || ''}">`;
        })
        .replace(/<\/span>/g, '', 1) + '</span>';

    return result.replace(/<span class=""><\/span>/g, '');
}

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

/**
 * ⭐ Toggle star status for a command
 * @param {string} cmdId - The command ID to star/unstar
 */
function toggleStar(cmdId) {
    const index = starredCommands.indexOf(cmdId);
    if (index === -1) {
        starredCommands.push(cmdId);
        // Feedback visual
        const starBtn = document.querySelector(`.star-btn[data-id="${cmdId}"]`);
        if (starBtn) {
            starBtn.innerHTML = '<i class="fas fa-star text-xl"></i>';
            starBtn.classList.remove('text-gray-400', 'hover:text-yellow-200');
            starBtn.classList.add('text-yellow-400');

            // Efeito de pulso
            starBtn.style.transform = 'scale(1.3)';
            setTimeout(() => {
                starBtn.style.transform = 'scale(1)';
            }, 300);
        }
    } else {
        starredCommands.splice(index, 1);
        // Feedback visual
        const starBtn = document.querySelector(`.star-btn[data-id="${cmdId}"]`);
        if (starBtn) {
            starBtn.innerHTML = '<i class="far fa-star text-xl"></i>';
            starBtn.classList.remove('text-yellow-400');
            starBtn.classList.add('text-gray-400', 'hover:text-yellow-200');
        }
    }
    localStorage.setItem(STARRED_KEY, JSON.stringify(starredCommands));
    renderCommands(searchInput.value);
}

/**
 * 🌟 Check if a command is starred
 * @param {string} cmdId - The command ID to check
 * @returns {boolean} - True if the command is starred
 */
function isStarred(cmdId) {
    return starredCommands.includes(cmdId);
}

/**
 * 🖼️ Renders command cards based on search filter
 * @param {string} [filter=''] - The search filter string
 * @description Displays all commands that match the filter, with starred commands first
 */
function renderCommands(filter = '') {
    commandsContainer.innerHTML = '';

    let filteredCommands = commands.filter(cmd =>
        cmd.command.toLowerCase().includes(filter.toLowerCase()) ||
        cmd.description.toLowerCase().includes(filter.toLowerCase())
    );

    // Separar comandos com estrelas
    const starredCmds = filteredCommands.filter(cmd => isStarred(cmd.id));
    let unstarredCmds = filteredCommands.filter(cmd => !isStarred(cmd.id));

    // Embaralhar apenas os não estrelados se não houver filtro
    if (filter === '') {
        unstarredCmds = shuffleArray(unstarredCmds);
    }

    // Combinar comandos (estrelados primeiro)
    filteredCommands = [...starredCmds, ...unstarredCmds];

    if (filteredCommands.length === 0) {
        commandsContainer.innerHTML = `
            <div class="col-span-full text-center py-8 mc-gray">
                <i class="fas fa-search-minus text-5xl mb-4 block"></i>
                <p class="text-xl">Nenhum comando encontrado para "${filter}"</p>
                <p class="text-sm mt-2">Tente usar termos diferentes</p>
            </div>
        `;
        return;
    }

    filteredCommands.forEach((cmd, index) => {
        const commandElement = document.createElement('div');
        commandElement.className = `command-card rounded-lg transition-all duration-300 animate-fade-in delay-${index}`;

        // Adicionar classe para comandos com estrela
        if (isStarred(cmd.id)) {
            commandElement.classList.add('starred');
            commandElement.style.order = '-1'; // Garante que fique no topo
        }

        const parsedCommand = parseMCString(cmd.command);
        const parsedDescription = parseMCString(cmd.description);

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
                            <span class="tooltip">Copiar para área de transferência</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        commandElement.addEventListener('click', (e) => {
            if (e.target.closest('.info-btn') ||
                e.target.closest('.copy-btn') ||
                e.target.closest('.tooltip') ||
                e.target.closest('.star-btn')) {
                return;
            }

            const drawer = commandElement.querySelector('.command-drawer');
            drawer.classList.toggle('open');

            document.querySelectorAll('.command-drawer').forEach(d => {
                if (d !== drawer && d.classList.contains('open')) {
                    d.classList.remove('open');
                }
            });
        });

        const infoBtn = commandElement.querySelector('.info-btn');
        infoBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openModal(cmd.id);
        });

        const starBtn = commandElement.querySelector('.star-btn');
        starBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const cmdId = starBtn.getAttribute('data-id');
            toggleStar(cmdId);
        });

        const copyBtn = commandElement.querySelector('.copy-btn');
        if (copyBtn) {
            copyBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const commandText = copyBtn.getAttribute('data-command');
                navigator.clipboard.writeText(commandText);

                const originalText = copyBtn.innerHTML;
                copyBtn.innerHTML = '<i class="fas fa-check mr-1"></i>Copiado!';
                copyBtn.classList.remove('bg-[#2e2d2d]', 'hover:bg-gray-600');
                copyBtn.classList.add('bg-green-600', 'hover:bg-green-700');

                setTimeout(() => {
                    copyBtn.innerHTML = originalText;
                    copyBtn.classList.remove('bg-green-600', 'hover:bg-green-700');
                    copyBtn.classList.add('bg-[#2e2d2d]', 'hover:bg-gray-600');
                }, 2000);
            });
        }

        commandsContainer.appendChild(commandElement);
    });

    setupTooltipPositioning();
}

/**
 * 🛠️ Configures smart positioning for tooltips
 * @description Ensures tooltips stay visible by positioning them above or below their parent element
 */
function setupTooltipPositioning() {
    document.querySelectorAll('.tooltip-container').forEach(container => {
        const tooltip = container.querySelector('.tooltip');

        // Verificar se é um tooltip de estrela
        const isStarTooltip = container.querySelector('.star-btn') !== null;

        container.addEventListener('mouseenter', function () {
            const containerRect = container.getBoundingClientRect();
            const tooltipRect = tooltip.getBoundingClientRect();

            tooltip.classList.remove('bottom', 'left', 'right');

            // Posicionamento especial para tooltips de estrela
            if (isStarTooltip) {
                if (containerRect.right + tooltipRect.width > window.innerWidth) {
                    tooltip.classList.add('left');
                } else {
                    tooltip.classList.add('right');
                }
            }
            // Posicionamento padrão para outros tooltips
            else if (containerRect.top - tooltipRect.height < 10) {
                tooltip.classList.add('bottom');
            }
        });
    });
}

let currentCommandId = null;

/**
 * 🪟 Opens modal with detailed command information
 * @param {string} cmdId - The ID of the command to display
 * @description Shows a modal with the full command details and updates browser history
 */
function openModal(cmdId) {
    currentCommandId = cmdId;
    const command = commands.find(cmd => cmd.id === cmdId);

    if (!command) {
        modalCommand.innerHTML = '';
        modalDescription.innerHTML = '';
        closeModal();
        return;
    }

    history.pushState(null, null, `?m=${cmdId}`);

    const parsedCommand = parseMCString(command.command);
    const parsedDescription = parseMCString(command.description);

    modalCommand.innerHTML = parsedCommand;
    modalDescription.innerHTML = parsedDescription;

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

/**
 * ❌ Closes the modal dialog
 * @description Hides the modal and restores browser history state
 */
function closeModal() {
    modal.classList.remove('open');
    history.pushState(null, null, window.location.pathname);
    document.body.style.overflow = '';
}

/**
 * 📸 Captures the command details as a PNG image
 * @description Creates a styled screenshot of the command details for sharing
 */
function captureModal() {
    if (!currentCommandId) return;

    // Bloquear o botão de captura
    captureBtn.disabled = true;
    captureBtn.classList.add('opacity-50', 'cursor-not-allowed');

    // 1. Criar um elemento temporário idêntico ao captureArea
    const tempCaptureArea = document.createElement('div');
    tempCaptureArea.id = 'temp-capture-area';
    tempCaptureArea.className = captureArea.className;
    tempCaptureArea.style.position = 'fixed';
    tempCaptureArea.style.left = '-9999px';
    tempCaptureArea.style.top = '0';
    document.body.appendChild(tempCaptureArea);

    // 2. Obter o comando atual
    const command = commands.find(cmd => cmd.id === currentCommandId) || {};

    // 3. Popular o elemento temporário com o conteúdo de captura
    tempCaptureArea.innerHTML = `
        <div class="capture-header">
            <img src="https://i.imgur.com/gSomY9Z.png" alt="Nerdzone Logo" class="capture-logo">
            <div>
                <p class="text-sm mc-gray">Comando do Servidor</p>
                <h3 class="mc-red">nerd<span class="mc-white">zone.gg</span></h3>
            </div>
        </div>
        <div class="command-content">
            <div id="modal-command" class="text-2xl font-bold mb-4 break-words">
                ${parseMCString(command.command || '')}
            </div>
            <div id="modal-description" class="text-lg mc-gray break-words">
                ${parseMCString(command.description || '')}
            </div>
        </div>
        <div class="capture-footer">
            <p class="text-xs mt-1" style="margin-top: 5px; font-size: 11px; color: #8ad4ff;">
                texturas-nerdzone.pages.dev/comandos?m=${currentCommandId}
            </p>
        </div>
    `;

    // 4. Aplicar estilos específicos para captura
    tempCaptureArea.style.width = '800px';
    tempCaptureArea.style.minHeight = '400px';
    tempCaptureArea.style.padding = '30px';
    tempCaptureArea.style.margin = '0 auto';
    tempCaptureArea.style.backgroundColor = '#1e1e1e';
    tempCaptureArea.classList.add('capturing');

    // 5. Capturar o elemento temporário
    setTimeout(() => {
        html2canvas(tempCaptureArea, {
            backgroundColor: null,
            scale: 2,
            logging: false,
            useCORS: true,
            allowTaint: true,
            windowWidth: 800,
            windowHeight: tempCaptureArea.scrollHeight
        }).then(canvas => {
            // 6. Criar e disparar o download
            const link = document.createElement('a');
            link.download = `comando-${currentCommandId}-${new Date().toISOString().slice(0, 10)}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();

            // 7. Limpeza: remover o elemento temporário
            document.body.removeChild(tempCaptureArea);

            // 8. Liberar o botão de captura
            captureBtn.disabled = false;
            captureBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        }).catch(error => {
            console.error('Erro ao capturar:', error);

            // Limpeza em caso de erro
            document.body.removeChild(tempCaptureArea);

            // Liberar o botão de captura
            captureBtn.disabled = false;
            captureBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        });
    }, 300);
}

/**
 * 🔍 Checks URL for modal parameter on page load
 * @description Opens a command modal if the URL contains a command ID parameter
 */
function checkUrlForModal() {
    const params = new URLSearchParams(window.location.search);
    const cmdId = params.get('m');
    if (cmdId) {
        openModal(cmdId);
    }
}

// Event Listeners
searchInput.addEventListener('input', (e) => {
    renderCommands(e.target.value);
});

closeModalBtn.addEventListener('click', closeModal);
captureBtn.addEventListener('click', captureModal);

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
        closeModal();
    }
});

// Initialize
renderCommands();
checkUrlForModal();

const style = document.createElement('style');
for (let i = 0; i < commands.length; i++) {
    style.innerHTML += `
        .delay-${i} {
            animation-delay: ${i * 0.05}s;
        }
    `;
}

document.head.appendChild(style);