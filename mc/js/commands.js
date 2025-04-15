// Color mapping and parsing functions
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

// DOM elements
const commandsContainer = document.getElementById('commands-container');
const searchInput = document.getElementById('search');
const modal = document.getElementById('modal');
const modalCommand = document.getElementById('modal-command');
const modalDescription = document.getElementById('modal-description');
const closeModalBtn = document.getElementById('close-modal');
const captureBtn = document.getElementById('capture-btn');
const captureArea = document.getElementById('capture-area');

function renderCommands(filter = '') {
    commandsContainer.innerHTML = '';
    const filteredCommands = commands.filter(cmd =>
        cmd.command.toLowerCase().includes(filter.toLowerCase()) ||
        cmd.description.toLowerCase().includes(filter.toLowerCase())
    );

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

        const parsedCommand = parseMCString(cmd.command);
        const parsedDescription = parseMCString(cmd.description);

        commandElement.innerHTML = `
            <div class="p-5 cursor-pointer command-header">
                <div class="flex justify-between items-start">
                    <div class="flex-1 command-text">
                        <h3 class="text-xl font-bold mb-2">${parsedCommand}</h3>
                    </div>
                    <div class="tooltip-container">
                        <button class="info-btn ml-2 p-1 text-gray-400 hover:text-yellow-400 transition-colors duration-300" data-id="${cmd.id}">
                            <i class="fas fa-info-circle text-xl"></i>
                        </button>
                        <span class="tooltip">Mais detalhes</span>
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
            if (e.target.closest('.info-btn') || e.target.closest('.copy-btn') || e.target.closest('.tooltip')) return;

            const drawer = commandElement.querySelector('.command-drawer');
            drawer.classList.toggle('open');
            document.querySelectorAll('.command-drawer').forEach(d => {
                if (d !== drawer && d.classList.contains('open')) {
                    d.classList.remove('open');
                }
            });
        });

        commandElement.querySelector('.info-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            openModal(cmd.id);
        });

        const copyBtn = commandElement.querySelector('.copy-btn');
        copyBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const commandText = copyBtn.getAttribute('data-command');
            navigator.clipboard.writeText(commandText);

            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check mr-1"></i>Copiado!';
            copyBtn.classList.replace('bg-[#2e2d2d]', 'bg-green-600');
            copyBtn.classList.replace('hover:bg-gray-600', 'hover:bg-green-700');

            setTimeout(() => {
                copyBtn.innerHTML = originalText;
                copyBtn.classList.replace('bg-green-600', 'bg-[#2e2d2d]');
                copyBtn.classList.replace('hover:bg-green-700', 'hover:bg-gray-600');
            }, 2000);
        });

        commandsContainer.appendChild(commandElement);
    });

    setupTooltipPositioning();
}

function setupTooltipPositioning() {
    document.querySelectorAll('.tooltip-container').forEach(container => {
        const tooltip = container.querySelector('.tooltip');
        container.addEventListener('mouseenter', function () {
            const containerRect = container.getBoundingClientRect();
            const tooltipRect = tooltip.getBoundingClientRect();
            tooltip.classList.remove('bottom');
            if (containerRect.top - tooltipRect.height < 10) {
                tooltip.classList.add('bottom');
            }
        });
    });
}

let currentCommandId = null;
function openModal(cmdId) {
    currentCommandId = cmdId;
    const command = commands.find(cmd => cmd.id === cmdId);
    if (!command) {
        closeModal();
        return;
    }

    history.pushState(null, null, `?m=${cmdId}`);

    modalCommand.innerHTML = parseMCString(command.command);
    modalDescription.innerHTML = parseMCString(command.description);

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.remove('open');
    history.pushState(null, null, window.location.pathname);
    document.body.style.overflow = '';
}

function captureModal() {
    captureBtn.disabled = true;
    captureBtn.classList.add('opacity-50', 'cursor-not-allowed');

    const commandId = currentCommandId || 'command';
    const command = commands.find(cmd => cmd.id === commandId) || {};

    const tempDiv = document.createElement('div');
    tempDiv.className = 'capture-wrapper';
    tempDiv.innerHTML = `
        <div class="capture-header">
            <img src="https://i.imgur.com/gSomY9Z.png" alt="Nerdzone Logo" class="capture-logo">
            <div>
                <h3 class="mc-red">Nerd<span class="mc-white">zone</span></h3>
                <p class="text-sm mc-gray">Comando do Servidor</p>
            </div>
        </div>
        <div class="command-content">
            <div class="text-2xl font-bold mb-4 break-words">
                ${parseMCString(command.command || '')}
            </div>
            <div class="text-lg mc-gray break-words">
                ${parseMCString(command.description || '')}
            </div>
        </div>
        <div class="capture-footer">
            <p><span class="ip">nerd</span><span class="ip2">zone.gg</span><span class="separator">•</span><span class="id">${commandId}</span></p>
            <p class="text-xs mt-1">Gerado em ${new Date().toLocaleDateString('pt-BR')}</p>
        </div>
    `;

    document.body.appendChild(tempDiv);
    tempDiv.classList.add('capturing');
    tempDiv.style.width = '800px';
    tempDiv.style.padding = '30px';
    tempDiv.style.margin = '0 auto';

    setTimeout(() => {
        html2canvas(tempDiv, {
            backgroundColor: null,
            scale: 2,
            logging: false,
            useCORS: true,
            allowTaint: true,
            windowWidth: 800,
            windowHeight: tempDiv.scrollHeight
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = `comando-${commandId}-${new Date().toISOString().slice(0, 10)}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();

            tempDiv.remove();
            openModal(commandId);
            captureBtn.disabled = false;
            captureBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        }).catch(error => {
            console.error('Erro ao capturar:', error);
            tempDiv.remove();
            captureBtn.disabled = false;
            captureBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        });
    }, 100);
}

function checkUrlForModal() {
    const params = new URLSearchParams(window.location.search);
    const cmdId = params.get('m');
    if (cmdId) openModal(cmdId);
}

searchInput.addEventListener('input', (e) => renderCommands(e.target.value));
closeModalBtn.addEventListener('click', closeModal);
captureBtn.addEventListener('click', captureModal);
modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
});

renderCommands();
checkUrlForModal();

const style = document.createElement('style');
for (let i = 0; i < commands.length; i++) {
    style.innerHTML += `.delay-${i} { animation-delay: ${i * 0.1}s; }`;
}
style.innerHTML += `.capturing { box-shadow: 0 0 0 2px #48bb78; }`;
document.head.appendChild(style);
