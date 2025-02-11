const fullCrops = ["full"];
const defaultCrops = ["default"];
const fullHeadCrops = ["full", "head"];
const fullBustCrops = ["full", "bust"];
const renderTypes = {
    "default": fullCrops,
    "marching": fullCrops,
    "walking": fullCrops,
    "crouching": fullCrops,
    "crossed": fullCrops,
    "criss_cross": fullCrops,
    "ultimate": fullCrops,
    "isometric": fullHeadCrops,
    "head": fullCrops,
    "custom": fullCrops,
    "cheering": fullCrops,
    "relaxing": fullCrops,
    "trudging": fullCrops,
    "cowering": fullCrops,
    "pointing": fullCrops,
    "lunging": fullCrops,
    "dungeons": fullCrops,
    "facepalm": fullCrops,
    "sleeping": fullBustCrops,
    "dead": fullCrops,
    "archer": fullCrops,
    "kicking": fullCrops,
    "mojavatar": fullBustCrops,
    "reading": fullCrops,
    "high_ground": fullCrops,
    "bitzel": fullCrops,
    "pixel": fullCrops,
    "skin": defaultCrops,
    "profile": fullCrops
};

// Traduções para exibição no select
const renderNames = {
    "default": "Padrão",
    "marching": "Marcha",
    "walking": "Andando",
    "crouching": "Agachado",
    "crossed": "Braços Cruzados",
    "criss_cross": "Pernas Cruzadas",
    "ultimate": "Supremo",
    "isometric": "Isométrico",
    "head": "Cabeça",
    "custom": "Personalizado",
    "cheering": "Torcendo",
    "relaxing": "Relaxando",
    "trudging": "Caminhando Pesado",
    "cowering": "Encolhido",
    "pointing": "Apontando",
    "lunging": "Investida",
    "dungeons": "Masmorras",
    "facepalm": "Facepalm",
    "sleeping": "Dormindo",
    "dead": "Morto",
    "archer": "Arqueiro",
    "kicking": "Chutando",
    "mojavatar": "Mojavatar",
    "reading": "Lendo",
    "high_ground": "Terreno Alto",
    "bitzel": "Bitzel",
    "pixel": "Pixel",
    "skin": "Skin",
    "profile": "Perfil"
};

function updateAvailableCrops() {
    const renderType = document.getElementById("renderType").value;
    const renderCrop = document.getElementById("renderCrop");

    const fragment = document.createDocumentFragment();
    renderTypes[renderType]?.forEach(crop => {
        const option = document.createElement("option");
        option.value = crop;
        option.textContent = crop;
        fragment.appendChild(option);
    });
    renderCrop.replaceChildren(fragment);
}

function generateRandomHex() {
    return Math.floor(Math.random() * 16777215).toString(16);
}


function isValidMinecraftUsername(username) {
    return /^[a-z0-9_]{2,16}$/i.test(username);
}
function fetchSkin() {
    const playerName = document.getElementById("playerName").value.trim();
    const renderType = document.getElementById("renderType").value;
    const renderCrop = document.getElementById("renderCrop").value;
    const loading = document.getElementById("loading");
    const skinImage = document.getElementById("skinImage");
    const downloadBtn = document.getElementById("downloadBtn");
    const skinDisplay = document.querySelector(".skin-display");
    const searchBtn = document.getElementById("searchBtn");

    // Mostrar loading
    loading.style.display = "flex";
    skinImage.style.display = "none";
    searchBtn.disabled = true;
    if (downloadBtn) downloadBtn.remove();

    if (!playerName || !isValidMinecraftUsername(playerName)) {
        loading.style.display = "none";
        searchBtn.disabled = false;
        return;
    }

    if (skinImage.abortController) {
        skinImage.abortController.abort();
    }
    const abortController = new AbortController();
    skinImage.abortController = abortController;

    const requestId = Symbol();
    skinImage.currentRequest = requestId;

    fetch(`https://starlightskins.lunareclipse.studio/render/${renderType}/${playerName}/${renderCrop}`, {
        signal: abortController.signal
    })
        .then(response => {
            if (!response.ok || skinImage.currentRequest !== requestId) {
                throw new Error('Requisição obsoleta ou erro HTTP');
            }
            return response.blob();
        })
        .then(blob => {
            if (skinImage.currentRequest !== requestId) return;

            const objectURL = URL.createObjectURL(blob);
            const newDownloadBtn = document.createElement("button");

            skinImage.onerror = () => {
                searchBtn.disabled = false;
                loading.style.display = "none";
                skinImage.style.display = "none";
                URL.revokeObjectURL(objectURL);
                newDownloadBtn.remove();
            };

            skinImage.onload = () => {

                searchBtn.disabled = false;
                loading.style.display = "none";
                skinImage.style.display = "block";
                newDownloadBtn.id = "downloadBtn";
                newDownloadBtn.textContent = "Baixar Skin";
                newDownloadBtn.onclick = () => {
                    const link = document.createElement("a");
                    link.href = objectURL;
                    link.download = `${generateRandomHex()}.png`;
                    link.click();
                };
                skinDisplay.appendChild(newDownloadBtn);
            };
            skinImage.dataset.player = playerName;
            skinImage.dataset.renderType = renderType;
            skinImage.src = objectURL;
        })
        .catch(error => {
            searchBtn.disabled = false;
            loading.style.display = "none";
            if (error.name !== "AbortError") {
                URL.revokeObjectURL(skinImage.src);
            }
        });
}

document.addEventListener("DOMContentLoaded", () => {
    const renderTypeSelect = document.getElementById("renderType");

    const fragment = document.createDocumentFragment();
    Object.keys(renderTypes).forEach(type => {
        const option = document.createElement("option");
        option.value = type;
        option.textContent = `${type} (${renderNames[type] || "Sem tradução"})`;
        fragment.appendChild(option);
    });
    renderTypeSelect.appendChild(fragment);

    renderTypeSelect.addEventListener("change", updateAvailableCrops);

    updateAvailableCrops();
});
// Adicione este código após o DOMContentLoaded
document.getElementById('skinImage').addEventListener('click', function () {
    const player = this.dataset.player;
    const renderType = this.dataset.renderType;

    if (player && renderType) {
        const modal = document.getElementById('skinModal');
        const modalImg = document.getElementById('modalSkinImage');
        modalImg.src = `https://starlightskins.lunareclipse.studio/render/${renderType}/${player}/full`;
        modal.style.display = 'block';
    }
});

// Fechar modal
document.querySelector('.close-modal').onclick = () => {
    document.getElementById('skinModal').style.display = 'none';
};

window.onclick = (event) => {
    if (event.target === document.getElementById('skinModal')) {
        document.getElementById('skinModal').style.display = 'none';
    }
};