/**
 * Conteúdo da página Comet em PT-BR.
 * `original` é o texto verbatim da referência (captura de 2026-04); `pt` é a tradução.
 * Strings sem original conhecido são marcadas `reconstructed: true`.
 */
export const DOWNLOAD_URL = "https://perplexity.sng.link/Bot2p/kkat?_smtype=3";
export const RESOURCES_URL = "https://www.perplexity.ai/comet/resources";
export const APP_STORE_URL = "https://apps.apple.com/app/id6748622471";
export const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=ai.perplexity.comet";
export const FOLLOW_URL = "https://x.com/comet";

export const hero = {
  h1: { original: "A new browser from Perplexity", pt: "Um novo navegador da Perplexity" },
  h2: { original: "The browser that works for you", pt: "O navegador que trabalha por você" },
  platforms: { original: "Available for Mac, Windows, iOS, and Android", pt: "Disponível para Mac, Windows, iOS e Android" },
  cta: { original: "Download Comet", pt: "Baixar o Comet" },
};

export const doAnything = {
  heading: { original: "Do anything with Comet", pt: "Faça qualquer coisa com o Comet" },
  cards: [
    { id: "understands", label: { original: "AI that understands", pt: "IA que entende" }, prompt: { original: "How are different news outlets covering this differently?", pt: "Como diferentes veículos de imprensa estão cobrindo isso de formas diferentes?" }, orb: "var(--orb-2)" },
    { id: "builds", label: { original: "AI that builds", pt: "IA que constrói" }, chip: { original: "Pause Comet Assistant", pt: "Pausar o Assistente Comet" }, prompt: { original: "Build a basic website for me using the best website generator tool", pt: "Crie um site básico para mim usando a melhor ferramenta de geração de sites" }, orb: "var(--orb-1)" },
    { id: "emails", label: { original: "AI that emails", pt: "IA que responde e-mails" }, prompt: { original: "Draft a reply that shares my upcoming schedule", pt: "Rascunhe uma resposta compartilhando minha agenda dos próximos dias" }, orb: "var(--orb-3)" },
    { id: "creates", label: { original: "AI that creates", pt: "IA que cria" }, prompt: { original: "Create a study plan given this syllabus for the next week to help me on my test", pt: "Crie um plano de estudos para a próxima semana com base nesta ementa para me ajudar na prova" }, orb: "var(--orb-2)" },
    { id: "shops", label: { original: "AI that shops", pt: "IA que compra" }, prompt: { original: "Buy a high quality, comfortable yet cheap office chair", pt: "Compre uma cadeira de escritório de alta qualidade, confortável e barata" }, orb: "var(--orb-1)" },
  ],
};

export const resourceBridge = {
  line1: { original: "Explore more ways to use Comet.", pt: "Explore mais formas de usar o Comet." },
  line2: { original: "Browse smarter, faster, and with less friction.", pt: "Navegue de forma mais inteligente, mais rápida e com menos atrito." },
  cta: { original: "Ways to Use Comet", pt: "Formas de usar o Comet" },
  hubLink: { original: "Comet Resource Hub", pt: "Central de recursos do Comet" },
};

export const personalAssistant = {
  heading: { original: "Your personal assistant", pt: "Seu assistente pessoal" },
  body: {
    original: "What can Comet do? Discover everything that can be delegated, from wrangling inboxes to ordering groceries, staying on top of finances to planning vacations.",
    pt: "O que o Comet pode fazer? Descubra tudo o que pode ser delegado: de organizar caixas de entrada a pedir compras de mercado, de acompanhar as finanças a planejar férias.",
  },
  videoLabel: { pt: "Vídeo: o Comet como assistente pessoal", reconstructed: true },
  videoMissing: { pt: "arquivo da referência não disponível nesta cópia", reconstructed: true },
  tiles: [
    { pt: "Caixa de entrada", reconstructed: true }, { pt: "Compras de mercado", reconstructed: true }, { pt: "Finanças", reconstructed: true }, { pt: "Férias", reconstructed: true }, { pt: "Agenda", reconstructed: true },
    { pt: "Pesquisa", reconstructed: true }, { pt: "Abas", reconstructed: true }, { pt: "Resumos", reconstructed: true }, { pt: "Formulários", reconstructed: true }, { pt: "Reservas", reconstructed: true },
  ],
};

export const faq = {
  heading: { original: "FAQ", pt: "Perguntas frequentes" },
  items: [
    { q: { original: "What platforms is Comet available on?", pt: "Em quais plataformas o Comet está disponível?" }, a: { pt: "Mac (macOS 11 Big Sur ou superior), Windows (10 ou superior), iOS (18 ou superior) e Android (12 ou superior).", reconstructed: true } },
    { q: { original: "How do I install Comet?", pt: "Como instalo o Comet?" }, a: { pt: "Clique em “Baixar o Comet”. No Mac, abra o arquivo .dmg e arraste o Comet para a pasta Aplicativos. No Windows, execute o instalador. No celular, o link abre a App Store ou o Google Play.", reconstructed: true } },
    { q: { original: "What search engine does Comet use?", pt: "Qual mecanismo de busca o Comet usa?" }, a: { pt: "O Comet usa a Perplexity como mecanismo de busca padrão. Você pode trocar nas configurações do navegador.", reconstructed: true } },
    { q: { original: "Is Comet free?", pt: "O Comet é gratuito?" }, a: { pt: "Sim. Baixar e usar o Comet é gratuito. Recursos adicionais do assistente podem depender do seu plano Perplexity.", reconstructed: true } },
    { q: { original: "How do I make Comet my default browser?", pt: "Como torno o Comet meu navegador padrão?" }, a: { pt: "Na primeira abertura o Comet oferece essa opção. Depois, vá em Configurações › Navegador padrão e confirme no sistema operacional.", reconstructed: true } },
    { q: { original: "How do I control privacy settings?", pt: "Como controlo as configurações de privacidade?" }, a: { pt: "Em Configurações › Privacidade e segurança você controla cookies, permissões de site, dados de navegação e o que o assistente pode acessar.", reconstructed: true } },
    { q: { original: "How do I browse safely with Comet?", pt: "Como navego com segurança no Comet?" }, a: { pt: "O Comet inclui bloqueio de rastreadores e navegação segura. Revise as permissões que concede ao assistente e mantenha o navegador atualizado.", reconstructed: true } },
  ],
};

export const closing = {
  heading: { original: "Browse with intelligence", pt: "Navegue com inteligência" },
  cta: { original: "Download Comet", pt: "Baixar o Comet" },
};

export const footer = {
  follow: { original: "Follow Comet", pt: "Siga o Comet" },
};

export const header = {
  brand: { pt: "Comet", reconstructed: true },
  cta: { original: "Download Comet", pt: "Baixar o Comet" },
  menu: { pt: "Menu", reconstructed: true },
};

export const mobileSplash = {
  title: { pt: "Comet no seu celular", reconstructed: true },
  body: { pt: "Baixe o app para navegar com o assistente onde estiver.", reconstructed: true },
  cta: { pt: "Abrir na loja", reconstructed: true },
  dismiss: { pt: "Continuar no site", reconstructed: true },
};

export const download = {
  title: { pt: "Baixar o Comet", reconstructed: true },
  detecting: { pt: "Detectando seu sistema…", reconstructed: true },
  detected: { pt: "Detectamos", reconstructed: true },
  other: { pt: "Outras plataformas", reconstructed: true },
  platforms: {
    mac: { pt: "Baixar para Mac", reconstructed: true },
    windows: { pt: "Baixar para Windows", reconstructed: true },
    ios: { pt: "Abrir na App Store", reconstructed: true },
    android: { pt: "Abrir no Google Play", reconstructed: true },
  },
  unknown: { pt: "Não conseguimos detectar seu sistema. Escolha uma plataforma abaixo.", reconstructed: true },
};
