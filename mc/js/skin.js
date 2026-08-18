/**
 * 🎮 Controlador de skins Minecraft - NerdZone
 * 🖼️ Usa API do Lunar Eclipse/Starlight diretamente no <img>
 * 🔍 UUID consultado separadamente com fallback
 * ⚠️ Mensagens de erro claras na interface
 * 🚫 Evita requisições concorrentes
 * 🎨 Mantém os tipos de renderização do projeto
 */

class SkinController {
    constructor() {
        this.API_BASE = 'https://starlightskins.lunareclipse.studio';

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

        this.abortController = null;
        this.currentRequest = 0;
        this.currentSkinUrl = null;

        this.ensureErrorElement();
    }

    initialize() {
        if (!this.elements.playerInput ||
            !this.elements.renderType ||
            !this.elements.renderCrop ||
            !this.elements.searchBtn ||
            !this.elements.skinImage) {
            console.error('[NerdZone Skin] Elementos obrigatórios não encontrados no HTML.');
            return;
        }

        this.populateRenderTypes();
        this.setupEventListeners();
        this.setupModal();
        this.hideError();
    }

    ensureErrorElement() {
        if (this.elements.errorMessage) return;

        const anchor =
            this.elements.searchBtn?.parentElement ||
            this.elements.playerInput?.parentElement;

        if (!anchor) return;

        const error = document.createElement('div');
        error.id = 'errorMessage';
        error.setAttribute('role', 'alert');
        error.setAttribute('aria-live', 'polite');
        error.style.display = 'none';

        anchor.insertAdjacentElement('afterend', error);
        this.elements.errorMessage = error;
    }

    populateRenderTypes() {
        const fragment = document.createDocumentFragment();

        Object.entries(this.renderConfig.types).forEach(([type]) => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent =
                `${type} (${this.renderConfig.translations[type] || type})`;
            fragment.appendChild(option);
        });

        this.elements.renderType.replaceChildren(fragment);
        this.updateCropOptions();
    }

    updateCropOptions() {
        const selectedType = this.elements.renderType.value;
        const cropType = this.renderConfig.types[selectedType] || 'full';
        const crops = this.renderConfig.crops[cropType] || ['full'];

        const fragment = document.createDocumentFragment();

        crops.forEach(crop => {
            const option = document.createElement('option');
            option.value = crop;
            option.textContent =
                crop.charAt(0).toUpperCase() + crop.slice(1);
            fragment.appendChild(option);
        });

        this.elements.renderCrop.replaceChildren(fragment);
        this.elements.renderCrop.style.display =
            crops.length <= 1 ? 'none' : '';
    }

    setupEventListeners() {
        this.elements.renderType.addEventListener(
            'change',
            () => this.updateCropOptions()
        );

        this.elements.searchBtn.addEventListener(
            'click',
            () => this.fetchSkin()
        );

        this.elements.playerInput.addEventListener('keydown', event => {
            if (event.key === 'Enter') {
                event.preventDefault();
                this.fetchSkin();
            }
        });
    }

    setupModal() {
        if (!this.elements.modal || !this.elements.modalImage) return;

        this.elements.skinImage.addEventListener('click', () => {
            if (!this.currentSkinUrl) return;

            this.elements.modalImage.src = this.currentSkinUrl;
            this.elements.modal.style.display = 'block';
        });

        const closeButton = document.querySelector('.close-modal');

        if (closeButton) {
            closeButton.addEventListener('click', () => {
                this.closeModal();
            });
        }

        window.addEventListener('click', event => {
            if (event.target === this.elements.modal) {
                this.closeModal();
            }
        });

        window.addEventListener('keydown', event => {
            if (event.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    closeModal() {
        if (!this.elements.modal) return;
        this.elements.modal.style.display = 'none';
    }

    isValidUsername(username) {
        return /^[a-z0-9_]{3,16}$/i.test(username);
    }

    generateFileHash() {
        return Math.random().toString(16).substring(2, 10);
    }

    buildRenderUrl(type, username, crop) {
        const safeType = encodeURIComponent(type);
        const safeUsername = encodeURIComponent(username);
        const safeCrop = encodeURIComponent(crop);

        return `${this.API_BASE}/render/${safeType}/${safeUsername}/${safeCrop}`;
    }

    async fetchSkin() {
        const playerName = this.elements.playerInput.value.trim();

        if (!playerName) {
            this.showError(
                'Digite um nome de jogador do Minecraft para fazer a consulta.'
            );
            this.elements.playerInput.focus();
            return;
        }

        if (!this.isValidUsername(playerName)) {
            this.showError(
                'Nome de jogador inválido. Use de 3 a 16 caracteres, apenas letras, números e _.'
            );
            this.elements.playerInput.focus();
            return;
        }

        if (this.abortController) {
            this.abortController.abort();
        }

        const requestId = ++this.currentRequest;
        this.abortController = new AbortController();

        this.hideError();
        this.resetResult();
        this.toggleLoading(true);

        const renderType = this.elements.renderType.value || 'default';
        const renderCrop = this.elements.renderCrop.value || 'full';
        const imageUrl = this.buildRenderUrl(
            renderType,
            playerName,
            renderCrop
        );

        try {
            await this.resolveUUID(
                playerName,
                this.abortController.signal
            );

            if (requestId !== this.currentRequest) return;

            await this.loadSkinImage(
                imageUrl,
                playerName,
                requestId
            );

            if (requestId !== this.currentRequest) return;

            this.elements.skinImage.dataset.renderType = renderType;
            this.elements.skinImage.dataset.renderCrop = renderCrop;

        } catch (error) {
            if (error?.name === 'AbortError') return;

            console.error('[NerdZone Skin] Falha na consulta:', error);

            this.handleFetchError(error);
        } finally {
            if (requestId === this.currentRequest) {
                this.toggleLoading(false);
            }
        }
    }

    async resolveUUID(username, signal) {
        const providers = [
            {
                name: 'Ashcon',
                url: `https://api.ashcon.app/mojang/v2/user/${encodeURIComponent(username)}`
            },
            {
                name: 'MineTools',
                url: `https://api.minetools.eu/uuid/${encodeURIComponent(username)}`
            }
        ];

        let lastError = null;

        for (const provider of providers) {
            try {
                const response = await fetch(provider.url, {
                    signal,
                    headers: {
                        Accept: 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(
                        `${provider.name}: HTTP ${response.status}`
                    );
                }

                const data = await response.json();

                const uuid = this.extractUUID(data);

                if (!uuid) {
                    throw new Error(
                        `${provider.name}: UUID não encontrado`
                    );
                }

                if (this.elements.uuidDisplay) {
                    this.elements.uuidDisplay.textContent = uuid;
                }

                return uuid;
            } catch (error) {
                if (error?.name === 'AbortError') {
                    throw error;
                }

                lastError = error;
                console.warn(
                    `[NerdZone Skin] ${provider.name} indisponível:`,
                    error
                );
            }
        }

        if (this.elements.uuidDisplay) {
            this.elements.uuidDisplay.textContent =
                'UUID indisponível no momento';
        }

        return null;
    }

    extractUUID(data) {
        if (!data || typeof data !== 'object') return null;

        const candidates = [
            data.uuid,
            data.id,
            data.player?.uuid,
            data.data?.uuid
        ];

        for (const value of candidates) {
            if (typeof value !== 'string') continue;

            const clean = value.replace(/-/g, '').trim();

            if (/^[0-9a-f]{32}$/i.test(clean)) {
                return clean;
            }
        }

        return null;
    }

    loadSkinImage(imageUrl, playerName, requestId) {
        return new Promise((resolve, reject) => {
            const image = this.elements.skinImage;

            image.onload = () => {
                if (requestId !== this.currentRequest) return;

                this.currentSkinUrl = imageUrl;
                image.dataset.player = playerName;
                image.style.display = 'block';

                this.elements.resultContainer &&
                    (this.elements.resultContainer.style.display = 'flex');

                this.createDownloadButton(imageUrl);
                this.createNameMCButton(playerName);

                resolve();
            };

            image.onerror = () => {
                if (requestId !== this.currentRequest) return;

                reject(
                    new Error(
                        'A API do Lunar Eclipse não conseguiu gerar a renderização dessa skin.'
                    )
                );
            };

            image.alt = `Skin de ${playerName}`;
            image.src = imageUrl;
        });
    }

    resetResult() {
        this.currentSkinUrl = null;

        if (this.elements.skinImage) {
            this.elements.skinImage.removeAttribute('src');
            this.elements.skinImage.style.display = 'none';
            delete this.elements.skinImage.dataset.player;
            delete this.elements.skinImage.dataset.renderType;
            delete this.elements.skinImage.dataset.renderCrop;
        }

        if (this.elements.resultContainer) {
            this.elements.resultContainer.style.display = 'none';
        }

        this.removeExistingButtons();
    }

    handleFetchError(error) {
        this.toggleLoading(false);

        if (this.elements.resultContainer) {
            this.elements.resultContainer.style.display = 'none';
        }

        const message = this.getFriendlyErrorMessage(error);

        this.showError(message);
    }

    getFriendlyErrorMessage(error) {
        const raw = String(error?.message || '').toLowerCase();

        if (
            raw.includes('failed to fetch') ||
            raw.includes('network') ||
            raw.includes('networkerror')
        ) {
            return (
                'Não foi possível conectar ao serviço de skins. ' +
                'Verifique sua conexão e tente novamente.'
            );
        }

        if (
            raw.includes('lunar eclipse') ||
            raw.includes('renderização')
        ) {
            return (
                'A skin foi encontrada, mas o serviço de renderização ' +
                'do Lunar Eclipse não conseguiu gerar a imagem. ' +
                'Tente novamente ou escolha outro tipo de render.'
            );
        }

        if (raw.includes('http 429') || raw.includes('too many')) {
            return (
                'O serviço recebeu muitas consultas em pouco tempo. ' +
                'Aguarde alguns segundos e tente novamente.'
            );
        }

        if (raw.includes('http 5')) {
            return (
                'O serviço de skins está temporariamente indisponível. ' +
                'Tente novamente em alguns instantes.'
            );
        }

        return (
            error?.message ||
            'Não foi possível consultar a skin. Verifique o nome e tente novamente.'
        );
    }

    showError(message) {
        if (!this.elements.errorMessage) {
            console.error('[NerdZone Skin]', message);
            return;
        }

        this.elements.errorMessage.textContent = message;
        this.elements.errorMessage.style.display = 'block';
        this.elements.errorMessage.hidden = false;
    }

    hideError() {
        if (!this.elements.errorMessage) return;

        this.elements.errorMessage.textContent = '';
        this.elements.errorMessage.style.display = 'none';
        this.elements.errorMessage.hidden = true;
    }

    toggleLoading(show) {
        if (this.elements.loading) {
            this.elements.loading.style.display = show ? 'flex' : 'none';
        }

        if (this.elements.searchBtn) {
            this.elements.searchBtn.disabled = show;
        }
    }

    createDownloadButton(url) {
        this.removeButton('downloadBtn');

        const downloadBtn = document.createElement('button');
        downloadBtn.id = 'downloadBtn';
        downloadBtn.type = 'button';
        downloadBtn.textContent = 'Baixar Skin';
        downloadBtn.addEventListener('click', () => {
            this.downloadSkin(url);
        });

        this.elements.skinDisplay?.appendChild(downloadBtn);
    }

    createNameMCButton(playerName) {
        this.removeButton('nameMcBtn');

        const nameMcBtn = document.createElement('button');
        nameMcBtn.id = 'nameMcBtn';
        nameMcBtn.type = 'button';
        nameMcBtn.textContent = 'NameMC';

        nameMcBtn.addEventListener('click', () => {
            window.open(
                `https://namemc.com/profile/${encodeURIComponent(playerName)}`,
                '_blank',
                'noopener,noreferrer'
            );
        });

        this.elements.skinDisplay?.appendChild(nameMcBtn);
    }

    removeButton(id) {
        document.getElementById(id)?.remove();
    }

    removeExistingButtons() {
        this.removeButton('downloadBtn');
        this.removeButton('nameMcBtn');
    }

    async downloadSkin(url) {
        const filename =
            `skin_${this.generateFileHash()}.png`;

        try {
            const response = await fetch(url, {
                mode: 'cors'
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            link.remove();

            setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
        } catch (error) {
            console.warn(
                '[NerdZone Skin] Download por Blob indisponível:',
                error
            );

            window.open(url, '_blank', 'noopener,noreferrer');
        }
    }
}

/**
 * 📋 Compatibilidade com o botão "Copiar UUID" existente no HTML
 */
function copyUUID() {
    const uuidElement = document.getElementById('result');
    const uuid = uuidElement?.innerText?.trim();

    if (!uuid || !/^[0-9a-f]{32}$/i.test(uuid.replace(/-/g, ''))) {
        alert('Nenhum UUID válido disponível para copiar.');
        return;
    }

    if (!navigator.clipboard) {
        alert('Seu navegador não permite copiar o UUID automaticamente.');
        return;
    }

    navigator.clipboard.writeText(uuid)
        .then(() => {
            alert('UUID copiado!');
        })
        .catch(error => {
            console.error('[NerdZone Skin] Erro ao copiar UUID:', error);
            alert('Não foi possível copiar o UUID.');
        });
}

document.addEventListener('DOMContentLoaded', () => {
    const skinController = new SkinController();
    skinController.initialize();

    window.skinController = skinController;
});
