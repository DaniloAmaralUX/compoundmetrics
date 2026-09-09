---
id: comet-08-siga-o-comet
title: Comet — rodapé · Siga o Comet
reference: https://www.perplexity.ai/comet
route: /comet
verification: inferred
date: 2026-09-09
source_of_truth:
  - src/app/comet/sections/Footer.tsx
  - src/app/comet/sections/Footer.module.css
---

# Comet — rodapé · Siga o Comet

## Identidade

| Campo | Valor |
| --- | --- |
| Papel no fluxo | saída social (F6) e assinatura visual |
| Entrada | fim de `/comet` e `/comet/download` |
| Saída | `x.com/comet` |
| Viewport de referência | 1440 × ~500 |
| Tema | claro |

## Fórmula de design

### Tokens

| Token | Valor | Uso |
| --- | --- | --- |
| padding | 96 px em cima, 40 px embaixo | rodapé |
| link | 18 px, peso 500, borda inferior `--line` | “Siga o Comet →” |
| marca | display `clamp(96px, 22vw, 320px)`, entrelinha .85, cor `--surface` | placeholder do SVG 1154 × 1118 |

### Grade e ritmo

| Propriedade | Valor |
| --- | --- |
| Disposição | coluna, gap 40 px |

### Tipografia

| Papel | Família | Tamanho | Peso |
| --- | --- | --- | --- |
| Link | `--font-body` | 18 px | 500 |
| Marca | `--font-display` | até 320 px | 400 |

### Hierarquia

1. Marca grande (baixo contraste, decorativa).
2. Link.

## Estrutura

| # | Seção | Componente | Conteúdo |
| --- | --- | --- | --- |
| 1 | Link | `.follow` | “Siga o Comet →” |
| 2 | Marca | `.wordmark` | “Comet” em serifa gigante |

## Copy (PT-BR)

| Original | Tradução | Observação |
| --- | --- | --- |
| Follow Comet | Siga o Comet | |
| [desconhecido] | — | links legais, copyright e seletor de idioma não foram capturados e **não foram inventados** |

## Estados

| Estado | Comportamento |
| --- | --- |
| padrão | link + marca |
| hover link | borda escurece |

## Fluxos

- **Entra por:** fim da página.
- **Sai para:** F6 (`x.com/comet`).

## Movimento

| Elemento | Gatilho | Duração | Easing | Reduced motion |
| --- | --- | --- | --- | --- |
| nenhum | — | — | — | — |

## Acessibilidade

| Verificação | Resultado | Estado |
| --- | --- | --- |
| Marca | `aria-hidden`, `user-select: none` | observed |
| Contraste marca `--surface`/`--bg` | 1.24:1 — aceitável só porque é decorativa | observed (computado) |
| Link | nome “Siga o Comet →” | observed |

## Evidência

| Fato | Estado | Fonte |
| --- | --- | --- |
| Heading “Follow Comet” seguido de um SVG grande | inferred | captura verbatim |
| Destino `x.com/comet` | inferred | conta oficial do produto vista em resultado de busca |
| Links legais / rodapé global da Perplexity | not-verified | nenhuma fonte capturou; clipper remove rodapés |

## Desvios conhecidos

- SVG substituído pela palavra “Comet” em serifa.
- Rodapé legal omitido por falta de evidência.

## Código (fonte da verdade)

<!-- code:start -->
### `src/app/comet/sections/Footer.tsx`

```tsx
import shared from "../comet.module.css";
import styles from "./Footer.module.css";
import { FOLLOW_URL, footer } from "../content";

/** Rodapé: "Siga o Comet" + marca grande. Links legais da referência são desconhecidos e não foram inventados. */
export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`${shared.container} ${styles.inner}`}>
        <a href={FOLLOW_URL} className={styles.follow} rel="noopener">{footer.follow.pt} →</a>
        <div className={styles.wordmark} aria-hidden="true">Comet</div>
      </div>
    </footer>
  );
}
```

### `src/app/comet/sections/Footer.module.css`

```css
/* Rodapé — heading "Follow Comet" seguido de um SVG grande (1154×1118 na referência). */
.footer { padding: 96px 0 40px; }
.inner { display: flex; flex-direction: column; gap: 40px; }
.follow { align-self: flex-start; color: var(--fg); text-decoration: none; font: 500 18px/1 var(--font-body); border-bottom: 1px solid var(--line); padding-bottom: 4px; }
.follow:hover { border-color: var(--fg); }
.follow:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
.wordmark { font-family: var(--font-display); font-size: clamp(96px, 22vw, 320px); line-height: 0.85; letter-spacing: -0.04em; color: var(--surface); user-select: none; }
```
<!-- code:end -->
