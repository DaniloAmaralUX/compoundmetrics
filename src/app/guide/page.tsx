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
