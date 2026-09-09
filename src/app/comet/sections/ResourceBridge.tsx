import shared from "../comet.module.css";
import styles from "./ResourceBridge.module.css";
import { RESOURCES_URL, resourceBridge } from "../content";

/** Ponte para a central de recursos: duas linhas de copy, um CTA e um link secundário. */
export function ResourceBridge() {
  return (
    <section className={styles.section} aria-labelledby="bridge-title">
      <div className={`${shared.container} ${styles.inner}`}>
        <div className={styles.copy}>
          <h2 id="bridge-title" className={`${shared.display} ${styles.title}`}>{resourceBridge.line1.pt}</h2>
          <p className={shared.lead}>{resourceBridge.line2.pt}</p>
          <div className={styles.actions}>
            <a href={RESOURCES_URL} className={shared.btn} rel="noopener">{resourceBridge.cta.pt}</a>
            <a href={RESOURCES_URL} className={styles.hubLink} rel="noopener">{resourceBridge.hubLink.pt} →</a>
          </div>
        </div>
        <div className={styles.media} aria-hidden="true">
          <span className={`${shared.orb} ${styles.orb}`} />
          <div className={styles.shot} />
        </div>
      </div>
    </section>
  );
}
