---
id: comet-09-download
title: Comet — download por plataforma
reference: https://perplexity.sng.link/Bot2p/kkat?_smtype=3
route: /comet/download
verification: inferred
date: 2026-09-09
source_of_truth:
  - src/app/comet/download/page.tsx
  - src/app/comet/download/DownloadClient.tsx
  - src/app/comet/download/download.module.css
---

# Comet — download por plataforma

Na referência esta “tela” é um redirecionamento: o CTA aponta para um link inteligente que envia cada sistema ao instalador ou à loja. Aqui o roteamento é uma página visível, para que o fluxo seja legível e reversível.

## Identidade

| Campo | Valor |
| --- | --- |
| Papel no fluxo | roteador de F1 (desktop) e F2 (mobile) |
| Entrada | CTAs de 01, 02, 07 e 10 |
| Saída | link inteligente da referência (Mac/Windows), App Store (iOS), Google Play (Android) |
| Viewport de referência | — (não existe como tela na referência) |
| Tema | claro |

## Fórmula de design

### Tokens

| Token | Valor | Uso |
| --- | --- | --- |
| seção | padding 96 px em cima, `--section-gap` embaixo, centralizada, gap 24 px | coluna única |
| título | display `clamp(40px, 6vw, 80px)` | H1 |
| bloco primário | min-height 140 px, gap 14 px, `aria-live="polite"` | plataforma detectada |
| CTA primário | `.btn` 56 px, 18 px | plataforma detectada |
| CTAs secundários | `.btn.btnGhost` | outras plataformas |
| nota | mono 13 px, `--fg-2` | requisito de sistema |
| subtítulo | mono 14 px, caixa alta, +0.08em | “Outras plataformas” |

### Grade e ritmo

| Propriedade | Valor |
| --- | --- |
| Colunas | 1, centralizada |
| Lista secundária | flex-wrap, gap 20 px |

### Tipografia

| Papel | Família | Tamanho | Peso |
| --- | --- | --- | --- |
| H1 | `--font-display` | até 80 px | 400 |
| CTA | `--font-body` | 18 / 16 px | 500 |
| Nota | `--font-mono` | 13 px | 500 |

### Hierarquia

1. CTA da plataforma detectada.
2. H1.
3. Outras plataformas.

## Estrutura

| # | Seção | Componente | Conteúdo |
| --- | --- | --- | --- |
| 1 | Cabeçalho | `sections/Header.tsx` | compartilhado |
| 2 | Primário | `DownloadClient.tsx` `.primary` | estado + CTA + nota |
| 3 | Outras | `DownloadClient.tsx` `.others` | 3 CTAs fantasmas |
| 4 | Rodapé | `sections/Footer.tsx` | compartilhado |

## Copy (PT-BR)

| Original | Tradução | Observação |
| --- | --- | --- |
| [desconhecido] | Baixar o Comet | H1 |
| [desconhecido] | Detectando seu sistema… | snapshot do servidor |
| [desconhecido] | Detectamos: mac / windows / ios / android | |
| [desconhecido] | Baixar para Mac · Baixar para Windows · Abrir na App Store · Abrir no Google Play | rótulos; imprensa cita “Download for Mac / Windows” na referência |
| [desconhecido] | Outras plataformas | |
| [desconhecido] | Não conseguimos detectar seu sistema. Escolha uma plataforma abaixo. | Linux e agentes desconhecidos |
| — | macOS 11 Big Sur ou superior · Windows 10 ou superior · iOS 18 ou superior · Android 12 ou superior | requisitos citados em central de ajuda / lojas (inferred) |

## Estados

| Estado | Comportamento |
| --- | --- |
| detectando | HTML estático; texto “Detectando seu sistema…” até hidratar |
| mac / windows | CTA primário → link inteligente da referência |
| ios / android | CTA primário → loja |
| desconhecido | mensagem + as quatro plataformas como secundárias |
| erro de rede no destino | fora do escopo (link externo) |

## Fluxos

- **Entra por:** F1/F2 (CTAs).
- **Sai para:** instalador ou loja (externo).

## Movimento

| Elemento | Gatilho | Duração | Easing | Reduced motion |
| --- | --- | --- | --- | --- |
| nenhum | — | — | — | — |

## Acessibilidade

| Verificação | Resultado | Estado |
| --- | --- | --- |
| Mudança de estado anunciada | `aria-live="polite"` no bloco primário | observed |
| iPad com UA de Mac | tratado como iOS por `maxTouchPoints > 1` | observed (código) |
| Render mobile (UA iPhone) | primário “Abrir na App Store” | observed (render local) |
| Render Linux headless | estado “desconhecido” | observed (render local) |

## Evidência

| Fato | Estado | Fonte |
| --- | --- | --- |
| CTA da referência aponta para `perplexity.sng.link/Bot2p/kkat?_smtype=3` | inferred | captura verbatim |
| Link roteia por SO para `.dmg`/`.exe`/lojas | inferred | parâmetros `_ios_dl`/`_android_dl` vistos em regras de filtro de terceiros + imprensa |
| IDs das lojas (`id6748622471`, `ai.perplexity.comet`) | inferred | resultados de busca das lojas |
| URLs diretas dos instaladores | not-verified | desconhecidas; o link inteligente é usado |

## Desvios conhecidos

- Tela inteira é local: a referência redireciona sem interface.
- Instaladores desktop reutilizam o link inteligente da referência (URLs diretas desconhecidas).

## Código (fonte da verdade)

<!-- code:start -->
### `src/app/comet/download/page.tsx`

```tsx
import type { Metadata } from "next";
import shared from "../comet.module.css";
import { Header } from "../sections/Header";
import { Footer } from "../sections/Footer";
import { DownloadClient } from "./DownloadClient";

export const metadata: Metadata = {
  title: { absolute: "Baixar o Comet" },
  robots: { index: false, follow: false },
};

/**
 * Tela de download. Na referência o CTA aponta para um link inteligente (perplexity.sng.link)
 * que redireciona por sistema operacional; aqui a detecção é feita no cliente e cada plataforma
 * fica visível, para que o fluxo seja legível e reversível.
 */
export default function DownloadPage() {
  return (
    <div className={shared.page} lang="pt-BR">
      <Header />
      <main>
        <DownloadClient />
      </main>
      <Footer />
    </div>
  );
}
```

### `src/app/comet/download/DownloadClient.tsx`

```tsx
"use client";
import { useSyncExternalStore } from "react";
import shared from "../comet.module.css";
import styles from "./download.module.css";
import { APP_STORE_URL, DOWNLOAD_URL, PLAY_STORE_URL, download } from "../content";

type Platform = "mac" | "windows" | "ios" | "android" | "unknown";

const targets: Record<Exclude<Platform, "unknown">, { label: string; href: string; note: string }> = {
  mac: { label: download.platforms.mac.pt, href: DOWNLOAD_URL, note: "macOS 11 Big Sur ou superior · .dmg" },
  windows: { label: download.platforms.windows.pt, href: DOWNLOAD_URL, note: "Windows 10 ou superior · instalador .exe" },
  ios: { label: download.platforms.ios.pt, href: APP_STORE_URL, note: "iOS 18 ou superior" },
  android: { label: download.platforms.android.pt, href: PLAY_STORE_URL, note: "Android 12 ou superior" },
};

function detect(ua: string, touchPoints: number): Platform {
  if (/android/i.test(ua)) return "android";
  if (/iphone|ipad|ipod/i.test(ua) || (/macintosh/i.test(ua) && touchPoints > 1)) return "ios";
  if (/windows/i.test(ua)) return "windows";
  if (/macintosh|mac os x/i.test(ua)) return "mac";
  return "unknown";
}

export function DownloadClient() {
  // "detecting" é o snapshot do servidor; no cliente a plataforma é lida uma vez do user agent.
  const platform = useSyncExternalStore<Platform | "detecting">(
    () => () => {},
    () => detect(navigator.userAgent, navigator.maxTouchPoints ?? 0),
    () => "detecting",
  );

  const primary = platform !== "detecting" && platform !== "unknown" ? targets[platform] : null;
  const others = (Object.keys(targets) as Array<keyof typeof targets>).filter((k) => k !== platform);

  return (
    <section className={`${shared.container} ${styles.section}`} aria-labelledby="download-title">
      <h1 id="download-title" className={`${shared.display} ${styles.title}`}>{download.title.pt}</h1>
      <div className={styles.primary} aria-live="polite">
        {platform === "detecting" && <p className={shared.lead}>{download.detecting.pt}</p>}
        {platform === "unknown" && <p className={shared.lead}>{download.unknown.pt}</p>}
        {primary && (
          <>
            <p className={shared.eyebrow}>{download.detected.pt}: {platform}</p>
            <a href={primary.href} className={`${shared.btn} ${styles.cta}`} rel="noopener">{primary.label}</a>
            <p className={styles.note}>{primary.note}</p>
          </>
        )}
      </div>
      <h2 className={styles.otherTitle}>{download.other.pt}</h2>
      <ul className={styles.others} role="list">
        {others.map((k) => (
          <li key={k}>
            <a href={targets[k].href} className={`${shared.btn} ${shared.btnGhost}`} rel="noopener">{targets[k].label}</a>
            <span className={styles.note}>{targets[k].note}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

### `src/app/comet/download/download.module.css`

```css
/* Download — uma coluna centrada; CTA primário da plataforma detectada, demais como fantasmas. */
.section { padding: 96px 0 var(--section-gap); display: flex; flex-direction: column; align-items: center; text-align: center; gap: 24px; }
.title { font-size: clamp(40px, 6vw, 80px); }
.primary { min-height: 140px; display: flex; flex-direction: column; align-items: center; gap: 14px; }
.cta { min-height: 56px; padding: 0 28px; font-size: 18px; }
.note { margin: 0; color: var(--fg-2); font: 500 13px/1.3 var(--font-mono); }
.otherTitle { margin: 24px 0 0; font: 500 14px/1 var(--font-mono); letter-spacing: 0.08em; text-transform: uppercase; color: var(--fg-2); }
.others { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; justify-content: center; gap: 20px; }
.others li { display: flex; flex-direction: column; align-items: center; gap: 8px; }
```
<!-- code:end -->
