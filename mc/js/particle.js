document.addEventListener("DOMContentLoaded", () => {
    const levelUpSound = new Audio("https://texturas-nerdzone.pages.dev/mc/sounds/level-up.mp3");
    levelUpSound.volume = 0.5;

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
        }, 1000);
    }

    function triggerLevelUpAnimation() {
        setTimeout(() => {
            levelUpSound.currentTime = 0;
            levelUpSound.play().catch(error => {});
        }, 100);

        for (let i = 0; i < 50; i++) {
            setTimeout(spawnXPParticle, i * 30);
        }

        setTimeout(() => {
            levelUpSound.pause();
            levelUpSound.currentTime = 0;
        }, 3000);
    }

    triggerLevelUpAnimation();
});
