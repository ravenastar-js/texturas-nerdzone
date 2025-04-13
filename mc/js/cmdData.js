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
        id: 'skillsverbooster',
        command: '&f/skills verbooster',
        description: '&fVer booster de xp ativo e o tempo restante.'
    },
    {
        id: 'skillsvernivel',
        command: '&f/skills vernivel',
        description: '&fVer booster de nível ativo e o tempo restante.'
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