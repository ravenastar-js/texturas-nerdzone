const defaultCrops = ["full"];
const renderTypes = {
    "default": defaultCrops,
    "marching": defaultCrops,
    "walking": defaultCrops,
    "crouching": defaultCrops,
    "crossed": defaultCrops,
    "criss_cross": defaultCrops,
    "ultimate": defaultCrops,
    "isometric": ["full", "head"],
    "head": defaultCrops,
    "custom": defaultCrops,
    "cheering": defaultCrops,
    "relaxing": defaultCrops,
    "trudging": defaultCrops,
    "cowering": defaultCrops,
    "pointing": defaultCrops,
    "lunging": defaultCrops,
    "dungeons": defaultCrops,
    "facepalm": defaultCrops,
    "sleeping": ["full", "bust"],
    "dead": defaultCrops,
    "archer": defaultCrops,
    "kicking": defaultCrops,
    "mojavatar": ["full", "bust"],
    "reading": defaultCrops,
    "high_ground": defaultCrops,
    "bitzel": defaultCrops,
    "pixel": defaultCrops,
    "skin": ["default"],
    "profile": defaultCrops
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


function fetchSkin() {
    const playerName = document.getElementById("playerName").value.trim();
    const renderType = document.getElementById("renderType").value;
    const renderCrop = document.getElementById("renderCrop").value;

    if (!playerName) {
        return;
    }

    const skinImage = document.getElementById("skinImage");
    const downloadBtn = document.getElementById("downloadBtn") || document.createElement("button");
    downloadBtn.id = "downloadBtn";  // Adiciona um id ao botão para evitarmos duplicação
    downloadBtn.textContent = "Baixar Skin";

    // Gera o nome aleatório para o arquivo
    const randomHex = generateRandomHex();
    const imageUrl = `https://starlightskins.lunareclipse.studio/render/${renderType}/${playerName}/${renderCrop}`;
    skinImage.src = imageUrl;
    skinImage.onload = () => {
        // Cria o botão de download
        downloadBtn.onclick = () => {
            fetch(imageUrl)
                .then(response => response.blob()) // Baixa a imagem como blob
                .then(blob => {
                    // Cria um link temporário para fazer o download da imagem
                    const link = document.createElement("a");
                    link.href = URL.createObjectURL(blob);  // Cria um link com o blob
                    link.download = `${randomHex}.png`;  // Nome aleatório para o arquivo
                    link.click();  // Força o download
                })
                .catch(error => {
                    console.error('Erro ao baixar a skin:', error);
                });
        };

        // Adiciona o botão de download à página, logo abaixo da imagem, se ainda não estiver presente
        const skinDisplay = document.querySelector(".skin-display");
        if (!document.getElementById("downloadBtn")) {
            skinDisplay.appendChild(downloadBtn);
        }
    };
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
