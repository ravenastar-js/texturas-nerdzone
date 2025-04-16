document.addEventListener('DOMContentLoaded', function() {
    const tipTextElement = document.getElementById('tip-text');
    const tipIcon = document.querySelector('.tip-icon');
    const tips = [
        "&fVocê pode digitar &6[item] &fpara mostrar os detalhes do seu item no chat!",
        "&fPara o jogador ir à sua plot apenas clicando no chat, basta digitar &6[plot] &f."
    ];

    let currentTipIndex = 0;
    const tipDuration = 8000; // 8 segundos
    let isTransitioning = false;

    function showTip() {
        if (isTransitioning) return;
        isTransitioning = true;

        // Anima o ícone
        tipIcon.classList.add('wave');
        setTimeout(() => tipIcon.classList.remove('wave'), 800);

        // Efeito de saída sofisticado
        tipTextElement.classList.remove('elegant-fade-in', 'text-glowing');
        tipTextElement.classList.add('elegant-fade-out');

        setTimeout(() => {
            currentTipIndex = (currentTipIndex + 1) % tips.length;
            const newTip = tips[currentTipIndex];
            const parsedTip = parseMCString(newTip);

            // Pré-carrega o texto antes da animação de entrada
            tipTextElement.innerHTML = parsedTip;
            
            // Força reflow para reiniciar a animação
            void tipTextElement.offsetWidth;

            // Efeito de entrada com atraso entre palavras
            tipTextElement.classList.remove('elegant-fade-out');
            tipTextElement.classList.add('elegant-fade-in', 'text-glowing');
            
            // Ativa a animação de letras individuais
            animateLetters(tipTextElement);
            
            isTransitioning = false;
        }, 600); // tempo da animação de saída
    }

    function animateLetters(element) {
        const letters = element.querySelectorAll('span');
        letters.forEach((letter, index) => {
            // Reset antes de animar
            letter.style.animation = 'none';
            void letter.offsetWidth; // força reflow
            
            // Animação com atraso progressivo
            letter.style.animation = `letterPop 0.6s ease ${index * 0.05}s forwards`;
        });
    }

    // Initial tip
    tipTextElement.innerHTML = parseMCString(tips[0]);
    animateLetters(tipTextElement);
    
    // Start the tip rotation
    setInterval(showTip, tipDuration);
    

});