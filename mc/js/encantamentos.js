/**
 * 🪄 Script para controlar o modal de encantamentos da mineração
 */
document.addEventListener('DOMContentLoaded', function () {
    const openModalBtn = document.getElementById('open-encantamentos-modal');
    const closeModalBtns = [
        document.getElementById('close-encantamentos-modal'),
        document.getElementById('close-encantamentos-modal-2')
    ];
    const modal = document.getElementById('encantamentos-modal');

    // Verificar se os elementos existem
    if (!openModalBtn) {
        return;
    }

    if (!modal) {
        return;
    }


    // Abrir modal
    openModalBtn.addEventListener('click', function (e) {
        // Remover todas as classes que podem estar escondendo o modal
        modal.classList.remove('hidden');

        // Adicionar classe open para mostrar
        modal.classList.add('open');

        // Forçar display flex diretamente no estilo
        modal.style.display = 'flex';
        modal.style.visibility = 'visible';
        modal.style.opacity = '1';

        document.body.style.overflow = 'hidden';
    });

    // Fechar modal
    function closeModal() {
        modal.classList.remove('open');
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }

    closeModalBtns.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', closeModal);
        }
    });

    // Fechar modal ao clicar fora
    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Fechar modal com a tecla ESC
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.classList.contains('open')) {
            closeModal();
        }
    });
});