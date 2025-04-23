const commands = [
    {
        id: 'ajuda',
        command: '&f/ajuda',
        description: '&fConfira o tutorial do servidor.'
    },
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
        id: 'warp-spawners',
        command: '&f/warp spawners',
        description: '&fÉ iniciante no servidor? Acesse a farm pública e comece a subir seu rank!'
    },
    {
        id: 'clan-criar',
        command: '&f/clan criar &6<nome> <tag>',
        description: '&fCrie o seu clan utilizando este comando.'
    },
    {
        id: 'clan-chat',
        command: '&f/clan chat &6<mensagem>',
        description: '&fEnvie uma mensagem no chat do clan.'
    },
    {
        id: 'a',
        command: '&f/a &6<mensagem>',
        description: '&fEnvie uma mensagem no chat de todas alianças do clan.'
    },
    {
        id: 'clan-deletar',
        command: '&f/clan deletar',
        description: '&fExclua o seu clan ao utilizar este comando.'
    },
    {
        id: 'clan-convidar',
        command: '&f/clan convidar &6<jogador>',
        description: '&fConvide alguém para o seu clan ao utilizar este comando.'
    },
    {
        id: 'clan-expulsar',
        command: '&f/clan expulsar &6<jogador>',
        description: '&fExpulse alguém do seu clan ao utilizar este comando.'
    },
    {
        id: 'clan-promover',
        command: '&f/clan promover &6<jogador> <cargo>',
        description: '&fPromove um jogador do clan.'
    },
    {
        id: 'clan-aceitar',
        command: '&f/clan aceitar &6<nome>',
        description: '&fAceitar um convite de um clan.'
    },
    {
        id: 'clan-negar',
        command: '&f/clan negar &6<nome>',
        description: '&fNegar um convite de um clan.'
    },
    {
        id: 'clan-ally-enviar',
        command: '&f/clan ally enviar &6<nome>',
        description: '&fEnvia um pedido de aliança para um clan.'
    },
    {
        id: 'clan-ally-negar',
        command: '&f/clan ally negar &6<nome>',
        description: '&fNega um pedido de aliança de um clan.'
    },
    {
        id: 'clan-ally-aceitar',
        command: '&f/clan ally aceitar &6<nome>',
        description: '&fAceita um pedido de aliança de um clan.'
    },
    {
        id: 'clan-ally-remover',
        command: '&f/clan ally remover &6<nome>',
        description: '&fRemove uma aliança com um clan.'
    },
    {
        id: 'clan-rival-adicionar',
        command: '&f/clan rival adicionar &6<nome>',
        description: '&fDeclara guerra contra um clan.'
    },
    {
        id: 'clan-rival-remover',
        command: '&f/clan rival remover &6<nome>',
        description: '&fEncerra a guerra contra um clan.'
    },
    {
        id: 'mina',
        command: '&f/mina',
        description: '&fAcesse as minas do servidor, onde você pode coletar recursos e enfrentar outros jogadores na mina PvP.'
    },
    {
        id: 'trocas',
        command: '&f/trocas',
        description: '&fTroque itens no servidor, como cacau, cacto, cenouras, entre outros.'
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
        description: '&fMostra o tempo do booster de vendas.'
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
        id: 'skills-verbooster',
        command: '&f/skills verbooster',
        description: '&fVer booster de xp ativo e o tempo restante.'
    },
    {
        id: 'skills-vernivel',
        command: '&f/skills vernivel',
        description: '&fVer booster de nível ativo e o tempo restante.'
    },
    {
        id: 'skills-p',
        command: '&f/skills &6<jogador>',
        description: '&fPara ver os níveis de outro jogador!'
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
        id: 'toggletell',
        command: '&f/toggletell',
        description: '&fDesativa/ativa o tell.'
    },
    {
        id: 'home',
        command: '&f/home &6<nome>',
        description: '&fTeleporta-se para sua home.'
    },
    {
        id: 'homes',
        command: '&f/homes',
        description: '&fVejas suas homes.'
    },
    {
        id: 'moneypay',
        command: '&f/money pay &6<nick> <valor>',
        description: '&fEnvie money para outros jogadores.'
    },
    {
        id: 'sethome',
        command: '&f/sethome &6<nome>',
        description: '&fCrie uma home personalizada em sua plot com um nome customizado.'
    },
    {
        id: 'delhome',
        command: '&f/delhome &6<nome>',
        description: '&fDeletar sua home.'
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
        id: 'plot-add',
        command: '&f/plot add &6<nick>',
        description: '&fAdiciona um jogador à sua plot com permissões limitadas (apenas enquanto você estiver online).'
    },
    {
        id: "plot-remove",
        command: "&f/plot remove &6<nick>",
        description: "&fRemove um jogador que você adicionou em sua plot."
    },
    {
        id: 'plot-deny',
        command: '&f/plot deny &6<nick>',
        description: '&fImpedir que o player entre em sua plot.'
    },
    {
        id: 'plot-deny2',
        command: '&f/plot deny * &6<seu nick>',
        description: '&fImpedir que TODOS os players entrem em sua plot, exceto você.'
    },
    {
        id: 'plot-undeny',
        command: '&f/plot undeny &6<nick>',
        description: '&fPermitir que o player entre em sua plot.'
    },
    {
        id: 'plot-undeny2',
        command: '&f/plot undeny * &6<seu nick>',
        description: '&fPermitir que todos os players consigam entrar em sua plot.'
    },
    {
        id: 'plot-sethome',
        command: '&f/plot sethome',
        description: '&fDefina onde será o local de spawn da sua plot.'
    },
    {
        id: 'plot-dispose',
        command: '&f/plot dispose',
        description: '&fUse este comando para deletar uma plot: é necessário estar dentro da plot que deseja excluir e, logo em seguida, usar &e/plot confirm&f.'
    },
    {
        id: 'venderfarm',
        command: '&f/venderfarm',
        description: '&fUse este comando dentro do &e/warp farm&f, para facilitar a abertura do menu de venda.'
    },
    {
        id: 'tempovip',
        command: '&f/tempovip',
        description: '&fUse este comando para verificar o tempo do seu VIP.'
    },
    {
        id: 'leilao-anunciar',
        command: '&f/leilao anunciar &6<valor>',
        description: '&fPara negociar seus itens com outros jogadores.'
    },
    {
        id: 'warp-reciclar',
        command: '&f/warp reciclar',
        description: '&fCaso não utilize seus spawners antigos, você pode reciclá-los...'
    },
    {
        id: 'plot-trust',
        command: '&f/plot trust &6<nick>',
        description: '&fAdiciona um jogador à sua plot com permissões completas (funciona mesmo quando você estiver offline).'
    },
    {
        id: 'plot-alias',
        command: '&f/plot alias set &6<nome>',
        description: '&fDefine um apelido personalizado para sua plot.'
    },
    {
        id: 'plot-auto',
        command: '&f/plot auto',
        description: '&fObtém automaticamente uma plot disponível em localização aleatória.'
    },
    {
        id: 'plot-claim',
        command: '&f/plot claim',
        description: '&fVá em uma plot sem dono e obtenha-a.'
    },
    {
        id: 'plot-home',
        command: '&f/plot home &6<nome>',
        description: '&fVá para a plot de um jogador. Se o jogador possuir várias plots e desejar ir para uma específica, utilize &e/p h:2 <nome>&f.'
    },
    {
        id: 'pot',
        command: '&f/pot',
        description: '&fPara agrupar suas poções!'
    },
    {
        id: 'pref',
        command: '&f/pref',
        description: '&fPara ativar/desativar preferências, como: chat local, chat global, transferências, vendas com a tecla Shift, vendas automáticas e outros. &eAs preferências de venda requerem nível de mineração.'
    },
    {
        id: 'heads',
        command: '&f/heads',
        description: '&fPara stackar cabeça de mobs.'
    },
    {
        id: 'warp-farm',
        command: '&f/warp farm',
        description: '&fAproveite as altas da bolsa para vender suas plantações!'
    },
    {
        id: 'verkit',
        command: '&f/verkit &6<nome>',
        description: '&fVeja o que há no kit de cada rank. Exemplo: &e/verkit creeper.'
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
