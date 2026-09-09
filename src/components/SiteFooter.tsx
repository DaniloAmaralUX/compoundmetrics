import Link from "next/link";
import { currentState, v } from "@/content/current-state";
import styles from "./shell.module.css";

const REPO = "https://github.com/DaniloAmaralUX/compoundmetrics";

export function SiteFooter() {
  const s = currentState;
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerGrid}`}>
        <div className={styles.footerState}>
          <span className="label">Compound Design · {s.releaseStage}</span>
          <p className="small muted">
            {v(s.currentVersion)} — {s.releaseTheme}. Stable evidence baseline {v(s.stableBaseline)}. Evidence level {s.currentCEL}; runtime uplift{" "}
            {s.runtimeUplift}; controlled runtime {s.runtimeStatus}.
          </p>
          <p className="small faint">Every claim on this site is derived from the repository&apos;s own records. Nothing here is endorsed by any upstream author or vendor.</p>
        </div>
        <div className={styles.footerLinks}>
          <Link href="/evidence">Evidence</Link>
          <Link href="/learn">Field Guide</Link>
          <Link href="/case-study">Case Study</Link>
          <a href={REPO} rel="noopener">
            Repository
          </a>
          <a href={`${REPO}/blob/main/NOTICE`} rel="noopener">
            Provenance
          </a>
        </div>
      </div>
    </footer>
  );
}
