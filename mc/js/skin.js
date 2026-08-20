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
            errorMessage: document.getElementById('errorMessage')
        };

        this.renderConfig = {
            crops: {
                full: ['full'],
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

        this.abortController = null;
        this.currentSkinUrl = null;
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
    }

    /**
     * 📦 Popula os tipos de renderização no select
     * @method
     */
    populateRenderTypes() {
        const fragment = document.createDocumentFragment();

        Object.entries(this.renderConfig.types).forEach(([type]) => {
            const option = document.createElement('option');
            option.value = type;
            const translation = this.renderConfig.translations[type] || type;
            option.textContent = `${type} (${translation})`;
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
        const cropType = this.renderConfig.types[selectedType] || 'full';
        const crops = this.renderConfig.crops[cropType] || ['full'];

        const fragment = document.createDocumentFragment();
        crops.forEach(crop => {
            const option = document.createElement('option');
            option.value = crop;
            option.textContent = crop.charAt(0).toUpperCase() + crop.slice(1);
            fragment.appendChild(option);
        });

        this.elements.renderCrop.replaceChildren(fragment);
        this.elements.renderCrop.style.display = crops.length <= 1 ? 'none' : '';
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
            const player = this.elements.skinImage.dataset.player;
            if (player && this.currentSkinUrl) {
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
        return Math.random().toString(16).substring(2, 10);
    }

    /**
     * 📡 Busca a skin e informações do jogador
     * @method
     */
    async fetchSkin() {
        const playerName = this.elements.playerInput.value.trim();

        if (!this.isValidUsername(playerName)) {
            this.showError('Nome de usuário inválido. Use 2-16 caracteres (letras, números ou underline).');
            return;
        }

        this.hideError();

        if (this.abortController) {
            this.abortController.abort();
        }

        this.toggleLoading(true);
        this.elements.resultContainer.style.display = 'none';
        this.elements.skinImage.style.display = 'none';
        this.currentSkinUrl = null;

        try {
            this.abortController = new AbortController();
            
            const uuidResponse = await fetch(
                `https://api.minetools.eu/uuid/${playerName}`,
                { signal: this.abortController.signal }
            );

            if (!uuidResponse.ok) {
                throw new Error('Jogador não encontrado. Verifique o nome e tente novamente.');
            }

            const uuidData = await uuidResponse.json();
            
            if (!uuidData.id) {
                throw new Error('UUID não encontrado para este jogador.');
            }

            const uuid = uuidData.id;
            this.elements.uuidDisplay.textContent = uuid;
            this.elements.resultContainer.style.display = 'flex';

            const renderType = this.elements.renderType.value;
            const renderCrop = this.elements.renderCrop.value;
            
            const imageUrl = `https://starlight.lunareclipse.studio/render/${renderType}/${playerName}/${renderCrop}`;
            
            const testResponse = await fetch(imageUrl, { 
                signal: this.abortController.signal,
                method: 'HEAD' 
            });

            if (testResponse.ok) {
                this.loadSkinImage(imageUrl, playerName);
            } else {
                this.loadFallbackSkin(uuid, playerName);
            }

        } catch (error) {
            if (error.name !== 'AbortError') {
                try {
                    const uuid = this.elements.uuidDisplay.textContent;
                    if (uuid) {
                        this.loadFallbackSkin(uuid, playerName);
                    } else {
                        throw new Error('Não foi possível carregar a skin.');
                    }
                } catch (fallbackError) {
                    this.handleFetchError(error.message || 'Erro ao buscar informações do jogador.');
                }
            }
        }
    }

    /**
     * 🖼️ Carrega a imagem da skin
     * @param {string} imageUrl - URL da imagem
     * @param {string} playerName - Nome do jogador
     * @method
     */
    loadSkinImage(imageUrl, playerName) {
        this.currentSkinUrl = imageUrl;
        
        this.elements.skinImage.onload = () => {
            this.handleImageLoad(playerName);
        };
        
        this.elements.skinImage.onerror = () => {
            const uuid = this.elements.uuidDisplay.textContent;
            if (uuid) {
                this.loadFallbackSkin(uuid, playerName);
            } else {
                this.handleImageError('Falha ao carregar a imagem da skin.');
            }
        };

        this.elements.skinImage.src = imageUrl;
        this.elements.skinImage.dataset.player = playerName;
    }

    /**
     * 🔄 Carrega a skin usando API de fallback
     * @param {string} uuid - UUID do jogador
     * @param {string} playerName - Nome do jogador
     * @method
     */
    loadFallbackSkin(uuid, playerName) {
        const fallbackUrl = `https://visage.surgeplay.com/full/512/${uuid}`;
        this.currentSkinUrl = fallbackUrl;
        
        this.elements.skinImage.onload = () => {
            this.handleImageLoad(playerName);
        };
        
        this.elements.skinImage.onerror = () => {
            const defaultSkin = `https://mc-heads.net/avatar/${uuid}/512`;
            this.currentSkinUrl = defaultSkin;
            
            this.elements.skinImage.onload = () => {
                this.handleImageLoad(playerName);
            };
            this.elements.skinImage.onerror = () => {
                this.handleImageError('Não foi possível carregar a skin do jogador.');
            };
            this.elements.skinImage.src = defaultSkin;
        };

        this.elements.skinImage.src = fallbackUrl;
        this.elements.skinImage.dataset.player = playerName;
        this.elements.skinImage.dataset.fallback = 'true';
    }

    /**
     * ✅ Trata carregamento bem-sucedido da imagem
     * @param {string} playerName - Nome do jogador
     * @method
     */
    handleImageLoad(playerName) {
        this.toggleLoading(false);
        this.elements.skinImage.style.display = 'block';
        this.createButtons(playerName);
        this.hideError();
    }

    /**
     * 🛑 Trata erro no carregamento da imagem
     * @param {string} errorMessage - Mensagem de erro
     * @method
     */
    handleImageError(errorMessage) {
        this.toggleLoading(false);
        this.elements.skinImage.style.display = 'none';
        this.elements.resultContainer.style.display = 'none';
        this.currentSkinUrl = null;
        this.showError(errorMessage);
        this.removeButtons();
    }

    /**
     * 🚨 Trata erros na requisição
     * @param {string} errorMessage - Mensagem de erro
     * @method
     */
    handleFetchError(errorMessage) {
        this.toggleLoading(false);
        this.elements.resultContainer.style.display = 'none';
        this.elements.skinImage.style.display = 'none';
        this.currentSkinUrl = null;
        this.showError(errorMessage);
        this.removeButtons();
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
        this.removeButtons();

        const downloadBtn = document.createElement('button');
        downloadBtn.id = 'downloadBtn';
        downloadBtn.className = 'action-btn';
        downloadBtn.innerHTML = '<i class="fas fa-download"></i> Baixar Skin';
        downloadBtn.onclick = () => this.downloadSkin();

        const nameMcBtn = document.createElement('button');
        nameMcBtn.id = 'nameMcBtn';
        nameMcBtn.className = 'action-btn';
        nameMcBtn.innerHTML = '<i class="fas fa-globe"></i> NameMC';
        nameMcBtn.onclick = () => window.open(`https://namemc.com/profile/${playerName}`, '_blank');

        const copyBtn = document.createElement('button');
        copyBtn.id = 'copyUuidBtn';
        copyBtn.className = 'action-btn';
        copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copiar UUID';
        copyBtn.onclick = () => this.copyUUID();

        const container = this.elements.skinDisplay;
        container.appendChild(downloadBtn);
        container.appendChild(nameMcBtn);
        container.appendChild(copyBtn);
    }

    /**
     * 🗑️ Remove botões existentes
     * @method
     */
    removeButtons() {
        const buttons = ['downloadBtn', 'nameMcBtn', 'copyUuidBtn'];
        buttons.forEach(id => {
            const btn = document.getElementById(id);
            if (btn) btn.remove();
        });
    }

    /**
     * 💾 Dispara o download da skin
     * @method
     */
    downloadSkin() {
        const imageUrl = this.elements.skinImage.src;
        if (!imageUrl || imageUrl === window.location.href) return;

        fetch(imageUrl)
            .then(response => response.blob())
            .then(blob => {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `skin_${this.generateFileHash()}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            })
            .catch(() => {
                window.open(imageUrl, '_blank');
            });
    }

    /**
     * 📋 Copia o UUID para a área de transferência
     * @method
     */
    copyUUID() {
        const uuid = this.elements.uuidDisplay.textContent;
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
        const errorElement = this.elements.errorMessage;
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
        const errorElement = this.elements.errorMessage;
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
