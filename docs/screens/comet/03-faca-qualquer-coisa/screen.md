---
id: comet-03-faca-qualquer-coisa
title: Comet — Faça qualquer coisa com o Comet
reference: https://www.perplexity.ai/comet
route: /comet
verification: inferred
date: 2026-09-09
source_of_truth:
  - src/app/comet/sections/DoAnything.tsx
  - src/app/comet/sections/DoAnything.module.css
---

# Comet — Faça qualquer coisa com o Comet

## Identidade

| Campo | Valor |
| --- | --- |
| Papel no fluxo | prova de valor: cinco tarefas delegáveis com prompt de exemplo |
| Entrada | rolagem após o hero |
| Saída | nenhuma (seção sem links) |
| Viewport de referência | 1440 × ~700 |
| Tema | claro |

## Fórmula de design

### Tokens

| Token | Valor | Uso |
| --- | --- | --- |
| título | display `clamp(36px, 5vw, 64px)`, margin-bottom 40 px | H2 |
| trilho | `grid-auto-flow: column`, gap 16 px, `scroll-snap-type: x mandatory` | 5 cartões |
| coluna | `calc((100% − 32px) / 3)` ≥ 1100 · `minmax(280px, 1fr)` · 82 % ≤ 560 | largura do cartão |
| figura | 1:1, raio 24 px, gradiente `--surface-2 → --surface`, borda `--line`, padding 18 px | placeholder da captura 1052² |
| esfera | 62 % da figura, deslocada para cima/direita | ilustração |
| chip | `.glass`, mono 12 px, `nowrap` | “Pausar o Assistente Comet” |
| prompt | `.glass`, 15 px / 1.4, padding 14 × 16 | exemplo |
| rótulo | 20 px / 1.2, peso 500 | “IA que …” |

### Grade e ritmo

| Propriedade | Valor |
| --- | --- |
| Cartões visíveis | 3 (≥ 1100) · ~1,2 (≤ 560) · restante por rolagem horizontal |
| Gap | 16 px |
| Rótulo | abaixo da figura, gap 14 px |

### Tipografia

| Papel | Família | Tamanho | Peso |
| --- | --- | --- | --- |
| H2 | `--font-display` | `clamp(36px, 5vw, 64px)` | 400 |
| Rótulo | `--font-body` | 20 px | 500 |
| Prompt | `--font-body` | 15 px | 400 |
| Chip | `--font-mono` | 12 px | 500 |

### Hierarquia

1. H2.
2. Figuras (esfera + prompt).
3. Rótulos.

## Estrutura

| # | Seção | Componente | Conteúdo |
| --- | --- | --- | --- |
| 1 | Título | `DoAnything.tsx` `.title` | “Faça qualquer coisa com o Comet” |
| 2 | Trilho | `DoAnything.tsx` `.grid` | 5 × `.card` (figura + rótulo) |

## Copy (PT-BR)

| Original | Tradução | Observação |
| --- | --- | --- |
| Do anything with Comet | Faça qualquer coisa com o Comet | |
| AI that understands | IA que entende | |
| How are different news outlets covering this differently? | Como diferentes veículos de imprensa estão cobrindo isso de formas diferentes? | |
| AI that builds | IA que constrói | |
| Pause Comet Assistant | Pausar o Assistente Comet | chip de UI dentro da captura |
| Build a basic website for me using the best website generator tool | Crie um site básico para mim usando a melhor ferramenta de geração de sites | |
| AI that emails | IA que responde e-mails | “emails” como verbo; “IA que envia e-mails” seria mais literal e mais longo |
| Draft a reply that shares my upcoming schedule | Rascunhe uma resposta compartilhando minha agenda dos próximos dias | |
| AI that creates | IA que cria | |
| Create a study plan given this syllabus for the next week to help me on my test | Crie um plano de estudos para a próxima semana com base nesta ementa para me ajudar na prova | |
| AI that shops | IA que compra | |
| Buy a high quality, comfortable yet cheap office chair | Compre uma cadeira de escritório de alta qualidade, confortável e barata | |

## Estados

| Estado | Comportamento |
| --- | --- |
| padrão | 3 cartões visíveis, trilho rolável com snap |
| revelação | cada cartão faz fade-in/slide-up ao entrar na viewport |
| rolagem horizontal | barra fina (`scrollbar-width: thin`) |
| reduced motion | sem revelação |

## Fluxos

- **Entra por:** rolagem.
- **Sai para:** nenhuma.

## Movimento

| Elemento | Gatilho | Duração | Easing | Reduced motion |
| --- | --- | --- | --- | --- |
| `.card.reveal` | entrada 0–35 % | scroll-driven | linear | desligado |

## Acessibilidade

| Verificação | Resultado | Estado |
| --- | --- | --- |
| Lista semântica | `ul role="list"` + `li` | observed |
| Rótulos como `h3` | sim | observed |
| Rolagem horizontal por teclado | trilho não é focável; conteúdo é alcançável por leitura sequencial | not-verified (precisa de teste com teclado) |

## Evidência

| Fato | Estado | Fonte |
| --- | --- | --- |
| Título, 5 rótulos, 5 prompts, chip | inferred | captura verbatim |
| Cinco PNG 1052 × 1052 | inferred | captura (URLs) |
| Cartões “glassmorphism” | inferred | galeria |
| Trilho horizontal vs. grade | not-verified | escolha local |
| Cartão “AI that organizes” | not-verified | presente em versão anterior (Q1 2026) segundo fonte secundária; ausente na captura |

## Desvios conhecidos

- Capturas de produto substituídas por esfera + prompt em vidro.
- Disposição em trilho é uma escolha local para cinco itens 1:1.

## Código (fonte da verdade)

<!-- code:start -->
### `src/app/comet/sections/DoAnything.tsx`

```tsx
import shared from "../comet.module.css";
import styles from "./DoAnything.module.css";
import { doAnything } from "../content";

/** "Faça qualquer coisa com o Comet": cinco cartões quadrados, cada um com ilustração, rótulo e prompt de exemplo. */
export function DoAnything() {
  return (
    <section className={styles.section} aria-labelledby="do-anything-title">
      <div className={shared.container}>
        <h2 id="do-anything-title" className={`${shared.display} ${styles.title}`}>{doAnything.heading.pt}</h2>
        <ul className={styles.grid} role="list">
          {doAnything.cards.map((card) => (
            <li key={card.id} className={`${styles.card} ${shared.reveal}`}>
              <figure className={styles.figure} style={{ "--orb-color": card.orb } as React.CSSProperties}>
                <span className={`${shared.orb} ${styles.orb}`} aria-hidden="true" />
                {"chip" in card && card.chip ? <span className={`${shared.glass} ${styles.chip}`}>{card.chip.pt}</span> : null}
                <figcaption className={`${shared.glass} ${styles.prompt}`}>{card.prompt.pt}</figcaption>
              </figure>
              <h3 className={styles.label}>{card.label.pt}</h3>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
```

### `src/app/comet/sections/DoAnything.module.css`

```css
/* Cinco cartões 1:1 — trilho com rolagem horizontal e snap (disposição inferida; a referência usa cinco PNGs 1052×1052). */
.section { padding: var(--section-gap) 0 0; }
.title { font-size: clamp(36px, 5vw, 64px); margin-bottom: 40px; }
.grid { list-style: none; margin: 0; padding: 0 0 12px; display: grid; grid-auto-flow: column; grid-auto-columns: minmax(280px, 1fr); gap: 16px; overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: thin; }
.card { scroll-snap-align: start; display: flex; flex-direction: column; gap: 14px; }
.figure { position: relative; margin: 0; aspect-ratio: 1; border-radius: var(--radius-card); overflow: hidden; background: linear-gradient(160deg, var(--surface-2), var(--surface)); border: 1px solid var(--line); display: flex; flex-direction: column; justify-content: flex-end; padding: 18px; }
.orb { width: 62%; aspect-ratio: 1; right: -12%; top: -8%; }
.chip { align-self: flex-start; white-space: nowrap; padding: 8px 12px; margin-bottom: 10px; font: 500 12px/1 var(--font-mono); color: var(--fg-2); }
.prompt { padding: 14px 16px; font-size: 15px; line-height: 1.4; color: var(--fg); }
.label { margin: 0; font: 500 20px/1.2 var(--font-body); letter-spacing: -0.01em; }
@media (min-width: 1100px) { .grid { grid-auto-columns: calc((100% - 2 * 16px) / 3); } }
@media (max-width: 560px) { .grid { grid-auto-columns: 82%; } }
```
<!-- code:end -->
