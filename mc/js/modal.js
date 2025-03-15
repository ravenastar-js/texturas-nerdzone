const infoBtn = document.getElementById('infoBtn');
const infoModal = document.getElementById('infoModal');
const closeModalBtn = document.getElementById('closeModalBtn');

// Abre o modal ao clicar no botão de "info"
infoBtn.addEventListener('click', () => {
    infoModal.style.display = "block";
});

// Fecha o modal ao clicar no botão de fechar
closeModalBtn.addEventListener('click', closeModal);

// Fecha o modal ao clicar fora dele
window.addEventListener('click', (event) => {
    if (event.target === infoModal) {
        closeModal();
    }
});

// Função para fechar o modal e reiniciar o vídeo
function closeModal() {
    infoModal.style.display = "none";
    pauseAndResetModalVideo();
}

// Função para pausar e reiniciar o vídeo do modal
function pauseAndResetModalVideo() {
    const modalIframe = infoModal.querySelector('iframe');
    if (modalIframe) {
        modalIframe.src = modalIframe.src; // Reinicia o vídeo
    }
}