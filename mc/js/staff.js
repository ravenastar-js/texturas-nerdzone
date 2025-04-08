
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
        <button class="bt-dc youtube-button" onclick="window.open('${membro.yt}', '_blank')">
            <div class="svg-wrapper-1">
                <div class="svg-wrapper"> <svg viewBox="0 0 576 512" fill="white" height="1.6em" xmlns="http://www.w3.org/2000/svg">
                        <path d="M549.7 124.1c-6.3-23.7-24.8-42.3-48.3-48.6C458.8 64 288 64 288 64S117.2 64 74.6 75.5c-23.5 6.3-42 24.9-48.3 48.6-11.4 42.9-11.4 132.3-11.4 132.3s0 89.4 11.4 132.3c6.3 23.7 24.8 41.5 48.3 47.8C117.2 448 288 448 288 448s170.8 0 213.4-11.5c23.5-6.3 42-24.2 48.3-47.8 11.4-42.9 11.4-132.3 11.4-132.3s0-89.4-11.4-132.3zm-317.5 213.5V175.2l142.7 81.2-142.7 81.2z"></path>
                    </svg> </div>
            </div> <span>Youtube</span>
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