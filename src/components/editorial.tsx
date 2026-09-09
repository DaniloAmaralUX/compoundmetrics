import Link from "next/link";
import type { ReactNode } from "react";
import { currentState } from "@/content/current-state";
import type { Source } from "@/content/types";
import styles from "./editorial.module.css";

/* The editorial primitives: page and section openings, rows, definition lists, badges, state. */

export function PageIntro({ eyebrow, title, lead, aside, display = false }: { eyebrow?: string; title: ReactNode; lead?: ReactNode; aside?: ReactNode; display?: boolean }) {
  return (
    <header className={`container ${styles.intro}`}>
      <div className={styles.introMain}>
        {eyebrow && <span className="label">{eyebrow}</span>}
        <h1 className={display ? "display" : "h1"}>{title}</h1>
        {lead && <p className="lead">{lead}</p>}
      </div>
      {aside && <div className={styles.introAside}>{aside}</div>}
    </header>
  );
}

export function SectionIntro({ eyebrow, title, lead, wide = false, id }: { eyebrow?: string; title: ReactNode; lead?: ReactNode; wide?: boolean; id?: string }) {
  return (
    <div className={`${styles.sectionIntro} ${wide ? styles.wide : ""}`}>
      {eyebrow && <span className="label">{eyebrow}</span>}
      <h2 className="h2" id={id}>
        {title}
      </h2>
      {lead && <p className="lead">{lead}</p>}
    </div>
  );
}

export function Rows({ children }: { children: ReactNode }) {
  return <div className={styles.rows}>{children}</div>;
}

export function Row({ href, title, sub, meta }: { href?: string; title: ReactNode; sub?: ReactNode; meta?: ReactNode }) {
  const inner = (
    <>
      <div className={styles.rowMain}>
        <span className={styles.rowTitle}>{title}</span>
        {sub && <span className={styles.rowSub}>{sub}</span>}
      </div>
      {meta && <div className={styles.rowMeta}>{meta}</div>}
    </>
  );
  return href ? (
    <Link href={href} className={styles.row}>
      {inner}
    </Link>
  ) : (
    <div className={styles.row}>{inner}</div>
  );
}

export function Defs({ items }: { items: Array<[ReactNode, ReactNode]> }) {
  return (
    <dl className={styles.defs}>
      {items.map(([k, val], i) => (
        <div key={i} style={{ display: "contents" }}>
          <dt>{k}</dt>
          <dd>{val}</dd>
        </div>
      ))}
    </dl>
  );
}

export function EvidenceBadge({ cel, cdqi, muted = false }: { cel: string; cdqi?: number | null; muted?: boolean }) {
  return (
    <span className={`${styles.badge} ${cel === currentState.currentCEL ? styles.badgeE1 : ""} ${muted ? styles.badgeMuted : ""}`}>
      <span>{cel}</span>
      {cdqi !== undefined && <span className="faint">{cdqi === null ? "CDQI —" : `CDQI ${cdqi.toFixed(2)}`}</span>}
    </span>
  );
}

export function StateGrid({ children }: { children: ReactNode }) {
  return <div className={styles.state}>{children}</div>;
}

export function StateCell({ label, value, note, mono = false, wide = false }: { label: string; value: ReactNode; note?: ReactNode; mono?: boolean; wide?: boolean }) {
  return (
    <div className={`${styles.stateCell} ${wide ? styles.wideCell : ""}`}>
      <span className="label">{label}</span>
      <span className={`${styles.stateValue} ${mono ? styles.mono : ""}`}>{value}</span>
      {note && <span className={styles.stateNote}>{note}</span>}
    </div>
  );
}

export function StateFoot({ children }: { children: ReactNode }) {
  return <div className={styles.stateFoot}>{children}</div>;
}

export function EvidenceBoundary({ left, right, leftNote, rightNote }: { left: ReactNode; right: ReactNode; leftNote?: ReactNode; rightNote?: ReactNode }) {
  return (
    <div className={styles.boundary} role="group" aria-label="Built well is not the same as proven useful">
      <div className={styles.boundarySide}>
        <span className={styles.boundaryBig}>{left}</span>
        {leftNote && <span className="small muted">{leftNote}</span>}
      </div>
      <span className={styles.boundaryNeq} aria-label="is not the same as">
        ≠
      </span>
      <div className={styles.boundarySide}>
        <span className={styles.boundaryBig}>{right}</span>
        {rightNote && <span className="small muted">{rightNote}</span>}
      </div>
    </div>
  );
}

export function Cta({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className={styles.cta}>
      <span>{children}</span>
      <i aria-hidden="true">→</i>
    </Link>
  );
}

export function CtaRow({ children }: { children: ReactNode }) {
  return <div className={styles.ctaRow}>{children}</div>;
}

export function SourceList({ sources, label = "Sources" }: { sources: Source[]; label?: string }) {
  return (
    <div className={styles.sources}>
      <span className="label">{label}</span>
      <ul style={{ padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
        {sources.map((s) => (
          <li key={s.path + (s.note ?? "")}>
            <code>{s.path}</code>
            {s.note && <span> — {s.note}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
