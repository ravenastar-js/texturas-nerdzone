const infoBtn = document.getElementById('infoBtn');
const infoModal = document.getElementById('infoModal');
const closeModalBtn = document.getElementById('closeModalBtn');

infoBtn.onclick = () => infoModal.style.display = "block";
closeModalBtn.onclick = closeModal;

window.onclick = (event) => {
    if (event.target === infoModal) closeModal();
}

function closeModal() {
    infoModal.style.display = "none";
    pauseAndResetModalVideo();
}

function pauseAndResetModalVideo() {
    const modalIframe = infoModal.querySelector('iframe');
    if (modalIframe) modalIframe.src = modalIframe.src;
}