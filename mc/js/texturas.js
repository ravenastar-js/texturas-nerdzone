
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

