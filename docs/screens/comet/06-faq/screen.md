---
id: comet-06-faq
title: Comet — Perguntas frequentes
reference: https://www.perplexity.ai/comet#faq
route: /comet#faq
verification: inferred
date: 2026-09-09
source_of_truth:
  - src/app/comet/sections/Faq.tsx
  - src/app/comet/sections/Faq.module.css
---

# Comet — Perguntas frequentes

## Identidade

| Campo | Valor |
| --- | --- |
| Papel no fluxo | objeções: plataformas, instalação, busca, preço, padrão, privacidade, segurança (F4) |
| Entrada | rolagem; âncora `#faq` do cabeçalho |
| Saída | nenhuma |
| Viewport de referência | 1440 × ~700 |
| Tema | claro |

## Fórmula de design

### Tokens

| Token | Valor | Uso |
| --- | --- | --- |
| grade | `4fr 7fr`, gap 48 px | título / lista |
| item | borda inferior `--line`; lista com borda superior | separadores |
| summary | padding 22 × 4 px, `clamp(17px, 1.5vw, 20px)`, peso 500 | pergunta |
| ícone | 28 px, círculo, borda `--line`, “+” que vira “−” | estado |
| resposta | 16 px / 1.55, `--fg-2`, ≤ 60ch, padding-bottom 24 px | texto |
| esfera | `--orb-2`, 22 vw ≤ 300 px, canto inferior esquerdo | decorativa (some ≤ 820) |

### Grade e ritmo

| Propriedade | Valor |
| --- | --- |
| Colunas | 2 (1 ≤ 820 px, gap 24) |
| Altura de item fechado | ~70 px |

### Tipografia

| Papel | Família | Tamanho | Peso |
| --- | --- | --- | --- |
| H2 | `--font-display` | `clamp(36px, 5vw, 64px)` | 400 |
| Pergunta | `--font-body` | 17–20 px | 500 |
| Resposta | `--font-body` | 16 px | 400 |

### Hierarquia

1. H2.
2. Perguntas.
3. Respostas (só abertas).

## Estrutura

| # | Seção | Componente | Conteúdo |
| --- | --- | --- | --- |
| 1 | Título | `.title` | “Perguntas frequentes” |
| 2 | Lista | `.list` | 7 × `<details>` |
| 3 | Mídia | `.media` | esfera decorativa |

## Copy (PT-BR)

| Original | Tradução | Observação |
| --- | --- | --- |
| FAQ | Perguntas frequentes | |
| What platforms is Comet available on? | Em quais plataformas o Comet está disponível? | |
| How do I install Comet? | Como instalo o Comet? | |
| What search engine does Comet use? | Qual mecanismo de busca o Comet usa? | |
| Is Comet free? | O Comet é gratuito? | |
| How do I make Comet my default browser? | Como torno o Comet meu navegador padrão? | |
| How do I control privacy settings? | Como controlo as configurações de privacidade? | |
| How do I browse safely with Comet? | Como navego com segurança no Comet? | |
| [desconhecido] ×7 | ver `content.ts` (`faq.items[].a`) | respostas **reconstruídas** a partir de requisitos de sistema e central de ajuda citados em resultados de busca; não são tradução |

## Estados

| Estado | Comportamento |
| --- | --- |
| fechado (padrão) | só a pergunta e o “+” |
| aberto | resposta visível; ícone vira “−”; outros itens não fecham |
| foco | anel `--accent` no `summary` |
| ≤ 820 px | uma coluna; esfera oculta |

## Fluxos

- **Entra por:** rolagem ou `#faq`.
- **Sai para:** nenhuma.

## Movimento

| Elemento | Gatilho | Duração | Easing | Reduced motion |
| --- | --- | --- | --- | --- |
| ícone “+” → “−” | abrir/fechar | 200 ms | `--ease` | mantido (rotação de 90°, não essencial) |
| conteúdo | abrir | nativo do `<details>` (sem animação) | — | — |

## Acessibilidade

| Verificação | Resultado | Estado |
| --- | --- | --- |
| Acordeão | `<details>/<summary>` nativos: teclado e leitor de tela sem JS | observed |
| Marcador padrão | oculto; ícone próprio `aria-hidden` | observed |
| Contraste resposta `--fg-2`/`--bg` | 9.74:1 | observed (computado) |

## Evidência

| Fato | Estado | Fonte |
| --- | --- | --- |
| Título e 7 perguntas | inferred | captura verbatim (perguntas aparecem como `h6`, fechadas) |
| Respostas | not-verified | não capturadas |
| Um SVG 1662 × 990 e um PNG 1932 × 1288 junto ao bloco | inferred | captura (URLs) |
| Disposição título/lista em duas colunas | not-verified | escolha local |

## Desvios conhecidos

- Respostas reconstruídas, não traduzidas. Trocar por tradução quando a referência for lida.
- Assets substituídos por uma esfera.

## Código (fonte da verdade)

<!-- code:start -->
### `src/app/comet/sections/Faq.tsx`

```tsx
import shared from "../comet.module.css";
import styles from "./Faq.module.css";
import { faq } from "../content";

/** FAQ: sete perguntas em acordeão nativo (<details>), fechadas por padrão. */
export function Faq() {
  return (
    <section id="faq" className={styles.section} aria-labelledby="faq-title">
      <div className={`${shared.container} ${styles.inner}`}>
        <h2 id="faq-title" className={`${shared.display} ${styles.title}`}>{faq.heading.pt}</h2>
        <div className={styles.list}>
          {faq.items.map((item) => (
            <details key={item.q.original} className={styles.item}>
              <summary className={styles.summary}>
                <span>{item.q.pt}</span>
                <span className={styles.icon} aria-hidden="true" />
              </summary>
              <p className={styles.answer}>{item.a.pt}</p>
            </details>
          ))}
        </div>
      </div>
      <div className={styles.media} aria-hidden="true">
        <span className={`${shared.orb} ${styles.orb}`} />
      </div>
    </section>
  );
}
```

### `src/app/comet/sections/Faq.module.css`

```css
/* FAQ — título à esquerda, lista à direita; acordeão com linha divisória (padrão Framer; disposição inferida). */
.section { position: relative; padding: var(--section-gap) 0 0; }
.inner { display: grid; grid-template-columns: minmax(0, 4fr) minmax(0, 7fr); gap: 48px; align-items: start; }
.title { font-size: clamp(36px, 5vw, 64px); }
.list { border-top: 1px solid var(--line); }
.item { border-bottom: 1px solid var(--line); }
.summary { list-style: none; cursor: pointer; display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 22px 4px; font: 500 clamp(17px, 1.5vw, 20px)/1.3 var(--font-body); }
.summary::-webkit-details-marker { display: none; }
.summary:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; border-radius: 6px; }
.icon { flex: none; width: 28px; height: 28px; border-radius: 50%; border: 1px solid var(--line); position: relative; }
.icon::before, .icon::after { content: ""; position: absolute; inset: 50% auto auto 50%; width: 12px; height: 1.5px; background: var(--fg); translate: -50% -50%; transition: rotate 200ms var(--ease); }
.icon::after { rotate: 90deg; }
.item[open] .icon::after { rotate: 0deg; }
.answer { margin: 0; padding: 0 4px 24px; max-width: 60ch; color: var(--fg-2); font-size: 16px; line-height: 1.55; }
.media { position: absolute; left: calc(50% - var(--container) / 2); bottom: 0; width: 22vw; max-width: 300px; aspect-ratio: 1; pointer-events: none; }
.orb { --orb-color: var(--orb-2); inset: 0; }
@media (max-width: 820px) { .inner { grid-template-columns: 1fr; gap: 24px; } .media { display: none; } }
```
<!-- code:end -->
