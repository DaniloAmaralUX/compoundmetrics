import shared from "../comet.module.css";
import styles from "./Footer.module.css";
import { FOLLOW_URL, footer } from "../content";

/** Rodapé: "Siga o Comet" + marca grande. Links legais da referência são desconhecidos e não foram inventados. */
export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`${shared.container} ${styles.inner}`}>
        <a href={FOLLOW_URL} className={styles.follow} rel="noopener">{footer.follow.pt} →</a>
        <div className={styles.wordmark} aria-hidden="true">Comet</div>
      </div>
    </footer>
  );
}
