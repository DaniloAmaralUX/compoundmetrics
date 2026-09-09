"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import type { ProjectStage } from "@/content/types";
import { SourceList } from "./editorial";
import styles from "./Timeline.module.css";

/**
 * One rail, six markers, one panel. Horizontal on desktop, vertical on mobile, where the panel
 * moves under its marker through CSS `order` so one DOM serves both layouts. The rail draws in
 * once and the markers settle from muted to full; both end in their resting state immediately under
 * `prefers-reduced-motion`. Interaction model adapted from Evil Rabbit's Lifeline (MIT); the
 * implementation is this file.
 */
export function Timeline({ stages }: { stages: ProjectStage[] }) {
  const initial = Math.max(0, stages.findIndex((s) => s.status === "current"));
  const [selected, setSelected] = useState(initial);
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const base = useId();

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const n = stages.length;
    let next: number | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (i + 1) % n;
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (i - 1 + n) % n;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = n - 1;
    if (next === null) return;
    e.preventDefault();
    setSelected(next);
    refs.current[next]?.focus();
  };

  const stage = stages[selected];
  return (
    <div className={styles.timeline}>
      <div className={styles.rail} aria-hidden="true" />
      <div role="tablist" aria-label="Project timeline" style={{ display: "contents" }}>
        {stages.map((s, i) => (
          <button
            key={s.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            role="tab"
            id={`${base}-tab-${s.id}`}
            aria-selected={i === selected}
            aria-controls={`${base}-panel`}
            tabIndex={i === selected ? 0 : -1}
            className={`${styles.marker} ${s.status === "current" ? styles.current : ""} ${s.status === "next" ? styles.next : ""}`}
            style={{ ["--i" as string]: i, order: i * 2 }}
            onClick={() => setSelected(i)}
            onKeyDown={(e) => onKey(e, i)}
          >
            <span className={styles.version}>{s.version}</span>
            <span className={styles.name}>{s.name}</span>
            <span className={styles.question}>{s.question}</span>
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`${base}-panel`} aria-labelledby={`${base}-tab-${stage.id}`} className={styles.panel} style={{ order: selected * 2 + 1 }} key={stage.id}>
        <div className={styles.panelHead}>
          <span className="label">
            {stage.version} · {stage.name} · {stage.status === "done" ? "done" : stage.status === "current" ? "current" : "next"}
          </span>
          <span className={styles.panelQuestion}>{stage.question}</span>
        </div>
        <div className={`${styles.cell} ${styles.half}`}>
          <span className="label">What changed</span>
          <p>{stage.changed}</p>
        </div>
        <div className={`${styles.cell} ${styles.half}`}>
          <span className="label">What was built</span>
          <ul>
            {stage.built.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </div>
        <div className={`${styles.cell} ${styles.half}`}>
          <span className="label">What we learned</span>
          <p>{stage.learned}</p>
        </div>
        <div className={`${styles.cell} ${styles.half}`}>
          <span className="label">What remains unknown</span>
          <p className={styles.unknown}>{stage.unknown}</p>
        </div>
        <div className={styles.sources}>
          <SourceList sources={stage.sources} label="Derived from" />
        </div>
      </div>
    </div>
  );
}
