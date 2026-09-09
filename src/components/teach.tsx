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

type TransformationItem = { name: string; form: string };
type ProcessStage = { id: string; name: string; question: string; skill: string };
type RepeatStage = { name: string; question: string };

export function Transformation({
  items,
  ariaLabel = "How one project improves the next",
}: {
  items?: ReadonlyArray<TransformationItem>;
  ariaLabel?: string;
} = {}) {
  const source = items ?? transformation.map((name, i) => ({ name, form: transformationForms[i] }));

  return (
    <div className={styles.transformation} role="list" aria-label={ariaLabel}>
      <span className={styles.pulse} aria-hidden="true" />
      {source.map((item, i) => {
        const compounds = i === 3 || i === 4;
        const end = i === source.length - 1;
        return (
          <div key={`${item.name}-${i}`} role="listitem" className={`${styles.node} ${compounds ? styles.compounds : ""} ${end ? styles.end : ""}`}>
            <span className={styles.nodeName}>{item.name}</span>
            <span className={styles.nodeForm}>{item.form}</span>
          </div>
        );
      })}
    </div>
  );
}

export function WhatCompounds({ items = whatCompounds }: { items?: ReadonlyArray<readonly [string, string]> } = {}) {
  return (
    <div className={styles.compounds} role="list">
      {items.map(([from, to]) => (
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

export function ProcessFlow({
  linkSkills = true,
  stages = loop,
  repeatStage = repeat,
}: {
  linkSkills?: boolean;
  stages?: ReadonlyArray<ProcessStage>;
  repeatStage?: RepeatStage;
} = {}) {
  return (
    <ol className={styles.flow} style={{ padding: 0, margin: 0 }}>
      {stages.map((s, i) => (
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
          <span className={styles.stageName}>{repeatStage.name}</span>
        </div>
        <span className={styles.stageQuestion}>{repeatStage.question}</span>
      </li>
    </ol>
  );
}

export function LearningTransformation({
  example,
  from = 2,
  formLabel = "Form it takes",
}: {
  example: Example;
  from?: number;
  formLabel?: string;
}) {
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
            <span className="label">{formLabel}</span>
            <span className={styles.stepFormValue}>{step.form}</span>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function NotEverythingCompounds({ lines = whatDoesNotCompound }: { lines?: ReadonlyArray<string> } = {}) {
  return (
    <ul className={styles.ladder} style={{ padding: 0, margin: 0 }}>
      {lines.map((line, i) => (
        <li key={line} style={{ ["--i" as string]: i }}>
          {line}
        </li>
      ))}
    </ul>
  );
}

export function DurabilityTest({ text = durabilityTest }: { text?: string } = {}) {
  return (
    <blockquote className={styles.test} style={{ margin: 0 }}>
      {text}
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
