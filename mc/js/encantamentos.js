/**
 * 🪄 Script para controlar o modal de encantamentos da mineração
 */
document.addEventListener('DOMContentLoaded', function () {
    const enchantments = [
        {
            name: "Aurora",
            icon: "fas fa-sun",
            description: "O encantamento Aurora quando ativado, você recebe um bônus de skills (multiplicador) por X segundos.",
            details: "O tempo e a chance de ativar varia de acordo com o nível, quanto maior o nível, maior o tempo e a chance.",
            color: "mc-blue-alt",
            colorst: "rare"
        },
        {
            name: "Cristalizador",
            icon: "fas fa-gem",
            description: "O encantamento Cristalizador quando ativado você recebe 1 aura.",
            details: "Quanto maior o nível, maior a chance de ativar.",
            color: "mc-light-purple",
            colorst: "epic"
        },
        {
            name: "Martelo Titânico",
            icon: "fas fa-hammer",
            description: "O encantamento Martelo Titânico quando ativado você quebra uma linha de blocos na frente do bloco quebrado.",
            details: "Quanto maior o nível, maior a linha afetada.",
            color: "mc-gray",
            colorst: "common"
        },
        {
            name: "Corrida da Sorte",
            icon: "fas fa-clover",
            description: "O encantamento Corrida da Sorte quando ativado você recebe um multiplicador de todos os drops minerados por X segundos.",
            details: "Quanto maior o nível, maior o tempo e a chance.",
            color: "mc-green",
            colorst: "uncommon"
        }
    ];

    const colorStyles = {
        common: {
            border: "1px solid #AAAAAA",
            background: "linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)",
            glow: "0 0 5px rgba(170, 170, 170, 0.3)"
        },
        uncommon: {
            border: "1px solid #55FF55",
            background: "linear-gradient(135deg, #1a2a1a 0%, #2a3a2a 100%)",
            glow: "0 0 8px rgba(85, 255, 85, 0.4)"
        },
        df: {
            border: "1px solid #48bb78",
            background: "linear-gradient(45deg, transparent, rgba(72, 187, 120, 0.1), transparent)",
            glow: "0 0 8px #48bb78"
        },
        rare: {
            border: "1px solid #85b6ffff",
            background: "linear-gradient(135deg, #1a232aff 0%, #2a323aff 100%)",
            glow: "0 0 10px rgba(85, 150, 255, 0.5)"
        },
        epic: {
            border: "1px solid #AA00AA",
            background: "linear-gradient(135deg, #2a1a2a 0%, #3a2a3a 100%)",
            glow: "0 0 12px rgba(170, 0, 170, 0.6)"
        },
        legendary: {
            border: "1px solid #FFAA00",
            background: "linear-gradient(135deg, #2a2a1a 0%, #3a3a2a 100%)",
            glow: "0 0 15px rgba(255, 170, 0, 0.7)"
        }
    };

    const openModalBtn = document.getElementById('open-encantamentos-modal');
    const closeModalBtns = [
        document.getElementById('close-encantamentos-modal'),
        document.getElementById('close-encantamentos-modal-2')
    ];
    const modal = document.getElementById('encantamentos-modal');
    const modalBody = document.querySelector('.modal-body-encantamentos');

    if (!openModalBtn || !modal || !modalBody) {
        return;
    }

    function generateEnchantments() {
        modalBody.innerHTML = '';

        enchantments.forEach(enchantment => {
            const card = document.createElement('div');
            card.className = 'encantamento-card';

            const style = colorStyles[enchantment.colorst] || colorStyles.common;

            card.style.border = style.border;
            card.style.background = style.background;
            card.style.boxShadow = style.glow;

            card.innerHTML = `
                <div class="encantamento-card-content">
                    <i class="${enchantment.icon} encantamento-icon ${enchantment.color}"></i>
                    <div class="encantamento-text">
                        <div class="encantamento-title ${enchantment.color}">
                            ${enchantment.name}
                        </div>
                        <div class="encantamento-description">
                            ${enchantment.description}
                        </div>
                        <div class="encantamento-detail">
                            ${enchantment.details}
                        </div>
                    </div>
                </div>
            `;

            modalBody.appendChild(card);
        });
    }


    function addcolorStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .colorst-badge {
                font-size: 0.7em;
                padding: 2px 8px;
                border-radius: 12px;
                margin-left: 8px;
                font-weight: bold;
                text-transform: uppercase;
                border: 1px solid;
            }
            
            .colorst-badge.common {
                background: #333333;
                color: #AAAAAA;
                border-color: #AAAAAA;
            }
            
            .colorst-badge.uncommon {
                background: #1a331a;
                color: #55FF55;
                border-color: #55FF55;
            }
            
            .colorst-badge.rare {
                background: #1a1a33;
                color: #55a1ffff;
                border-color: #55a1ffff;
            }
            
            .colorst-badge.epic {
                background: #331a33;
                color: #AA00AA;
                border-color: #AA00AA;
            }
            
            .colorst-badge.legendary {
                background: #332a1a;
                color: #FFAA00;
                border-color: #FFAA00;
            }
            

        `;
        document.head.appendChild(style);
    }

    addcolorStyles();
    generateEnchantments();

    openModalBtn.addEventListener('click', function (e) {
        modal.classList.remove('hidden');
        modal.classList.add('open');
        modal.style.display = 'flex';
        modal.style.visibility = 'visible';
        modal.style.opacity = '1';

        document.body.style.overflow = 'hidden';
    });

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

    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.classList.contains('open')) {
            closeModal();
        }
    });

    window.encantamentosData = enchantments;
});