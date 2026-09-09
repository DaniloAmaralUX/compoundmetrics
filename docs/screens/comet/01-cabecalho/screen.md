---
id: comet-01-cabecalho
title: Comet — cabeçalho
reference: https://www.perplexity.ai/comet
route: /comet
verification: inferred
date: 2026-09-09
source_of_truth:
  - src/app/comet/sections/Header.tsx
  - src/app/comet/sections/Header.module.css
---

# Comet — cabeçalho

## Identidade

| Campo | Valor |
| --- | --- |
| Papel no fluxo | acesso permanente ao CTA de download (F1, F2) |
| Entrada | topo de `/comet` e `/comet/download`; fica fixo ao rolar |
| Saída | `/comet/download`; `#faq` pelo botão-ícone |
| Viewport de referência | 1440 × 72 · 390 × 60 |
| Tema | claro, fundo translúcido com blur |

## Fórmula de design

### Tokens

| Token | Valor | Uso |
| --- | --- | --- |
| altura | 72 px (60 px ≤ 560) | barra |
| fundo | `color-mix(var(--bg) 82%, transparent)` + blur 12 px | barra fixa |
| marca | círculo 28 px em gradiente cônico (`--accent`, `--orb-1`, `--orb-3`) | logo (placeholder) |
| CTA | `.btn` (preto, pill, 48 px) | “Baixar o Comet” |
| botão-ícone | 48 px, círculo, `--surface-2`, borda `--line` | ação secundária |

### Grade e ritmo

| Propriedade | Valor |
| --- | --- |
| Largura | `.container` (1200 px) |
| Distribuição | `space-between`: marca à esquerda, ações à direita |
| Gap das ações | 10 px |

### Tipografia

| Papel | Família | Tamanho | Peso |
| --- | --- | --- | --- |
| Marca | `--font-body` | 18 px | 500 |
| CTA | `--font-body` | 16 px | 500 |

### Hierarquia

1. CTA preto.
2. Marca.
3. Botão-ícone.

## Estrutura

| # | Seção | Componente | Conteúdo |
| --- | --- | --- | --- |
| 1 | Marca | `Header.tsx` `.brand` | ícone + “Comet” (texto oculto ≤ 560) |
| 2 | Ações | `Header.tsx` `.actions` | CTA + botão-ícone |

## Copy (PT-BR)

| Original | Tradução | Observação |
| --- | --- | --- |
| Download Comet | Baixar o Comet | verbatim da captura |
| [desconhecido] | Comet | texto da marca reconstruído |
| [desconhecido] | Menu | `aria-label` do botão-ícone; o ícone real da referência é desconhecido |

## Estados

| Estado | Comportamento |
| --- | --- |
| topo da página | barra no fluxo, sem sombra |
| rolado | `position: sticky`; fundo translúcido com blur |
| hover CTA | fundo `#142626`, sobe 1 px |
| foco | anel `--accent` 2 px, offset 3 px |
| ≤ 560 px | altura 60 px; texto da marca vai para leitor de tela apenas |

## Fluxos

- **Entra por:** qualquer posição de rolagem.
- **Sai para:** F1/F2 (CTA), F4 (âncora `#faq`).

## Movimento

| Elemento | Gatilho | Duração | Easing | Reduced motion |
| --- | --- | --- | --- | --- |
| CTA | hover | 160 ms | `--ease` | mantido |
| Barra | rolagem | sem animação (sticky nativo) | — | — |

## Acessibilidade

| Verificação | Resultado | Estado |
| --- | --- | --- |
| Nome acessível da marca | “Comet — início” | observed (render local) |
| Nome do botão-ícone | “Menu” | observed |
| Alvo mínimo | 48 × 48 px | observed (CSS) |
| Contraste CTA | 17.52:1 | observed (computado) |

## Evidência

| Fato | Estado | Fonte |
| --- | --- | --- |
| Um único CTA no cabeçalho, sem menu | inferred | blog do Framer citando a página (“a single CTA … no distractions in the header”) |
| Barra fica fixa após o hero | inferred | galeria (nota de técnica) |
| Logo à esquerda, CTA + ícone circular à direita | inferred | clone de terceiro da página; ícone real `[desconhecido]` |
| Presença de “Entrar” ou seletor de idioma | not-verified | nenhuma fonte |

## Desvios conhecidos

- Logo real substituído por um círculo em gradiente.
- Botão-ícone “?” aponta para `#faq`; a função do ícone da referência é desconhecida.

## Código (fonte da verdade)

<!-- code:start -->
### `src/app/comet/sections/Header.tsx`

```tsx
import shared from "../comet.module.css";
import styles from "./Header.module.css";
import { header } from "../content";

/** Cabeçalho: marca à esquerda, um único CTA à direita. Fica fixo após o hero. */
export function Header() {
  return (
    <header className={styles.header}>
      <div className={`${shared.container} ${styles.bar}`}>
        <a href="/comet" className={styles.brand} aria-label="Comet — início">
          <span className={styles.mark} aria-hidden="true" />
          <span>{header.brand.pt}</span>
        </a>
        <nav className={styles.actions} aria-label="Ações principais">
          <a href="/comet/download" className={shared.btn}>{header.cta.pt}</a>
          <a href="/comet#faq" className={styles.iconBtn} aria-label={header.menu.pt}>
            <span aria-hidden="true">?</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
```

### `src/app/comet/sections/Header.module.css`

```css
/* Cabeçalho — sticky após o hero (observado em galeria: "becomes sticky after the initial hero section"). */
.header { position: sticky; top: 0; z-index: 20; background: color-mix(in oklab, var(--bg) 82%, transparent); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border-bottom: 1px solid transparent; }
.bar { height: 72px; display: flex; align-items: center; justify-content: space-between; gap: 16px; }
.brand { display: inline-flex; align-items: center; gap: 10px; color: inherit; text-decoration: none; font: 500 18px/1 var(--font-body); letter-spacing: -0.01em; }
.mark { width: 28px; height: 28px; border-radius: 50%; background: conic-gradient(from 200deg, var(--accent), var(--orb-1), var(--orb-3), var(--accent)); }
.actions { display: flex; align-items: center; gap: 10px; }
.iconBtn { width: 48px; height: 48px; display: grid; place-items: center; border-radius: 50%; border: 1px solid var(--line); color: var(--fg); text-decoration: none; font: 500 16px/1 var(--font-mono); background: var(--surface-2); }
.iconBtn:hover { background: var(--surface); }
.iconBtn:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
@media (max-width: 560px) { .bar { height: 60px; } .brand span:last-child { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); } }
```
<!-- code:end -->
