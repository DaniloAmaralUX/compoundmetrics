import shared from "../comet.module.css";
import styles from "./Hero.module.css";
import { hero } from "../content";

/** Hero: H1 + H2 + linha de plataformas + CTA, sobre uma composição com esferas em parallax. */
export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={`${shared.container} ${styles.inner}`}>
        <h1 id="hero-title" className={`${shared.display} ${styles.h1}`}>{hero.h1.pt}</h1>
        <h2 className={`${shared.display} ${styles.h2}`}>{hero.h2.pt}</h2>
        <p className={styles.platforms}>{hero.platforms.pt}</p>
        <a href="/comet/download" className={`${shared.btn} ${styles.cta}`}>{hero.cta.pt}</a>
      </div>
      <div className={styles.composition} aria-hidden="true">
        <span className={`${shared.orb} ${styles.orbA}`} />
        <span className={`${shared.orb} ${styles.orbB}`} />
        <span className={`${shared.orb} ${styles.orbC}`} />
        <div className={`${shared.glass} ${styles.snippet} ${styles.snippetA}`}><span /><span /></div>
        <div className={`${shared.glass} ${styles.snippet} ${styles.snippetB}`}><span /><span /><span /></div>
        <div className={styles.screen} />
      </div>
    </section>
  );
}
