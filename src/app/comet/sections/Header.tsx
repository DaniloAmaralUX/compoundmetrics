import shared from "../comet.module.css";
import styles from "./Header.module.css";
import { header } from "../content";

/** Cabeçalho: marca à esquerda, um único CTA à direita. Fica fixo após o hero. */
export function Header() {
  return (
    <header className={styles.header}>
      <div className={`${shared.container} ${styles.bar}`}>
        <a href="/comet" className={styles.brand} aria-label="Comet — início">
          <span className={styles.mark} aria-hidden="true" />
          <span>{header.brand.pt}</span>
        </a>
        <nav className={styles.actions} aria-label="Ações principais">
          <a href="/comet/download" className={shared.btn}>{header.cta.pt}</a>
          <a href="/comet#faq" className={styles.iconBtn} aria-label={header.menu.pt}>
            <span aria-hidden="true">?</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
