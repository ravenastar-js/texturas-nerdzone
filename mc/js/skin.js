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
        this.baseUrl = 'https://starlight.lunareclipse.studio/api/v1/render/';
        this.fallbackUrls = [
            'https://visage.surgeplay.com/full/512/',
            'https://mc-heads.net/body/',
            'https://crafatar.com/renders/body/'
        ];
        
        this.elements = {
            playerInput: document.getElementById('playerName'),
            renderType: document.getElementById('renderType'),
            renderCrop: document.getElementById('renderCrop'),
            searchBtn: document.getElementById('searchBtn'),
            skinImage: document.getElementById('skinImage'),
            loading: document.getElementById('loading'),
            skinDisplay: document.querySelector('.skin-display'),
            modal: document.getElementById('skinModal'),
            modalImage: document.getElementById('modalSkinImage'),
            uuidDisplay: document.getElementById('result'),
            resultContainer: document.querySelector('.result-container'),
            renderControls: document.querySelector('.render-controls')
        };

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

        this.abortController = null;
        this.currentRequest = null;
        this.currentSkinUrl = null;
        this.currentPlayerName = null;
        this.currentRenderType = null;
        this.currentRenderCrop = null;
        this.currentUuid = null;
        this.isFallbackMode = false;
        this.apiAvailable = true;
        this.isValidPlayer = false;
    }

    /**
     * 🚀 Inicializa o controlador
     * @method
     */
    initialize() {
        this.populateRenderTypes();
        this.setupEventListeners();
        this.setupModal();
        this.hideError();
        this.checkApiStatus();
    }

    /**
     * 🔍 Verifica se a API principal está disponível
     * @method
     */
    async checkApiStatus() {
        try {
            const response = await fetch(`${this.baseUrl}default/Notch/full`, { 
                method: 'HEAD',
                signal: AbortSignal.timeout(5000)
            });
            this.apiAvailable = response.ok;
        } catch {
            this.apiAvailable = false;
        }
        
        if (!this.apiAvailable) {
            this.hideRenderControls();
            this.showError('API de renderização 3D indisponível. Usando modo básico.');
        }
    }

    /**
     * 🙈 Oculta os controles de renderização
     * @method
     */
    hideRenderControls() {
        if (this.elements.renderControls) {
            this.elements.renderControls.style.display = 'none';
        }
        this.elements.renderType.style.display = 'none';
        this.elements.renderCrop.style.display = 'none';
    }

    /**
     * 👀 Exibe os controles de renderização
     * @method
     */
    showRenderControls() {
        if (this.elements.renderControls) {
            this.elements.renderControls.style.display = '';
        }
        this.elements.renderType.style.display = '';
        this.elements.renderCrop.style.display = '';
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
    
        if (crops.length === 1) {
            this.elements.renderCrop.style.display = 'none';
        } else {
            this.elements.renderCrop.style.display = '';
        }
    }

    /**
     * 🕹️ Configura os event listeners
     * @method
     */
    setupEventListeners() {
        this.elements.renderType.addEventListener('change', () => this.updateCropOptions());
        this.elements.searchBtn.addEventListener('click', () => this.fetchSkin());
        this.elements.playerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.fetchSkin();
            }
        });
    }

    /**
     * 🖼️ Configura o modal de visualização
     * @method
     */
    setupModal() {
        this.elements.skinImage.addEventListener('click', () => {
            if (this.elements.skinImage.dataset.player && this.currentSkinUrl) {
                this.elements.modalImage.src = this.currentSkinUrl;
                this.elements.modal.style.display = 'block';
            }
        });

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

        if (!this.isValidUsername(playerName)) {
            this.showError('Nome de usuário inválido. Use 2-16 caracteres (letras, números ou underline).');
            return;
        }

        this.hideError();
        this.isValidPlayer = false;

        if (this.abortController) {
            this.abortController.abort();
        }

        this.toggleLoading(true);
        this.elements.resultContainer.style.display = 'none';
        this.elements.skinImage.style.display = 'none';
        this.currentSkinUrl = null;
        this.currentPlayerName = playerName;
        this.isFallbackMode = false;

        try {
            const { skinImage, renderType, renderCrop } = this.elements;
            this.abortController = new AbortController();
            this.currentRequest = Symbol();
            this.currentRenderType = renderType.value;
            this.currentRenderCrop = renderCrop.value;

            const uuidResponse = await fetch(`https://api.minetools.eu/uuid/${playerName}`);
            
            if (!uuidResponse.ok) {
                throw new Error('Jogador não encontrado');
            }

            const uuidData = await uuidResponse.json();
            
            if (!uuidData.id) {
                throw new Error('Jogador não encontrado');
            }

            this.isValidPlayer = true;
            this.currentUuid = uuidData.id;
            this.elements.uuidDisplay.innerText = uuidData.id;
            this.elements.resultContainer.style.display = 'flex';

            this.createCopyUuidButton();

            if (this.apiAvailable) {
                await this.tryLoadSkin(playerName, renderType.value, renderCrop.value);
            } else {
                await this.loadFallbackSkin(playerName);
            }

        } catch (error) {
            this.handleFetchError(error);
        }
    }

    /**
     * 📋 Cria o botão de copiar UUID dentro do result-container
     * @method
     */
    createCopyUuidButton() {
        const existingBtn = document.getElementById('copyUuidBtn');
        if (existingBtn) {
            existingBtn.remove();
        }

        const copyBtn = document.createElement('button');
        copyBtn.id = 'copyUuidBtn';
        copyBtn.className = 'action-btn';
        copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copiar UUID';
        copyBtn.onclick = () => this.copyUUID();

        this.elements.resultContainer.appendChild(copyBtn);
    }

    /**
     * 🔄 Tenta carregar a skin com fallback
     * @param {string} playerName - Nome do jogador
     * @param {string} renderType - Tipo de renderização
     * @param {string} renderCrop - Crop da renderização
     * @method
     */
    async tryLoadSkin(playerName, renderType, renderCrop) {
        const imageUrl = `${this.baseUrl}${renderType}/${playerName}/${renderCrop}`;
        
        try {
            const response = await fetch(imageUrl, { 
                signal: this.abortController.signal 
            });

            if (!response.ok) throw new Error('API principal indisponível');

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            this.currentSkinUrl = url;
            this.isFallbackMode = false;

            this.elements.skinImage.onload = () => this.handleImageLoad(url, playerName);
            this.elements.skinImage.onerror = () => this.handleImageError(url);
            this.elements.skinImage.src = url;
            this.elements.skinImage.dataset.player = playerName;
            this.elements.skinImage.dataset.renderType = renderType;
            this.elements.skinImage.dataset.renderCrop = renderCrop;

        } catch (error) {
            if (error.name !== 'AbortError') {
                this.apiAvailable = false;
                this.hideRenderControls();
                await this.loadFallbackSkin(playerName);
            }
        }
    }

    /**
     * 🔄 Carrega a skin usando APIs de fallback
     * @param {string} playerName - Nome do jogador
     * @method
     */
    async loadFallbackSkin(playerName) {
        this.isFallbackMode = true;
        this.showError('API de renderização 3D indisponível. Usando modo básico.');

        const fallbackUrls = [
            `https://visage.surgeplay.com/full/512/${this.currentUuid}`,
            `https://mc-heads.net/body/${this.currentUuid}`,
            `https://crafatar.com/renders/body/${this.currentUuid}`
        ];

        for (const url of fallbackUrls) {
            try {
                const response = await fetch(url, { 
                    signal: this.abortController.signal 
                });
                
                if (response.ok) {
                    const blob = await response.blob();
                    const objectUrl = URL.createObjectURL(blob);
                    this.currentSkinUrl = objectUrl;

                    this.elements.skinImage.onload = () => this.handleImageLoad(objectUrl, playerName);
                    this.elements.skinImage.onerror = () => this.handleImageError(objectUrl);
                    this.elements.skinImage.src = objectUrl;
                    this.elements.skinImage.dataset.player = playerName;
                    this.elements.skinImage.dataset.fallback = 'true';
                    return;
                }
            } catch (error) {
                continue;
            }
        }

        throw new Error('Todos os fallbacks falharam');
    }

    /**
     * ✅ Trata carregamento bem-sucedido da imagem
     * @param {string} url - URL da imagem
     * @param {string} playerName - Nome do jogador
     * @method
     */
    handleImageLoad(url, playerName) {
        this.toggleLoading(false);
        this.createButtons(playerName);
        this.elements.skinImage.style.display = 'block';
        this.elements.resultContainer.style.display = 'block';
        this.hideError();
    }

    /**
     * 🛑 Trata erro no carregamento da imagem
     * @param {string} url - URL da imagem
     * @method
     */
    handleImageError(url) {
        URL.revokeObjectURL(url);
        this.toggleLoading(false);
        this.elements.resultContainer.style.display = 'none';
        this.currentSkinUrl = null;
        this.showError('Falha ao carregar a imagem da skin.');
        this.removeExistingButtons();
    }

    /**
     * 🚨 Trata erros na requisição
     * @param {Error} error - Erro ocorrido
     * @method
     */
    handleFetchError(error) {
        if (error.name !== 'AbortError') {
            this.toggleLoading(false);
            this.elements.resultContainer.style.display = 'none';
            this.currentSkinUrl = null;
            this.isValidPlayer = false;
            
            if (error.message === 'Jogador não encontrado') {
                this.showError('Jogador não encontrado. Verifique o nome e tente novamente.');
            } else {
                this.showError(error.message || 'Erro ao buscar informações do jogador.');
            }
            
            this.removeExistingButtons();
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
        this.elements.searchBtn.textContent = show ? 'Buscando...' : 'Buscar Skin';
    }

    /**
     * 🖼️ Cria botões de ação
     * @param {string} playerName - Nome do jogador
     * @method
     */
    createButtons(playerName) {
        this.removeExistingButtons();

        const downloadSkinBtn = document.createElement('button');
        downloadSkinBtn.id = 'downloadSkinBtn';
        downloadSkinBtn.className = 'action-btn';
        downloadSkinBtn.innerHTML = '<i class="fas fa-file-image"></i> Baixar Skin';
        downloadSkinBtn.onclick = () => this.downloadSkin();

        const downloadPreviewBtn = document.createElement('button');
        downloadPreviewBtn.id = 'downloadPreviewBtn';
        downloadPreviewBtn.className = 'action-btn';
        downloadPreviewBtn.innerHTML = '<i class="fas fa-image"></i> Baixar Preview';
        downloadPreviewBtn.onclick = () => this.downloadPreview();

        const nameMcBtn = document.createElement('button');
        nameMcBtn.id = 'nameMcBtn';
        nameMcBtn.className = 'action-btn';
        nameMcBtn.innerHTML = '<i class="fas fa-globe"></i> NameMC';
        nameMcBtn.onclick = () => window.open(`https://namemc.com/profile/${playerName}`, '_blank');

        const apiLinkBtn = document.createElement('button');
        apiLinkBtn.id = 'apiLinkBtn';
        apiLinkBtn.className = 'action-btn';
        apiLinkBtn.innerHTML = '<i class="fas fa-link"></i> Link Direto';
        apiLinkBtn.onclick = () => this.openApiLink();

        const container = this.elements.skinDisplay;
        container.appendChild(downloadSkinBtn);
        container.appendChild(downloadPreviewBtn);
        container.appendChild(nameMcBtn);
        container.appendChild(apiLinkBtn);
    }

    /**
     * 🗑️ Remove botões existentes
     * @method
     */
    removeExistingButtons() {
        const buttons = ['downloadSkinBtn', 'downloadPreviewBtn', 'nameMcBtn', 'apiLinkBtn'];
        buttons.forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.remove();
        });
    }

    /**
     * 🔗 Abre o link direto da API em uma nova aba com segurança
     * @method
     */
    openApiLink() {
        if (!this.currentPlayerName) {
            this.showError('Nenhum jogador pesquisado.');
            return;
        }

        if (this.isFallbackMode) {
            this.showError('Link direto indisponível em modo fallback.');
            return;
        }

        const apiUrl = `${this.baseUrl}${this.currentRenderType}/${this.currentPlayerName}/${this.currentRenderCrop}`;
        window.open(apiUrl, '_blank', 'noopener,noreferrer');
    }

    /**
     * 💾 Dispara o download da skin original
     * @method
     */
    downloadSkin() {
        if (!this.currentPlayerName) {
            this.showError('Nome do jogador não disponível.');
            return;
        }

        let downloadUrl;
        if (this.isFallbackMode) {
            downloadUrl = `https://visage.surgeplay.com/skin/${this.currentUuid}`;
        } else {
            downloadUrl = `${this.baseUrl}skin/${this.currentPlayerName}/default`;
        }
        
        fetch(downloadUrl)
            .then(response => {
                if (!response.ok) throw new Error('Erro ao baixar a skin');
                return response.blob();
            })
            .then(blob => {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `skin_${this.currentPlayerName}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            })
            .catch(() => {
                this.showError('Não foi possível baixar a skin original. Tente novamente.');
            });
    }

    /**
     * 🖼️ Dispara o download da imagem de preview (renderização 3D)
     * @method
     */
    downloadPreview() {
        if (!this.currentSkinUrl) {
            this.showError('Nenhuma imagem de preview disponível.');
            return;
        }

        const previewUrl = this.currentSkinUrl;
        
        fetch(previewUrl)
            .then(response => {
                if (!response.ok) throw new Error('Erro ao baixar o preview');
                return response.blob();
            })
            .then(blob => {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                const extension = this.isFallbackMode ? 'png' : 'png';
                link.download = `preview_${this.currentPlayerName}_${this.currentRenderType}.${extension}`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            })
            .catch(() => {
                this.showError('Não foi possível baixar o preview. Tente novamente.');
            });
    }

    /**
     * 📋 Copia o UUID para a área de transferência
     * @method
     */
    copyUUID() {
        const uuid = this.elements.uuidDisplay.innerText;
        if (!uuid || uuid === 'Carregando...') {
            this.showError('Nenhum UUID disponível para copiar.');
            return;
        }

        navigator.clipboard.writeText(uuid)
            .then(() => {
                const copyBtn = document.getElementById('copyUuidBtn');
                if (copyBtn) {
                    const originalText = copyBtn.innerHTML;
                    copyBtn.innerHTML = '<i class="fas fa-check"></i> Copiado!';
                    setTimeout(() => {
                        copyBtn.innerHTML = originalText;
                    }, 2000);
                }
            })
            .catch(() => {
                const textArea = document.createElement('textarea');
                textArea.value = uuid;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                alert('UUID copiado para a área de transferência!');
            });
    }

    /**
     * ⚠️ Exibe mensagem de erro
     * @param {string} message - Mensagem de erro
     * @method
     */
    showError(message) {
        const errorElement = document.getElementById('errorMessage');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        } else {
            alert(message);
        }
    }

    /**
     * 🙈 Oculta mensagem de erro
     * @method
     */
    hideError() {
        const errorElement = document.getElementById('errorMessage');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }
}

/**
 * 🚀 Inicialização quando o DOM estiver pronto
 */
document.addEventListener('DOMContentLoaded', () => {
    const skinController = new SkinController();
    skinController.initialize();
});
