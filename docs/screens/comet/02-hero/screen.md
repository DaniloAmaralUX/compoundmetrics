---
id: comet-02-hero
title: Comet — hero
reference: https://www.perplexity.ai/comet
route: /comet#hero
verification: inferred
date: 2026-09-09
source_of_truth:
  - src/app/comet/sections/Hero.tsx
  - src/app/comet/sections/Hero.module.css
---

# Comet — hero

## Identidade

| Campo | Valor |
| --- | --- |
| Papel no fluxo | primeira dobra: proposta + CTA de download (F1, F2) |
| Entrada | topo de `/comet` |
| Saída | `/comet/download` |
| Viewport de referência | 1440 × 900 |
| Tema | claro |

## Fórmula de design

### Tokens

| Token | Valor | Uso |
| --- | --- | --- |
| padding-top | 96 px (64 px ≤ 820) | respiro acima do H1 |
| gap | 16 px | entre H1, H2, plataformas e CTA |
| CTA | `.btn` 52 px, padding 26 px, 17 px | “Baixar o Comet” |
| composição | `clamp(320px, 46vw, 640px)` de altura, margin-top 56 px | camadas em parallax |
| tela | 78 % da altura, ≤ 1040 px, raio 24 px em cima, gradiente `--surface-2 → --surface` | placeholder da captura 4464 × 2201 |
| esferas | A `--orb-1` 120–260 px · B `--orb-2` 90–190 px · C `--orb-3` 70–130 px | placeholders das 3 ilustrações 1080² |
| snippets | `.glass`, 160–300 px, linhas de 10 px | “UI snippets” citados na galeria |

### Grade e ritmo

| Propriedade | Valor |
| --- | --- |
| Alinhamento | centralizado (esquerda ≤ 820 px) |
| Largura do H1 | 14ch |
| Camadas | texto (z 2) → snippets (z 1) → esferas → tela |

### Tipografia

| Papel | Família | Tamanho | Peso | Entrelinha | Tracking |
| --- | --- | --- | --- | --- | --- |
| H1 | `--font-display` | `clamp(44px, 7vw, 96px)` | 400 | 1.02 | −0.02em |
| H2 | `--font-display` itálico | `clamp(24px, 3.2vw, 40px)` | 400 | 1.02 | −0.02em |
| Plataformas | `--font-body` | 15 px | 400 | 1.5 | 0 |

### Hierarquia

1. H1 “Um novo navegador da Perplexity”.
2. H2 “O navegador que trabalha por você”.
3. CTA.
4. Linha de plataformas.
5. Composição.

## Estrutura

| # | Seção | Componente | Conteúdo |
| --- | --- | --- | --- |
| 1 | Texto | `Hero.tsx` `.inner` | H1, H2, plataformas, CTA |
| 2 | Composição | `Hero.tsx` `.composition` | 3 esferas, 2 snippets, tela |

## Copy (PT-BR)

| Original | Tradução | Observação |
| --- | --- | --- |
| A new browser from Perplexity | Um novo navegador da Perplexity | |
| The browser that works for you | O navegador que trabalha por você | |
| Available for Mac, Windows, iOS, and Android | Disponível para Mac, Windows, iOS e Android | |
| Download Comet | Baixar o Comet | |

## Estados

| Estado | Comportamento |
| --- | --- |
| padrão | texto centralizado, composição abaixo |
| rolagem | esferas e snippets sobem em velocidades diferentes (parallax) |
| ≤ 820 px | texto alinhado à esquerda; composição encolhe |
| reduced motion | sem parallax |

## Fluxos

- **Entra por:** carga da página.
- **Sai para:** F1/F2 pelo CTA.

## Movimento

| Elemento | Gatilho | Duração | Easing | Reduced motion |
| --- | --- | --- | --- | --- |
| esfera A / B / C | rolagem 0–100vh | −60 / −110 / −30 px | linear (scroll-driven) | desligado |
| snippet A / B | rolagem 0–100vh | −80 / −40 px | linear | desligado |

## Acessibilidade

| Verificação | Resultado | Estado |
| --- | --- | --- |
| Composição | `aria-hidden` (decorativa) | observed |
| H1 computado | 96 px desktop · 44 px mobile, família PP Editorial New (fallback ativo) | observed (render local) |
| Contraste H2 `--fg-2`/`--bg` | 9.74:1 | observed (computado) |

## Evidência

| Fato | Estado | Fonte |
| --- | --- | --- |
| H1, H2, linha de plataformas, rótulo e destino do CTA | inferred | captura verbatim (2026-04) |
| Composição em camadas com snippets de UI e esferas em parallax | inferred | galeria |
| Um PNG 4464 × 2201 + um SVG + três PNG 1080² no hero | inferred | captura (URLs dos assets) |
| CTA “Watch Film” | not-verified | existia em versão anterior (Q1 2026) segundo fonte secundária; ausente na captura |
| Alinhamento central do texto | not-verified | escolha local |

## Desvios conhecidos

- Assets substituídos por placeholders (ver 00).
- O CTA vai para a tela 09 em vez do link inteligente.

## Código (fonte da verdade)

<!-- code:start -->
### `src/app/comet/sections/Hero.tsx`

```tsx
import shared from "../comet.module.css";
import styles from "./Hero.module.css";
import { hero } from "../content";

/** Hero: H1 + H2 + linha de plataformas + CTA, sobre uma composição com esferas em parallax. */
export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={`${shared.container} ${styles.inner}`}>
        <h1 id="hero-title" className={`${shared.display} ${styles.h1}`}>{hero.h1.pt}</h1>
        <h2 className={`${shared.display} ${styles.h2}`}>{hero.h2.pt}</h2>
        <p className={styles.platforms}>{hero.platforms.pt}</p>
        <a href="/comet/download" className={`${shared.btn} ${styles.cta}`}>{hero.cta.pt}</a>
      </div>
      <div className={styles.composition} aria-hidden="true">
        <span className={`${shared.orb} ${styles.orbA}`} />
        <span className={`${shared.orb} ${styles.orbB}`} />
        <span className={`${shared.orb} ${styles.orbC}`} />
        <div className={`${shared.glass} ${styles.snippet} ${styles.snippetA}`}><span /><span /></div>
        <div className={`${shared.glass} ${styles.snippet} ${styles.snippetB}`}><span /><span /><span /></div>
        <div className={styles.screen} />
      </div>
    </section>
  );
}
```

### `src/app/comet/sections/Hero.module.css`

```css
/* Hero — texto centralizado; composição em camadas com parallax (observado em galeria; valores inferidos). */
.hero { position: relative; padding: 96px 0 0; overflow: clip; }
.inner { position: relative; z-index: 2; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 16px; }
.h1 { font-size: clamp(44px, 7vw, 96px); max-width: 14ch; }
.h2 { font-size: clamp(24px, 3.2vw, 40px); color: var(--fg-2); font-style: italic; }
.platforms { margin: 8px 0 0; color: var(--fg-2); font-size: 15px; }
.cta { margin-top: 8px; min-height: 52px; padding: 0 26px; font-size: 17px; }
.composition { position: relative; height: clamp(320px, 46vw, 640px); margin-top: 56px; }
.screen { position: absolute; inset: auto 0 0; height: 78%; width: min(1040px, 100%); margin: 0 auto; border-radius: var(--radius-card) var(--radius-card) 0 0; background: linear-gradient(180deg, var(--surface-2), var(--surface)); border: 1px solid var(--line); border-bottom: 0; }
.orbA { --orb-color: var(--orb-1); width: clamp(120px, 18vw, 260px); aspect-ratio: 1; left: 6%; top: 4%; }
.orbB { --orb-color: var(--orb-2); width: clamp(90px, 13vw, 190px); aspect-ratio: 1; right: 10%; top: 0; }
.orbC { --orb-color: var(--orb-3); width: clamp(70px, 9vw, 130px); aspect-ratio: 1; right: 28%; bottom: 18%; }
.snippet { position: absolute; z-index: 1; display: grid; gap: 8px; padding: 14px; width: clamp(160px, 22vw, 300px); }
.snippet span { display: block; height: 10px; border-radius: 6px; background: var(--line); }
.snippet span:last-child { width: 60%; }
.snippetA { left: 12%; bottom: 24%; }
.snippetB { right: 8%; bottom: 36%; }
@supports (animation-timeline: scroll()) {
  @media (prefers-reduced-motion: no-preference) {
    .orbA, .orbB, .orbC, .snippetA, .snippetB { animation: drift 1ms linear both; animation-timeline: scroll(root); animation-range: 0 100vh; }
    .orbA { --drift: -60px; } .orbB { --drift: -110px; } .orbC { --drift: -30px; } .snippetA { --drift: -80px; } .snippetB { --drift: -40px; }
    @keyframes drift { to { translate: 0 var(--drift); } }
  }
}
@media (max-width: 820px) { .hero { padding-top: 64px; } .inner { align-items: flex-start; text-align: left; } .composition { margin-top: 40px; } }
```
<!-- code:end -->
