"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import styles from "./ConceptLink.module.css";

/**
 * Inline education. A term stays in the sentence; pressing it opens a small popover with one plain
 * sentence and a link to the Field Guide. Escape, outside click or leaving focus closes it and
 * returns focus to the term. No library: a button, a dialog, and three listeners.
 */
export function ConceptLink({ id, title, plain, children }: { id: string; title: string; plain: string; children?: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [right, setRight] = useState(false);
  const wrap = useRef<HTMLSpanElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const popId = useId();

  useEffect(() => {
    if (!open) return;
    const el = wrap.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      setRight(rect.left + 340 > window.innerWidth - 16);
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    const onDown = (e: PointerEvent) => {
      if (el && !el.contains(e.target as Node)) setOpen(false);
    };
    const onFocus = (e: FocusEvent) => {
      if (el && !el.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("focusin", onFocus);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("focusin", onFocus);
    };
  }, [open]);

  return (
    <span className={styles.wrap} ref={wrap}>
      <button ref={trigger} type="button" className={styles.trigger} aria-expanded={open} aria-controls={popId} onClick={() => setOpen((o) => !o)}>
        {children ?? title}
      </button>
      {open && (
        <span id={popId} role="dialog" aria-label={title} className={`${styles.pop} ${right ? styles.right : ""}`}>
          <span className={styles.popTitle}>
            <span className={styles.popName}>{title}</span>
            <button
              type="button"
              className={styles.close}
              onClick={() => {
                setOpen(false);
                trigger.current?.focus();
              }}
              aria-label={`Close ${title}`}
            >
              esc
            </button>
          </span>
          <span>{plain}</span>
          <Link href={`/learn/${id}`} className={styles.popLink}>
            <span>Learn about {title}</span>
            <i aria-hidden="true">→</i>
          </Link>
        </span>
      )}
    </span>
  );
}
