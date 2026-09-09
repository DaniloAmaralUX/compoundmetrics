---
id: comet-04-ponte-recursos
title: Comet — ponte para a central de recursos
reference: https://www.perplexity.ai/comet
route: /comet
verification: inferred
date: 2026-09-09
source_of_truth:
  - src/app/comet/sections/ResourceBridge.tsx
  - src/app/comet/sections/ResourceBridge.module.css
---

# Comet — ponte para a central de recursos

## Identidade

| Campo | Valor |
| --- | --- |
| Papel no fluxo | saída para a central de recursos (F3) |
| Entrada | rolagem após os cartões |
| Saída | `perplexity.ai/comet/resources` (tela 11, externa) |
| Viewport de referência | 1440 × ~600 |
| Tema | claro |

## Fórmula de design

### Tokens

| Token | Valor | Uso |
| --- | --- | --- |
| grade | `5fr 6fr`, gap 48 px, alinhada ao centro | copy / mídia |
| título | display `clamp(32px, 4vw, 52px)` | linha 1 |
| lead | `.lead` | linha 2 |
| ações | gap 18 px, margin-top 8 px | CTA + link |
| link | peso 500, borda inferior `--line` (→ `--fg` no hover) | “Central de recursos do Comet →” |
| mídia | proporção 1932:1467; captura deslocada 8 % / 12 %; esfera `--orb-3` 34 % | placeholders |

### Grade e ritmo

| Propriedade | Valor |
| --- | --- |
| Colunas | 2 (1 abaixo de 820 px, gap 32 px) |
| Copy | coluna de 5/11 |

### Tipografia

| Papel | Família | Tamanho | Peso |
| --- | --- | --- | --- |
| Linha 1 | `--font-display` | `clamp(32px, 4vw, 52px)` | 400 |
| Linha 2 | `--font-body` | `clamp(17px, 1.6vw, 20px)` | 400 |

### Hierarquia

1. Linha 1 serifada.
2. CTA preto.
3. Link secundário.

## Estrutura

| # | Seção | Componente | Conteúdo |
| --- | --- | --- | --- |
| 1 | Copy | `.copy` | H2, lead, CTA, link |
| 2 | Mídia | `.media` | esfera + placeholder de captura |

## Copy (PT-BR)

| Original | Tradução | Observação |
| --- | --- | --- |
| Explore more ways to use Comet. | Explore mais formas de usar o Comet. | |
| Browse smarter, faster, and with less friction. | Navegue de forma mais inteligente, mais rápida e com menos atrito. | mais longa que o original; quebra em duas linhas a 1440 |
| Ways to Use Comet | Formas de usar o Comet | CTA |
| Comet Resource Hub | Central de recursos do Comet | link secundário; ambos apontam para a mesma URL na referência |

## Estados

| Estado | Comportamento |
| --- | --- |
| padrão | duas colunas |
| hover link | borda inferior escurece |
| ≤ 820 px | empilha; mídia abaixo da copy |

## Fluxos

- **Entra por:** rolagem.
- **Sai para:** F3 (central de recursos, externa, mesma aba).

## Movimento

| Elemento | Gatilho | Duração | Easing | Reduced motion |
| --- | --- | --- | --- | --- |
| nenhum | — | — | — | — |

## Acessibilidade

| Verificação | Resultado | Estado |
| --- | --- | --- |
| Dois links para o mesmo destino | nomes distintos (“Formas de usar o Comet”, “Central de recursos do Comet →”) | observed |
| Mídia | `aria-hidden` | observed |

## Evidência

| Fato | Estado | Fonte |
| --- | --- | --- |
| Duas linhas de copy, CTA e link, URL de destino | inferred | captura verbatim |
| Um SVG 1119 × 1703 e um PNG 1932 × 1467 | inferred | captura (URLs) |
| Disposição em duas colunas | not-verified | escolha local a partir das proporções dos assets |

## Desvios conhecidos

- Placeholders no lugar dos assets.

## Código (fonte da verdade)

<!-- code:start -->
### `src/app/comet/sections/ResourceBridge.tsx`

```tsx
import shared from "../comet.module.css";
import styles from "./ResourceBridge.module.css";
import { RESOURCES_URL, resourceBridge } from "../content";

/** Ponte para a central de recursos: duas linhas de copy, um CTA e um link secundário. */
export function ResourceBridge() {
  return (
    <section className={styles.section} aria-labelledby="bridge-title">
      <div className={`${shared.container} ${styles.inner}`}>
        <div className={styles.copy}>
          <h2 id="bridge-title" className={`${shared.display} ${styles.title}`}>{resourceBridge.line1.pt}</h2>
          <p className={shared.lead}>{resourceBridge.line2.pt}</p>
          <div className={styles.actions}>
            <a href={RESOURCES_URL} className={shared.btn} rel="noopener">{resourceBridge.cta.pt}</a>
            <a href={RESOURCES_URL} className={styles.hubLink} rel="noopener">{resourceBridge.hubLink.pt} →</a>
          </div>
        </div>
        <div className={styles.media} aria-hidden="true">
          <span className={`${shared.orb} ${styles.orb}`} />
          <div className={styles.shot} />
        </div>
      </div>
    </section>
  );
}
```

### `src/app/comet/sections/ResourceBridge.module.css`

```css
/* Ponte de recursos — duas colunas: copy à esquerda, captura + esfera à direita (inferido dos dois assets 1119×1703 e 1932×1467). */
.section { padding: var(--section-gap) 0 0; }
.inner { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 6fr); gap: 48px; align-items: center; }
.copy { display: flex; flex-direction: column; gap: 18px; }
.title { font-size: clamp(32px, 4vw, 52px); }
.actions { display: flex; flex-wrap: wrap; align-items: center; gap: 18px; margin-top: 8px; }
.hubLink { color: var(--fg); font-weight: 500; text-decoration: none; border-bottom: 1px solid var(--line); }
.hubLink:hover { border-color: var(--fg); }
.media { position: relative; aspect-ratio: 1932 / 1467; }
.shot { position: absolute; inset: 8% 0 0 12%; border-radius: var(--radius-card); background: linear-gradient(160deg, var(--surface-2), var(--surface)); border: 1px solid var(--line); }
.orb { --orb-color: var(--orb-3); width: 34%; aspect-ratio: 1; left: 0; top: 0; z-index: 1; }
@media (max-width: 820px) { .inner { grid-template-columns: 1fr; gap: 32px; } }
```
<!-- code:end -->
