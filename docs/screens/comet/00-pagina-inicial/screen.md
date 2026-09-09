---
id: comet-00-pagina-inicial
title: Comet — página inicial (composição)
reference: https://www.perplexity.ai/comet
route: /comet
verification: inferred
date: 2026-09-09
source_of_truth:
  - src/app/comet/page.tsx
  - src/app/comet/comet.module.css
  - src/app/comet/content.ts
---

# Comet — página inicial (composição)

Esta tela é a composição da página: a ordem das seções, os tokens compartilhados e o dicionário de copy. Cada seção tem seu próprio `screen.md` (01 a 08); o splash mobile (10) é montado aqui.

## Identidade

| Campo | Valor |
| --- | --- |
| Papel no fluxo | Ponto de entrada de todos os fluxos (F1–F6 em `FLOWS.md`) |
| Entrada | URL direta, busca, redes sociais |
| Saída | `/comet/download` (F1, F2), central de recursos (F3), `x.com/comet` (F6) |
| Viewport de referência | 1440 × 900 (desktop) · 390 × 844 (mobile) |
| Tema | claro (fundo off-white, texto quase preto) — único; a referência não tem tema escuro |

## Fórmula de design

### Tokens

| Token | Valor | Uso | Estado |
| --- | --- | --- | --- |
| `--bg` | `#fbfaf4` | fundo da página | inferred (galeria) |
| `--fg` | `#091717` | texto, botão primário, fundo do fechamento | inferred (galeria) |
| `--fg-2` | `#3b4151` | texto secundário | inferred (galeria) |
| `--surface` | `#e4e3d4` | superfícies sutis, marca grande do rodapé | inferred (galeria) |
| `--surface-2` | `#f2f1e8` | placeholders de captura, botão-ícone | derivado (entre `--bg` e `--surface`) |
| `--line` | `rgba(9,23,23,.10)` | bordas | derivado |
| `--accent` | `#20808d` | foco, esfera do fechamento | not-verified (teal Perplexity citado em fontes secundárias; hex não confirmado) |
| `--glass` / `--glass-line` | `rgba(251,250,244,.62)` / `rgba(255,255,255,.55)` | cartões “glassmorphism” | inferred (galeria descreve o efeito; valores locais) |
| `--orb-1/2/3` | `#f3b9a1` `#9ac7c8` `#d9c7ee` | esferas abstratas no lugar das ilustrações 3D | local (assets indisponíveis) |
| `--font-display` | PP Editorial New → Georgia | títulos | inferred (Fonts In Use) |
| `--font-body` | FK Grotesk → Geist Sans → system-ui | corpo e UI | inferred (Fonts In Use) |
| `--font-mono` | Berkeley Mono → Geist Mono | rótulos, chips | inferred (Fonts In Use) |
| `--container` | `1200px` | largura do conteúdo | inferred |
| `--gutter` | `24px` (20 px ≤ 820) | margem lateral | inferred |
| `--section-gap` | `128px` (88 px ≤ 820) | ritmo entre seções (“airy”) | inferred (galeria) |
| `--radius-card` / `--radius-pill` | `24px` / `999px` | cartões / botões | inferred (galeria: cantos arredondados em cartões, botões e contêineres) |
| `--ease` | `cubic-bezier(.2,.7,.1,1)` | transições | local |

### Grade e ritmo

| Propriedade | Valor |
| --- | --- |
| Largura máxima do conteúdo | 1200 px, centralizada |
| Colunas | fluidas por seção (1 col no hero; 2 col em 04 e 06; trilho horizontal em 03 e 05) |
| Gutter | 24 px · 20 px abaixo de 820 px |
| Espaçamento entre seções | 128 px · 88 px abaixo de 820 px |
| Breakpoints | 1100 px (trilho de 3 cartões) · 820 px (empilha, splash mobile) · 560 px (cabeçalho compacto) |

### Tipografia

| Papel | Família | Tamanho | Peso | Entrelinha | Tracking |
| --- | --- | --- | --- | --- | --- |
| Display (H1/H2 de seção) | `--font-display` | `clamp(36px, 5vw, 64px)` a `clamp(44px, 7vw, 96px)` | 400 | 1.02 | −0.02em |
| Lead | `--font-body` | `clamp(17px, 1.6vw, 20px)` | 400 | 1.5 | 0 |
| Corpo | `--font-body` | 17 px (16 px ≤ 820) | 400 | 1.5 | 0 |
| Botão | `--font-body` | 16–18 px | 500 | 1 | 0 |
| Rótulo mono | `--font-mono` | 12–14 px | 500 | 1.2 | +0.08em |

### Hierarquia

1. H1 serifado do hero.
2. CTA “Baixar o Comet” (preto sobre off-white; repetido no cabeçalho e no fechamento).
3. Títulos serifados de cada seção.
4. Cartões e mídia; copy secundária em `--fg-2`.

## Estrutura

| # | Seção | Componente | Conteúdo |
| --- | --- | --- | --- |
| 1 | Cabeçalho (fixo) | `sections/Header.tsx` | marca + CTA + botão-ícone |
| 2 | Hero | `sections/Hero.tsx` | H1, H2, plataformas, CTA, composição em parallax |
| 3 | Faça qualquer coisa com o Comet | `sections/DoAnything.tsx` | 5 cartões 1:1 |
| 4 | Ponte para a central de recursos | `sections/ResourceBridge.tsx` | 2 linhas, CTA, link |
| 5 | Seu assistente pessoal | `sections/PersonalAssistant.tsx` | título, parágrafo, vídeo, 10 tiles |
| 6 | Perguntas frequentes | `sections/Faq.tsx` | 7 perguntas em acordeão |
| 7 | Navegue com inteligência | `sections/ClosingCta.tsx` | título + CTA sobre fundo escuro |
| 8 | Rodapé | `sections/Footer.tsx` | “Siga o Comet” + marca grande |
| 9 | Splash mobile | `MobileSplash.tsx` | interstitial fixo ≤ 820 px |

## Copy (PT-BR)

O dicionário completo está em `src/app/comet/content.ts` (campo `original` = verbatim da captura; `reconstructed: true` = sem original conhecido). Metadados da página:

| Original | Tradução | Observação |
| --- | --- | --- |
| Comet Browser: a Personal AI Assistant | Comet: Browser: Assistente de IA pessoal | título da rota `/comet/pt` da própria referência, visto em resultado de busca (inferred) |
| The browser that works for you. | O navegador que trabalha por você. | meta description |

## Estados

| Estado | Comportamento |
| --- | --- |
| padrão | todas as seções renderizadas estaticamente (export estático, sem dados remotos) |
| carregando | não há dados assíncronos; fontes proprietárias ausentes caem no fallback sem layout shift perceptível (métricas próximas) |
| erro | nenhum caminho de erro; links externos abrem a referência |
| offline | página estática continua navegável; vídeo e links externos falham silenciosamente |
| reduced motion | parallax, revelação e deriva desligados (`prefers-reduced-motion`) |
| ≤ 820 px | seções empilham; splash mobile aparece se o cookie de dispensa não existir |

## Fluxos

- **Entra por:** URL direta.
- **Sai para:** F1/F2 (`/comet/download`), F3 (central de recursos), F6 (`x.com/comet`); F4 e F5 ficam na página.

## Movimento

| Elemento | Gatilho | Duração | Easing | Reduced motion |
| --- | --- | --- | --- | --- |
| Composição do hero | rolagem (0–100vh) | ligada ao scroll | linear | desligado |
| Cartões e vídeo (`.reveal`) | entrada na viewport (0–35 %) | ligada ao scroll | linear | desligado |
| Esferas do fechamento | contínuo | 14 s / 18 s alternado | ease-in-out | desligado |
| Botões | hover | 160 ms | `--ease` | mantido (não é movimento essencial) |

## Acessibilidade

| Verificação | Resultado | Estado |
| --- | --- | --- |
| Ordem de foco | marca → CTA → ícone → CTA hero → links da ponte → vídeo → 7 perguntas → CTA final → “Siga o Comet” → splash (só mobile) | observed (render local, Chromium) |
| Contraste `--fg`/`--bg` | 17.52:1 | observed (computado) |
| Contraste `--fg-2`/`--bg` | 9.74:1 | observed (computado) |
| Contraste `--accent`/`--bg` (anel de foco) | 4.43:1 | observed (computado) — AA para componentes (≥ 3:1) |
| Marca grande do rodapé `--surface`/`--bg` | 1.24:1 | decorativa, `aria-hidden` |
| Reflow a 390 px | sem rolagem horizontal (`scrollWidth` = `clientWidth`) | observed (render local) |
| `lang` | `pt-BR` no contêiner da página; o `<html>` do site continua `en` | observed |

## Evidência

| Fato | Estado | Fonte |
| --- | --- | --- |
| Ordem das seções | inferred | `evidencia/captura-2026-04-web-clipper.md` (captura verbatim de terceiro) |
| Copy original de hero, cartões, ponte, assistente, FAQ, fechamento, rodapé | inferred | mesma captura |
| Paleta e tema claro | inferred | `evidencia/galeria-2026-08-lapa-ninja.md` |
| Famílias tipográficas | inferred | Fonts In Use “Comet” (trecho de busca) |
| Parallax, sticky, revelação, glassmorphism, vídeo full-bleed | inferred | galeria |
| Largura do contêiner, breakpoints, tamanhos exatos | not-verified | escolha local; precisa de CSS computado da referência |
| Links legais do rodapé, seletor de idioma, itens do cabeçalho | not-verified | `[desconhecido]` em todas as fontes |

## Desvios conhecidos

- **Assets** (composição do hero, 5 capturas 1052², vídeo, 10 tiles, SVG do rodapé) não puderam ser baixados: substituídos por esferas em gradiente, placeholders de captura e um player sem fonte, com aviso visível.
- **Fontes proprietárias** (PP Editorial New, FK Grotesk, Berkeley Mono) não são distribuídas: pilhas de fallback declaradas nos tokens.
- **Link de download** aponta para `/comet/download` (tela 09) em vez do link inteligente da referência, para que a detecção de plataforma seja visível e reversível.
- **`<html lang>`** permanece `en` (layout raiz do site); a página declara `lang="pt-BR"` no seu contêiner.
- **Cabeçalho**: “?” como botão-ícone é um palpite (o ícone real é desconhecido).

## Código (fonte da verdade)

<!-- code:start -->
### `src/app/comet/page.tsx`

```tsx
import type { Metadata } from "next";
import shared from "./comet.module.css";
import { Header } from "./sections/Header";
import { Hero } from "./sections/Hero";
import { DoAnything } from "./sections/DoAnything";
import { ResourceBridge } from "./sections/ResourceBridge";
import { PersonalAssistant } from "./sections/PersonalAssistant";
import { Faq } from "./sections/Faq";
import { ClosingCta } from "./sections/ClosingCta";
import { Footer } from "./sections/Footer";
import { MobileSplash } from "./MobileSplash";

export const metadata: Metadata = {
  title: { absolute: "Comet: Browser: Assistente de IA pessoal" },
  description: "O navegador que trabalha por você.",
  robots: { index: false, follow: false },
};

/**
 * Página inicial do Comet em PT-BR. Ordem das seções = ordem observada na captura da referência:
 * cabeçalho → hero → "Faça qualquer coisa" → ponte de recursos → assistente pessoal → FAQ → fechamento → rodapé.
 */
export default function CometPage() {
  return (
    <div className={shared.page} lang="pt-BR">
      <Header />
      <main>
        <Hero />
        <DoAnything />
        <ResourceBridge />
        <PersonalAssistant />
        <Faq />
        <ClosingCta />
      </main>
      <Footer />
      <MobileSplash />
    </div>
  );
}
```

### `src/app/comet/comet.module.css`

```css
/*
 * Comet (PT-BR) — tokens e primitivos compartilhados por todas as seções.
 * Fonte da verdade do design: este arquivo + o .module.css de cada seção.
 * Referência: https://www.perplexity.ai/comet (tema claro, serifa editorial nos títulos).
 */
.page {
  /* cor — paleta observada em galeria de design (inferred); teal Perplexity (not-verified) */
  --bg: #fbfaf4;
  --fg: #091717;
  --fg-2: #3b4151;
  --surface: #e4e3d4;
  --surface-2: #f2f1e8;
  --line: rgba(9, 23, 23, 0.10);
  --accent: #20808d;
  --accent-ink: #fbfaf4;
  --glass: rgba(251, 250, 244, 0.62);
  --glass-line: rgba(255, 255, 255, 0.55);
  /* esferas abstratas (placeholder das ilustrações 3D) */
  --orb-1: #f3b9a1;
  --orb-2: #9ac7c8;
  --orb-3: #d9c7ee;
  /* tipografia — famílias proprietárias da referência com fallback local */
  --font-display: "PP Editorial New", "Editorial New", "Iowan Old Style", "Palatino Linotype", Georgia, serif;
  --font-body: "FK Grotesk", "FK Grotesk Neue", var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif;
  --font-mono: "Berkeley Mono", var(--font-geist-mono), ui-monospace, monospace;
  /* grade e ritmo */
  --container: 1200px;
  --gutter: 24px;
  --section-gap: 128px;
  --radius-card: 24px;
  --radius-pill: 999px;
  --ease: cubic-bezier(0.2, 0.7, 0.1, 1);

  color-scheme: light;
  min-height: 100vh;
  background: var(--bg);
  color: var(--fg);
  font-family: var(--font-body);
  font-size: 17px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  overflow-x: clip;
}
.page * { box-sizing: border-box; }
.page ::selection { background: var(--fg); color: var(--bg); }

.container { width: min(var(--container), calc(100% - 2 * var(--gutter))); margin: 0 auto; }

.display { font-family: var(--font-display); font-weight: 400; letter-spacing: -0.02em; line-height: 1.02; text-wrap: balance; margin: 0; }
.eyebrow { font: 500 12px/1.2 var(--font-mono); letter-spacing: 0.08em; text-transform: uppercase; color: var(--fg-2); }
.lead { margin: 0; color: var(--fg-2); font-size: clamp(17px, 1.6vw, 20px); line-height: 1.5; max-width: 60ch; }

.btn {
  display: inline-flex; align-items: center; gap: 10px;
  min-height: 48px; padding: 0 22px;
  border-radius: var(--radius-pill); border: 1px solid transparent;
  background: var(--fg); color: var(--bg);
  font: 500 16px/1 var(--font-body); text-decoration: none; cursor: pointer;
  transition: transform 160ms var(--ease), background-color 160ms var(--ease);
}
.btn:hover { background: #142626; transform: translateY(-1px); }
.btn:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
.btnGhost { background: transparent; color: var(--fg); border-color: var(--line); }
.btnGhost:hover { background: var(--surface-2); }
.btnAccent { background: var(--accent); color: var(--accent-ink); }
.btnAccent:hover { background: #1a6c78; }

/* esfera abstrata — substitui as ilustrações 3D da referência (assets não disponíveis) */
.orb {
  position: absolute; border-radius: 50%; pointer-events: none;
  background: radial-gradient(circle at 30% 30%, #fff8 0, transparent 40%), radial-gradient(circle at 50% 50%, var(--orb-color, var(--orb-2)), color-mix(in oklab, var(--orb-color, var(--orb-2)) 60%, var(--fg)) 100%);
  box-shadow: 0 30px 60px -30px rgba(9, 23, 23, 0.35);
}

/* cartão "glassmorphism" da referência */
.glass {
  background: var(--glass); border: 1px solid var(--glass-line);
  backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
  border-radius: 16px;
}

/* revelação ao rolar — fade-in/slide-up (motion observado em galeria) */
.reveal { opacity: 1; transform: none; }
@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    .reveal { animation: reveal 1ms linear both; animation-timeline: view(); animation-range: entry 0% entry 35%; }
    @keyframes reveal { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }
  }
}

.srOnly { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }

@media (max-width: 820px) {
  .page { --section-gap: 88px; --gutter: 20px; font-size: 16px; }
}
```

### `src/app/comet/content.ts`

```ts
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
```
<!-- code:end -->
