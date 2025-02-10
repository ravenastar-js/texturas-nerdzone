document.addEventListener("DOMContentLoaded", () => {
    const levelUpSound = new Audio("https://texturas-nerdzone.pages.dev/sounds/level_up.mp3"); // Certifique-se de que o caminho está correto
    levelUpSound.volume = 1.0;
    
    function spawnXPParticle() {
        const particle = document.createElement("img");
        particle.src = "mc/imgs/xp.gif";
        particle.classList.add("xp-particle");
        
        document.body.appendChild(particle);
        
        const startX = Math.random() * window.innerWidth;
        const startY = Math.random() * window.innerHeight;
        
        particle.style.position = "fixed";
        particle.style.left = `${startX}px`;
        particle.style.top = `${startY}px`;
        particle.style.width = "20px";
        particle.style.height = "20px";
        particle.style.pointerEvents = "none";
        
        particle.animate([
            { transform: "translateY(0px)", opacity: 1 },
            { transform: "translateY(-50px)", opacity: 0 }
        ], {
            duration: 1000 + Math.random() * 1000,
            easing: "ease-out"
        });
        
        setTimeout(() => {
            particle.remove();
        }, 2000);
    }
    
    function triggerLevelUpAnimation() {
        setTimeout(() => {
            levelUpSound.currentTime = 0; // Reinicia o áudio
            levelUpSound.play().catch(error => {
                console.error("Erro ao tentar reproduzir o áudio:", error);
            });
        }, 100); // Pequeno atraso para evitar bloqueios do navegador
        
        for (let i = 0; i < 50; i++) {
            setTimeout(spawnXPParticle, i * 30);
        }
        
        // Parar o som após a animação
        setTimeout(() => {
            levelUpSound.pause();
            levelUpSound.currentTime = 0;
        }, 3000); // Tempo correspondente à duração total da animação
    }
    
    // Chama a animação automaticamente ao carregar a página
    triggerLevelUpAnimation();
    
    // Permite chamar manualmente se necessário
    window.triggerLevelUpAnimation = triggerLevelUpAnimation;
});
