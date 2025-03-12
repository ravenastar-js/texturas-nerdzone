function copyLink(fieldId, button) {
    const linkField = document.getElementById(fieldId);
    linkField.select();
    linkField.setSelectionRange(0, 99999); // Para dispositivos móveis
    navigator.clipboard.writeText("https://"+linkField.value)
        .then(() => {
            button.classList.add('show-tooltip');
            setTimeout(() => {
                button.classList.remove('show-tooltip');
            }, 2000); // Tooltip visível por 2 segundos
        })
        .catch(err => {
            console.error('Erro ao copiar o link: ', err);
        });
}

function copyToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
}