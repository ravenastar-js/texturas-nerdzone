const commands = [
    {
        id: 'on',
        command: '&f/on',
        description: '&fAtiva a visualização de players na &e/mina&f.'
    },
    {
        id: 'ajuda',
        command: '&f/ajuda',
        description: '&fExibe o menu de ajuda.'
    },
    {
        id: 'saque',
        command: '&f/saque',
        description: '&fVocê pode saquear cidades para conquistar recompensas valiosas como crates, lucky blocks e muito mais!\n&eAs recompensas vão para o &b/correios'
    },

    {
        id: 'correios',
        command: '&f/correios',
        description: '&fAs recompensas obtidas por meio do &e/saque&f, assim como aquelas adquiridas quando o presidente realiza compras, podem ser acessadas através do comando &e/correios&f.'
    },
    {
        id: 'votar',
        command: '&f/votar &6<jogador>',
        description: '&fVote em um jogador para escolhê-lo como presidente do servidor.\n&eVocê precisa ser nível 8 do /passe para votar.'
    },
    {
        id: 'lucky',
        command: '&f/lucky',
        description: '&fVeja as recompensas da LuckyBlcoks.'
    },
    {
        id: 'passe',
        command: '&f/passe',
        description: '&fO passe de batalha tem suas tarefas que podem ser concluídas para que você ganhe seus EXP e upe de nível para recolher suas diversas recompensas! '
    },
    {
        id: 'recompensas',
        command: '&f/recompensas',
        description: '&fVeja as recompensas das skins e alguns itens.'
    },
    {
        id: 'rankup',
        command: '&f/rankup',
        description: '&fEvolui para o próximo rank. Requer quantidade específica de &ecabeças de mobs e money&f.'
    },
    {
        id: 'ranks',
        command: '&f/ranks',
        description: '&fLista todos os ranks disponíveis com seus respectivos requisitos para evolução.'
    },
    {
        id: 'warps',
        command: '&f/warps',
        description: '&fAbre o menu de warps disponíveis no servidor.'
    },
    {
        id: 'warp-spawners',
        command: '&f/warp spawners',
        description: '&fFarm pública ideal para &einiciantes&f coletarem spawners e começarem a evoluir.'
    },
    {
        id: 'clan-ajuda',
        command: '&f/clan ajuda',
        description: '&fExibe o menu de ajuda específico para comandos de clan.'
    },
    {
        id: 'clan-criar',
        command: '&f/clan criar &6<nome> <tag>',
        description: '&fCria um novo clan com nome e tag personalizados.'
    },
    {
        id: 'clan-chat',
        command: '&f/clan chat &6<mensagem>&f ou &f/. &6<mensagem>',
        description: '&fEnvia mensagem no chat exclusivo do seu clan.'
    },
    {
        id: 'a',
        command: '&f/a &6<mensagem>',
        description: '&fEnvia mensagem no chat de &etodas as alianças&f do seu clan.'
    },
    {
        id: 'clan-deletar',
        command: '&f/clan deletar',
        description: '&fExclui permanentemente o seu clan (ação irreversível).'
    },
    {
        id: 'clan-convidar',
        command: '&f/clan convidar &6<jogador>',
        description: '&fConvida um jogador para entrar no seu clan.'
    },
    {
        id: 'clan-expulsar',
        command: '&f/clan expulsar &6<jogador>',
        description: '&fRemove um membro do seu clan.'
    },
    {
        id: 'clan-promover',
        command: '&f/clan promover &6<jogador> <cargo>',
        description: '&fAltera o cargo de um membro do clan (promoção).'
    },
    {
        id: 'clan-aceitar',
        command: '&f/clan aceitar &6<nome>',
        description: '&fAceita um convite para entrar em um clan.'
    },
    {
        id: 'clan-negar',
        command: '&f/clan negar &6<nome>',
        description: '&fRecusa um convite para entrar em um clan.'
    },
    {
        id: 'clan-ally-enviar',
        command: '&f/clan ally enviar &6<nome>',
        description: '&fEnvia solicitação de aliança para outro clan.'
    },
    {
        id: 'clan-ally-negar',
        command: '&f/clan ally negar &6<nome>',
        description: '&fRecusa uma solicitação de aliança de outro clan.'
    },
    {
        id: 'clan-ally-aceitar',
        command: '&f/clan ally aceitar &6<nome>',
        description: '&fAceita uma solicitação de aliança de outro clan.'
    },
    {
        id: 'clan-ally-remover',
        command: '&f/clan ally remover &6<nome>',
        description: '&fRompe a aliança com um clan.'
    },
    {
        id: 'clan-rival-adicionar',
        command: '&f/clan rival adicionar &6<nome>',
        description: '&fDeclara &eguerra&f contra um clan (adiciona como rival).'
    },
    {
        id: 'clan-rival-remover',
        command: '&f/clan rival remover &6<nome>',
        description: '&fEncerra a guerra contra um clan (remove dos rivais).'
    },
    {
        id: 'mina',
        command: '&f/mina',
        description: '&fTeleporta para as minas do servidor para coleta de recursos e &ePvP&f.'
    },
    {
        id: 'trocas',
        command: '&f/trocas',
        description: '&fAbre o menu de trocas de itens (cacau, cacto, cenouras, etc).'
    },
    {
        id: 'vantagens',
        command: '&f/vantagens',
        description: '&fMostra todas as vantagens e benefícios do seu rank atual.'
    },
    {
        id: 'fly',
        command: '&f/fly',
        description: '&fAtiva/desativa o modo voo (disponível apenas para &eVIPs&f).'
    },
    {
        id: 'compactar',
        command: '&f/compactar',
        description: '&fCompacta itens no inventário (ex: minérios → blocos) para economizar espaço.'
    },
    {
        id: 'skygrid',
        command: '&f/skygrid',
        description: '&fTeleporta para o mundo &eSkygrid&f com blocos flutuantes e recursos especiais.'
    },
    {
        id: 'bolsa',
        command: '&f/bolsa',
        description: '&fAcessa a bolsa de valores para negociar recursos e acompanhar cotações.'
    },
    {
        id: 'pesca',
        command: '&f/pesca',
        description: '&fAcessa o minigame de pesca com recompensas exclusivas.'
    },
    {
        id: 'skills',
        command: '&f/skills',
        description: '&fAbre o menu de habilidades para gerenciar upgrades e ver progresso.'
    },
    {
        id: 'skills-p',
        command: '&f/skills &6<jogador>',
        description: '&fVerifica os níveis de skills de outro jogador.'
    },
    {
        id: 'kit',
        command: '&f/kit',
        description: '&fAbre o menu de kits disponíveis para seu rank (respeita cooldowns).'
    },
    {
        id: 'site',
        command: '&f/site',
        description: '&fExibe o link do site oficial do servidor.'
    },
    {
        id: 'toggletell',
        command: '&f/toggletell',
        description: '&fAtiva/desativa o recebimento de mensagens privadas (tell).'
    },
    {
        id: 'home',
        command: '&f/home &6<nome>',
        description: '&fTeleporta para uma das suas homes salvas.'
    },
    {
        id: 'homes',
        command: '&f/homes',
        description: '&fLista todas as homes que você possui.'
    },
    {
        id: 'moneypay',
        command: '&f/money pay &6<nick> <valor>',
        description: '&fTransfere money para outro jogador.'
    },
    {
        id: 'sethome',
        command: '&f/sethome &6<nome>',
        description: '&fCria uma nova home na sua plot local.'
    },
    {
        id: 'delhome',
        command: '&f/delhome &6<nome>',
        description: '&fDeleta uma home existente.'
    },
    {
        id: 'lixeira',
        command: '&f/lixeira',
        description: '&fAbre a lixeira virtual para descartar itens indesejados.'
    },
    {
        id: 'redstone',
        command: '&f/redstone',
        description: '&fAcessa comandos especiais relacionados a &eredstone&f.'
    },
    {
        id: 'xp',
        command: '&f/xp &6<quantidade>',
        description: '&fConverte XP em frascos para armazenamento ou troca.'
    },
    {
        id: 'plot-add',
        command: '&f/plot add &6<nick>',
        description: '&fAdiciona jogador à plot com permissões &ebásicas&f (apenas online).'
    },
    {
        id: "plot-remove",
        command: "&f/plot remove &6<nick>",
        description: "&fRemove um jogador da sua plot."
    },
    {
        id: 'plot-deny',
        command: '&f/plot deny &6<nick>',
        description: '&fBloqueia um jogador de entrar na sua plot.'
    },
    {
        id: 'plot-deny2',
        command: '&f/plot deny *',
        description: '&fBloqueia &etodos os jogadores&f de entrar na sua plot (exceto você).'
    },
    {
        id: 'plot-undeny',
        command: '&f/plot undeny &6<nick>',
        description: '&fRemove o bloqueio de um jogador na sua plot.'
    },
    {
        id: 'plot-undeny2',
        command: '&f/plot undeny *',
        description: '&fPermite que &etodos os jogadores&f entrem na sua plot.'
    },
    {
        id: 'plot-sethome',
        command: '&f/plot sethome',
        description: '&fDefine o ponto de spawn da sua plot.'
    },
    {
        id: 'plot-dispose',
        command: '&f/plot dispose',
        description: '&fInicia processo para &edeletar a plot&f (use &e/plot confirm&f para confirmar).'
    },
    {
        id: 'plot-music',
        command: '&f/plot music',
        description: '&fConfigura músicas e sons na sua plot.'
    },
    {
        id: 'venderfarm',
        command: '&f/venderfarm',
        description: '&fAbre menu de venda rápido dentro da &e/warp farm&f.'
    },
    {
        id: 'tempovip',
        command: '&f/tempovip',
        description: '&fVerifica o tempo restante do seu VIP.'
    },
    {
        id: 'leilao-anunciar',
        command: '&f/leilao anunciar &6<valor>',
        description: '&fAnuncia item no leilão com preço mínimo especificado.'
    },
    {
        id: 'plot-trust',
        command: '&f/plot trust &6<nick>',
        description: '&fAdiciona jogador com permissões &ecompletas&f na plot (funciona offline).'
    },
    {
        id: 'plot-alias',
        command: '&f/plot alias set &6<nome>',
        description: '&fDefine um nome personalizado para sua plot.'
    },
    {
        id: 'plot-auto',
        command: '&f/plot auto',
        description: '&fObtém automaticamente uma plot disponível em local aleatório.'
    },
    {
        id: 'plot-claim',
        command: '&f/plot claim',
        description: '&fReivindica uma plot sem dono onde você está.'
    },
    {
        id: 'plot-home',
        command: '&f/plot home &6<nome>',
        description: '&fTeleporta para a plot de um jogador. Para plots específicas: &e/p h:2 <nome>&f.'
    },
    {
        id: 'pot',
        command: '&f/pot',
        description: '&fAgrupa poções soltas em stacks.'
    },
    {
        id: 'pref',
        command: '&f/pref',
        description: '&fAbre menu de preferências: chat, transferências, vendas automáticas, etc.'
    },
    {
        id: 'heads',
        command: '&f/heads',
        description: '&fAgrupa cabeças de mobs em stacks.'
    },
    {
        id: 'warp-farm',
        command: '&f/warp farm',
        description: '&fFarm pública para vender plantações conforme oscilações da bolsa.'
    },
    {
        id: 'verkit',
        command: '&f/verkit &6<nome>',
        description: '&fVisualiza os itens de um kit específico. Ex: &e/verkit creeper&f.'
    },
    {
        id: 'changepass',
        command: '&f/changepass &6<senha-antiga> <senha-nova>',
        description: '&fAltera a senha da sua conta (requer confirmação).'
    },
    {
        id: 'vercaixa',
        command: '&f/vercaixa &6<caixa>',
        description: '&fVisualiza as recompensas possíveis de uma caixa antes de abrir.'
    }
];