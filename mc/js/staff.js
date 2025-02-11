
function getIconURL(username, hasMinecraftOriginal) {
    if (hasMinecraftOriginal) {
        return `https://starlightskins.lunareclipse.studio/render/head/${username}/full`;
    } else {
        if (username.includes("matheussponchi")) return 'mc/img/staff/matheussponchi.png';
        return 'mc/img/staff/p.png';
    }
}

const staffList = document.getElementById('staff-list');

staffMembers.forEach(membro => {
    const item = document.createElement('div');
    item.className = 'texture-item staff-item';

    const username = membro.nome.split(' ')[1];
    const iconURL = getIconURL(username, membro.hasMinecraftOriginal);

    let ytButton = '';
    if (membro.yt) {
        ytButton = `
            <button class="youtube-btn" onclick="window.open('${membro.yt}', '_blank')">
                <svg class="youtube-icon" viewBox="0 0 48 48" fill="currentColor">
                   <path fill="#FFF"  d="M43.2,33.9c-0.4,2.1-2.1,3.7-4.2,4c-3.3,0.5-8.8,1.1-15,1.1c-6.1,0-11.6-0.6-15-1.1c-2.1-0.3-3.8-1.9-4.2-4C4.4,31.6,4,28.2,4,24c0-4.2,0.4-7.6,0.8-9.9c0.4-2.1,2.1-3.7,4.2-4C12.3,9.6,17.8,9,24,9c6.2,0,11.6,0.6,15,1.1c2.1,0.3,3.8,1.9,4.2,4c0.4,2.3,0.9,5.7,0.9,9.9C44,28.2,43.6,31.6,43.2,33.9z"></path><path  fill="#FF3D00" d="M20 31L20 17 32 24z"></path>
                </svg>
                YOUTUBE
            </button>
        `;
    }

    item.innerHTML = `
        <img src="${iconURL}" class="texture-icon staff-icon" alt="${membro.nome}" style="border: none;">
        <div class="texture-content">
            <h3 class="texture-title">${parseMCString(membro.nome)}</h3>
        </div>
         ${ytButton}
    `;

    staffList.appendChild(item);
});