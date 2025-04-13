     // Color mapping and parsing functions
     const colorMap = (() => {
        const baseColors = {
            '§0': 'mc-black',
            '§1': 'mc-dark-blue',
            '§2': 'mc-dark-green',
            '§3': 'mc-dark-aqua',
            '§4': 'mc-dark-red',
            '§5': 'mc-dark-purple',
            '§6': 'mc-gold',
            '§7': 'mc-gray',
            '§8': 'mc-dark-gray',
            '§9': 'mc-blue',
            '§a': 'mc-green',
            '§b': 'mc-aqua',
            '§c': 'mc-red',
            '§d': 'mc-light-purple',
            '§e': 'mc-yellow',
            '§f': 'mc-white'
        };

        // Create versions with & for the same map
        const extendedColors = {};
        for (const [key, value] of Object.entries(baseColors)) {
            extendedColors[key] = value;
            extendedColors['&' + key[1]] = value;
        }

        return extendedColors;
    })();

    function parseMCString(text) {
        if (!text) return '';

        // Primeiro substituímos os colchetes por HTML entities
        const withEntities = text.replace(/</g, '&lt;').replace(/>/g, '&gt;');

        // Depois aplicamos as cores
        const result = withEntities
            .replace(/[§&][0-9a-f]/g, match => {
                const normalizedKey = '§' + match[1];
                return `</span><span class="${colorMap[normalizedKey] || ''}">`;
            })
            .replace(/<\/span>/g, '', 1) + '</span>';

        return result.replace(/<span class=""><\/span>/g, '');
    }

    // Command data
    const commands = [
        {
            id: 'rankup',
            command: '&f/rankup',
            description: '&fSubir de rank no servidor. Requer alguns requisitos como quantidade de cabeças de mobs e money.'
        },
        {
            id: 'ranks',
            command: '&f/ranks',
            description: '&fVisualiza a lista de ranks disponíveis no servidor com seus respectivos requisitos para evolução.'
        },
        {
            id: 'warps',
            command: '&f/warps',
            description: '&fAcessa o menu de warps disponíveis no servidor.'
        },
        {
            id: 'mina',
            command: '&f/mina',
            description: '&fAcesse as minas do servidor, onde você pode coletar recursos e enfrentar outros jogadores na mina PvP.'
        },
        {
            id: 'vantagens',
            command: '&f/vantagens',
            description: '&fVisualiza todas as vantagens e benefícios do seu rank atual no servidor.'
        },
        {
            id: 'fly',
            command: '&f/fly',
            description: '&fAtive ou desative o modo de voo, acessível apenas para VIPs.'
        },
        {
            id: 'compactar',
            command: '&f/compactar',
            description: '&fCompacta itens em seu inventário para economizar espaço (ex: transforma minérios em blocos).'
        },
        {
            id: 'vendas',
            command: '&f/vendas',
            description: '&fAcessa o menu de vendas do servidor para comprar ou vender itens.'
        },
        {
            id: 'skygrid',
            command: '&f/skygrid',
            description: '&fTeleporte-se para o mundo Skygrid e colete recursos em um mundo de blocos flutuantes.'
        },
        {
            id: 'bolsa',
            command: '&f/bolsa',
            description: '&fAcessa a bolsa de valores do servidor para acompanhar e negociar recursos.'
        },
        {
            id: 'pesca',
            command: '&f/pesca',
            description: '&fAcessa o minigame de pesca do servidor para ganhar recompensas especiais.'
        },
        {
            id: 'skills',
            command: '&f/skills',
            description: '&fVisualiza e gerencia suas habilidades no servidor, incluindo progresso e upgrades.'
        },
        {
            id: 'kit',
            command: '&f/kit',
            description: '&fAcessa os kits disponíveis para seu rank e os resgata conforme os cooldowns.'
        },
        {
            id: 'site',
            command: '&f/site',
            description: '&fMostra o link do site oficial do servidor para mais informações.'
        },
        {
            id: 'home',
            command: '&f/home',
            description: '&fTeleporta-se para sua casa principal definida no servidor.'
        },
        {
            id: 'lixeira',
            command: '&f/lixeira',
            description: '&fAbre uma lixeira virtual para descartar itens indesejados.'
        },
        {
            id: 'redstone',
            command: '&f/redstone',
            description: '&fAcessa os comandos especiais relacionados a redstone no servidor.'
        },
        {
            id: 'xp',
            command: '&f/xp &6<quantidade>',
            description: '&fConverte seu XP acumulado em frascos de XP para armazenamento ou troca.'
        },
        {
            id: 'plotadd',
            command: '&f/plot add &6<nick>',
            description: '&fAdiciona um jogador à sua plot com permissões limitadas (apenas enquanto você estiver online).'
        },
        {
            id: 'plottrust',
            command: '&f/plot trust &6<nick>',
            description: '&fAdiciona um jogador à sua plot com permissões completas (funciona mesmo quando você estiver offline).'
        },
        {
            id: 'plotalias',
            command: '&f/plot alias set &6<nome>',
            description: '&fDefine um apelido personalizado para sua plot.'
        },
        {
            id: 'plotauto',
            command: '&f/plot auto',
            description: '&fObtém automaticamente uma plot disponível em localização aleatória.'
        },
        {
            id: 'changepass',
            command: '&f/changepass &6<senha-antiga> &6<senha-nova>',
            description: '&fAltera a senha da sua conta no servidor (requer senha antiga e nova).'
        },
        {
            id: 'vercaixa',
            command: '&f/vercaixa &6<caixa>',
            description: '&fVisualiza o conteúdo de uma caixa antes de abri-la para ver as possíveis recompensas.'
        }
    ];
    
    // DOM elements
    const commandsContainer = document.getElementById('commands-container');
    const searchInput = document.getElementById('search');
    const modal = document.getElementById('modal');
    const modalCommand = document.getElementById('modal-command');
    const modalDescription = document.getElementById('modal-description');
    const closeModalBtn = document.getElementById('close-modal');
    const captureBtn = document.getElementById('capture-btn');
    const captureArea = document.getElementById('capture-area');

    // Render commands
    function renderCommands(filter = '') {
        commandsContainer.innerHTML = '';

        const filteredCommands = commands.filter(cmd =>
            cmd.command.toLowerCase().includes(filter.toLowerCase()) ||
            cmd.description.toLowerCase().includes(filter.toLowerCase())
        );

        if (filteredCommands.length === 0) {
            commandsContainer.innerHTML = `
                <div class="col-span-full text-center py-8 mc-gray">
                    <i class="fas fa-search-minus text-5xl mb-4 block"></i>
                    <p class="text-xl">Nenhum comando encontrado para "${filter}"</p>
                    <p class="text-sm mt-2">Tente usar termos diferentes</p>
                </div>
            `;
            return;
        }

        filteredCommands.forEach((cmd, index) => {
            const commandElement = document.createElement('div');
            commandElement.className = `command-card rounded-lg transition-all duration-300 animate-fade-in delay-${index}`;

            // Parse the command with colors
            const parsedCommand = parseMCString(cmd.command);
            const parsedDescription = parseMCString(cmd.description);

            commandElement.innerHTML = `
                <div class="p-5 cursor-pointer command-header">
                    <div class="flex justify-between items-start">
                        <div class="flex-1 command-text">
                            <h3 class="text-xl font-bold mb-2">${parsedCommand}</h3>
                        </div>
                        <div class="tooltip-container">
                            <button class="info-btn ml-2 p-1 text-gray-400 hover:text-yellow-400 transition-colors duration-300" data-id="${cmd.id}">
                                <i class="fas fa-info-circle text-xl"></i>
                            </button>
                            <span class="tooltip">Mais detalhes</span>
                        </div>
                    </div>
                </div>
                <div class="command-drawer">
                    <div class="command-drawer-content p-4">
                        <p class="text-gray-300 mb-3 command-text">${parsedDescription}</p>
                        <div class="flex justify-between items-center text-sm mc-gray">
                            <span class="bg-gray-800 px-2 py-1 rounded flex items-center gap-1">
                                  <span class="text-white">ID:</span>
                                  <span class="text-yellow-400 font-mono">${cmd.id}</span>
                            </span>
                            <div class="tooltip-container">
                                <button class="copy-btn px-3 py-1 bg-gray-700 text-white hover:bg-gray-600 rounded text-xs" data-command="${cmd.command.replace(/&[0-9a-f]/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>')}">
                                    <i class="fas fa-copy mr-1"></i>Copiar comando
                                </button>
                                <span class="tooltip">Copiar para área de transferência</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Add click event to toggle drawer when clicking anywhere on the card
            commandElement.addEventListener('click', (e) => {
                // Don't toggle if clicking on buttons or tooltips
                if (e.target.closest('.info-btn') ||
                    e.target.closest('.copy-btn') ||
                    e.target.closest('.tooltip')) {
                    return;
                }

                const drawer = commandElement.querySelector('.command-drawer');
                drawer.classList.toggle('open');

                // Close other open drawers
                document.querySelectorAll('.command-drawer').forEach(d => {
                    if (d !== drawer && d.classList.contains('open')) {
                        d.classList.remove('open');
                    }
                });
            });

            // Add event listener to info button
            const infoBtn = commandElement.querySelector('.info-btn');
            infoBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                openModal(cmd.id);
            });

            // Add event listener to copy button
            const copyBtn = commandElement.querySelector('.copy-btn');
            if (copyBtn) {
                copyBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const commandText = copyBtn.getAttribute('data-command');
                    navigator.clipboard.writeText(commandText);

                    // Feedback visual
                    const originalText = copyBtn.innerHTML;
                    copyBtn.innerHTML = '<i class="fas fa-check mr-1"></i>Copiado!';
                    copyBtn.classList.remove('bg-gray-700', 'hover:bg-gray-600');
                    copyBtn.classList.add('bg-green-600', 'hover:bg-green-700');

                    setTimeout(() => {
                        copyBtn.innerHTML = originalText;
                        copyBtn.classList.remove('bg-green-600', 'hover:bg-green-700');
                        copyBtn.classList.add('bg-gray-700', 'hover:bg-gray-600');
                    }, 2000);
                });
            }

            commandsContainer.appendChild(commandElement);
        });

        // Configurar posicionamento dos tooltips
        setupTooltipPositioning();
    }

    // Configurar posicionamento inteligente dos tooltips
    function setupTooltipPositioning() {
        document.querySelectorAll('.tooltip-container').forEach(container => {
            const tooltip = container.querySelector('.tooltip');

            container.addEventListener('mouseenter', function () {
                const containerRect = container.getBoundingClientRect();
                const tooltipRect = tooltip.getBoundingClientRect();

                // Reset position
                tooltip.classList.remove('bottom');

                // Verificar se o tooltip caberia acima do elemento
                if (containerRect.top - tooltipRect.height < 10) { // 10px de margem
                    tooltip.classList.add('bottom');
                }
            });
        });
    }

    // Open modal with command info
    function openModal(cmdId) {
        const command = commands.find(cmd => cmd.id === cmdId);
        if (!command) return;

        // Update URL
        history.pushState(null, null, `?m=${cmdId}`);

        // Parse the command with colors
        const parsedCommand = parseMCString(command.command);
        const parsedDescription = parseMCString(command.description);

        // Set modal content
        modalCommand.innerHTML = parsedCommand;
        modalDescription.innerHTML = parsedDescription;

        // Show modal
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    // Close modal
    function closeModal() {
        modal.classList.remove('open');
        history.pushState(null, null, window.location.pathname);
        document.body.style.overflow = '';
    }

    // Capture modal as PNG
    function captureModal() {
        // Add a small delay to ensure everything is rendered
        setTimeout(() => {
            // Add temporary class for capture
            captureArea.classList.add('capturing');

            html2canvas(captureArea, {
                backgroundColor: null,
                scale: 2,
                logging: false,
                useCORS: true,
                allowTaint: true,
                windowWidth: captureArea.scrollWidth,
                windowHeight: captureArea.scrollHeight
            }).then(canvas => {
                const link = document.createElement('a');
                const commandId = new URLSearchParams(window.location.search).get('m') || 'command';
                link.download = `comando-${commandId}-${new Date().toISOString().slice(0, commands.length)}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();

                // Remove temporary class
                captureArea.classList.remove('capturing');
            });
        }, 100);
    }

    // Check URL for modal parameter on load
    function checkUrlForModal() {
        const params = new URLSearchParams(window.location.search);
        const cmdId = params.get('m');
        if (cmdId) {
            openModal(cmdId);
        }
    }

    // Event listeners
    searchInput.addEventListener('input', (e) => {
        renderCommands(e.target.value);
    });

    closeModalBtn.addEventListener('click', closeModal);
    captureBtn.addEventListener('click', captureModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('open')) {
            closeModal();
        }
    });

    // Initialize
    renderCommands();
    checkUrlForModal();

    // Add animation delay styles dynamically
    const style = document.createElement('style');
    for (let i = 0; i < commands.length; i++) {
        style.innerHTML += `
            .delay-${i} {
                animation-delay: ${i * 0.1}s;
            }
        `;
    }
    style.innerHTML += `
        .capturing {
            box-shadow: 0 0 0 2px #48bb78;
        }
    `;
    document.head.appendChild(style);