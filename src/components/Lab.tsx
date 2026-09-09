"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { compoundSequence, labFindings, labFrame, labStages, verificationStates, type LabFinding, type Verification } from "@/content/lab";
import { ConceptLink } from "./ConceptLink";
import styles from "./Lab.module.css";

type StageId = (typeof labStages)[number]["id"];

/**
 * The Compound Lab. A real small form with four seeded defects; the visitor frames the review,
 * verifies it finding by finding, applies corrections and watches the fixture change, then
 * compounds — and sees that only some of what was found deserves to survive the project.
 *
 * Deterministic by construction: no model, no network, no randomness. Reduced motion ends every
 * transition in its settled state.
 */
export function Lab({ terms }: { terms: Record<string, { title: string; plain: string }> }) {
  const [stage, setStage] = useState<StageId>("frame");
  const [selected, setSelected] = useState<string | null>(null);
  const [applied, setApplied] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [compounded, setCompounded] = useState(false);
  const [lit, setLit] = useState(0);
  const stepRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const ids = useId();

  const stageIndex = labStages.findIndex((s) => s.id === stage);
  const finding = labFindings.find((f) => f.id === selected) ?? null;
  const isFixed = (id: string) => applied.includes(id);
  // Compound: light the sequence one item at a time; all at once under reduced motion. State is
  // only set from timers, never synchronously inside the effect.
  useEffect(() => {
    if (!compounded) return;
    const total = compoundSequence.length + 1;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      const t = window.setTimeout(() => setLit(total), 0);
      return () => window.clearTimeout(t);
    }
    let i = 0;
    const t = window.setInterval(() => {
      i += 1;
      setLit(i);
      if (i >= total) window.clearInterval(t);
    }, 520);
    return () => window.clearInterval(t);
  }, [compounded]);

  const go = (id: StageId) => {
    setStage(id);
    if (id !== "verify") setSelected(null);
  };

  const onStepKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const n = labStages.length;
    let next: number | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (i + 1) % n;
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (i - 1 + n) % n;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = n - 1;
    if (next === null) return;
    e.preventDefault();
    go(labStages[next].id);
    stepRefs.current[next]?.focus();
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const reset = () => {
    setStage("frame");
    setSelected(null);
    setApplied([]);
    setSubmitted(false);
    setCompounded(false);
    setLit(0);
  };

  const verificationOf = (f: LabFinding): Verification => (f.needsRun && !submitted ? "not-verified" : f.needsRun ? "observed" : f.verification);

  const emailFixed = isFixed("IR-01");
  const feedbackFixed = isFixed("IR-02");
  const focusFixed = isFixed("IR-03");
  const submitFixed = isFixed("IR-04");
  const hl = (id: string) => (stage === "verify" && selected === id ? styles.highlight : stage === "polish" && isFixed(id) ? styles.fixed : "");

  return (
    <div className={styles.lab}>
      <div className={styles.left}>
        <div className={styles.specimenWrap}>
          <div className={styles.specimenHead}>
            <span className="label">The specimen · a signup form</span>
            <span className="small faint mono">deterministic · no model</span>
          </div>
          <div className={styles.paper} data-lab-fixture aria-label="Specimen under review: a signup form with deliberate defects" role="group">
            <form className={styles.form} onSubmit={onSubmit} noValidate>
              <span className={styles.formTitle}>Create your account</span>
              <span className={styles.formSub}>Takes about a minute.</span>

              {!feedbackFixed && (
                <div className={`${styles.banner} ${hl("IR-02")}`} role="presentation">
                  Please fix the errors below.
                </div>
              )}

              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor={`${ids}-name`}>
                  Full name
                </label>
                <input id={`${ids}-name`} className={styles.input} type="text" defaultValue="Ana Ribeiro" autoComplete="off" />
              </div>

              <div className={`${styles.field} ${hl("IR-01")}`}>
                {emailFixed ? (
                  <label className={styles.fieldLabel} htmlFor={`${ids}-email`}>
                    Email
                  </label>
                ) : null}
                <input
                  id={`${ids}-email`}
                  className={styles.input}
                  type="email"
                  placeholder={emailFixed ? "name@example.com" : "Email"}
                  defaultValue="ana@"
                  aria-invalid="true"
                  aria-describedby={feedbackFixed ? `${ids}-email-error` : undefined}
                  autoComplete="off"
                />
                {feedbackFixed && (
                  <span id={`${ids}-email-error`} className={`${styles.fieldError} ${hl("IR-02")}`}>
                    Enter a complete address, like name@example.com.
                  </span>
                )}
              </div>

              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor={`${ids}-password`}>
                  Password
                </label>
                <input id={`${ids}-password`} className={styles.input} type="password" defaultValue="••••••••••" autoComplete="off" />
              </div>

              <button type="submit" className={`${styles.submit} ${focusFixed ? "" : styles.noFocus} ${hl("IR-03")} ${hl("IR-04")}`} disabled={submitted && !submitFixed}>
                {submitted && submitFixed ? "Creating your account…" : "Create account"}
              </button>
              <span className={styles.status} role={submitFixed ? "status" : undefined} aria-live={submitFixed ? "polite" : undefined}>
                {submitted && submitFixed ? "Creating your account. This usually takes a few seconds." : ""}
              </span>
            </form>
          </div>
          <div className={styles.specimenNote}>
            <span className={styles.legend}>observed defect</span>
            <span className={`${styles.legend} ${styles.ok}`}>correction applied</span>
            {submitted && (
              <button type="button" className={`${styles.button} ${styles.quiet}`} onClick={() => setSubmitted(false)}>
                Reset the form
              </button>
            )}
          </div>
        </div>
      </div>

      <div className={styles.right}>
        <div role="tablist" aria-label="Lab stages" className={styles.stepper}>
          {labStages.map((s, i) => (
            <button
              key={s.id}
              ref={(el) => {
                stepRefs.current[i] = el;
              }}
              role="tab"
              id={`${ids}-tab-${s.id}`}
              aria-selected={stage === s.id}
              aria-controls={`${ids}-panel`}
              tabIndex={stage === s.id ? 0 : -1}
              className={`${styles.step} ${i < stageIndex ? styles.done : ""}`}
              onClick={() => go(s.id)}
              onKeyDown={(e) => onStepKey(e, i)}
            >
              <span className={styles.stepN}>{s.n}</span>
              <span className={styles.stepName}>{s.name}</span>
              <span className={styles.stepQ}>{s.question}</span>
            </button>
          ))}
        </div>

        <div role="tabpanel" id={`${ids}-panel`} aria-labelledby={`${ids}-tab-${stage}`} className={styles.panel} key={stage}>
          {stage === "frame" && (
            <>
              <span className={styles.panelTitle}>Before anyone reviews anything: what are we actually solving?</span>
              <p className="body muted">Frame decides whether the work is worth doing, for whom, and what would count as done. It does not design the fix. This is the frame Verify will check against.</p>
              <dl className={styles.contract}>
                <dt>Problem</dt>
                <dd>{labFrame.problem}</dd>
                <dt>User</dt>
                <dd>{labFrame.user}</dd>
                <dt>Outcome</dt>
                <dd>{labFrame.outcome}</dd>
                <dt>Non-goals</dt>
                <dd>{labFrame.nonGoals}</dd>
                <dt>Success</dt>
                <dd>{labFrame.success}</dd>
                <dt>Next</dt>
                <dd className="mono">{labFrame.next}</dd>
              </dl>
              <div className={styles.actions}>
                <button type="button" className={`${styles.button} ${styles.primary}`} onClick={() => go("verify")}>
                  Verify against this frame
                </button>
              </div>
            </>
          )}

          {stage === "verify" && (
            <>
              <span className={styles.panelTitle}>Four findings. Pick one to see what was observed, where, and why it matters.</span>
              <p className="body muted">Report-only: reviewing is not permission to change. One of these can only be established by doing something — try submitting the form.</p>
              <div className={styles.findings}>
                {labFindings.map((f) => (
                  <button key={f.id} type="button" className={`${styles.finding} ${isFixed(f.id) ? styles.fixed : ""}`} aria-pressed={selected === f.id} onClick={() => setSelected(selected === f.id ? null : f.id)}>
                    <span className={styles.findingId}>{f.id}</span>
                    <span className={styles.findingShort}>{f.short}</span>
                    <span className={styles.findingMeta}>
                      <span className={`${styles.sev} ${f.severity === "minor" ? styles.minor : ""}`}>{f.severity}</span>
                      <span>{verificationOf(f)}</span>
                    </span>
                  </button>
                ))}
              </div>

              {finding ? (
                <dl className={styles.contract} aria-label={`Finding ${finding.id}`}>
                  <dt>What was observed</dt>
                  <dd className="mono small">{finding.evidence}</dd>
                  <dt>Where it exists</dt>
                  <dd>{finding.where}</dd>
                  <dt>Why it matters</dt>
                  <dd>{finding.impact}</dd>
                  <dt>Concrete change</dt>
                  <dd>{finding.recommendation}</dd>
                  <dt>Severity · confidence</dt>
                  <dd>
                    <span className={styles.sev}>{finding.severity}</span> · {finding.confidence}
                  </dd>
                  <dt>Source</dt>
                  <dd className="muted">{finding.source}</dd>
                  <dt>How it was established</dt>
                  <dd>
                    <span className="mono">{verificationOf(finding)}</span>
                    {finding.needsRun && !submitted && <span className="muted"> — press Create account in the specimen to observe it. Until then, claiming it would be a fabricated verification.</span>}
                    {finding.needsRun && submitted && <span className="muted"> — you ran it. Now it is observed.</span>}
                  </dd>
                </dl>
              ) : (
                <p className="small faint">No finding selected. The specimen shows the defect you choose.</p>
              )}

              <div className={styles.states} aria-label="Verification states">
                <span className="label">Three ways a finding can be established</span>
                {verificationStates.map((s) => (
                  <div key={s.id} className={`${styles.state} ${finding && verificationOf(finding) === s.id ? styles.active : ""}`}>
                    <span>{s.plain}</span>
                    <span className={styles.stateTerm}>{s.id}</span>
                  </div>
                ))}
              </div>
              <div className={styles.actions}>
                <button type="button" className={`${styles.button} ${styles.primary}`} onClick={() => go("polish")}>
                  Take the findings to Polish
                </button>
                <button type="button" className={`${styles.button} ${styles.quiet}`} onClick={() => go("frame")}>
                  Back to the frame
                </button>
              </div>
            </>
          )}

          {stage === "polish" && (
            <>
              <span className={styles.panelTitle}>Apply a correction and watch the specimen change.</span>
              <p className="body muted">Polish makes a working interface deliberate. Each change is small, reversible and tied to a named finding. Reduce before adding: one of these is a deletion.</p>
              <div className={styles.findings}>
                {labFindings.map((f) => (
                  <button key={f.id} type="button" className={`${styles.finding} ${isFixed(f.id) ? styles.fixed : ""}`} aria-pressed={isFixed(f.id)} onClick={() => setApplied((a) => (a.includes(f.id) ? a.filter((x) => x !== f.id) : [...a, f.id]))}>
                    <span className={styles.findingId}>{f.id}</span>
                    <span className={styles.findingShort}>{f.recommendation}</span>
                    <span className={styles.findingMeta}>
                      <span className={styles.sev}>{isFixed(f.id) ? "applied" : "apply"}</span>
                    </span>
                  </button>
                ))}
              </div>
              <div className={styles.actions}>
                <button type="button" className={`${styles.button} ${styles.primary}`} onClick={() => setApplied(labFindings.map((f) => f.id))} disabled={applied.length === labFindings.length}>
                  Apply all four
                </button>
                <button type="button" className={`${styles.button} ${styles.accent}`} onClick={() => go("compound")}>
                  Now compound
                </button>
              </div>
            </>
          )}

          {stage === "compound" && (
            <>
              <span className={styles.panelTitle}>The work is done. What deserves to survive it?</span>
              <p className="body muted">
                Four findings were corrected. Most of them should compound into nothing — the durability test is strict on purpose. Watch one of them change form.
              </p>
              {!compounded ? (
                <div className={styles.actions}>
                  <button
                    type="button"
                    className={`${styles.button} ${styles.accent}`}
                    onClick={() => {
                      setLit(0);
                      setCompounded(true);
                    }}
                  >
                    Compound IR-02
                  </button>
                  <span className="small muted">the detached validation message</span>
                </div>
              ) : (
                <>
                  <ol className={styles.sequence} style={{ padding: 0, margin: 0 }} aria-label="Knowledge changing form">
                    {compoundSequence.map((label, i) => (
                      <li key={label} className={`${styles.seqItem} ${lit > i ? styles.on : ""}`}>
                        <span className={styles.seqDot} aria-hidden="true" />
                        <div>
                          <div className={styles.seqLabel}>{label}</div>
                          <div className={styles.seqBody}>{sequenceBody[i]}</div>
                        </div>
                      </li>
                    ))}
                  </ol>
                  <p className={`${styles.seqEnd} ${lit > compoundSequence.length ? styles.on : ""}`} aria-live="polite">
                    The lesson does not die with the project.
                  </p>
                </>
              )}

              {compounded && lit > compoundSequence.length && (
                <>
                  <div>
                    <span className="label">And the other three</span>
                    <div className={styles.outcomes}>
                      {labFindings.map((f) => (
                        <div key={f.id} className={`${styles.outcome} ${f.compound.outcome === "learning" || f.compound.outcome === "eval" ? styles.survives : ""}`}>
                          <span className="mono small">{f.id}</span>
                          <span className={styles.outcomeForm}>{f.compound.form}</span>
                          <span className="muted">{f.compound.why}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="label">What you just watched has names</span>
                    <div className={styles.names}>
                      <ConceptLink id="learning-ledger" title={terms["learning-ledger"].title} plain={terms["learning-ledger"].plain} />
                      <ConceptLink id="durable-learning" title={terms["durable-learning"].title} plain={terms["durable-learning"].plain} />
                      <ConceptLink id="discoverability" title={terms["discoverability"].title} plain={terms["discoverability"].plain} />
                      <ConceptLink id="finding-contract" title={terms["finding-contract"].title} plain={terms["finding-contract"].plain} />
                    </div>
                  </div>
                  <div className={styles.actions}>
                    <Link href="/how-it-works" className={`${styles.button} ${styles.primary}`}>
                      See the mechanism explained
                    </Link>
                    <button type="button" className={`${styles.button} ${styles.quiet}`} onClick={reset}>
                      Run the Lab again
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const sequenceBody = [
  "The message appears in a banner at the top; the field says nothing. A note in one review of one form.",
  "The message moves next to the field, is announced where focus is, and names what a valid address looks like.",
  "“Validation feedback should preserve spatial and programmatic association with its field.” Written once, with the literal signals that will recur: aria-describedby, error-summary, toast.",
  "Interface Review already checks states and reachability; this sharpens one check into a rule with a known impact and a known fix.",
  "A fixture with a detached error message and a ground-truth expectation that the reviewer reports it. Recorded, not remembered.",
  "Months later, Frame runs discovery on a request that mentions a form error summary. The learning surfaces, with its id, as a constraint.",
];
