/**
 * 🎮 Controlador principal de renderização de skins Minecraft
 * 🔗 Integrado com Lunar Eclipse Studio API
 */
class SkinController {
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
            resultContainer: document.querySelector('.result-container'),
            uuidResult: document.getElementById('result'),
            errorMessage: document.getElementById('errorMessage') || this.createErrorElement()
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
    }

    createErrorElement() {
        const div = document.createElement('div');
        div.id = 'errorMessage';
        div.className = 'error-message';
        div.style.color = '#ff4444';
        div.style.marginTop = '10px';
        div.style.display = 'none';
        this.elements.skinDisplay.parentNode.insertBefore(div, this.elements.skinDisplay.nextSibling);
        return div;
    }

    initialize() {
        this.populateRenderTypes();
        this.setupEventListeners();
        this.setupModal();
    }

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
        this.elements.renderCrop.style.display = crops.length === 1 ? 'none' : '';
    }

    setupEventListeners() {
        this.elements.renderType.addEventListener('change', () => this.updateCropOptions());
        this.elements.searchBtn.addEventListener('click', () => this.fetchSkin());
        
        this.elements.playerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.fetchSkin();
        });
    }

    setupModal() {
        this.elements.skinImage.addEventListener('click', () => {
            if (this.elements.skinImage.dataset.src) {
                this.elements.modalImage.src = this.elements.skinImage.dataset.src;
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

    isValidUsername(username) {
        return /^[a-z0-9_]{2,16}$/i.test(username);
    }

    generateFileHash() {
        return Math.random().toString(16).substr(2, 8);
    }

    showError(message) {
        this.elements.errorMessage.textContent = message;
        this.elements.errorMessage.style.display = 'block';
        this.elements.resultContainer.style.display = 'none';
        this.elements.skinImage.style.display = 'none';
        this.removeExistingButtons();
    }

    hideError() {
        this.elements.errorMessage.style.display = 'none';
        this.elements.errorMessage.textContent = '';
    }

    async fetchSkin() {
        const playerName = this.elements.playerInput.value.trim();

        if (!playerName) {
            this.showError('Por favor, insira um nome de usuário.');
            return;
        }

        if (!this.isValidUsername(playerName)) {
            this.showError('Nome de usuário inválido. Use apenas letras, números e underscores (2-16 caracteres).');
            return;
        }

        if (this.abortController) {
            this.abortController.abort();
        }

        this.toggleLoading(true);
        this.hideError();
        this.removeExistingButtons();

        const renderType = this.elements.renderType.value;
        const renderCrop = this.elements.renderCrop.value;

        const apiUrl = `https://api.lunareclipse.studio/v1/minecraft/profile/${playerName}`;

        this.abortController = new AbortController();

        try {
            const profileResponse = await fetch(apiUrl, { 
                signal: this.abortController.signal 
            });

            if (!profileResponse.ok) {
                if (profileResponse.status === 404) {
                    throw new Error('Jogador não encontrado. Verifique o nome.');
                }
                throw new Error(`Erro na API: ${profileResponse.statusText}`);
            }

            const profileData = await profileResponse.json();
            
            if (!profileData.uuid) {
                throw new Error('Dados incompletos recebidos da API.');
            }

            const imageUrl = `https://starlightskins.lunareclipse.studio/render/${renderType}/${playerName}/${renderCrop}`;

            await this.loadImage(imageUrl, playerName, renderType, renderCrop);

            this.elements.uuidResult.textContent = profileData.uuid;
            this.elements.resultContainer.style.display = 'flex';

        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error(error);
                this.showError(error.message || 'Falha ao buscar skin. Tente novamente.');
            }
        } finally {
            this.toggleLoading(false);
        }
    }

    loadImage(url, playerName, renderType, renderCrop) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.elements.skinImage.src = url;
                this.elements.skinImage.dataset.src = url;
                this.elements.skinImage.style.display = 'block';
                
                this.createDownloadButton(url);
                this.createNameMCButton(playerName);
                this.createCopyUUIDButton();
                
                resolve();
            };
            img.onerror = () => {
                reject(new Error('Falha ao carregar a imagem da skin.'));
            };
            img.src = url;
        });
    }

    createDownloadButton(url) {
        const btn = document.createElement('button');
        btn.id = 'downloadBtn';
        btn.className = 'action-btn';
        btn.textContent = 'Baixar Skin';
        btn.onclick = () => {
            const link = document.createElement('a');
            link.href = url;
            link.download = `skin_${playerName}_${this.generateFileHash()}.png`;
            link.click();
        };
        this.elements.skinDisplay.appendChild(btn);
    }

    createNameMCButton(playerName) {
        const btn = document.createElement('button');
        btn.id = 'nameMcBtn';
        btn.className = 'action-btn';
        btn.textContent = 'NameMC';
        btn.onclick = () => window.open(`https://namemc.com/profile/${playerName}`, '_blank');
        this.elements.skinDisplay.appendChild(btn);
    }

    createCopyUUIDButton() {
        const existing = document.getElementById('copyUuidBtn');
        if (existing) existing.remove();

        const btn = document.createElement('button');
        btn.id = 'copyUuidBtn';
        btn.className = 'action-btn';
        btn.textContent = 'Copiar UUID';
        btn.onclick = () => {
            const uuid = this.elements.uuidResult.textContent;
            navigator.clipboard.writeText(uuid).then(() => {
                const originalText = btn.textContent;
                btn.textContent = 'Copiado!';
                setTimeout(() => btn.textContent = originalText, 2000);
            }).catch(err => {
                console.error('Erro ao copiar', err);
            });
        };
        this.elements.skinDisplay.appendChild(btn);
    }

    removeExistingButtons() {
        ['downloadBtn', 'nameMcBtn', 'copyUuidBtn'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.remove();
        });
    }

    toggleLoading(show) {
        this.elements.loading.style.display = show ? 'flex' : 'none';
        this.elements.searchBtn.disabled = show;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const skinController = new SkinController();
    skinController.initialize();
});
