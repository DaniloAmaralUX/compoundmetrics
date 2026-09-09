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
