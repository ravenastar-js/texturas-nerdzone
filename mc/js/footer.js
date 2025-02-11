class ServerStatus {
    constructor() {
        this.apiUrl = 'https://api.mcstatus.io/v2/status/java/nerdzone.gg';
        this.footerElement = document.querySelector('.minecraft-footer');
        this.updateInterval = 60000;
    }

    async init() {
        await this.updateStatus();
        setInterval(() => this.updateStatus(), this.updateInterval);
    }

    async fetchData() {
        try {
            const response = await fetch(this.apiUrl);
            if (!response.ok) throw new Error('Erro na API');
            return await response.json();
        } catch (error) {
            console.error('Erro ao buscar status:', error);
            return null;
        }
    }

    async updateStatus() {
        const data = await this.fetchData();

        if (!data || !data.online) {
            this.setOfflineStatus();
            return;
        }

        this.updateServerInfo(data);
        this.updateVersion(data);
        this.updatePlayers(data);
        this.updateMotd(data);
        this.updateIcon(data);
    }

    updateServerInfo(data) {
        const statusElement = this.footerElement.querySelector('.server-status');
        if (statusElement) {
            statusElement.innerHTML = `
                <span class="online-dot ${data.online ? 'online' : 'offline'}"></span>
                <span class="${data.online ? 'mc-green' : 'mc-red'}">
                    ${data.online ? 'Online' : 'Offline'}
                </span> - <span class="mc-white">Jogando agora:</span> <span class="mc-gold">${data.players?.online || 0}</span>
            `;
        }
    }

    updateVersion(data) {
        const versionElement = this.footerElement.querySelector('.server-version');
        if (versionElement && data.version) {
            versionElement.textContent = `Versão: ${data.version.name_clean}`;
        }
    }

    updatePlayers(data) {
        const playersElement = this.footerElement.querySelector('.players-count');
        if (playersElement && data.players) {
            playersElement.textContent = `Jogadores: ${data.players.online}/${data.players.max}`;
        }
    }

    updateMotd(data) {
        const motdElement = this.footerElement.querySelector('.server-motd');
        if (motdElement && data.motd?.raw) {
            motdElement.innerHTML = this.parseMCString(data.motd.raw);
        } else {
            motdElement.textContent = "";
        }
    }

    updateIcon(data) {
        const iconElement = this.footerElement.querySelector('.server-icon.achievement-icon');
        if (iconElement && data.icon) {
            iconElement.src = data.icon;
            iconElement.style.display = 'block';
        }
    }

    setOfflineStatus() {
        const statusElement = this.footerElement.querySelector('.server-status');
        const versionElement = this.footerElement.querySelector('.server-version');
        const playersElement = this.footerElement.querySelector('.players-count');

        if (statusElement) {
            statusElement.innerHTML = `
                <span class="online-dot offline"></span> 
                <span class="mc-red">Offline - Servidor não disponível</span>
            `;
        }

        if (versionElement) versionElement.textContent = "";
        if (playersElement) playersElement.textContent = "";
    }
    parseMCString(text) {
        return text.replace(/[§&][0-9a-fk-or]/g, match => {
            const colorMap = {
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
                '§f': 'mc-white',
                '§l': 'mc-bold'
            };
            const normalizedKey = '§' + match[1];
            switch (normalizedKey) {
                case '§4':
                    return '<span class="mc-red">';
                case '§l':
                    return '<strong>';
                default:
                    return `</span><span class="${colorMap[normalizedKey] || ''}">`;
            }
        }) + '</span>';
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    const serverStatus = new ServerStatus();
    serverStatus.init();
});
