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

function parseMCString(text) {
    return text
        .replace(/[§&][0-9a-f]/g, match => {
            const normalizedKey = '§' + match[1]; // Converte & para §
            return `</span><span class="${colorMap[normalizedKey]}">`;
        })
        .replace(/<\/span>/g, '', 1) + '</span>';
}

// Renderizar texturas
const textureList = document.getElementById('texture-list');

texturas.forEach(textura => {
    const item = document.createElement('div');
    item.className = 'texture-item';

    item.innerHTML = `
        <div class="texture-icon-container">
            <div class="version-badge">${textura.v}</div>
            <img src="${textura.icone}" class="texture-icon" alt="${textura.nome}">
        </div>
        <div class="texture-content">
            <h3 class="texture-title">${parseMCString(textura.nome)}</h3>
            <p class="texture-description">${parseMCString(textura.description)}</p>
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

// Lógica do Modal
const infoBtn = document.getElementById('infoBtn');
const infoModal = document.getElementById('infoModal');
const closeModalBtn = document.getElementById('closeModalBtn');

infoBtn.onclick = () => infoModal.style.display = "block";
closeModalBtn.onclick = closeModal;

window.onclick = (event) => {
    if (event.target === infoModal) closeModal();
}

function closeModal() {
    infoModal.style.display = "none";
    pauseAndResetModalVideo();
}

function pauseAndResetModalVideo() {
    const modalIframe = infoModal.querySelector('iframe');
    if (modalIframe) modalIframe.src = modalIframe.src;
}
