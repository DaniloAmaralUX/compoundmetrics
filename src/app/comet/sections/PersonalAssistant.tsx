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
