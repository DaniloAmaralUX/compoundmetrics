---
id: comet-10-splash-mobile
title: Comet — splash de instalação (web mobile)
reference: https://www.perplexity.ai/comet
route: /comet
verification: inferred
date: 2026-09-09
source_of_truth:
  - src/app/comet/MobileSplash.tsx
  - src/app/comet/MobileSplash.module.css
---

# Comet — splash de instalação (web mobile)

## Identidade

| Campo | Valor |
| --- | --- |
| Papel no fluxo | interstitial que empurra o web mobile para o app (F2) |
| Entrada | `/comet` em viewport ≤ 820 px sem cookie de dispensa |
| Saída | `/comet/download` ou dispensa |
| Viewport de referência | 390 × 844 |
| Tema | claro, cartão em vidro |

## Fórmula de design

### Tokens

| Token | Valor | Uso |
| --- | --- | --- |
| posição | `fixed`, 12 px das bordas inferiores/laterais, z 30 | barra |
| cartão | `.glass`, sombra `0 20px 40px -20px rgba(9,23,23,.4)`, padding 12 × 14 | contêiner |
| grade | `40px 1fr auto` / linha extra para “Continuar no site” | mark · texto · CTA |
| mark | 40 px, raio 12 px, gradiente cônico | ícone do app |
| texto | 13 px / 1.3; título peso 500 `--fg`, corpo `--fg-2` | copy |
| CTA | `.btn` 40 px, 14 px | “Abrir na loja” |
| dispensar | 12 px sublinhado, `--fg-2` | link-botão |

### Grade e ritmo

| Propriedade | Valor |
| --- | --- |
| Visibilidade | `display: none` acima de 820 px |

### Tipografia

| Papel | Família | Tamanho | Peso |
| --- | --- | --- | --- |
| Título | `--font-body` | 13 px | 500 |
| Corpo | `--font-body` | 13 px | 400 |

### Hierarquia

1. CTA.
2. Título.
3. Dispensar.

## Estrutura

| # | Seção | Componente | Conteúdo |
| --- | --- | --- | --- |
| 1 | Portal | `MobileSplash.tsx` `.portal` | `role="dialog"` não modal |
| 2 | Cartão | `.card` | mark, texto, CTA, dispensar |

## Copy (PT-BR)

| Original | Tradução | Observação |
| --- | --- | --- |
| [desconhecido] | Comet no seu celular | reconstruído |
| [desconhecido] | Baixe o app para navegar com o assistente onde estiver. | reconstruído |
| [desconhecido] | Abrir na loja | reconstruído |
| [desconhecido] | Continuar no site | reconstruído |

## Estados

| Estado | Comportamento |
| --- | --- |
| servidor / hidratando | não renderiza (snapshot “dispensado”) para evitar flash em desktop |
| sem cookie, ≤ 820 px | visível, fixo no rodapé da viewport |
| dispensado | cookie `pplx.mweb-splash-page-dismissed=1` por 30 dias; some imediatamente |
| > 820 px | oculto por CSS mesmo sem cookie |

## Fluxos

- **Entra por:** carga de `/comet` no mobile.
- **Sai para:** F2 (tela 09) ou permanece na página.

## Movimento

| Elemento | Gatilho | Duração | Easing | Reduced motion |
| --- | --- | --- | --- | --- |
| nenhum | — | — | — | — |

## Acessibilidade

| Verificação | Resultado | Estado |
| --- | --- | --- |
| Papel | `role="dialog"`, `aria-modal="false"`, rotulado pelo título | observed |
| Foco | não rouba foco; alcançável no fim da ordem de tabulação | observed (render local) |
| Dispensa por teclado | `<button>` nativo | observed |

## Evidência

| Fato | Estado | Fonte |
| --- | --- | --- |
| A referência injeta um portal mobile com link inteligente e cookie `pplx.mweb-splash-page-dismissed` | inferred | regras de filtro de terceiros para `perplexity.ai` |
| O portal aparece especificamente em `/comet` | not-verified | as regras cobrem o domínio, não a rota |
| Copy e aparência | not-verified | nenhuma fonte |

## Desvios conhecidos

- Toda a copy é reconstruída.
- Barra inferior é uma escolha local; a referência pode usar tela cheia.

## Código (fonte da verdade)

<!-- code:start -->
### `src/app/comet/MobileSplash.tsx`

```tsx
"use client";
import { useSyncExternalStore } from "react";
import shared from "./comet.module.css";
import styles from "./MobileSplash.module.css";
import { mobileSplash } from "./content";

const COOKIE = "pplx.mweb-splash-page-dismissed";

/**
 * Interstitial de instalação do app no web mobile.
 * A referência injeta um portal com link inteligente e memoriza a dispensa em cookie de mesmo nome.
 * Só aparece em viewports estreitos (CSS) e some após a dispensa.
 */
const listeners = new Set<() => void>();
const subscribe = (cb: () => void) => { listeners.add(cb); return () => listeners.delete(cb); };
const isDismissed = () => document.cookie.includes(`${COOKIE}=1`);

export function MobileSplash() {
  // No servidor o splash não existe (snapshot true = dispensado); no cliente lê o cookie.
  const dismissed = useSyncExternalStore(subscribe, isDismissed, () => true);
  if (dismissed) return null;
  const dismiss = () => {
    document.cookie = `${COOKIE}=1; path=/; max-age=${60 * 60 * 24 * 30}`;
    listeners.forEach((cb) => cb());
  };
  return (
    <div className={styles.portal} role="dialog" aria-modal="false" aria-labelledby="splash-title">
      <div className={`${shared.glass} ${styles.card}`}>
        <span className={styles.mark} aria-hidden="true" />
        <div className={styles.text}>
          <strong id="splash-title">{mobileSplash.title.pt}</strong>
          <span>{mobileSplash.body.pt}</span>
        </div>
        <a href="/comet/download" className={`${shared.btn} ${styles.cta}`}>{mobileSplash.cta.pt}</a>
        <button type="button" onClick={dismiss} className={styles.dismiss}>{mobileSplash.dismiss.pt}</button>
      </div>
    </div>
  );
}
```

### `src/app/comet/MobileSplash.module.css`

```css
/* Splash mobile — barra fixa no rodapé da viewport, só abaixo de 820px. */
.portal { display: none; }
@media (max-width: 820px) {
  .portal { display: block; position: fixed; inset: auto 12px 12px; z-index: 30; }
  .card { display: grid; grid-template-columns: 40px 1fr auto; grid-template-areas: "mark text cta" "dismiss dismiss dismiss"; gap: 8px 12px; align-items: center; padding: 12px 14px; box-shadow: 0 20px 40px -20px rgba(9, 23, 23, 0.4); }
  .mark { grid-area: mark; width: 40px; height: 40px; border-radius: 12px; background: conic-gradient(from 200deg, var(--accent), var(--orb-1), var(--orb-3), var(--accent)); }
  .text { grid-area: text; display: flex; flex-direction: column; gap: 2px; font-size: 13px; line-height: 1.3; color: var(--fg-2); }
  .text strong { color: var(--fg); font-weight: 500; }
  .cta { grid-area: cta; min-height: 40px; padding: 0 14px; font-size: 14px; }
  .dismiss { grid-area: dismiss; justify-self: center; background: none; border: 0; padding: 4px; color: var(--fg-2); font: 500 12px/1 var(--font-body); text-decoration: underline; cursor: pointer; }
  .dismiss:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
}
```
<!-- code:end -->
