import Link from "next/link";
import type { ReactNode } from "react";
import { loop, repeat, transformation, whatCompounds, whatDoesNotCompound, durabilityTest } from "@/content/examples";
import type { Example } from "@/content/types";
import styles from "./teach.module.css";

/* The teaching components: each one shows knowledge changing form. */

const transformationForms = [
  "a project begins",
  "the work gets done",
  "something is noticed",
  "a lesson that would otherwise be lost",
  "a rule, an eval, a skill or a specialist",
  "the way of working is better",
  "starts with more than the first had",
];

export function Transformation() {
  return (
    <div className={styles.transformation} role="list" aria-label="How one project improves the next">
      <span className={styles.pulse} aria-hidden="true" />
      {transformation.map((name, i) => {
        const compounds = i === 3 || i === 4;
        const end = i === transformation.length - 1;
        return (
          <div key={name} role="listitem" className={`${styles.node} ${compounds ? styles.compounds : ""} ${end ? styles.end : ""}`}>
            <span className={styles.nodeName}>{name}</span>
            <span className={styles.nodeForm}>{transformationForms[i]}</span>
          </div>
        );
      })}
    </div>
  );
}

export function WhatCompounds() {
  return (
    <div className={styles.compounds} role="list">
      {whatCompounds.map(([from, to]) => (
        <div key={from} role="listitem" className={styles.compoundRow}>
          <span className={styles.compoundFrom}>{from}</span>
          <span className={styles.compoundArrow} aria-hidden="true">
            →
          </span>
          <span className={styles.compoundTo}>{to}</span>
        </div>
      ))}
    </div>
  );
}

export function ProcessFlow({ linkSkills = true }: { linkSkills?: boolean }) {
  return (
    <ol className={styles.flow} style={{ padding: 0, margin: 0 }}>
      {loop.map((s, i) => (
        <li key={s.id} className={styles.stage}>
          <div className={styles.stageHead}>
            <span className={styles.stageNum}>{String(i + 1).padStart(2, "0")}</span>
            <span className={styles.stageName}>{s.name}</span>
          </div>
          <span className={styles.stageQuestion}>{s.question}</span>
          {linkSkills ? (
            <Link href={`/resources/${s.skill}`} className={styles.stageSkill}>
              {s.skill}
            </Link>
          ) : (
            <span className={styles.stageSkill}>{s.skill}</span>
          )}
        </li>
      ))}
      <li className={`${styles.stage} ${styles.repeat}`}>
        <div className={styles.stageHead}>
          <span className={styles.stageNum}>↻</span>
          <span className={styles.stageName}>{repeat.name}</span>
        </div>
        <span className={styles.stageQuestion}>{repeat.question}</span>
      </li>
    </ol>
  );
}

export function LearningTransformation({ example, from = 2 }: { example: Example; from?: number }) {
  return (
    <ol className={styles.learning} style={{ padding: "0 0 0 32px", margin: 0 }}>
      {example.steps.map((step, i) => (
        <li key={step.id} className={`${styles.step} ${i >= from ? styles.compounds : ""}`}>
          <div className={styles.stepMain}>
            <span className="label">{step.label}</span>
            <span className={styles.stepTitle}>{step.title}</span>
            <p className={styles.stepBody}>{step.body}</p>
          </div>
          <div className={styles.stepForm}>
            <span className="label">Form it takes</span>
            <span className={styles.stepFormValue}>{step.form}</span>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function NotEverythingCompounds() {
  return (
    <ul className={styles.ladder} style={{ padding: 0, margin: 0 }}>
      {whatDoesNotCompound.map((line, i) => (
        <li key={line} style={{ ["--i" as string]: i }}>
          {line}
        </li>
      ))}
    </ul>
  );
}

export function DurabilityTest() {
  return (
    <blockquote className={styles.test} style={{ margin: 0 }}>
      {durabilityTest}
    </blockquote>
  );
}

export function Chain({ items, highlight = [] }: { items: ReactNode[]; highlight?: number[] }) {
  return (
    <div className={styles.chain} role="list">
      {items.map((item, i) => (
        <span key={i} role="listitem" className={highlight.includes(i) ? styles.hi : undefined}>
          {item}
          {i < items.length - 1 && (
            <i aria-hidden="true" style={{ marginLeft: 14 }}>
              →
            </i>
          )}
        </span>
      ))}
    </div>
  );
}
