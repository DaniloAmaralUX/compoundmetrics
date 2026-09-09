import shared from "../comet.module.css";
import styles from "./ClosingCta.module.css";
import { closing } from "../content";

/** "Navegue com inteligência": seção full-bleed com fundo em movimento e o mesmo CTA de download. */
export function ClosingCta() {
  return (
    <section className={styles.section} aria-labelledby="closing-title">
      <div className={styles.backdrop} aria-hidden="true">
        <span className={`${shared.orb} ${styles.orbA}`} />
        <span className={`${shared.orb} ${styles.orbB}`} />
      </div>
      <div className={`${shared.container} ${styles.inner}`}>
        <h2 id="closing-title" className={`${shared.display} ${styles.title}`}>{closing.heading.pt}</h2>
        <a href="/comet/download" className={`${shared.btn} ${styles.cta}`}>{closing.cta.pt}</a>
      </div>
    </section>
  );
}
