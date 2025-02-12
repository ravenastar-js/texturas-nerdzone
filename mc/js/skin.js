/**
 * 🎮 Controlador principal de renderização de skins Minecraft
 * @class
 */
class SkinController {
    /**
     * 🏗️ Construtor inicializando configurações
     * @constructor
     */
    constructor() {
        // 🔗 Elementos do DOM
        this.elements = {
            playerInput: document.getElementById('playerName'),
            renderType: document.getElementById('renderType'),
            renderCrop: document.getElementById('renderCrop'),
            searchBtn: document.getElementById('searchBtn'),
            skinImage: document.getElementById('skinImage'),
            loading: document.getElementById('loading'),
            skinDisplay: document.querySelector('.skin-display'),
            modal: document.getElementById('skinModal'),
            modalImage: document.getElementById('modalSkinImage')
        };

        // 🌈 Tipos de renderização disponíveis
        this.renderConfig = {
            crops: {
                full: ['full'],
                default: ['default'],
                head: ['full', 'head'],
                bust: ['full', 'bust']
            },
            types: {
                default: 'full',
                marching: 'full',
                walking: 'full',
                crouching: 'full',
                crossed: 'full',
                criss_cross: 'full',
                ultimate: 'full',
                isometric: 'head',
                head: 'full',
                custom: 'full',
                cheering: 'full',
                relaxing: 'full',
                trudging: 'full',
                cowering: 'full',
                pointing: 'full',
                lunging: 'full',
                dungeons: 'full',
                facepalm: 'full',
                sleeping: 'bust',
                dead: 'full',
                archer: 'full',
                kicking: 'full',
                mojavatar: 'bust',
                reading: 'full',
                high_ground: 'full',
                bitzel: 'full',
                pixel: 'full',
                skin: 'default',
                profile: 'full'
            },
            translations: {
                default: 'Padrão',
                marching: 'Marcha',
                walking: 'Andando',
                crouching: 'Agachado',
                crossed: 'Braços Cruzados',
                criss_cross: 'Pernas Cruzadas',
                ultimate: 'Supremo',
                isometric: 'Isométrico',
                head: 'Cabeça',
                custom: 'Personalizado',
                cheering: 'Torcendo',
                relaxing: 'Relaxando',
                trudging: 'Caminhando Pesado',
                cowering: 'Encolhido',
                pointing: 'Apontando',
                lunging: 'Investida',
                dungeons: 'Masmorras',
                facepalm: 'Facepalm',
                sleeping: 'Dormindo',
                dead: 'Morto',
                archer: 'Arqueiro',
                kicking: 'Chutando',
                mojavatar: 'Mojavatar',
                reading: 'Lendo',
                high_ground: 'Terreno Alto',
                bitzel: 'Bitzel',
                pixel: 'Pixel',
                skin: 'Skin',
                profile: 'Perfil'
            }
        };

        // 🎛️ Controle de requisições
        this.abortController = null;
        this.currentRequest = null;
    }

    /**
     * 🚀 Inicializa o controlador
     * @method
     */
    initialize() {
        this.populateRenderTypes();
        this.setupEventListeners();
        this.setupModal();
    }

    /**
     * 📦 Popula os tipos de renderização no select
     * @method
     */
    populateRenderTypes() {
        const fragment = document.createDocumentFragment();

        Object.entries(this.renderConfig.types).forEach(([type, cropType]) => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = `${type} (${this.renderConfig.translations[type]})`;
            fragment.appendChild(option);
        });

        this.elements.renderType.appendChild(fragment);
        this.updateCropOptions();
    }

    /**
     * 🔄 Atualiza as opções de crop disponíveis
     * @method
     */
    updateCropOptions() {
        const selectedType = this.elements.renderType.value;
        const cropType = this.renderConfig.types[selectedType];
        const crops = this.renderConfig.crops[cropType];

        const fragment = document.createDocumentFragment();
        crops.forEach(crop => {
            const option = document.createElement('option');
            option.value = crop;
            option.textContent = crop;
            fragment.appendChild(option);
        });

        this.elements.renderCrop.replaceChildren(fragment);
    }

    /**
     * 🕹️ Configura os event listeners
     * @method
     */
    setupEventListeners() {
        this.elements.renderType.addEventListener('change', () => this.updateCropOptions());
        this.elements.searchBtn.addEventListener('click', () => this.fetchSkin());
    }

    /**
     * 🖼️ Configura o modal de visualização
     * @method
     */
    setupModal() {
        // 🔍 Ampliar imagem
        this.elements.skinImage.addEventListener('click', () => {
            if (this.elements.skinImage.dataset.player) {
                this.elements.modalImage.src =
                    `https://starlightskins.lunareclipse.studio/render/${this.elements.skinImage.dataset.renderType}/${this.elements.skinImage.dataset.player}/full`;
                this.elements.modal.style.display = 'block';
            }
        });

        // ❌ Fechar modal
        document.querySelector('.close-modal').addEventListener('click', () => {
            this.elements.modal.style.display = 'none';
        });

        window.addEventListener('click', (event) => {
            if (event.target === this.elements.modal) {
                this.elements.modal.style.display = 'none';
            }
        });
    }

    /**
     * 🔍 Valida nome de usuário Minecraft
     * @param {string} username - Nome a validar
     * @returns {boolean}
     * @method
     */
    isValidUsername(username) {
        return /^[a-z0-9_]{2,16}$/i.test(username);
    }

    /**
     * ⚡ Gera hexadecimal aleatório para nome de arquivo
     * @returns {string}
     * @method
     */
    generateFileHash() {
        return Math.random().toString(16).substr(2, 8);
    }

    /**
     * 📡 Busca a skin do jogador
     * @method
     */
    async fetchSkin() {
        const playerName = this.elements.playerInput.value.trim();

        // 🛑 Validação inicial
        if (!this.isValidUsername(playerName)) {
            return;
        }

        // 🛑 Cancela requisição anterior
        if (this.abortController) {
            this.abortController.abort();
        }

        // 🌀 Mostra estado de carregamento
        this.toggleLoading(true);

        try {
            const { skinImage, renderType, renderCrop } = this.elements;
            this.abortController = new AbortController();
            this.currentRequest = Symbol();

            // ⚡ Requisição da skin
            const response = await fetch(
                `https://starlightskins.lunareclipse.studio/render/${renderType.value}/${playerName}/${renderCrop.value}`,
                { signal: this.abortController.signal }
            );

            if (!response.ok) throw new Error('Erro na resposta da API');

            // 🖼️ Processamento da imagem
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            skinImage.onload = () => this.handleImageLoad(url, playerName);
            skinImage.onerror = () => this.handleImageError(url);
            skinImage.src = url;
            skinImage.dataset.player = playerName;
            skinImage.dataset.renderType = renderType.value;
            document.querySelector('.result-container').style.display = 'flex';
            // Buscar o UUID
            const uuidResponse = await fetch(`https://api.minetools.eu/uuid/${playerName}`);
            if (!uuidResponse.ok) throw new Error('Erro ao buscar UUID');

            const uuidData = await uuidResponse.json();
            document.getElementById('result').innerText = uuidData.id;

        } catch (error) {
            this.handleFetchError(error);
        }
    }

    /**
     * ✅ Trata carregamento bem-sucedido da imagem
     * @param {string} url - URL da imagem
     * @param {string} playerName - Nome do jogador
     * @method
     */
    handleImageLoad(url, playerName) {
        this.toggleLoading(false);
        this.createDownloadButton(url);
        this.createNameMCButton(playerName);
        this.elements.skinImage.style.display = 'block';
        document.querySelector('.result-container').style.display = 'block'; // Exibir o container do UUID
    }

    /**
     * 🛑 Trata erro no carregamento da imagem
     * @param {string} url - URL da imagem
     * @method
     */
    handleImageError(url) {
        URL.revokeObjectURL(url);
        this.toggleLoading(false);
        document.querySelector('.result-container').style.display = 'none'; // Ocultar o container do UUID
    }

    /**
     * 🚨 Trata erros na requisição
     * @param {Error} error - Erro ocorrido
     * @method
     */
    handleFetchError(error) {
        if (error.name !== 'AbortError') {
            this.toggleLoading(false);
            document.querySelector('.result-container').style.display = 'none'; // Ocultar o container do UUID
        }
    }

    /**
     * 🎚️ Controla visibilidade do loading
     * @param {boolean} show - Mostrar/Esconder
     * @method
     */
    toggleLoading(show) {
        this.elements.loading.style.display = show ? 'flex' : 'none';
        this.elements.searchBtn.disabled = show;
    }

    /**
     * ⬇️ Cria botão de download
     * @param {string} url - URL da imagem
     * @method
     */
    createDownloadButton(url) {
        this.removeExistingButtons();

        const downloadBtn = document.createElement('button');
        downloadBtn.id = 'downloadBtn';
        downloadBtn.textContent = 'Baixar Skin';
        downloadBtn.onclick = () => this.downloadSkin(url);
        this.elements.skinDisplay.appendChild(downloadBtn);
    }

    /**
     * 🌐 Cria botão do NameMC
     * @param {string} playerName - Nome do jogador
     * @method
     */
    createNameMCButton(playerName) {
        const nameMcBtn = document.createElement('button');
        nameMcBtn.id = 'nameMcBtn';
        nameMcBtn.textContent = 'NameMC';
        nameMcBtn.onclick = () => window.open(`https://namemc.com/profile/${playerName}`, '_blank');
        this.elements.skinDisplay.appendChild(nameMcBtn);
    }

    /**
     * 🗑️ Remove botões existentes
     * @method
     */
    removeExistingButtons() {
        const existingDownload = document.getElementById('downloadBtn');
        const existingNameMC = document.getElementById('nameMcBtn');
        if (existingDownload) existingDownload.remove();
        if (existingNameMC) existingNameMC.remove();
    }

    /**
     * 💾 Dispara o download da skin
     * @param {string} url - URL da imagem
     * @method
     */
    downloadSkin(url) {
        const link = document.createElement('a');
        link.href = url;
        link.download = `skin_${this.generateFileHash()}.png`;
        link.click();
    }
}

// 📋 Copia o UUID exibido na tela para a área de transferência.
function copyUUID() {
    const uuid = document.getElementById('result').innerText;
    if (!uuid) {
        alert('No UUID to copy!');
        return;
    }

    navigator.clipboard.writeText(uuid).then(() => {
        alert('UUID copiado!');
    }).catch((error) => {
        console.error('Error copying UUID:', error);
    });
}

// 🚀 Inicialização quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    const skinController = new SkinController();
    skinController.initialize();
});
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("skinForm");
    const usernameInput = document.getElementById("username");
    const skinContainer = document.getElementById("skinContainer");
    const playerUUID = document.getElementById("playerUUID");
    const copyUUIDBtn = document.getElementById("copyUUID");

    form.addEventListener("submit", async function (event) {
        event.preventDefault();
        const username = usernameInput.value.trim();
        if (!username) return;

        try {
            const response = await fetch(`https://api.ashcon.app/mojang/v2/user/${username}`);
            if (!response.ok) throw new Error("Jogador não encontrado");
            const data = await response.json();

            const uuid = data.uuid;
            playerUUID.textContent = `UUID: ${uuid}`;
            playerUUID.style.display = "block";
            copyUUIDBtn.style.display = "inline-block";
            copyUUIDBtn.onclick = function () {
                navigator.clipboard.writeText(uuid).then(() => {
                    alert("UUID copiado para a área de transferência!");
                });
            };

            skinContainer.innerHTML = `
                <img src="https://api.starlightskin.com/render/skin?uuid=${uuid}&shadow=true" alt="Skin de ${username}">
            `;
        } catch (error) {
            alert("Erro ao buscar o jogador. Verifique o nome e tente novamente.");
        }
    });
});