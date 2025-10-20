/**
      * ColorMap - Mapeia códigos de cores do Minecraft para classes CSS
      * @module ColorMap
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

    // Cria versões com & para o mesmo mapa
    const extendedColors = {};
    for (const [key, value] of Object.entries(baseColors)) {
        extendedColors[key] = value;
        extendedColors['&' + key[1]] = value; // Adiciona versão com &
    }

    return extendedColors;
})();

/**
 * Converte strings com códigos de cores do Minecraft para HTML com spans
 * @param {string} text - Texto com códigos de cores
 * @returns {string} HTML com spans e classes CSS
 */
function parseMCString(text) {
    if (!text) return '';
    return text
        .replace(/[§&][0-9a-f]/g, match => {
            const normalizedKey = '§' + match[1]; // Converte & para §
            return `</span><span class="${colorMap[normalizedKey] || 'mc-white'}">`;
        })
        .replace(/<\/span>/g, '', 1) + '</span>';
}

/**
 * Dados dos VIPs
 * @type {Array<{
 *   id: string,
 *   name: string,
 *   colorClass: string,
 *   features: Array<string>,
 *   featured: boolean,
 *   buyUrl: string
 * }>}
 */
const vipData = [
    {
        id: "basic",
        name: "§aVIP",
        colorClass: "vip-basic",
        features: [
            "§7Bonus de §a5% §7de exp a mais nas skills",
            "§7Acesso aos §aKits VIPs Diário",
            "§7Acesso aos §aKits VIPs Semanal",
            "§7Acesso a §a2 Terrenos",
            "§7Falar §acolorido §7no chat",
            "§7Delay de §a5s §7para teleportar no skygrid",
            "§7Não perde §aXP §7ao morrer",
            "§7Acesso ao comando §a/fly",
            "§7Limite de §a2 §7itens no leilão"
        ],
        featured: false,
        buyUrl: "https://loja.nerdzone.gg/itens"
    },
    {
        id: "mvp",
        name: "§bMVP",
        colorClass: "vip-mvp",
        features: [
            "§7Bonus de §b7% §7de exp a mais nas skills",
            "§7Acesso aos §bKits MVP Diários",
            "§7Acesso aos §bKits MVP Semanais",
            "§7Acesso a §b4 Terrenos",
            "§7Falar §bcolorido §7no chat",
            "§7Delay de §b5s §7para teleportar no skygrid",
            "§7Não perde §bXP §7ao morrer",
            "§7Acesso ao comando §b/fly",
            "§7Limite de §b3 §7itens no leilão"
        ],
        featured: false,
        buyUrl: "https://loja.nerdzone.gg/itens"
    },
    {
        id: "mvp-plus",
        name: "§bMVP§6+",
        colorClass: "vip-mvp-plus",
        features: [
            "§7Bonus de §b10% §7de exp a mais nas skills",
            "§7Acesso aos §bkits MVP§6+ §bDiários",
            "§7Acesso aos §bkits MVP§6+ §bSemanais",
            "§7Acesso a §b4 Terrenos",
            "§7Falar §bcolorido §7no chat",
            "§7Delay de §b4s §7para teleportar no skygrid",
            "§7Não perde §bXP §7ao morrer",
            "§7Acesso ao comando §b/fly",
            "§7Limite de §b4 §7itens no leilão",
            "§7Acesso a colocar §b2 luckyblocks §7por vez no chão!"

        ],
        featured: false,
        buyUrl: "https://loja.nerdzone.gg/itens"
    },
    {
        id: "Legacy",
        name: "§6Legacy",
        colorClass: "vip-legacy",
        features: [
            "§7Bonus de §e15% §7de exp a mais nas skills",
            "§7Acesso aos §eKits Origin Diários",
            "§7Acesso aos §eKits Origin Semanais",
            "§7Acesso a §e9 Terrenos",
            "§7Falar §ecolorido §7no chat",
            "§7Delay de §e3s §7para teleportar no skygrid",
            "§7Não perde §eXP §7ao morrer",
            "§7Acesso ao comando §e/fly",
            "§7Limite de §e5 §7itens no leilão",
            "§7Acesso a colocar §e3 luckyblocks §7por vez no chão!"
        ],
        featured: false,
        buyUrl: "https://loja.nerdzone.gg/itens"
    },
    {
        id: "last",
        name: "§6Legacy§e+",
        colorClass: "vip-legacy",
        features: [
            "§7Para ver as vantagens desse vip acesse o servidor e utilize o comando §e/vantagens",
        ],
        featured: false,
        buyUrl: "https://loja.nerdzone.gg/itens"
    }
];

/**
 * Cria um elemento de card VIP
 * @param {Object} vip - Dados do VIP
 * @returns {HTMLElement} Elemento do card
 */
function createVIPCard(vip) {
    const card = document.createElement("div");
    card.className = `vip-card ${vip.colorClass} ${vip.featured ? 'featured-card' : ''}`;
    card.setAttribute('data-tier', vip.id);
    card.setAttribute('role', 'article');
    card.setAttribute('aria-label', `Plano ${vip.name.replace(/§[0-9a-f]/g, '')}`);

    // Header
    const header = document.createElement("div");
    header.className = "vip-header";

    const title = document.createElement("h2");
    title.className = "vip-title";
    title.innerHTML = parseMCString(vip.name);
    header.appendChild(title);

    // Content
    const content = document.createElement("div");
    content.className = "vip-content";

    vip.features.forEach(feature => {
        const featureElement = document.createElement("div");
        featureElement.className = "vip-feature";
        featureElement.innerHTML = parseMCString(feature);
        content.appendChild(featureElement);
    });

    // Button
    const button = document.createElement("a");
    button.className = "vip-button";
    button.href = vip.buyUrl;
    button.textContent = "VEJA O PREÇO";
    button.target = "_blank";
    button.rel = "noopener noreferrer";
    button.setAttribute('aria-label', `Comprar plano ${vip.name.replace(/§[0-9a-f]/g, '')}`);

    // Montar card
    card.appendChild(header);
    card.appendChild(content);
    card.appendChild(button);

    return card;
}

/**
 * Renderiza todos os cards VIP no container
 */
function renderVIPCards() {
    const container = document.getElementById("vipContainer");
    container.innerHTML = "";

    // Adiciona cada card VIP diretamente ao container
    vipData.forEach((vip, index) => {
        const card = createVIPCard(vip);
        card.style.animationDelay = `${index * 0.1}s`;
        container.appendChild(card);
    });
}

/**
 * Inicializa a página quando o DOM estiver carregado
 */
document.addEventListener("DOMContentLoaded", () => {
    renderVIPCards();

    // Adicionar evento ao botão do Discord
    document.querySelector('.support-btn[data-channel="discord"]').addEventListener('click', () => {
        window.open('https://discord.nerdzone.gg', '_blank');
    });

    document.querySelector('.back-btn[data-channel="back"]').addEventListener('click', () => {
        window.open('./', '_self');
    });

    // Adicionar navegação por teclado
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            const focusedElement = document.activeElement;
            if (focusedElement.classList.contains('vip-button')) {
                focusedElement.classList.add('focus:ring-2', 'focus:ring-white', 'focus:ring-opacity-50');
            }
        }
    });
});