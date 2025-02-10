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
function getIconURL(username, hasMinecraftOriginal) {
    if (hasMinecraftOriginal) {
        return `https://starlightskins.lunareclipse.studio/render/head/${username}/full`;
    } else {
        if (username.includes("matheussponchi")) return 'mc/imgs/staff/matheussponchi.png';
        return 'mc/imgs/staff/p.png';
    }
}

const staffList = document.getElementById('staff-list');

staffMembers.forEach(membro => {
    const item = document.createElement('div');
    item.className = 'texture-item staff-item';

    const username = membro.nome.split(' ')[1];
    const iconURL = getIconURL(username, membro.hasMinecraftOriginal);

    item.innerHTML = `
        <img src="${iconURL}" class="texture-icon staff-icon" alt="${membro.nome}" style="border: none;">
        <div class="texture-content">
            <h3 class="texture-title">${parseMCString(membro.nome)}</h3>
        </div>
    `;

    staffList.appendChild(item);
});