---
id: guide-00-guia
title: Guia — Compound Design como processo
reference: https://every.to/guides/compound-engineering
route: /guide
verification: inferred
date: 2026-09-09
source_of_truth:
  - src/app/guide/page.tsx
  - src/app/guide/guide.module.css
  - src/content/guide.ts
---

# Guia — Compound Design como processo

## Identidade

| Campo | Valor |
| --- | --- |
| Papel no fluxo | reconta todo o conteúdo do site como um processo institucional, na estrutura do guia da Every |
| Entrada | `/` (CTA “Read the guide”, item “Guide” na navegação), URL direta |
| Saída | `#plugin`, `/resources`, `/resources/<id>`, repositório, `/` |
| Viewport de referência | 1440 × 900 · 390 × 844 |
| Tema | claro — fórmula do Comet, fora do shell do site |

## Fórmula de design

Tokens, grade, tipografia e primitivos são os de `src/app/comet/comet.module.css` (ver `docs/screens/comet/00-pagina-inicial/screen.md`). Esta tela **importa** os módulos CSS das seções do Comet e adiciona só o que a fórmula não tinha:

| Bloco | Módulo Comet reutilizado | Acréscimo em `guide.module.css` |
| --- | --- | --- |
| Cabeçalho | `Header.module.css` | — |
| Hero | `Hero.module.css` | `.loopScreen` desenha o loop dentro da “tela” da composição |
| Capítulos em prosa | — | `.chapter` / `.chapterInner` (5fr · 7fr), `.prose`, `.quote` |
| O loop (6 cartões) | `DoAnything.module.css` | `.stageActions`, `.stageMeta` |
| Quem faz o quê | — | `.roles` (tabela de papéis: possui / nunca) |
| O plugin | `ResourceBridge.module.css` | `.installList`, `.kv`, `.pluginGrid` |
| Onde o aprendizado vai | `PersonalAssistant.module.css` | `.film` (painel escuro com a cadeia), tiles = “o que compõe” |
| Crenças a abandonar | `Faq.module.css` | `.adopt` para as transições |
| Crenças a adotar | — | `.adopt`, `.principles` |
| Começando | — | `.ladder` (estágio 3 invertido), `.levels`, `.move` |
| Três perguntas | — | `.questions` |
| Boas práticas | — | `.practice`, `.compare` (tradicional × compound), `.code` |
| Fechamento | `ClosingCta.module.css` | — |
| Rodapé | `Footer.module.css` | — |

### Tipografia

| Papel | Família | Tamanho |
| --- | --- | --- |
| Títulos de capítulo | `--font-display` | `clamp(32px, 4.4vw, 56px)` |
| Prosa | `--font-body` | `clamp(17px, 1.5vw, 19px)` / 1.55 |
| Rótulos, comandos, caminhos | `--font-mono` | 11–13 px |

### Hierarquia

1. H1 “Compound Design” e H2 em itálico.
2. CTA “Install the plugin” (cabeçalho, hero, fechamento).
3. Títulos serifados de capítulo, à esquerda; prosa à direita.

## Estrutura

| # | Seção | Componente | Conteúdo |
| --- | --- | --- | --- |
| 1 | Cabeçalho | `page.tsx` header | marca → `/`, CTA → `#plugin`, ≡ → `#chapters` |
| 2 | Hero | hero | eyebrow, H1, H2, lede, plataformas, 2 CTAs, composição com o loop |
| 3 | Capítulos | `#chapters` | 10 pílulas numeradas |
| 4 | Philosophy | `#philosophy` | problema, virada, teste de durabilidade |
| 5 | The loop | `#loop` | 6 cartões: ações, pergunta, quem, o que deixa |
| 6 | Compound | — | o passo mais importante, 4 ações |
| 7 | Who does what | `#roles` | 5 papéis: possui / nunca |
| 8 | The plugin | `#plugin` | estado atual, instalação, onde as coisas vivem, comandos, especialistas |
| 9 | Where the learning goes | `#learning` | painel escuro com a cadeia + 7 tiles |
| 10 | Beliefs to let go | `#unlearn` | 8 crenças em acordeão + 3 transições |
| 11 | Beliefs to adopt | `#adopt` | 7 crenças + 8 princípios |
| 12 | Getting started | `#start` | 6 estágios + 5 transições com “compounding move” |
| 13 | Three questions | `#questions` | 3 perguntas |
| 14 | Best practices | `#practices` | 9 práticas (2 “more coming soon”) |
| 15 | Fechamento | — | manchete canônica + 2 CTAs |
| 16 | Rodapé | — | “Follow the project →” + marca |

## Copy (PT-BR)

O guia é escrito em inglês, língua canônica do site. A tabela abaixo registra a correspondência com a **estrutura** da referência; não há tradução.

| Seção da referência (Every) | Seção do guia | Observação |
| --- | --- | --- |
| The philosophy | Philosophy | mesma sequência problema → virada; mecanismos do Compound Design |
| The main loop · 80/20 | The loop · “most thinking happens before and after” | sem proporção numérica: a referência mede, o Compound Design não mediu |
| Compound (the most important step) | Compound — the most important step | quatro ações equivalentes (capturar, tornar encontrável, atualizar o sistema, verificar) |
| Beliefs to let go (8) | Beliefs to let go (8) | crenças reescritas para design engineering |
| Beliefs to adopt · Core principles | Beliefs to adopt · Core principles | a regra 50/50 vira “budget the compound step”, sem número |
| Getting started · stages 0–5 · compounding move | Getting started · stages 0–5 · compounding move | cada movimento nomeia um recurso real |
| Three questions | Three questions | ligadas aos estados observed / inferred / not-verified |
| Best practices · Traditional vs Compound | Best practices · Traditional vs Compound | “More coming soon” mantido como sinal de documento vivo |

## Estados

| Estado | Comportamento |
| --- | --- |
| padrão | página estática; acordeão fechado |
| item aberto | uma crença expandida; as outras não fecham |
| âncora | rolagem para o capítulo, com margem para o cabeçalho fixo |
| reduced motion | sem parallax, sem revelação, sem deriva |
| ≤ 820 px | capítulos empilham; escada em uma coluna; trilho do loop rola horizontalmente |

## Fluxos

- **Entra por:** `/` e navegação do site.
- **Sai para:** `#plugin`, `/resources`, `/resources/<id>`, repositório, `/`.

## Movimento

Herdado do Comet: parallax do hero, revelação dos cartões e do painel escuro, deriva das esferas do fechamento; todos desligados com `prefers-reduced-motion`.

## Acessibilidade

| Verificação | Resultado | Estado |
| --- | --- | --- |
| Ordem de foco | marca → CTA → ≡ → CTAs do hero → capítulos → links do plugin → 8 acordeões → CTAs finais → rodapé | observed (render local) |
| Reflow a 390 px | sem rolagem horizontal | observed (render local) |
| Console | sem erros | observed (render local) |
| Tabela de papéis | `role="table"/"row"/"cell"` sobre `div` | observed |
| Contraste | pares do Comet (17.5:1, 9.7:1, 4.4:1 para foco) | observed (computado) |
| Alvo dos âncoras sob o cabeçalho fixo | `scroll-margin-top: 88px` em todo capítulo | observed (CSS) |

## Evidência

| Fato | Estado | Fonte |
| --- | --- | --- |
| Estrutura de seções e tom do guia da Every | inferred | captura integral de terceiro (2026-07) do guia v1 + README do plugin da Every |
| Loop de 7/8 passos da revisão v2 | inferred | citações em fontes secundárias |
| Layout | inferred | fórmula do Comet, `docs/screens/comet/` |
| Copy do guia | observed | `src/content/guide.ts` |

## Desvios conhecidos

- Estrutura e registro são os da referência; nenhuma frase é copiada.
- Proporções numéricas da referência (80/20, 50/50) não são reproduzidas: o Compound Design não as mediu.
- Sem “Read with Claude / Copy for agent” no cabeçalho: um CTA, como no Comet.

## Código (fonte da verdade)

<!-- code:start -->
### `src/app/guide/page.tsx`

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import shared from "../comet/comet.module.css";
import header from "../comet/sections/Header.module.css";
import hero from "../comet/sections/Hero.module.css";
import cards from "../comet/sections/DoAnything.module.css";
import bridge from "../comet/sections/ResourceBridge.module.css";
import film from "../comet/sections/PersonalAssistant.module.css";
import faq from "../comet/sections/Faq.module.css";
import closingCss from "../comet/sections/ClosingCta.module.css";
import footerCss from "../comet/sections/Footer.module.css";
import styles from "./guide.module.css";
import { currentState, v } from "@/content/current-state";
import { whatCompounds } from "@/content/examples";
import {
  beliefsToAdopt,
  beliefsToLetGo,
  closing,
  compoundStep,
  gettingStarted,
  guideFooter,
  guideHero,
  guideNav,
  learningFilm,
  loopIntro,
  loopStages,
  phases,
  philosophy,
  plugin,
  practices,
  threeQuestions,
} from "@/content/guide";

const REPO = "https://github.com/DaniloAmaralUX/compoundmetrics";

export const metadata: Metadata = {
  title: { absolute: `${guideHero.title}: ${guideHero.subtitle}` },
  description: guideHero.lede,
  robots: { index: false, follow: false },
};

const orbFor = (i: number) => `var(--orb-${(i % 3) + 1})`;

/**
 * The Compound Design guide, laid out with the Comet formula: header with one CTA, hero with a
 * composition, a horizontal rail of cards, a bridge, a full-bleed dark panel, an accordion, a
 * dark closing CTA and a footer with a large wordmark. The chapters in between are prose.
 */
export default function GuidePage() {
  const s = currentState;
  return (
    <div className={shared.page} lang="en">
      <header className={header.header}>
        <div className={`${shared.container} ${header.bar}`}>
          <Link href="/" className={header.brand} aria-label="Compound Design — home">
            <span className={header.mark} aria-hidden="true" />
            <span>{guideNav.brand}</span>
          </Link>
          <nav className={header.actions} aria-label="Guide actions">
            <a href="#plugin" className={shared.btn}>{guideNav.cta}</a>
            <a href="#chapters" className={header.iconBtn} aria-label="Chapters">
              <span aria-hidden="true">≡</span>
            </a>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className={hero.hero} aria-labelledby="guide-title">
          <div className={`${shared.container} ${hero.inner}`}>
            <span className={shared.eyebrow}>{guideHero.eyebrow}</span>
            <h1 id="guide-title" className={`${shared.display} ${hero.h1}`}>{guideHero.title}</h1>
            <h2 className={`${shared.display} ${hero.h2}`}>{guideHero.subtitle}</h2>
            <p className={shared.lead} style={{ textAlign: "inherit" }}>{guideHero.lede}</p>
            <p className={hero.platforms}>{guideHero.platforms}</p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginTop: 8 }}>
              <a href="#plugin" className={`${shared.btn} ${hero.cta}`} style={{ marginTop: 0 }}>{guideHero.cta}</a>
              <a href="#philosophy" className={`${shared.btn} ${shared.btnGhost} ${hero.cta}`} style={{ marginTop: 0 }}>{guideHero.secondary}</a>
            </div>
          </div>
          <div className={hero.composition}>
            <span className={`${shared.orb} ${hero.orbA}`} aria-hidden="true" />
            <span className={`${shared.orb} ${hero.orbB}`} aria-hidden="true" />
            <span className={`${shared.orb} ${hero.orbC}`} aria-hidden="true" />
            <div className={hero.screen} aria-hidden="true" />
            <div className={styles.loopScreen} role="list" aria-label="The loop">
              <div className={styles.loopRow}>
                {loopStages.map((st) => (
                  <div key={st.id} role="listitem" className={`${shared.glass} ${styles.loopNode}`}>
                    <span>{st.n}</span>
                    <b>{st.name}</b>
                    <i>{st.question}</i>
                  </div>
                ))}
              </div>
              <span className={styles.loopRepeat}>↻ Repeat — start with more capability than before</span>
            </div>
          </div>
        </section>

        {/* Chapters */}
        <nav id="chapters" className={`${shared.container} ${styles.chapters} ${styles.anchor}`} aria-label="Chapters">
          <ol className={styles.chapterList}>
            {guideNav.chapters.map(([id, name], i) => (
              <li key={id}>
                <a href={`#${id}`}>
                  <i>{String(i + 1).padStart(2, "0")}</i>
                  {name}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* Philosophy */}
        <section id="philosophy" className={styles.chapter} aria-labelledby="philosophy-title">
          <div className={`${shared.container} ${styles.chapterInner}`}>
            <div>
              <span className={shared.eyebrow}>{philosophy.eyebrow}</span>
              <h2 id="philosophy-title" className={`${shared.display} ${styles.chapterTitle}`} style={{ marginTop: 12 }}>{philosophy.title}</h2>
            </div>
            <div className={styles.prose}>
              {philosophy.problem.map((p) => <p key={p} className="muted">{p}</p>)}
              {philosophy.turn.map((p) => <p key={p}>{p}</p>)}
              <blockquote className={styles.quote}>{compoundStep.test}</blockquote>
              <p className="muted" style={{ fontSize: 14 }}>{compoundStep.testNote}</p>
            </div>
          </div>
        </section>

        {/* The loop — six cards on the Comet rail */}
        <section id="loop" className={`${cards.section} ${styles.anchor}`} aria-labelledby="loop-title">
          <div className={shared.container}>
            <span className={shared.eyebrow}>{loopIntro.eyebrow}</span>
            <h2 id="loop-title" className={`${shared.display} ${cards.title}`} style={{ marginTop: 12 }}>{loopIntro.title}</h2>
            <div className={styles.prose} style={{ maxWidth: 720, marginBottom: 40 }}>
              {loopIntro.body.map((p, i) => <p key={p} className={i ? "muted" : undefined}>{p}</p>)}
            </div>
            <ul className={cards.grid} role="list">
              {loopStages.map((st, i) => (
                <li key={st.id} className={`${cards.card} ${shared.reveal}`}>
                  <figure className={cards.figure} style={{ "--orb-color": orbFor(i) } as React.CSSProperties}>
                    <span className={`${shared.orb} ${cards.orb}`} aria-hidden="true" />
                    <span className={`${shared.glass} ${cards.chip}`}>{st.n} · {st.skill}</span>
                    <ul className={styles.stageActions}>
                      {st.actions.map((a) => <li key={a} className={shared.glass}>{a}</li>)}
                    </ul>
                    <figcaption className={`${shared.glass} ${cards.prompt}`}>{st.question}</figcaption>
                  </figure>
                  <h3 className={cards.label}>{st.name}</h3>
                  <div className={styles.stageMeta}>
                    <span><b>Who:</b> {st.owner}</span>
                    <span><b>Leaves behind:</b> {st.artifact}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Compound, the most important step */}
        <section className={styles.chapter} aria-labelledby="compound-title">
          <div className={`${shared.container} ${styles.chapterInner}`}>
            <div>
              <span className={shared.eyebrow}>{compoundStep.eyebrow}</span>
              <h2 id="compound-title" className={`${shared.display} ${styles.chapterTitle}`} style={{ marginTop: 12 }}>{compoundStep.title}</h2>
            </div>
            <div className={styles.prose}>
              <p>{compoundStep.body}</p>
              <ol className={styles.points} style={{ color: "var(--fg-2)" }}>
                {loopStages[5].actions.map((a) => <li key={a}>{a}</li>)}
              </ol>
            </div>
          </div>
        </section>

        {/* Who does what */}
        <section id="roles" className={styles.chapter} aria-labelledby="roles-title">
          <div className={shared.container}>
            <div className={styles.chapterInner} style={{ marginBottom: 40 }}>
              <div>
                <span className={shared.eyebrow}>{phases.eyebrow}</span>
                <h2 id="roles-title" className={`${shared.display} ${styles.chapterTitle}`} style={{ marginTop: 12 }}>{phases.title}</h2>
              </div>
              <div className={styles.prose}><p>{phases.body}</p></div>
            </div>
            <div className={styles.roles} role="table" aria-label="Roles in the process">
              {phases.roles.map((r) => (
                <div key={r.role} className={styles.roleRow} role="row">
                  <b role="cell">{r.role}</b>
                  <span role="cell"><i>Owns</i>{r.owns}</span>
                  <span role="cell"><i>Never</i>{r.never}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* The plugin — bridge + lists */}
        <section id="plugin" className={`${bridge.section} ${styles.anchor}`} aria-labelledby="plugin-title">
          <div className={`${shared.container} ${bridge.inner}`}>
            <div className={bridge.copy}>
              <span className={shared.eyebrow}>{plugin.eyebrow}</span>
              <h2 id="plugin-title" className={`${shared.display} ${bridge.title}`}>{plugin.title}</h2>
              <p className={shared.lead}>{plugin.body}</p>
              <p className={styles.note}>
                In this release: {s.counts.skills} skills and {s.counts.agents} agents, {v(s.currentVersion)}. Every active resource holds evidence level {s.currentCEL}; runtime uplift is {s.runtimeUplift}.
              </p>
              <div className={bridge.actions}>
                <Link href="/resources" className={shared.btn}>See every resource</Link>
                <a href={REPO} className={bridge.hubLink} rel="noopener">Repository →</a>
              </div>
            </div>
            <div>
              <h3 className={styles.subTitle}>Installation</h3>
              <ol className={styles.installList}>
                {plugin.install.map(([n, name, cmd]) => (
                  <li key={n} className={shared.glass}>
                    <span>{n}</span>
                    <div><b>{name}</b><code>{cmd}</code></div>
                  </li>
                ))}
              </ol>
              <p className={styles.note}>{plugin.installNote}</p>
            </div>
          </div>
          <div className={`${shared.container} ${styles.pluginGrid}`}>
            <div>
              <h3 className={styles.subTitle}>{plugin.whereTitle}</h3>
              <ul className={styles.kv}>
                {plugin.where.map(([k, val]) => (
                  <li key={k}><code>{k}</code><span>{val}</span></li>
                ))}
              </ul>
              <p className={styles.note}>{plugin.whereNote}</p>
            </div>
            <div>
              <h3 className={styles.subTitle}>{plugin.commandsTitle}</h3>
              <ul className={styles.kv}>
                {plugin.commands.map(([k, val]) => (
                  <li key={k}><Link href={`/resources/${k}`} style={{ color: "inherit" }}><b>{k}</b></Link><span>{val}</span></li>
                ))}
              </ul>
              <h3 className={styles.subTitle} style={{ marginTop: 32 }}>{plugin.specialistsTitle}</h3>
              <ul className={styles.kv}>
                {plugin.specialists.map(([k, val]) => (
                  <li key={k}><b>{k}</b><span>{val}</span></li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Where the learning goes — dark panel + tiles */}
        <section id="learning" className={`${film.section} ${styles.anchor}`} aria-labelledby="learning-title">
          <div className={shared.container}>
            <div className={film.head}>
              <span className={shared.eyebrow}>{learningFilm.eyebrow}</span>
              <h2 id="learning-title" className={`${shared.display} ${film.title}`}>{learningFilm.title}</h2>
              <p className={shared.lead}>{learningFilm.body}</p>
            </div>
          </div>
          <div className={`${film.videoWrap} ${shared.reveal}`}>
            <div className={styles.film}>
              <div className={styles.filmChain} role="list" aria-label="How a learning changes form">
                {learningFilm.chain.map((item, i) => (
                  <span key={item} role="listitem" className={i === 3 || i === 4 ? styles.hi : undefined}>
                    {item}
                    {i < learningFilm.chain.length - 1 && <i aria-hidden="true"> →</i>}
                  </span>
                ))}
              </div>
              <p className={styles.filmNote}>Highlighted: the two forms only Compound produces.</p>
            </div>
          </div>
          <ul className={film.tiles} role="list" aria-label={learningFilm.tilesLabel}>
            {whatCompounds.map(([from, to], i) => (
              <li key={from} className={film.tile} style={{ "--orb-color": orbFor(i) } as React.CSSProperties}>
                <span className={`${shared.orb} ${film.tileOrb}`} aria-hidden="true" />
                <span className={film.tileLabel} style={{ display: "grid", gap: 4 }}>
                  <span className={styles.tileFrom}>{from}</span>
                  <span className={styles.tileTo}>{to}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Beliefs to let go — accordion */}
        <section id="unlearn" className={`${faq.section} ${styles.anchor}`} aria-labelledby="unlearn-title">
          <div className={`${shared.container} ${faq.inner}`}>
            <div>
              <span className={shared.eyebrow}>{beliefsToLetGo.eyebrow}</span>
              <h2 id="unlearn-title" className={`${shared.display} ${faq.title}`} style={{ marginTop: 12 }}>{beliefsToLetGo.title}</h2>
              <p className={styles.note} style={{ maxWidth: 40 * 10 }}>{beliefsToLetGo.body}</p>
            </div>
            <div className={faq.list}>
              {beliefsToLetGo.items.map((item) => (
                <details key={item.belief} className={faq.item}>
                  <summary className={faq.summary}>
                    <span>{item.belief}</span>
                    <span className={faq.icon} aria-hidden="true" />
                  </summary>
                  <p className={faq.answer}>{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
          <div className={`${shared.container} ${styles.chapterInner}`} style={{ marginTop: 56 }}>
            <div>
              <h3 className={styles.subTitle}>{beliefsToLetGo.transitionsTitle}</h3>
            </div>
            <ul className={styles.adopt}>
              {beliefsToLetGo.transitions.map((t) => (
                <li key={t.name}><b>{t.name}</b><p>{t.body}</p></li>
              ))}
            </ul>
          </div>
          <div className={faq.media} aria-hidden="true">
            <span className={`${shared.orb} ${faq.orb}`} />
          </div>
        </section>

        {/* Beliefs to adopt */}
        <section id="adopt" className={styles.chapter} aria-labelledby="adopt-title">
          <div className={shared.container}>
            <span className={shared.eyebrow}>{beliefsToAdopt.eyebrow}</span>
            <h2 id="adopt-title" className={`${shared.display} ${styles.chapterTitle}`} style={{ margin: "12px 0 32px" }}>{beliefsToAdopt.title}</h2>
            <ul className={styles.adopt}>
              {beliefsToAdopt.items.map((b) => (
                <li key={b.name}><b>{b.name}</b><p>{b.body}</p></li>
              ))}
            </ul>
            <h3 className={styles.subTitle} style={{ marginTop: 48 }}>{beliefsToAdopt.principlesTitle}</h3>
            <ol className={styles.principles}>
              {beliefsToAdopt.principles.map((p) => <li key={p} className={shared.glass}>{p}</li>)}
            </ol>
            <p className={styles.note} style={{ maxWidth: 640 }}>{beliefsToAdopt.universal}</p>
          </div>
        </section>

        {/* Getting started */}
        <section id="start" className={styles.chapter} aria-labelledby="start-title">
          <div className={shared.container}>
            <div className={styles.chapterInner} style={{ marginBottom: 40 }}>
              <div>
                <span className={shared.eyebrow}>{gettingStarted.eyebrow}</span>
                <h2 id="start-title" className={`${shared.display} ${styles.chapterTitle}`} style={{ marginTop: 12 }}>{gettingStarted.title}</h2>
              </div>
              <div className={styles.prose}><p>{gettingStarted.body}</p></div>
            </div>
            <ol className={styles.ladder}>
              {gettingStarted.stages.map((st) => (
                <li key={st.n} className={"key" in st && st.key ? styles.key : undefined}>
                  <span>Stage {st.n}</span>
                  <b>{st.name}</b>
                  <p>{st.body}</p>
                </li>
              ))}
            </ol>
            <h3 className={styles.subTitle} style={{ marginTop: 48 }}>{gettingStarted.levelTitle}</h3>
            <ul className={styles.levels}>
              {gettingStarted.levels.map((l) => (
                <li key={l.from}>
                  <span>{l.from}</span>
                  <div><b>{l.name}</b><p>{l.body}</p></div>
                  <span className={`${shared.glass} ${styles.move}`}><i>Compounding move</i>{l.move}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Three questions */}
        <section id="questions" className={styles.chapter} aria-labelledby="questions-title">
          <div className={shared.container}>
            <div className={styles.chapterInner} style={{ marginBottom: 32 }}>
              <div>
                <span className={shared.eyebrow}>{threeQuestions.eyebrow}</span>
                <h2 id="questions-title" className={`${shared.display} ${styles.chapterTitle}`} style={{ marginTop: 12 }}>{threeQuestions.title}</h2>
              </div>
              <div className={styles.prose}><p className="muted">{threeQuestions.body}</p></div>
            </div>
            <ol className={styles.questions}>
              {threeQuestions.questions.map((q) => <li key={q} className={shared.glass}>{q}</li>)}
            </ol>
          </div>
        </section>

        {/* Best practices */}
        <section id="practices" className={styles.chapter} aria-labelledby="practices-title">
          <div className={shared.container}>
            <span className={shared.eyebrow}>Best practices</span>
            <h2 id="practices-title" className={`${shared.display} ${styles.chapterTitle}`} style={{ margin: "12px 0 32px" }}>How teams run it.</h2>
            {practices.map((p) => (
              <article key={p.id} id={`practice-${p.id}`} className={styles.practice}>
                <div className={styles.practiceHead}>
                  <span className={styles.practiceTag}>Best practice</span>
                  <h3>{p.name}</h3>
                  <p>{p.lede}</p>
                </div>
                <div>
                  {p.traditional && p.compound && (
                    <div className={styles.compare}>
                      <div className={shared.glass}>
                        <h4>Traditional flow</h4>
                        <ol>{p.traditional.map((t) => <li key={t}>{t}</li>)}</ol>
                      </div>
                      <div className={`${shared.glass} ${styles.win}`}>
                        <h4>Compound flow</h4>
                        <ol>{p.compound.map((t) => <li key={t}>{t}</li>)}</ol>
                      </div>
                    </div>
                  )}
                  {p.code && <pre className={styles.code}>{p.code}</pre>}
                  {p.points && <ul className={styles.points}>{p.points.map((t) => <li key={t}>{t}</li>)}</ul>}
                  {p.soon && <span className={styles.soon}>More coming soon.</span>}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Closing */}
        <section className={closingCss.section} aria-labelledby="closing-title">
          <div className={closingCss.backdrop} aria-hidden="true">
            <span className={`${shared.orb} ${closingCss.orbA}`} />
            <span className={`${shared.orb} ${closingCss.orbB}`} />
          </div>
          <div className={`${shared.container} ${closingCss.inner}`}>
            <h2 id="closing-title" className={`${shared.display} ${closingCss.title}`}>{closing.title}</h2>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
              <a href="#plugin" className={`${shared.btn} ${closingCss.cta}`}>{closing.cta}</a>
              <Link href="/resources" className={`${shared.btn} ${closingCss.cta}`} style={{ background: "transparent", color: "var(--bg)", borderColor: "rgba(251,250,244,.3)" }}>{closing.secondary}</Link>
            </div>
          </div>
        </section>
      </main>

      <footer className={footerCss.footer}>
        <div className={`${shared.container} ${footerCss.inner}`}>
          <a href={REPO} className={footerCss.follow} rel="noopener">{guideFooter.follow} →</a>
          <div className={footerCss.wordmark} aria-hidden="true">{guideFooter.wordmark}</div>
        </div>
      </footer>
    </div>
  );
}
```

### `src/app/guide/guide.module.css`

```css
/*
 * Guide — sections the Comet formula does not already provide (prose chapters, roles, lists,
 * ladder, practices). Every value comes from the Comet tokens in comet.module.css.
 */
.chapters { padding: 40px 0 0; }
.chapterList { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 8px 6px; }
.chapterList a { display: inline-flex; align-items: center; gap: 8px; min-height: 36px; padding: 0 12px; border: 1px solid var(--line); border-radius: var(--radius-pill); color: var(--fg); text-decoration: none; font: 500 13px/1 var(--font-body); background: var(--surface-2); }
.chapterList a:hover { background: var(--surface); }
.chapterList a:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
.chapterList i { font: 500 11px/1 var(--font-mono); color: var(--fg-2); font-style: normal; }

/* loop drawn inside the hero "screen" placeholder */
.loopScreen { position: absolute; inset: auto 0 0; height: 78%; width: min(1040px, 100%); margin: 0 auto; padding: clamp(20px, 3vw, 40px); display: flex; flex-direction: column; justify-content: center; gap: 18px; }
.loopRow { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 10px; }
.loopNode { display: flex; flex-direction: column; gap: 6px; padding: 14px; min-height: 96px; }
.loopNode b { font: 500 15px/1.1 var(--font-body); }
.loopNode span { font: 500 11px/1.2 var(--font-mono); color: var(--fg-2); }
.loopNode i { font: 400 12px/1.3 var(--font-body); font-style: italic; color: var(--fg-2); }
.loopRepeat { align-self: center; font: 500 12px/1 var(--font-mono); letter-spacing: 0.08em; text-transform: uppercase; color: var(--fg-2); }

/* prose chapter: eyebrow + title left, body right */
.anchor { scroll-margin-top: 88px; }
.chapter { padding: var(--section-gap) 0 0; scroll-margin-top: 88px; }
.chapterInner { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: 48px; align-items: start; }
.chapterTitle { font-size: clamp(32px, 4.4vw, 56px); }
.prose { display: flex; flex-direction: column; gap: 18px; }
.prose p { margin: 0; font-size: clamp(17px, 1.5vw, 19px); line-height: 1.55; color: var(--fg); }
.prose p.muted { color: var(--fg-2); }
.quote { margin: 8px 0 0; padding: 20px 24px; border-left: 2px solid var(--fg); font-family: var(--font-display); font-style: italic; font-size: clamp(20px, 2vw, 26px); line-height: 1.3; }

/* stage cards: what is inside the Comet card figure */
.stageActions { list-style: none; margin: 0 0 12px; padding: 0; display: flex; flex-direction: column; gap: 6px; position: relative; }
.stageActions li { padding: 8px 10px; font-size: 13px; line-height: 1.35; }
.stageMeta { display: grid; gap: 4px; margin-top: 8px; font: 400 13px/1.4 var(--font-body); color: var(--fg-2); }
.stageMeta b { font-weight: 500; color: var(--fg); }
.stageSkill { font: 500 12px/1 var(--font-mono); color: var(--fg-2); }

/* roles */
.roles { display: grid; grid-template-columns: 1fr; border-top: 1px solid var(--line); }
.roleRow { display: grid; grid-template-columns: 180px minmax(0, 1fr) minmax(0, 1fr); gap: 24px; padding: 20px 0; border-bottom: 1px solid var(--line); }
.roleRow b { font: 500 17px/1.3 var(--font-body); }
.roleRow span { font-size: 15px; line-height: 1.5; color: var(--fg-2); }
.roleRow span i { display: block; font: 500 11px/1 var(--font-mono); letter-spacing: 0.08em; text-transform: uppercase; color: var(--fg-2); margin-bottom: 8px; font-style: normal; }

/* plugin lists */
.pluginGrid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 48px; margin-top: 40px; }
.installList { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
.installList li { display: grid; grid-template-columns: 36px 1fr; gap: 12px; padding: 14px 16px; }
.installList li span:first-child { font: 500 12px/1.4 var(--font-mono); color: var(--fg-2); }
.installList b { display: block; font: 500 15px/1.3 var(--font-body); margin-bottom: 6px; }
.installList code { font: 400 13px/1.4 var(--font-mono); color: var(--fg); word-break: break-all; }
.kv { list-style: none; margin: 0; padding: 0; border-top: 1px solid var(--line); }
.kv li { display: grid; grid-template-columns: minmax(150px, 2fr) minmax(0, 5fr); gap: 16px; padding: 14px 0; border-bottom: 1px solid var(--line); font-size: 15px; line-height: 1.5; }
.kv li code, .kv li b { font: 500 13px/1.5 var(--font-mono); color: var(--fg); }
.kv li span { color: var(--fg-2); }
.subTitle { margin: 0 0 14px; font: 500 12px/1 var(--font-mono); letter-spacing: 0.08em; text-transform: uppercase; color: var(--fg-2); }
.note { margin: 14px 0 0; font-size: 14px; line-height: 1.5; color: var(--fg-2); }

/* film panel */
.film { position: relative; display: flex; flex-direction: column; justify-content: center; gap: 24px; padding: clamp(24px, 4vw, 56px); color: var(--bg); }
.filmChain { display: flex; flex-wrap: wrap; align-items: center; gap: 10px 14px; font: 500 clamp(14px, 1.6vw, 20px)/1.3 var(--font-body); }
.filmChain i { font-style: normal; color: rgba(251, 250, 244, 0.5); }
.filmChain .hi { color: var(--orb-2); }
.filmNote { margin: 0; font: 500 12px/1.3 var(--font-mono); color: rgba(251, 250, 244, 0.6); }
.tileFrom { font: 500 13px/1.2 var(--font-body); color: var(--fg); }
.tileTo { font: 500 12px/1.3 var(--font-mono); color: var(--fg-2); }

/* beliefs to adopt, principles */
.adopt { list-style: none; margin: 0; padding: 0; border-top: 1px solid var(--line); }
.adopt li { display: grid; grid-template-columns: minmax(0, 4fr) minmax(0, 7fr); gap: 24px; padding: 22px 0; border-bottom: 1px solid var(--line); }
.adopt b { font: 400 clamp(20px, 2vw, 26px)/1.2 var(--font-display); }
.adopt p { margin: 0; font-size: 15px; line-height: 1.55; color: var(--fg-2); }
.principles { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; counter-reset: p; }
.principles li { padding: 16px 18px; font: 500 16px/1.35 var(--font-body); counter-increment: p; display: grid; grid-template-columns: 28px 1fr; gap: 10px; }
.principles li::before { content: counter(p, decimal-leading-zero); font: 500 12px/1.4 var(--font-mono); color: var(--fg-2); }

/* ladder */
.ladder { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
.ladder li { position: relative; overflow: hidden; padding: 20px; border-radius: 20px; background: var(--surface-2); border: 1px solid var(--line); display: flex; flex-direction: column; gap: 10px; min-height: 200px; }
.ladder li.key { background: var(--fg); color: var(--bg); }
.ladder li.key p { color: rgba(251, 250, 244, 0.75); }
.ladder li > span { font: 500 12px/1 var(--font-mono); color: var(--fg-2); }
.ladder li.key > span { color: rgba(251, 250, 244, 0.7); }
.ladder li b { font: 400 clamp(20px, 2vw, 24px)/1.15 var(--font-display); }
.ladder li p { margin: 0; font-size: 14px; line-height: 1.5; color: var(--fg-2); }
.levels { list-style: none; margin: 0; padding: 0; border-top: 1px solid var(--line); }
.levels li { display: grid; grid-template-columns: 80px minmax(0, 3fr) minmax(0, 4fr); gap: 20px; padding: 18px 0; border-bottom: 1px solid var(--line); font-size: 15px; line-height: 1.5; }
.levels li > span:first-child { font: 500 13px/1.5 var(--font-mono); color: var(--fg-2); }
.levels b { display: block; font-weight: 500; margin-bottom: 4px; }
.levels p { margin: 0; color: var(--fg-2); }
.move { display: block; padding: 12px 14px; }
.move i { display: block; font: 500 11px/1 var(--font-mono); letter-spacing: 0.08em; text-transform: uppercase; color: var(--fg-2); font-style: normal; margin-bottom: 6px; }

/* three questions */
.questions { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; counter-reset: q; }
.questions li { padding: 24px; min-height: 180px; display: flex; flex-direction: column; justify-content: space-between; gap: 20px; counter-increment: q; font: 400 clamp(20px, 2.2vw, 28px)/1.2 var(--font-display); }
.questions li::before { content: counter(q, decimal-leading-zero); font: 500 12px/1 var(--font-mono); color: var(--fg-2); }

/* practices */
.practice { display: grid; grid-template-columns: minmax(0, 4fr) minmax(0, 7fr); gap: 32px; padding: 32px 0; border-top: 1px solid var(--line); }
.practiceHead { display: flex; flex-direction: column; gap: 10px; }
.practiceTag { font: 500 11px/1 var(--font-mono); letter-spacing: 0.08em; text-transform: uppercase; color: var(--fg-2); }
.practiceHead h3 { margin: 0; font: 400 clamp(22px, 2.4vw, 30px)/1.15 var(--font-display); }
.practiceHead p { margin: 0; font-size: 15px; line-height: 1.5; color: var(--fg-2); }
.compare { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
.compare > div { padding: 18px; }
.compare h4 { margin: 0 0 10px; font: 500 12px/1 var(--font-mono); letter-spacing: 0.08em; text-transform: uppercase; color: var(--fg-2); }
.compare ol { margin: 0; padding-left: 18px; display: flex; flex-direction: column; gap: 6px; font-size: 14px; line-height: 1.45; }
.compare .win { background: var(--fg); color: var(--bg); border-color: var(--fg); }
.compare .win h4 { color: rgba(251, 250, 244, 0.7); }
.points { margin: 0; padding-left: 18px; display: flex; flex-direction: column; gap: 8px; font-size: 15px; line-height: 1.5; }
.code { margin: 0 0 14px; padding: 18px 20px; border-radius: 16px; background: var(--fg); color: var(--bg); font: 400 13px/1.6 var(--font-mono); white-space: pre-wrap; overflow-x: auto; }
.soon { font: 500 12px/1 var(--font-mono); color: var(--fg-2); }

@media (max-width: 1100px) { .loopRow { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
@media (max-width: 820px) {
  .chapterInner, .pluginGrid, .adopt li, .practice, .compare, .principles, .questions { grid-template-columns: 1fr; }
  .chapterInner { gap: 20px; }
  .roleRow { grid-template-columns: 1fr; gap: 10px; }
  .ladder { grid-template-columns: 1fr; }
  .levels li { grid-template-columns: 60px 1fr; }
  .levels li > *:last-child { grid-column: 2; }
  .loopRow { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .loopNode { min-height: auto; padding: 10px; }
  .loopNode i { display: none; }
}
@media (max-width: 560px) { .loopRow { grid-template-columns: 1fr 1fr; } .loopNode b { font-size: 13px; } .loopNode span { display: none; } }
```

### `src/content/guide.ts`

```ts
// The Compound Design guide: the process, told the way a guide tells it.
//
// Structure and register follow Every's Compound Engineering guide (philosophy → the loop →
// the plugin → beliefs to let go → beliefs to adopt → getting started → three questions →
// best practices). Every mechanism named here is Compound Design's own and is documented in
// skills/, agents/ and compound-design/; nothing is borrowed prose. Factual state (version,
// counts, level) is never written here — the page reads it from current-state.ts.

export const guideHero = {
  eyebrow: "A guide, and a process",
  title: "Compound Design",
  subtitle: "Make every unit of design work compound into the next.",
  lede: "Compound Design came out of building web applications with AI agents and noticing something uncomfortable: a design engineer working through agents produces more interface than they can carefully judge, and the judgment they do apply disappears with the transcript. We turned the fix into a process — frame, model, build, verify, polish, then keep the one thing worth keeping — and into a plugin that installs it into the coding agent you already use. We're sharing it because we think this is how design engineering will be done, and because the process is built to find out if we're wrong.",
  platforms: "For Claude Code, Codex and Cursor · one canonical implementation, three hosts",
  cta: "Install the plugin",
  secondary: "Read the process",
};

export const philosophy = {
  eyebrow: "The philosophy",
  title: "Every unit of design work should make the next one easier — not harder.",
  problem: [
    "Most products get harder to design over time. Each screen adds a one-off: a spacing value nobody remembers choosing, an error message that names no recovery, a state nobody designed. After a few years a team spends more time negotiating with its own interface than improving it, and every new feature is a negotiation with the old ones.",
    "AI agents make this worse before they make it better. They produce interface faster than anyone can judge it, and when the session ends, the judgment goes with it. What you get is more screens and less system.",
  ],
  turn: [
    "Compound Design flips this on its head. Instead of screens adding debt, they teach the system. A review finding becomes a rule. A failure becomes an eval. A repeated solution becomes a pattern, a recurring interface becomes a component, a useful workflow becomes a skill. When they are codified, the lessons of one project become the starting capability of the next.",
    "Not everything compounds, and that is the point. Most of what happens in a project is not worth keeping. The little that is has to change form to survive, and it has to pass one test before it is written down.",
  ],
};

export const loopIntro = {
  eyebrow: "The main loop",
  title: "Frame → Model → Build → Verify → Polish → Compound → Repeat",
  body: [
    "The first five steps should be familiar to any design engineer. It's the sixth that separates Compound Design from design work with AI assistance. This is where the gains accumulate. Skip it, and you've built a good interface and kept nothing.",
    "The loop works the same whether you are fixing one form field in ten minutes or shipping a checkout over several days. Nothing forces a small change through six stages: the orchestrator picks the smallest sufficient path, and craft is not a stage — it is a quality of the answers at Model, Verify and Polish.",
    "Most thinking happens before and after the interface gets built. Frame and Verify are where the process spends its judgment. Build is where the agent spends its tokens.",
  ],
};

export interface LoopStage {
  id: string;
  n: string;
  name: string;
  question: string;
  actions: string[];
  owner: string;
  artifact: string;
  skill: string;
}

export const loopStages: LoopStage[] = [
  {
    id: "frame",
    n: "01",
    name: "Frame",
    question: "What are we actually solving?",
    actions: ["Restate the request as the problem underneath it", "Discover what a previous run already learned here", "Name the user, the outcome and the non-goals", "Write the constraints and what counts as done"],
    owner: "A person decides. The agent grounds the question in the repository.",
    artifact: "A frame — in the response, or a file only when a decision would otherwise be rediscovered.",
    skill: "cd-frame",
  },
  {
    id: "model",
    n: "02",
    name: "Model",
    question: "How should the product behave?",
    actions: ["Read the system that already exists", "Model entities, routes and relationships", "Enumerate every state, especially the ones nobody designed", "Separate instructions, data, tools and actions where AI is involved", "Write the contract Build implements"],
    owner: "The agent proposes. A person closes the open decisions.",
    artifact: "A behaviour contract Build can implement and Verify can check without re-deciding anything.",
    skill: "cd-model",
  },
  {
    id: "build",
    n: "03",
    name: "Build",
    question: "Make it real.",
    actions: ["Implement the contract inside the existing architecture", "Prefer the primitives the codebase already has", "Run the project's own checks", "Report exactly what changed, including what the contract did not ask for"],
    owner: "The agent. If you trust the model, there's no need to watch every line.",
    artifact: "A change, and a report of it.",
    skill: "cd-build",
  },
  {
    id: "verify",
    n: "04",
    name: "Verify",
    question: "Did reality match intention?",
    actions: ["Run the deterministic checks first", "Walk the model's states one by one", "Check reachability, focus and names", "Report findings in the shared shape. Don't fix them."],
    owner: "The agent reports. Reviewing is not permission to change.",
    artifact: "Findings: evidence, impact, severity, confidence, and observed / inferred / not-verified.",
    skill: "cd-verify",
  },
  {
    id: "polish",
    n: "05",
    name: "Polish",
    question: "Is it deliberate?",
    actions: ["Compare with sibling surfaces before changing anything", "Delete before you add", "Rewrite copy to name the action and the recovery", "Ask whether motion should exist at all before asking how it should move"],
    owner: "A person judges. Specialists are dispatched only when the work has a question for them.",
    artifact: "An interface that works and is deliberate — in that order.",
    skill: "cd-polish",
  },
  {
    id: "compound",
    n: "06",
    name: "Compound",
    question: "What deserves to improve future work?",
    actions: ["Capture the one learning a future run would otherwise rediscover", "Make it findable: the literal signals that will recur", "Update the system: a rule, an eval, a skill or a specialist", "Verify the learning: would the next run find it before repeating the mistake?"],
    owner: "A person decides what survives. Most runs keep nothing, and that is a valid result.",
    artifact: "One durable learning, or none.",
    skill: "cd-compound",
  },
];

export const compoundStep = {
  eyebrow: "Compound — the most important step",
  title: "The first five steps produce an interface. The sixth produces a system that designs interfaces better each time.",
  body: "This is the step teams skip, because the feature is already shipped and nothing visible is waiting. Compound Design makes it a stage with a procedure, a bar and a write authority. It writes one learning per run, only when the learning passes the durability test, with the frontmatter that lets the next Frame find it without anyone remembering it exists.",
  test: "If this disappeared, would a future human or agent likely repeat meaningful work, risk or investigation?",
  testNote: "Effort spent and the size of the change confer no eligibility. A learning already recoverable from the code is not written down again.",
};

export const phases = {
  eyebrow: "Who does what",
  title: "People at the beginning and the end. Agents in the middle.",
  body: "At the beginning, a person decides what is worth building and what would count as done. In the middle, the agent models, builds, checks and reports. At the end, a person judges whether the interface is good enough for users and whether the system learned anything reusable. The process is a sandwich: agents are the filling, people are the bread.",
  roles: [
    { role: "Design engineer", owns: "Frame, the open decisions in Model, the judgment in Polish, and the decision of what compounds.", never: "Reviews every pixel. If the result can't be trusted, the fix is in the system." },
    { role: "Orchestrator", owns: "Routing: the smallest sufficient path through the loop, and which specialist owns a judgment it should not make itself.", never: "Performs a stage's procedure when that stage's skill exists." },
    { role: "Specialists", owns: "Interface craft, motion, and user-facing AI — dispatched into their own context, only when the work has a question for them.", never: "Modify source. Report-only, one finding shape, no exceptions." },
    { role: "Quality gate", owns: "Saying no. Construction quality and evidence maturity, kept apart, before any promotion claim.", never: "Lets a good output count as evidence." },
    { role: "Learning curator", owns: "Keeping the learning store true, distinct and findable — including by deleting.", never: "Silently corrects the guidance it audits." },
  ],
};

export const plugin = {
  eyebrow: "The plugin",
  title: "What's in the box.",
  body: "One canonical directory of skills, a handful of thin agents that point at them, and manifests for three hosts. The installed plugin clones nothing and calls no model on its own. Compute lives in the agent you already run.",
  install: [
    ["01", "Add the marketplace", "/plugin marketplace add DaniloAmaralUX/compoundmetrics"],
    ["02", "Install the plugin", "/plugin install compound-design@compound-design"],
    ["03", "Set up a project", "/cd-setup"],
  ] as const,
  installNote: "Setup diagnoses, offers each fix, and changes nothing you own without asking. Codex and Cursor read the same directory through their own manifests.",
  whereTitle: "Where things live",
  where: [
    ["STRATEGY.md", "The anchor. Frame and Model read it every run. Short is a feature."],
    [".compound-design/config.yaml", "Team defaults: artifact root, review mode, runtime policy. A per-checkout override is never committed."],
    ["docs/frames/", "What a piece of work is actually solving. Written only when a decision would otherwise be rediscovered."],
    ["docs/plans/", "How the product must behave — the contract Build implements and Verify checks."],
    ["docs/solutions/", "Your institutional knowledge. One learning per run, each with the literal signals that will recur, so the next run finds it before repeating the mistake."],
    ["docs/handoffs/", "One immutable, pointer-first handoff per session end, so the next session can resume without re-reading everything."],
  ],
  whereNote: "Project work memory lives under one root you configure. The framework's own evidence system lives elsewhere and never mixes with it.",
  commandsTitle: "Core commands",
  commands: [
    ["cd-frame", "When the request arrived as a solution, start here."],
    ["cd-model", "When behaviour needs deciding before code."],
    ["cd-build", "Implement the contract. Run the checks. Report what changed."],
    ["cd-verify", "Check reality against intention. Report-only."],
    ["cd-polish", "Make it deliberate, after it works."],
    ["cd-compound", "Keep the one thing worth keeping."],
    ["cd-strategy", "Write or refresh the anchor."],
    ["cd-compound-refresh", "Audit the learning store. Keep, update, consolidate, replace or delete."],
    ["cd-setup", "Diagnose a repository and offer each fix."],
    ["cd-handoff", "Leave a session so the next one can resume."],
  ],
  specialistsTitle: "Specialists",
  specialists: [
    ["Interface Review", "What in this interface materially costs the user?"],
    ["Motion Review", "Should this move at all — and if so, how?"],
    ["AI Interaction Review", "Can people rely on this AI well, and stay in control?"],
    ["Quality Gate", "Is it well built, and separately, is it proven?"],
    ["Resource Lab", "How does a resource improve without a bigger prompt?"],
  ],
};

export const learningFilm = {
  eyebrow: "Where the learning goes",
  title: "Knowledge changes form on its way to the next project.",
  body: "Every arrow is a decision someone has to make. The system provides the forms and the tests; it does not decide for you what deserves to survive.",
  chain: ["Work", "Observation", "Solution", "Learning Ledger", "Rule · Pattern · Skill · Agent · Eval", "Future work"],
  tilesLabel: "What compounds",
};

export const beliefsToLetGo = {
  eyebrow: "Beliefs to let go",
  title: "Eight things to unlearn.",
  body: "Compound Design asks for a few habits most design engineers were trained into. Each one felt like craft. Each one stops scaling the moment an agent is doing the drawing.",
  items: [
    { belief: "‘The interface must be drawn by hand’", answer: "Who draws it — a person or an agent — doesn't matter. What matters is that someone decided what it must do, and someone judged whether it does. Those two jobs are yours. The drawing is not." },
    { belief: "‘Every screen must be reviewed pixel by pixel’", answer: "If you don't trust the result, fix the system: a rule, an eval, a specialist. Don't compensate by looking at everything yourself. A review that has to see every pixel is a review that will stop happening." },
    { belief: "‘Taste can't be written down’", answer: "Some of it can't. Most of it is a decision that was made once and never recorded. Write the decision down where the next run will find it, and keep the taste for what is left." },
    { belief: "‘The mockup is the primary artifact’", answer: "A system that produces good interfaces is worth more than any one interface. The model, the rule and the eval outlive the mockup. Treat the mockup as an input to Frame, not the output of the work." },
    { belief: "‘Craft is the last stage’", answer: "Craft is not a stage. It is the quality of the answers at Model, Verify and Polish, expressed through the specialists they call. An interface polished before it works is polished twice." },
    { belief: "‘First attempts should be good’", answer: "First attempts are mostly wrong. That is what Verify is for. The process assumes correction and budgets for it; it does not apologise for it." },
    { belief: "‘The design is mine’", answer: "It belongs to the team, the product and the users. What is yours is the judgment — and the judgment is worth more once it is in the system than it ever was in your head." },
    { belief: "‘A claim is fine if the output looks good’", answer: "A good output is not evidence. A thing can be well built and still unproven; usually, it is. Compound Design keeps two numbers and never merges them, so the site — and your team — can say plainly what has and has not been shown." },
  ],
  transitionsTitle: "Transition challenges",
  transitions: [
    { name: "Less drawing feels like less design", body: "It isn't. The design moved from the screen to the frame and the model, where it is cheaper to fix and possible to check." },
    { name: "Letting go feels risky", body: "It is, without safety nets. The loop's answer is not more review; it is deterministic checks, report-only findings, and a stage that refuses to move until the contract holds." },
    { name: "Who designed this?", body: "You did the deciding. The agent did the rendering. The record — frame, model, findings, learning — says so, in a form the next person can read." },
  ],
};

export const beliefsToAdopt = {
  eyebrow: "Beliefs to adopt",
  title: "What replaces them.",
  items: [
    { name: "Extract your taste into the system", body: "Every time you correct the same thing twice, you are paying for a rule you haven't written. Put it in the strategy anchor, in a specialist's procedure, or in an eval. Correcting it in a review neither scales nor lets the rest of the team learn." },
    { name: "Two numbers, never one", body: "Construction quality asks whether a resource is bounded, grounded, actionable, testable and maintainable. Evidence maturity asks whether it has been shown to make the work better, against a baseline, more than once. A high construction score at a low evidence level is the normal case. The vocabulary exists to keep it visible." },
    { name: "An artifact must be earned", body: "Most runs write no document. A frame, a plan or a learning appears when a decision, a constraint or a lesson would otherwise have to be rediscovered — lightweight in the response, bounded for the session, durable on disk. Bureaucracy-as-code is the failure mode this rule prevents." },
    { name: "Review reports. People decide.", body: "Reviewing something is not permission to change it. Every reviewer emits one finding shape — evidence, impact, severity, confidence, verification state — and applying a finding is a separate, explicit act." },
    { name: "Make the environment agent-native", body: "If a design engineer can see or run something, the agent should be able to see or run it too: the dev server, the checks, the design system, the prior learning. An agent that cannot run the check reports the check as not verified, never as passed." },
    { name: "Models are the new mockups", body: "Fixing behaviour in a model is cheaper than fixing it in a screen, and cheaper still than fixing it in production. A model that lists every state — including the ones nobody designed — is the most valuable document the loop produces." },
    { name: "Budget the compound step", body: "If it isn't on the calendar, it doesn't happen. One learning per run is the bar, and most runs keep nothing. Institutionally, that means the last stage of every piece of work is scheduled, owned and allowed to conclude ‘nothing survives’." },
  ],
  principlesTitle: "Core principles",
  principles: [
    "Every unit of design work makes the next one easier.",
    "Taste belongs in the system, not in the review.",
    "Teach the system. Don't do the work yourself.",
    "Build checks, not gatekeepers.",
    "Make the environment agent-native.",
    "An artifact must be earned.",
    "A claim never exceeds its evidence.",
    "Ship more interface. Draw less.",
  ],
  universal: "The principles extend beyond interface work to research, content and product decisions. The steps are the same: frame, model, build, verify, polish, compound.",
};

export const gettingStarted = {
  eyebrow: "Getting started",
  title: "Find yourself on the ladder.",
  body: "There are six stages against which a design engineer — or a team — can plot themselves. Skipping stages doesn't work: each one builds the trust the next one spends.",
  stages: [
    { n: "0", name: "Manual design", body: "Mockups by hand, handoff by document, review by meeting. The system learns nothing between projects." },
    { n: "1", name: "Chat-based assistance", body: "You ask a model for a component and paste it in. Faster, but the judgment still lives in your head and leaves with the tab." },
    { n: "2", name: "Agentic tools with screen-by-screen review", body: "The agent builds; you inspect every screen. Most teams plateau here, because the review is the bottleneck and nothing is written down." },
    { n: "3", name: "Frame-first, review-by-contract", body: "You write the frame and the model. You review against them, not against every pixel. This is where everything changes. Compound Design begins here.", key: true },
    { n: "4", name: "Request to pull request", body: "You describe the outcome. The loop runs. You judge at Polish and decide at Compound. The findings arrive in one shape, and the learning is on disk before the branch merges." },
    { n: "5", name: "Parallel, across a team", body: "Several loops run at once. The learning store is shared, refreshed on a schedule, and allowed to delete. The process is institutional: anyone can run it, and the record shows who decided what." },
  ],
  levelTitle: "How to level up",
  levels: [
    { from: "0 → 1", name: "Start collaborating", body: "Use a model for the parts you would have searched for anyway.", move: "Keep a running note of prompts that produced interface you kept." },
    { from: "1 → 2", name: "Let the agent in", body: "Give it the repository, the dev server and the checks.", move: "Write STRATEGY.md — the anchor every run reads before it asks you anything." },
    { from: "2 → 3", name: "Trust the frame", body: "Write the frame and the model before the screen. Review against them. This is the key transition.", move: "When the result is wrong, document what the frame or the model missed — not what the screen got wrong." },
    { from: "3 → 4", name: "Describe, don't draw", body: "State the outcome and the constraints; let the loop choose the path.", move: "Run cd-setup on every repository and build a library of outcome-focused frames." },
    { from: "4 → 5", name: "Run it as an institution", body: "Several people, several loops, one store.", move: "Schedule cd-compound-refresh and let it delete what is no longer true." },
  ],
};

export const threeQuestions = {
  eyebrow: "Three questions",
  title: "Ask these before you accept an interface.",
  body: "Agents know where their weaknesses are, but you have to ask. The finding contract makes the answer explicit: every claim is observed, inferred or not verified, and a check that could not be run is never reported as passed.",
  questions: ["What would this cost a user if it were wrong?", "What did you observe, and what did you infer?", "What are you least confident about?"],
};

export interface Practice {
  id: string;
  name: string;
  lede: string;
  traditional?: string[];
  compound?: string[];
  points?: string[];
  code?: string;
  soon?: boolean;
}

export const practices: Practice[] = [
  {
    id: "designers",
    name: "Working with designers",
    lede: "The handoff was the problem, not the designer.",
    traditional: ["Designer draws in a design tool", "Engineer rebuilds it from a screenshot", "Review argues about the difference", "The decision is lost with the thread"],
    compound: ["Designer and engineer write the frame together", "Model names every state, including the ones the mockup didn't", "The agent builds against the design system the team already has", "Interface Review checks consistency with sibling surfaces", "Polish happens with the designer, on the working interface", "Compound records the decision where the next project will find it"],
  },
  {
    id: "taste",
    name: "Codifying design taste",
    lede: "A skill is taste that survived the person who had it.",
    code: `# skill: our-design-system
- Spacing comes from the scale. A one-off value is a finding, not a fix.
- An error names the recovery, never only the failure.
- Motion exists only when it explains a change of state.
- Meaning is never carried by colour alone.
- Reuse the primitive before writing a new one.`,
    points: ["Start from corrections you have made twice.", "Each line must be checkable by Verify or by a specialist.", "Put it where the agent reads it every run, not in a document nobody opens."],
  },
  {
    id: "review",
    name: "Review as a report",
    lede: "A finding is a claim with evidence. Everything else is commentary.",
    points: [
      "One shape for every reviewer: evidence, impact, severity, confidence, verification state, source.",
      "Three severities. One blocker outranks any number of minors, and severity is never inflated to make a review look important.",
      "A finding without evidence and impact is dropped. ‘It could be better’ is not a finding.",
      "One root cause is one finding, however many places it appears.",
      "Fixes are ordered by cost: delete the problem, use the platform default, reuse what exists, correct the value — and only then add something.",
    ],
  },
  {
    id: "store",
    name: "Keeping the store true",
    lede: "Institutional knowledge rots unless something is allowed to delete it.",
    points: [
      "Every learning gets exactly one outcome on refresh: keep, update, consolidate, replace or delete.",
      "Nothing is archived in place. Version history is the archive.",
      "Accuracy always runs; worth runs only when someone asks for a cleanup and confirms it.",
      "A learning that contradicts a skill is reported, never silently corrected.",
    ],
  },
  {
    id: "evidence",
    name: "Evidence discipline",
    lede: "The framework is allowed to say no — to itself first.",
    points: [
      "Construction quality and evidence maturity are separate numbers, and neither may borrow from the other.",
      "A resource reaches the first evidence level only by passing a deterministic contract suite, in its own commit.",
      "The controlled-runtime experiment is pre-registered with the conditions under which Compound loses, and it refuses to start without explicit paid-runtime authorisation.",
      "A resource that adds nothing over the open-source work it learned from is removed, not defended.",
    ],
  },
  {
    id: "team",
    name: "Team standards",
    lede: "Rules the organisation adopts, not suggestions the individual remembers.",
    points: [
      "A frame nobody approved is a guess. Silence is not approval; it is the absence of a decision.",
      "Review is not permission to change. Applying a finding is a separate act, by the owner.",
      "Handoffs are pointers, not copies: what matters at each reference, never the reference reproduced.",
      "Every claim on a public surface is derived from the repository's own records, and a guard fails the build when one is restated or inflated.",
    ],
  },
  {
    id: "ai",
    name: "User-facing AI",
    lede: "When the interface contains a model, six more questions apply.",
    points: [
      "AI fit — would deterministic UI be clearer, cheaper or more reliable?",
      "Reliance — can people accept good output and detect or reject bad output?",
      "Legibility — can the person understand enough of what the AI is doing to act well?",
      "Human control — are edit, reject, stop, approval and undo cheaper than recovery?",
      "Autonomy — does action power scale with consequence and reversibility?",
      "Evolution — can model, provider and data changes be regression-tested and rolled back?",
    ],
  },
  { id: "research", name: "User research", lede: "Research that never reaches a frame never reaches a screen.", soon: true },
  { id: "content", name: "Copy and content", lede: "Copy is part of the model, reviewed like code.", soon: true },
];

export const closing = {
  title: "Build the application. Improve the system that builds the next one.",
  cta: "Install the plugin",
  secondary: "See what has been encoded",
};

export const guideFooter = {
  follow: "Follow the project",
  wordmark: "Compound",
};

export const guideNav = {
  brand: "Compound Design",
  cta: "Install the plugin",
  chapters: [
    ["philosophy", "Philosophy"],
    ["loop", "The loop"],
    ["roles", "Who does what"],
    ["plugin", "The plugin"],
    ["learning", "Where learning goes"],
    ["unlearn", "Beliefs to let go"],
    ["adopt", "Beliefs to adopt"],
    ["start", "Getting started"],
    ["questions", "Three questions"],
    ["practices", "Best practices"],
  ] as const,
};
```
<!-- code:end -->
