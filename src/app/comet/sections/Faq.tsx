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
