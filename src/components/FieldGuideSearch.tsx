"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";
import { search, type SearchEntry } from "@/content/concepts";
import styles from "./FieldGuideSearch.module.css";

/**
 * Deterministic client-side search over a pre-built index. Matches the words people use — including
 * Portuguese phrasings recorded as aliases and queries — against each concept's strong and weak
 * tokens. No network, no model. The page below the search shows every concept regardless.
 */
export function FieldGuideSearch({ index, starting }: { index: SearchEntry[]; starting: SearchEntry[] }) {
  const [q, setQ] = useState("");
  const id = useId();
  const results = useMemo(() => search(q, index), [q, index]);
  const active = q.trim().length > 0;

  return (
    <div className={styles.wrap}>
      <h1 className="h2">
        <label htmlFor={id}>What do you want to understand?</label>
      </h1>
      <input
        id={id}
        className={styles.input}
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Try: how do I know if it works · teste que não foi visto · esconder qual versão foi usada"
        autoComplete="off"
        spellCheck={false}
        aria-describedby={`${id}-hint`}
      />
      <span id={`${id}-hint`} className="small faint">
        In your own words, in English or Portuguese. Matching is deterministic; nothing leaves the page.
      </span>

      <div className={styles.results} role="region" aria-live="polite" aria-label="Search results">
        {active && results.length === 0 && (
          <p className="muted">
            No concept matches “{q}”. The list below holds every term; these are the usual starting points.
          </p>
        )}
        {(active ? results.map((r) => r.entry) : starting).length > 0 && (
          <>
            <span className="label">{active ? `${results.length} match${results.length === 1 ? "" : "es"}` : "Starting points"}</span>
            <ul className={styles.list}>
              {(active ? results.map((r) => r.entry) : starting).map((e) => (
                <li key={e.id}>
                  <Link href={`/learn/${e.id}`} className={styles.item}>
                    <span className={styles.itemTitle}>{e.title}</span>
                    <span className={styles.itemSub}>{e.oneSentence}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
