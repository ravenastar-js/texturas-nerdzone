
/**
 * 🗂️ Sistema de Categorias para Comandos
 * @description Filtra e organiza comandos por categorias com URLs exclusivas
 */

/**
 * 📊 Definição das categorias disponíveis
 * @type {Array<Object>}
 */
const categories = [
    {
        id: 'all',
        name: 'Todos',
        icon: 'fas fa-list',
        description: 'Mostra todos os comandos disponíveis',
        color: 'gray',
        shortName: 'Todos'
    },
    {
        id: 'clan',
        name: 'Clan',
        icon: 'fas fa-users',
        description: 'Comandos relacionados a clans e alianças',
        color: 'blue',
        shortName: 'Clan',
        filter: cmd => cmd.id.includes('clan') || cmd.command.includes('/clan') || cmd.description.includes('clan')
    },
    {
        id: 'economy',
        name: 'Economia',
        icon: 'fas fa-coins',
        description: 'Comandos de money, trocas e economia',
        color: 'yellow',
        shortName: 'Economia',
        filter: cmd => 
            cmd.id.includes('money') || cmd.id.includes('vender') || cmd.id.includes('leilao') ||
            cmd.command.includes('/money') || cmd.command.includes('/vender') ||
            cmd.description.includes('money') || cmd.description.includes('vender') ||
            cmd.description.includes('economia') || cmd.description.includes('bolsa')
    },
    {
        id: 'warps',
        name: 'Warps',
        icon: 'fas fa-map-marker-alt',
        description: 'Comandos de teleporte e localizações',
        color: 'green',
        shortName: 'Warps',
        filter: cmd => 
            cmd.id.includes('warp') || cmd.id.includes('home') || 
            cmd.command.includes('/warp') || cmd.command.includes('/home') ||
            cmd.description.includes('warp') || cmd.description.includes('teleport')
    },
    {
        id: 'utilidades',
        name: 'Utilidades',
        icon: 'fas fa-tools',
        description: 'Comandos úteis do dia a dia',
        color: 'purple',
        shortName: 'Utilidades',
        filter: cmd => 
            cmd.id.includes('kit') || cmd.id.includes('fly') || cmd.id.includes('compactar') ||
            cmd.id.includes('pot') || cmd.id.includes('heads') || cmd.id.includes('lixeira') ||
            cmd.command.includes('/kit') || cmd.command.includes('/fly') ||
            cmd.description.includes('kit') || cmd.description.includes('utilidade')
    },
    {
        id: 'progressao',
        name: 'Progressão',
        icon: 'fas fa-chart-line',
        description: 'Comandos de rank, skills e progressão',
        color: 'orange',
        shortName: 'Progressão',
        filter: cmd => 
            cmd.id.includes('rank') || cmd.id.includes('skills') || cmd.id.includes('passe') ||
            cmd.command.includes('/rank') || cmd.command.includes('/skills') ||
            cmd.description.includes('rank') || cmd.description.includes('evoluir') ||
            cmd.description.includes('progresso')
    },
    {
        id: 'minigames',
        name: 'Minigames',
        icon: 'fas fa-gamepad',
        description: 'Comandos de minigames e sistemas especiais',
        color: 'red',
        shortName: 'Minigames',
        filter: cmd => 
            cmd.id.includes('mina') || cmd.id.includes('pesca') || cmd.id.includes('skygrid') ||
            cmd.id.includes('saque') || cmd.id.includes('lucky') ||
            cmd.description.includes('minigame') || cmd.description.includes('pesca') ||
            cmd.description.includes('skygrid')
    },
    {
        id: 'informacao',
        name: 'Informação',
        icon: 'fas fa-info-circle',
        description: 'Comandos informativos e de ajuda',
        color: 'aqua',
        shortName: 'Info',
        filter: cmd => 
            cmd.id.includes('ajuda') || cmd.id.includes('site') || cmd.id.includes('verkit') ||
            cmd.id.includes('recompensas') || cmd.id.includes('vantagens') ||
            cmd.command.includes('/ajuda') || cmd.command.includes('/site') ||
            cmd.description.includes('ajuda') || cmd.description.includes('informação')
    },
    {
        id: 'plot',
        name: 'Plot',
        icon: 'fas fa-house-user',
        description: 'Comandos específicos do sistema de plots',
        color: 'pink',
        shortName: 'Plot',
        filter: cmd => 
            cmd.id.includes('plot') || 
            cmd.command.includes('/plot') ||
            cmd.description.includes('plot')
    },
    {
        id: 'starred',
        name: 'Favoritos',
        icon: 'fas fa-star',
        description: 'Seus comandos favoritos',
        color: 'yellow',
        shortName: 'Favoritos',
        filter: cmd => starredCommands.includes(cmd.id)
    }
];

/**
 * 🎯 Categoria atualmente selecionada
 * @type {string}
 */
let currentCategory = 'all';

/**
 * 🎨 Mapeamento de cores Minecraft para categorias
 * @type {Object<string, Object>}
 */
const categoryStyles = {
    'gray': {
        active: {
            bg: 'linear-gradient(to bottom, #666, #444)',
            border: '#888',
            text: '#ccc',
            icon: '#ccc'
        },
        inactive: {
            bg: 'linear-gradient(to bottom, #444, #222)',
            border: '#555',
            text: '#999',
            icon: '#999'
        }
    },
    'blue': {
        active: {
            bg: 'linear-gradient(to bottom, #5566aa7c, #33449979)',
            border: '#7799ff',
            text: '#aaccff',
            icon: '#aaccff'
        },
        inactive: {
            bg: 'linear-gradient(to bottom, #444, #222)',
            border: '#555',
            text: '#999',
            icon: '#999'
        }
    },
    'yellow': {
        active: {
            bg: 'linear-gradient(to bottom, #aa983377, #8877227e)',
            border: '#ffcc00',
            text: '#ffeeaa',
            icon: '#ffcc00'
        },
        inactive: {
            bg: 'linear-gradient(to bottom, #444, #222)',
            border: '#555',
            text: '#999',
            icon: '#999'
        }
    },
    'green': {
        active: {
            bg: 'linear-gradient(to bottom, #55aa5580, #33883377)',
            border: '#77ff77',
            text: '#aaffaa',
            icon: '#77ff77'
        },
        inactive: {
            bg: 'linear-gradient(to bottom, #444, #222)',
            border: '#555',
            text: '#999',
            icon: '#999'
        }
    },
    'purple': {
        active: {
            bg: 'linear-gradient(to bottom, #aa55aa79, #8833887a)',
            border: '#cc77cc',
            text: '#eeaaee',
            icon: '#cc77cc'
        },
        inactive: {
            bg: 'linear-gradient(to bottom, #444, #222)',
            border: '#555',
            text: '#999',
            icon: '#999'
        }
    },
    'orange': {
        active: {
            bg: 'linear-gradient(to bottom, #ff99337a, #cc77227c)',
            border: '#ffaa55',
            text: '#ffcc99',
            icon: '#ffaa55'
        },
        inactive: {
            bg: 'linear-gradient(to bottom, #444, #222)',
            border: '#555',
            text: '#999',
            icon: '#999'
        }
    },
    'red': {
        active: {
            bg: 'linear-gradient(to bottom, #aa553371, #88332269)',
            border: '#ff7766',
            text: '#ffaaaa',
            icon: '#ff7766'
        },
        inactive: {
            bg: 'linear-gradient(to bottom, #444, #222)',
            border: '#555',
            text: '#999',
            icon: '#999'
        }
    },
    'aqua': {
        active: {
            bg: 'linear-gradient(to bottom, #33aaaa7c, #22888862)',
            border: '#55eeee',
            text: '#aaffff',
            icon: '#55eeee'
        },
        inactive: {
            bg: 'linear-gradient(to bottom, #444, #222)',
            border: '#555',
            text: '#999',
            icon: '#999'
        }
    },
    'pink': {
        active: {
            bg: 'linear-gradient(to bottom, #ff99cc80, #cc77998e)',
            border: '#ffaadd',
            text: '#ffccee',
            icon: '#ffaadd'
        },
        inactive: {
            bg: 'linear-gradient(to bottom, #444, #222)',
            border: '#555',
            text: '#999',
            icon: '#999'
        }
    }
};

/**
 * 🏗️ Preenche o container fixo das categorias com os botões
 */
function renderCategoriesInHeader() {
    const categoriesRow = document.querySelector('.categories-row');
    if (!categoriesRow) return;

    categoriesRow.innerHTML = '';

    categories.forEach(cat => {
        const button = document.createElement('button');
        button.className = `category-btn ${cat.id === currentCategory ? 'category-active' : ''} 
                           px-4 py-3 rounded-lg transition-all duration-200 
                           flex items-center gap-2 font-medium text-sm font-bold
                           border-2`;
        button.setAttribute('data-category', cat.id);
        button.setAttribute('data-color', cat.color);
        button.setAttribute('title', cat.description);
        
        applyCategoryStyle(button, cat.color, cat.id === currentCategory);
        
        button.innerHTML = `
            <i class="${cat.icon}"></i>
            <span>${cat.shortName}</span>
        `;
        
        categoriesRow.appendChild(button);
    });

    setupCategoryEventListeners();
}

/**
 * 🎨 Aplica o estilo visual baseado na cor da categoria
 * @param {HTMLElement} button - Elemento do botão
 * @param {string} color - Cor da categoria
 * @param {boolean} isActive - Se o botão está ativo
 */
function applyCategoryStyle(button, color, isActive) {
    const style = categoryStyles[color] || categoryStyles.gray;
    const state = isActive ? style.active : style.inactive;
    
    button.style.backgroundImage = state.bg;
    button.style.borderColor = state.border;
    button.style.color = state.text;
    
    if (isActive) {
        button.classList.add('scale-105', 'shadow-lg');
        button.classList.remove('hover:brightness-110');
    } else {
        button.classList.remove('scale-105', 'shadow-lg');
        button.classList.add('hover:brightness-110');
    }
    
    setTimeout(() => {
        const icon = button.querySelector('i');
        if (icon) {
            icon.style.color = state.icon;
        }
    }, 10);
}

/**
 * 🎯 Configura os event listeners para as categorias
 */
function setupCategoryEventListeners() {
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const categoryId = e.currentTarget.getAttribute('data-category');
            selectCategory(categoryId);
        });
    });
}

/**
 * 🎯 Seleciona uma categoria
 * @param {string} categoryId - ID da categoria a ser selecionada
 */
function selectCategory(categoryId) {
    currentCategory = categoryId;
    
    updateCategoryUrl(categoryId);
    updateCategoryUI();
    filterCommandsByCategory();
}

/**
 * 🔗 Atualiza a URL com o parâmetro de categoria
 * @param {string} categoryId - ID da categoria
 */
function updateCategoryUrl(categoryId) {
    const url = new URL(window.location);
    
    if (categoryId === 'all') {
        url.searchParams.delete('c');
    } else {
        url.searchParams.set('c', categoryId);
    }
    
    url.searchParams.delete('m');
    
    history.replaceState({}, '', url);
}

/**
 * 🎨 Atualiza a interface da categoria selecionada
 */
function updateCategoryUI() {
    document.querySelectorAll('.category-btn').forEach(btn => {
        const btnCategory = btn.getAttribute('data-category');
        const btnColor = btn.getAttribute('data-color');
        const isActive = btnCategory === currentCategory;
        
        applyCategoryStyle(btn, btnColor, isActive);
        
        if (isActive) {
            btn.classList.add('category-active');
        } else {
            btn.classList.remove('category-active');
        }
    });
}

/**
 * 🔍 Filtra comandos por categoria
 */
function filterCommandsByCategory() {
    const category = categories.find(cat => cat.id === currentCategory);
    let filteredCommands = [];

    if (category && category.filter) {
        if (category.id === 'starred') {
            filteredCommands = commands.filter(category.filter);
        } else {
            filteredCommands = commands.filter(category.filter);
        }
    } else {
        filteredCommands = [...commands];
    }

    const starredCmds = filteredCommands.filter(cmd => isStarred(cmd.id));
    let unstarredCmds = filteredCommands.filter(cmd => !isStarred(cmd.id));
    
    if (currentCategory === 'all') {
        unstarredCmds = shuffleArray(unstarredCmds);
    }
    
    filteredCommands = [...starredCmds, ...unstarredCmds];

    renderFilteredCommands(filteredCommands);
}

/**
 * 🖼️ Renderiza comandos filtrados
 * @param {Array} filteredCommands - Array de comandos filtrados
 */
function renderFilteredCommands(filteredCommands) {
    const commandsContainer = document.getElementById('commands-container');
    if (!commandsContainer) return;

    commandsContainer.innerHTML = '';

    updateCommandCounter(filteredCommands.length);

    if (filteredCommands.length === 0) {
        showNoCategoryResultsMessage();
        return;
    }

    filteredCommands.forEach((cmd, index) => {
        createCommandCard(cmd, index);
    });
}

/**
 * 📭 Mensagem quando nenhum comando é encontrado na categoria
 */
function showNoCategoryResultsMessage() {
    const category = categories.find(cat => cat.id === currentCategory);
    const commandsContainer = document.getElementById('commands-container');
    
    if (!commandsContainer) return;

    commandsContainer.innerHTML = `
        <div class="col-span-full text-center py-12 mc-gray">
            <i class="${category?.icon || 'fas fa-search-minus'} text-5xl mb-4"></i>
            <p class="text-xl mb-2">${getNoResultsMessage()}</p>
            <p class="text-sm">${getNoResultsSubmessage()}</p>
        </div>
    `;
}

/**
 * 💬 Mensagem personalizada para categoria sem resultados
 */
function getNoResultsMessage() {
    const messages = {
        'starred': 'Nenhum comando favoritado',
        'clan': 'Nenhum comando de clan encontrado',
        'economy': 'Nenhum comando de economia encontrado',
        'warps': 'Nenhum comando de warp encontrado',
        'utilidades': 'Nenhum comando de utilidade encontrado',
        'progressao': 'Nenhum comando de progressão encontrado',
        'minigames': 'Nenhum comando de minigame encontrado',
        'informacao': 'Nenhum comando informativo encontrado',
        'plot': 'Nenhum comando de plot encontrado'
    };
    return messages[currentCategory] || 'Nenhum comando encontrado';
}

/**
 * 💬 Submensagem personalizada para categoria sem resultados
 */
function getNoResultsSubmessage() {
    const messages = {
        'starred': 'Adicione estrelas aos comandos para vê-los aqui!',
        'default': 'Tente selecionar outra categoria'
    };
    return messages[currentCategory] || messages.default;
}

/**
 * 🔍 Verifica categoria na URL ao carregar a página
 */
function checkUrlForCategory() {
    const params = new URLSearchParams(window.location.search);
    const categoryId = params.get('c');
    
    if (categoryId && categories.some(cat => cat.id === categoryId)) {
        currentCategory = categoryId;
    } else {
        currentCategory = 'all';
    }
}

/**
 * 🚀 Inicializa o sistema de categorias
 */
function initCategories() {
    checkUrlForCategory();
    renderCategoriesInHeader();
    filterCommandsByCategory();
    observeStarredChanges();
}

/**
 * 👀 Observa mudanças nos comandos favoritados
 */
function observeStarredChanges() {
    const originalToggleStar = window.toggleStar;
    window.toggleStar = function(cmdId) {
        originalToggleStar(cmdId);
        
        if (currentCategory === 'starred') {
            filterCommandsByCategory();
        }
    };
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCategories);
} else {
    initCategories();
}