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

function fetchSkin() {
    const playerName = document.getElementById("playerName").value.trim();
    const renderType = document.getElementById("renderType").value;
    const renderCrop = document.getElementById("renderCrop").value;

    if (!playerName) {
        alert("Please enter a player name.");
        return;
    }

    document.getElementById("skinImage").src = `https://starlightskins.lunareclipse.studio/render/${renderType}/${playerName}/${renderCrop}`;
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
