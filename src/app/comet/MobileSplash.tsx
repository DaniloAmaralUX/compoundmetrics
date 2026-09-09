"use client";
import { useSyncExternalStore } from "react";
import shared from "./comet.module.css";
import styles from "./MobileSplash.module.css";
import { mobileSplash } from "./content";

const COOKIE = "pplx.mweb-splash-page-dismissed";

/**
 * Interstitial de instalação do app no web mobile.
 * A referência injeta um portal com link inteligente e memoriza a dispensa em cookie de mesmo nome.
 * Só aparece em viewports estreitos (CSS) e some após a dispensa.
 */
const listeners = new Set<() => void>();
const subscribe = (cb: () => void) => { listeners.add(cb); return () => listeners.delete(cb); };
const isDismissed = () => document.cookie.includes(`${COOKIE}=1`);

export function MobileSplash() {
  // No servidor o splash não existe (snapshot true = dispensado); no cliente lê o cookie.
  const dismissed = useSyncExternalStore(subscribe, isDismissed, () => true);
  if (dismissed) return null;
  const dismiss = () => {
    document.cookie = `${COOKIE}=1; path=/; max-age=${60 * 60 * 24 * 30}`;
    listeners.forEach((cb) => cb());
  };
  return (
    <div className={styles.portal} role="dialog" aria-modal="false" aria-labelledby="splash-title">
      <div className={`${shared.glass} ${styles.card}`}>
        <span className={styles.mark} aria-hidden="true" />
        <div className={styles.text}>
          <strong id="splash-title">{mobileSplash.title.pt}</strong>
          <span>{mobileSplash.body.pt}</span>
        </div>
        <a href="/comet/download" className={`${shared.btn} ${styles.cta}`}>{mobileSplash.cta.pt}</a>
        <button type="button" onClick={dismiss} className={styles.dismiss}>{mobileSplash.dismiss.pt}</button>
      </div>
    </div>
  );
}
