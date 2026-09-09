---
id: comet-07-navegue-com-inteligencia
title: Comet — Navegue com inteligência (fechamento)
reference: https://www.perplexity.ai/comet
route: /comet
verification: inferred
date: 2026-09-09
source_of_truth:
  - src/app/comet/sections/ClosingCta.tsx
  - src/app/comet/sections/ClosingCta.module.css
---

# Comet — Navegue com inteligência (fechamento)

## Identidade

| Campo | Valor |
| --- | --- |
| Papel no fluxo | segundo CTA de download (F1, F2) |
| Entrada | rolagem após o FAQ |
| Saída | `/comet/download` |
| Viewport de referência | 1440 × ~440 |
| Tema | invertido: fundo `--fg`, texto `--bg` |

## Fórmula de design

### Tokens

| Token | Valor | Uso |
| --- | --- | --- |
| seção | padding 160 px (112 ≤ 820), margin-top `--section-gap`, fundo `--fg` | full-bleed |
| esferas | A `--accent` 44 vw ≤ 620 px · B `--orb-1` 30 vw ≤ 420 px, opacidade .8 | fundo em movimento |
| título | display `clamp(40px, 6vw, 80px)` | H2 |
| CTA | `.btn` invertido: fundo `--bg`, texto `--fg`, 52 px | “Baixar o Comet” |

### Grade e ritmo

| Propriedade | Valor |
| --- | --- |
| Alinhamento | centralizado, gap 28 px |

### Tipografia

| Papel | Família | Tamanho | Peso |
| --- | --- | --- | --- |
| H2 | `--font-display` | `clamp(40px, 6vw, 80px)` | 400 |
| CTA | `--font-body` | 17 px | 500 |

### Hierarquia

1. H2 claro sobre escuro.
2. CTA claro.
3. Esferas.

## Estrutura

| # | Seção | Componente | Conteúdo |
| --- | --- | --- | --- |
| 1 | Fundo | `.backdrop` | 2 esferas |
| 2 | Conteúdo | `.inner` | H2 + CTA |

## Copy (PT-BR)

| Original | Tradução | Observação |
| --- | --- | --- |
| Browse with intelligence | Navegue com inteligência | mesmo slogan do teaser de 2025 |
| Download Comet | Baixar o Comet | |

## Estados

| Estado | Comportamento |
| --- | --- |
| padrão | esferas derivam lentamente |
| hover CTA | fundo branco |
| reduced motion | esferas paradas |

## Fluxos

- **Entra por:** rolagem.
- **Sai para:** F1/F2.

## Movimento

| Elemento | Gatilho | Duração | Easing | Reduced motion |
| --- | --- | --- | --- | --- |
| esfera A / B | contínuo, alternado | 14 s / 18 s | ease-in-out | desligado |

## Acessibilidade

| Verificação | Resultado | Estado |
| --- | --- | --- |
| Contraste `--bg`/`--fg` | 17.52:1 | observed (computado) |
| Fundo | `aria-hidden` | observed |

## Evidência

| Fato | Estado | Fonte |
| --- | --- | --- |
| Título, CTA e destino | inferred | captura verbatim |
| Seção full-bleed com “video-hero” de fundo | inferred | galeria |
| Dois PNG 1080² após o bloco | inferred | captura (URLs) |
| Fundo escuro | not-verified | escolha local para representar o vídeo de fundo |

## Desvios conhecidos

- O vídeo de fundo da referência foi substituído por esferas em deriva sobre fundo escuro.

## Código (fonte da verdade)

<!-- code:start -->
### `src/app/comet/sections/ClosingCta.tsx`

```tsx
import shared from "../comet.module.css";
import styles from "./ClosingCta.module.css";
import { closing } from "../content";

/** "Navegue com inteligência": seção full-bleed com fundo em movimento e o mesmo CTA de download. */
export function ClosingCta() {
  return (
    <section className={styles.section} aria-labelledby="closing-title">
      <div className={styles.backdrop} aria-hidden="true">
        <span className={`${shared.orb} ${styles.orbA}`} />
        <span className={`${shared.orb} ${styles.orbB}`} />
      </div>
      <div className={`${shared.container} ${styles.inner}`}>
        <h2 id="closing-title" className={`${shared.display} ${styles.title}`}>{closing.heading.pt}</h2>
        <a href="/comet/download" className={`${shared.btn} ${styles.cta}`}>{closing.cta.pt}</a>
      </div>
    </section>
  );
}
```

### `src/app/comet/sections/ClosingCta.module.css`

```css
/* Fechamento — "video-hero" full-bleed na referência; aqui, fundo escuro com esferas em deriva lenta. */
.section { position: relative; margin-top: var(--section-gap); padding: 160px 0; background: var(--fg); color: var(--bg); overflow: clip; }
.backdrop { position: absolute; inset: 0; }
.orbA { --orb-color: var(--accent); width: 44vw; max-width: 620px; aspect-ratio: 1; left: -10%; top: -30%; opacity: 0.8; }
.orbB { --orb-color: var(--orb-1); width: 30vw; max-width: 420px; aspect-ratio: 1; right: -6%; bottom: -30%; opacity: 0.8; }
.inner { position: relative; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 28px; }
.title { font-size: clamp(40px, 6vw, 80px); }
.cta { background: var(--bg); color: var(--fg); min-height: 52px; padding: 0 26px; font-size: 17px; }
.cta:hover { background: #fff; }
@media (prefers-reduced-motion: no-preference) {
  .orbA, .orbB { animation: float 14s ease-in-out infinite alternate; }
  .orbB { animation-duration: 18s; }
  @keyframes float { to { translate: 4% 6%; } }
}
@media (max-width: 820px) { .section { padding: 112px 0; } }
```
<!-- code:end -->
