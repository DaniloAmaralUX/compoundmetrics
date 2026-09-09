---
id: comet-05-assistente-pessoal
title: Comet — Seu assistente pessoal
reference: https://www.perplexity.ai/comet
route: /comet
verification: inferred
date: 2026-09-09
source_of_truth:
  - src/app/comet/sections/PersonalAssistant.tsx
  - src/app/comet/sections/PersonalAssistant.module.css
---

# Comet — Seu assistente pessoal

## Identidade

| Campo | Valor |
| --- | --- |
| Papel no fluxo | demonstração em vídeo (F5) |
| Entrada | rolagem após a ponte |
| Saída | nenhuma |
| Viewport de referência | 1440 × ~1300 |
| Tema | claro; player escuro |

## Fórmula de design

### Tokens

| Token | Valor | Uso |
| --- | --- | --- |
| cabeçalho | ≤ 720 px, gap 16 px, margin-bottom 40 px | H2 + lead |
| player | ≤ 1400 px, 16:9, fundo `--fg`, raio 24 px (0 ≤ 820) | vídeo full-bleed |
| aviso | mono 12 px, `--bg` a 70 %, canto inferior esquerdo | arquivo ausente |
| tiles | 220 px (160 ≤ 820), 1:1, raio 20 px, gap 12 px, snap `proximity` | 10 tiles |
| rótulo do tile | mono 14 px, `--fg-2` | texto reconstruído |

### Grade e ritmo

| Propriedade | Valor |
| --- | --- |
| Cabeçalho | dentro de `.container` |
| Player | fora do contêiner (até 1400 px) |
| Trilho | padding lateral = `--gutter`, rolagem horizontal |

### Tipografia

| Papel | Família | Tamanho | Peso |
| --- | --- | --- | --- |
| H2 | `--font-display` | `clamp(36px, 5vw, 64px)` | 400 |
| Lead | `--font-body` | `clamp(17px, 1.6vw, 20px)` | 400 |

### Hierarquia

1. Player (massa escura).
2. H2.
3. Lead.
4. Tiles.

## Estrutura

| # | Seção | Componente | Conteúdo |
| --- | --- | --- | --- |
| 1 | Cabeçalho | `.head` | H2, parágrafo |
| 2 | Vídeo | `figure.videoWrap` | `<video controls preload="none">` + aviso |
| 3 | Tiles | `ul.tiles` | 10 × esfera + rótulo |

## Copy (PT-BR)

| Original | Tradução | Observação |
| --- | --- | --- |
| Your personal assistant | Seu assistente pessoal | |
| What can Comet do? Discover everything that can be delegated, from wrangling inboxes to ordering groceries, staying on top of finances to planning vacations. | O que o Comet pode fazer? Descubra tudo o que pode ser delegado: de organizar caixas de entrada a pedir compras de mercado, de acompanhar as finanças a planejar férias. | |
| [desconhecido] | Vídeo: o Comet como assistente pessoal | rótulo do player, reconstruído |
| [desconhecido] | arquivo da referência não disponível nesta cópia | aviso local |
| [desconhecido] ×10 | Caixa de entrada · Compras de mercado · Finanças · Férias · Agenda · Pesquisa · Abas · Resumos · Formulários · Reservas | os 10 tiles da referência são imagens sem texto capturado; rótulos derivados do parágrafo |

## Estados

| Estado | Comportamento |
| --- | --- |
| padrão | player escuro com aviso; sem fonte de vídeo |
| com fonte | `preload="none"`; controles nativos |
| revelação | player faz fade-in/slide-up ao entrar |
| reduced motion | sem revelação |

## Fluxos

- **Entra por:** rolagem.
- **Sai para:** nenhuma; F5 acontece inline.

## Movimento

| Elemento | Gatilho | Duração | Easing | Reduced motion |
| --- | --- | --- | --- | --- |
| `figure.reveal` | entrada 0–35 % | scroll-driven | linear | desligado |

## Acessibilidade

| Verificação | Resultado | Estado |
| --- | --- | --- |
| Nome do vídeo | `aria-label` + `figcaption` visível | observed |
| Trilho de tiles | `aria-label="Exemplos de tarefas delegáveis"` | observed |
| Contraste do aviso sobre `--fg` | `--bg` a 70 % de opacidade ≈ 11:1 | inferred (computado sobre cor plena 17.52:1) |

## Evidência

| Fato | Estado | Fonte |
| --- | --- | --- |
| H2, parágrafo, `<video controls>` com URL, 10 PNG 1080² | inferred | captura verbatim |
| Parágrafo idêntico desde jan/2026 | inferred | índice de terceiros citando a página (trecho de busca) |
| Vídeo full-bleed que revela ao rolar | inferred | galeria |
| Conteúdo dos tiles | not-verified | imagens não baixadas |

## Desvios conhecidos

- Vídeo sem fonte (asset bloqueado); aviso visível no player.
- Tiles com rótulos reconstruídos.

## Código (fonte da verdade)

<!-- code:start -->
### `src/app/comet/sections/PersonalAssistant.tsx`

```tsx
import shared from "../comet.module.css";
import styles from "./PersonalAssistant.module.css";
import { personalAssistant } from "../content";

/** "Seu assistente pessoal": título, parágrafo, vídeo com controles nativos e trilho de dez tiles. */
export function PersonalAssistant() {
  return (
    <section className={styles.section} aria-labelledby="assistant-title">
      <div className={shared.container}>
        <div className={styles.head}>
          <h2 id="assistant-title" className={`${shared.display} ${styles.title}`}>{personalAssistant.heading.pt}</h2>
          <p className={shared.lead}>{personalAssistant.body.pt}</p>
        </div>
      </div>
      <figure className={`${styles.videoWrap} ${shared.reveal}`}>
        <video className={styles.video} controls preload="none" aria-label={personalAssistant.videoLabel.pt} />
        <figcaption className={styles.videoNote}>{personalAssistant.videoLabel.pt} · {personalAssistant.videoMissing.pt}</figcaption>
      </figure>
      <ul className={styles.tiles} role="list" aria-label="Exemplos de tarefas delegáveis">
        {personalAssistant.tiles.map((tile, i) => (
          <li key={tile.pt} className={styles.tile} style={{ "--orb-color": `var(--orb-${(i % 3) + 1})` } as React.CSSProperties}>
            <span className={`${shared.orb} ${styles.tileOrb}`} aria-hidden="true" />
            <span className={styles.tileLabel}>{tile.pt}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

### `src/app/comet/sections/PersonalAssistant.module.css`

```css
/* Vídeo full-bleed que revela ao rolar (observado em galeria) + dez tiles 1:1 em trilho horizontal. */
.section { padding: var(--section-gap) 0 0; }
.head { max-width: 720px; display: flex; flex-direction: column; gap: 16px; margin-bottom: 40px; }
.title { font-size: clamp(36px, 5vw, 64px); }
.videoWrap { position: relative; margin: 0 auto; width: min(1400px, 100%); aspect-ratio: 16 / 9; background: var(--fg); border-radius: var(--radius-card); overflow: hidden; }
.video { position: absolute; inset: 0; width: 100%; height: 100%; }
.videoNote { position: absolute; left: 24px; bottom: 20px; color: var(--bg); font: 500 12px/1.3 var(--font-mono); opacity: 0.7; pointer-events: none; }
.tiles { list-style: none; margin: 16px 0 0; padding: 0 var(--gutter) 12px; display: grid; grid-auto-flow: column; grid-auto-columns: 220px; gap: 12px; overflow-x: auto; scroll-snap-type: x proximity; scrollbar-width: thin; }
.tile { position: relative; aspect-ratio: 1; overflow: hidden; border-radius: 20px; background: var(--surface-2); border: 1px solid var(--line); scroll-snap-align: start; display: flex; align-items: flex-end; padding: 14px; }
.tileOrb { width: 70%; aspect-ratio: 1; right: -18%; top: -14%; }
.tileLabel { position: relative; font: 500 14px/1.2 var(--font-mono); color: var(--fg-2); }
@media (max-width: 820px) { .video { border-radius: 0; } .tiles { grid-auto-columns: 160px; } }
```
<!-- code:end -->
