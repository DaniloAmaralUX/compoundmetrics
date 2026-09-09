"use client";
import { useSyncExternalStore } from "react";
import shared from "../comet.module.css";
import styles from "./download.module.css";
import { APP_STORE_URL, DOWNLOAD_URL, PLAY_STORE_URL, download } from "../content";

type Platform = "mac" | "windows" | "ios" | "android" | "unknown";

const targets: Record<Exclude<Platform, "unknown">, { label: string; href: string; note: string }> = {
  mac: { label: download.platforms.mac.pt, href: DOWNLOAD_URL, note: "macOS 11 Big Sur ou superior · .dmg" },
  windows: { label: download.platforms.windows.pt, href: DOWNLOAD_URL, note: "Windows 10 ou superior · instalador .exe" },
  ios: { label: download.platforms.ios.pt, href: APP_STORE_URL, note: "iOS 18 ou superior" },
  android: { label: download.platforms.android.pt, href: PLAY_STORE_URL, note: "Android 12 ou superior" },
};

function detect(ua: string, touchPoints: number): Platform {
  if (/android/i.test(ua)) return "android";
  if (/iphone|ipad|ipod/i.test(ua) || (/macintosh/i.test(ua) && touchPoints > 1)) return "ios";
  if (/windows/i.test(ua)) return "windows";
  if (/macintosh|mac os x/i.test(ua)) return "mac";
  return "unknown";
}

export function DownloadClient() {
  // "detecting" é o snapshot do servidor; no cliente a plataforma é lida uma vez do user agent.
  const platform = useSyncExternalStore<Platform | "detecting">(
    () => () => {},
    () => detect(navigator.userAgent, navigator.maxTouchPoints ?? 0),
    () => "detecting",
  );

  const primary = platform !== "detecting" && platform !== "unknown" ? targets[platform] : null;
  const others = (Object.keys(targets) as Array<keyof typeof targets>).filter((k) => k !== platform);

  return (
    <section className={`${shared.container} ${styles.section}`} aria-labelledby="download-title">
      <h1 id="download-title" className={`${shared.display} ${styles.title}`}>{download.title.pt}</h1>
      <div className={styles.primary} aria-live="polite">
        {platform === "detecting" && <p className={shared.lead}>{download.detecting.pt}</p>}
        {platform === "unknown" && <p className={shared.lead}>{download.unknown.pt}</p>}
        {primary && (
          <>
            <p className={shared.eyebrow}>{download.detected.pt}: {platform}</p>
            <a href={primary.href} className={`${shared.btn} ${styles.cta}`} rel="noopener">{primary.label}</a>
            <p className={styles.note}>{primary.note}</p>
          </>
        )}
      </div>
      <h2 className={styles.otherTitle}>{download.other.pt}</h2>
      <ul className={styles.others} role="list">
        {others.map((k) => (
          <li key={k}>
            <a href={targets[k].href} className={`${shared.btn} ${shared.btnGhost}`} rel="noopener">{targets[k].label}</a>
            <span className={styles.note}>{targets[k].note}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
