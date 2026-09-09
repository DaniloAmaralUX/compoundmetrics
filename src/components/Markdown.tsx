import type { ReactNode } from "react";
import styles from "./Markdown.module.css";

/**
 * Renders the subset of Markdown the canonical skills and agents use: paragraphs, bullet and
 * numbered lists, fenced code, block quotes, ### headings, bold, inline code and links. HTML
 * comments (the artifact-root markers) are dropped. Deterministic, dependency-free, server-only.
 */
export function Markdown({ text }: { text: string }) {
  const src = text.replace(/<!--[\s\S]*?-->/g, "");
  const lines = src.split("\n");
  const out: ReactNode[] = [];
  let i = 0;
  let key = 0;
  const k = () => `b${key++}`;

  while (i < lines.length) {
    const line = lines[i];
    if (line.trim() === "") {
      i++;
      continue;
    }
    if (line.startsWith("```")) {
      const buf: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) buf.push(lines[i++]);
      i++;
      out.push(
        <pre key={k()} className={styles.pre}>
          <code>{buf.join("\n")}</code>
        </pre>,
      );
      continue;
    }
    const h = line.match(/^(#{3,4})\s+(.*)$/);
    if (h) {
      out.push(
        <h4 key={k()} className={styles.h}>
          {inline(h[2])}
        </h4>,
      );
      i++;
      continue;
    }
    if (/^\s*[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        let item = lines[i].replace(/^\s*[-*]\s+/, "");
        i++;
        while (i < lines.length && /^\s{2,}\S/.test(lines[i]) && !/^\s*[-*]\s+/.test(lines[i])) item += " " + lines[i++].trim();
        items.push(item);
      }
      out.push(
        <ul key={k()} className={styles.ul}>
          {items.map((it, j) => (
            <li key={j}>{inline(it)}</li>
          ))}
        </ul>,
      );
      continue;
    }
    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && (/^\s*\d+\.\s+/.test(lines[i]) || (/^\s{2,}\S/.test(lines[i]) && items.length))) {
        if (/^\s*\d+\.\s+/.test(lines[i])) items.push(lines[i].replace(/^\s*\d+\.\s+/, ""));
        else if (lines[i].trim().startsWith("```")) {
          // fenced block inside a list item: keep it as code on the item
          const buf: string[] = [];
          i++;
          while (i < lines.length && !lines[i].trim().startsWith("```")) buf.push(lines[i++].trim());
          items[items.length - 1] += " `" + buf.join(" ") + "`";
        } else items[items.length - 1] += " " + lines[i].trim();
        i++;
      }
      out.push(
        <ol key={k()} className={styles.ol}>
          {items.map((it, j) => (
            <li key={j}>{inline(it)}</li>
          ))}
        </ol>,
      );
      continue;
    }
    if (line.startsWith(">")) {
      const buf: string[] = [];
      while (i < lines.length && lines[i].startsWith(">")) buf.push(lines[i++].replace(/^>\s?/, ""));
      out.push(
        <blockquote key={k()} className={styles.quote}>
          {inline(buf.join(" "))}
        </blockquote>,
      );
      continue;
    }
    if (line.startsWith("|")) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i].startsWith("|")) {
        const cells = lines[i].split("|").slice(1, -1).map((c) => c.trim());
        if (!cells.every((c) => /^:?-{2,}:?$/.test(c))) rows.push(cells);
        i++;
      }
      const [head, ...body] = rows;
      out.push(
        <div key={k()} className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>{head.map((c, j) => <th key={j}>{inline(c)}</th>)}</tr>
            </thead>
            <tbody>
              {body.map((r, ri) => (
                <tr key={ri}>{r.map((c, j) => <td key={j}>{inline(c)}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      continue;
    }
    const buf: string[] = [];
    while (i < lines.length && lines[i].trim() !== "" && !/^(```|#{3,4}\s|\s*[-*]\s|\s*\d+\.\s|>|\|)/.test(lines[i])) buf.push(lines[i++].trim());
    out.push(
      <p key={k()} className={styles.p}>
        {inline(buf.join(" "))}
      </p>,
    );
  }
  return <div className={styles.md}>{out}</div>;
}

/** One line of the same inline subset (bold, inline code, links), for content rendered outside a Markdown block. */
export function Inline({ text }: { text: string }) {
  return <>{inline(text)}</>;
}

function inline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const re = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let n = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith("`")) nodes.push(<code key={n++}>{tok.slice(1, -1)}</code>);
    else if (tok.startsWith("**")) nodes.push(<strong key={n++}>{tok.slice(2, -2)}</strong>);
    else {
      const lm = tok.match(/^\[([^\]]+)\]\(([^)]+)\)$/)!;
      const [, label, href] = lm;
      if (/^https?:\/\//.test(href))
        nodes.push(
          <a key={n++} href={href} rel="noopener">
            {label}
          </a>,
        );
      else nodes.push(<code key={n++}>{label}</code>);
    }
    last = m.index + tok.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}
