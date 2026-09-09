import type { Metadata } from "next";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: { absolute: "Compound Design v0.2.1 — Evidence Infrastructure" },
  description: "An AI-native Design Engineering framework that separates construction quality from evidence and now adds machine-readable evidence infrastructure without inflating CEL.",
  robots: { index: false, follow: false },
};

const stages = [
  { n: "01", name: "Frame", line: "Define the problem, constraints, success and whether AI should exist at all.", resources: ["Problem Framing", "Experience Brief", "AI Fit"] },
  { n: "02", name: "Model", line: "Model entities, roles, states and flows — and separate instructions, data, tools and actions for agentic systems.", resources: ["System Model", "State Matrix", "instructions / data / tools / actions"] },
  { n: "03", name: "Craft", line: "Shape hierarchy, interface behavior and AI interaction quality without inventing a parallel system.", resources: ["Interface Review", "Supernova DS", "AI Interaction Review"] },
  { n: "04", name: "Build", line: "Turn design decisions into executable product behavior using the existing architecture and primitives.", resources: ["Implementation", "UI Primitives", "Agent-assisted Build"] },
  { n: "05", name: "Verify", line: "Check code, flow, craft and the resources themselves. Evidence and construction are measured separately.", resources: ["Quality Gate", "Contract Tests", "Browser Verification"] },
  { n: "06", name: "Polish", line: "Working is the baseline. Refine feedback, motion, copy, rhythm and edge-state behavior.", resources: ["Motion Review", "Polish Pass", "Human Craft Review"] },
  { n: "07", name: "Compound", line: "Turn proven learning into the system that gives the next project a better starting point.", resources: ["Resource Lab", "Learning Ledger", "Version + Promote"] },
];

const resources = [
  { name: "Design Guide", kind: "GUIDE", version: "0.2", score: "8.45", cel: "E1", summary: "Runs the smallest sufficient Design Engineering path, delegates specialists and adds the AI interaction branch only when it belongs.", delta: "Sharper routing + AI/system boundaries" },
  { name: "Interface Review", kind: "SPECIALIST", version: "0.2", score: "8.55", cel: "E1", summary: "Interface-craft specialist with explicit non-goals, severity and a prioritized evidence-bearing review contract.", delta: "Clearer prioritization + review boundaries" },
  { name: "Motion Review", kind: "SPECIALIST", version: "0.2", score: "8.50", cel: "E1", summary: "Motion and interaction specialist that decides whether animation should exist before deciding how it should move.", delta: "Motion restraint + routing boundaries" },
  { name: "Quality Gate", kind: "QUALITY", version: "0.2", score: "8.75", cel: "E1", summary: "Separates construction quality from evidence and evaluates the evaluator itself before allowing promotion claims.", delta: "CDQI + CEL + evidence debt" },
  { name: "Resource Lab", kind: "LEARNING", version: "0.2", score: "8.65", cel: "E1", summary: "Improves resources through reproduced failures, hypotheses, eval-first changes, holdouts and falsification attempts.", delta: "Learning Ledger feeds future evals" },
  { name: "AI Interaction Review", kind: "SPECIALIST", version: "0.1", score: "8.35", cel: "E1", summary: "Reviews only user-facing AI for fit, reliance, legibility, human control, proportional autonomy and model evolution.", delta: "Grounded AI interaction criteria" },
];

const construction = [
  ["Scope & contract", "15%"],
  ["Routing & boundaries", "15%"],
  ["Domain grounding", "15%"],
  ["Instruction design", "15%"],
  ["Output & actionability", "15%"],
  ["Evalability", "15%"],
  ["Maintainability & provenance", "10%"],
];

const evidence = [
  ["E0", "Inspection", "Static review only"],
  ["E1", "Deterministic", "Contract / regression assertions"],
  ["E2", "Controlled runtime", "Baseline + repeated runs"],
  ["E3", "Independent", "Cross-model / separate evaluator / blinded human"],
  ["E4", "Field", "Real-use history + regressions across versions"],
];

const aiGates = [
  ["01", "AI Fit", "Would deterministic UI be clearer, cheaper or more reliable?"],
  ["02", "Reliance", "Can people accept good output and detect or reject bad output?"],
  ["03", "Legibility", "Can the person understand enough of what AI is doing to act well?"],
  ["04", "Human Control", "Are edit, reject, stop, approval and undo cheaper than recovery?"],
  ["05", "Autonomy", "Does action power scale with consequence and reversibility?"],
  ["06", "Evolution", "Can model, provider and data changes be regression-tested and rolled back?"],
];

const infrastructure = [
  ["01", "Resource Registry", "One canonical machine-readable place for purpose, version, provenance, CDQI, CEL and evidence debt."],
  ["02", "Deterministic lint", "Checks semver, provenance, CEL boundaries, inflated runtime claims and vendor-certification language."],
  ["03", "Evidence Debt", "Shows exactly what remains unproven instead of hiding uncertainty behind a score."],
  ["04", "Learning Ledger", "Turns safe observations from real work into future regressions without extra model calls."],
  ["05", "Resource Value Audit", "A Compound resource may be simplified or deleted when a simpler path is equal or better."],
  ["06", "Local Stress Lane", "Optional zero-API-cost stress testing can find fragility, but it never impersonates formal E2 evidence."],
];

export default function CompoundDesignPage() {
  return (
    <main className={styles.page}>
      <nav className={styles.nav} aria-label="Compound Design">
        <div className={styles.brand}><span className={styles.mark}>CD</span><span>Compound Design</span></div>
        <div className={styles.navMeta}><span className={styles.liveDot} /> POC · v0.2.1 · EVIDENCE INFRASTRUCTURE</div>
      </nav>

      <header className={styles.hero}>
        <div className={styles.eyebrow}>AI-NATIVE DESIGN ENGINEERING · VERSIONED RESOURCES</div>
        <h1>Build the application.<br />Improve the system that builds the next one.</h1>
        <p>v0.2.1 improves the evidence system without pretending the evidence level improved: resources now have canonical metadata, explicit evidence debt, deterministic claim checks and a learning path from real work.</p>
        <div className={styles.heroStats}>
          <div><strong>07</strong><span>stages</span></div>
          <div><strong>06</strong><span>resources</span></div>
          <div><strong>E1</strong><span>evidence unchanged</span></div>
          <div><strong>0</strong><span>paid runtime used</span></div>
        </div>
        <p className={styles.disclaimer}>This release improves infrastructure, not outcome claims. Runtime uplift remains not measured; no E2/E3 or vendor-certification claim is made.</p>
      </header>

      <section className={styles.evidenceSection} aria-labelledby="manifesto-title">
        <div className={styles.sectionHeading}>
          <span>WHY THIS EXISTS</span>
          <h2 id="manifesto-title">AI knowledge should become shared capability — not private technique.</h2>
          <p>Compound Design is an applied experiment in turning useful human + AI working patterns into reusable, testable resources. It does not assume every AI workflow is better. It asks which practices deserve to be shared, measured and improved.</p>
        </div>
        <div className={styles.splitGrid}>
          <article className={styles.metricPanel}>
            <div className={styles.metricHead}><span>THE PROBLEM</span><strong>01</strong></div>
            <h3>Useful AI practice is often tribal.</h3>
            <p>People can get very different outcomes from the same model because process, context, review and judgment live in individual habits. Useful learning can be lost, repeated or overstated.</p>
            <div className={styles.rubric}>
              <div><span>Today</span><strong>individual techniques</strong></div>
              <div><span>Risk</span><strong>knowledge resets</strong></div>
              <div><span>Question</span><strong>what deserves to be shared?</strong></div>
            </div>
          </article>
          <article className={styles.metricPanel}>
            <div className={styles.metricHead}><span>THE BET</span><strong>02</strong></div>
            <h3>Make learning compound.</h3>
            <p>Capture a useful practice, make its contract explicit, test it against a relevant baseline, observe failures and only promote stronger claims when the evidence earns them.</p>
            <div className={styles.rubric}>
              <div><span>Goal</span><strong>shared capability</strong></div>
              <div><span>Method</span><strong>version + eval + regression</strong></div>
              <div><span>Constraint</span><strong>no uplift claim without evidence</strong></div>
            </div>
          </article>
        </div>
        <div className={styles.gateGrid}>
          <article><span>01</span><h3>Share what is useful</h3><p>Valuable techniques should be understandable and reusable by others instead of depending on a single expert.</p></article>
          <article><span>02</span><h3>Show evidence before claims</h3><p>A resource earns stronger claims only when it performs against a relevant baseline in a defined scope.</p></article>
          <article><span>03</span><h3>Turn failures into learning</h3><p>When a meaningful failure can be reproduced, it becomes an eval so the next version can start from what was learned.</p></article>
        </div>
      </section>

      <section className={styles.timelineSection} aria-labelledby="process-title">
        <div className={styles.sectionHeading}><span>THE PROCESS</span><h2 id="process-title">A loop that leaves the next project stronger.</h2></div>
        <div className={styles.timeline}><div className={styles.rail} />
          {stages.map((stage, index) => (
            <article className={styles.stage} key={stage.name}>
              <div className={styles.stageNode}><span>{stage.n}</span></div>
              <div className={styles.stageBody}>
                <div className={styles.stageHead}><h3>{stage.name}</h3><span>{index === stages.length - 1 ? "→ repeat" : stages[index + 1].n}</span></div>
                <p>{stage.line}</p>
                <div className={styles.chips}>{stage.resources.map((r) => <span key={r}>{r}</span>)}</div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.evidenceSection} aria-labelledby="evidence-title">
        <div className={styles.sectionHeading}>
          <span>THE v0.2 CORRECTION</span>
          <h2 id="evidence-title">One number cannot mean “well built” and “proven”.</h2>
          <p>CDQI measures construction. CEL measures evidence. v0.2.1 keeps that boundary intact while making it operational.</p>
        </div>
        <div className={styles.splitGrid}>
          <article className={styles.metricPanel}>
            <div className={styles.metricHead}><span>CDQI</span><strong>0–10</strong></div>
            <h3>Construction quality</h3>
            <p>How bounded, grounded, actionable, testable and maintainable the resource is.</p>
            <div className={styles.rubric}>{construction.map(([label, weight]) => <div key={label}><span>{label}</span><strong>{weight}</strong></div>)}</div>
          </article>
          <article className={styles.metricPanel}>
            <div className={styles.metricHead}><span>CEL</span><strong>E0–E4</strong></div>
            <h3>Evidence maturity</h3>
            <p>How strongly the resource&apos;s effectiveness has actually been demonstrated.</p>
            <div className={styles.evidenceLadder}>{evidence.map(([level, title, copy], i) => <div className={i === 1 ? styles.evidenceActive : ""} key={level}><strong>{level}</strong><span>{title}<small>{copy}</small></span></div>)}</div>
          </article>
        </div>
      </section>

      <section className={styles.aiSection} aria-labelledby="infra-title">
        <div className={styles.sectionHeading}><span>v0.2.1 · EVIDENCE INFRASTRUCTURE</span><h2 id="infra-title">The framework now knows what it has — and what it still does not know.</h2><p>This release improves traceability, falsifiability and learning without spending model/API budget or promoting any resource above E1.</p></div>
        <div className={styles.gateGrid}>{infrastructure.map(([n, title, copy]) => <article key={title}><span>{n}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
      </section>

      <section className={styles.resourcesSection} aria-labelledby="resources-title">
        <div className={styles.sectionHeading}><span>RESOURCE SYSTEM · FRAMEWORK v0.2.1</span><h2 id="resources-title">The resources did not need fake version bumps.</h2><p>Resource behavior versions remain where they were. The framework around them improved: registry, evidence debt, learning capture and deletion/simplification criteria were added.</p></div>
        <div className={styles.resourceGrid}>{resources.map((resource) => (
          <article className={styles.resourceCard} key={resource.name}>
            <div className={styles.resourceTop}><div><span className={styles.kind}>{resource.kind} · v{resource.version}</span><h3>{resource.name}</h3></div><div className={styles.score}><strong>{resource.score}</strong><span>CDQI</span></div></div>
            <div className={styles.celBadge}>{resource.cel} · CONTRACT-TESTED</div>
            <p>{resource.summary}</p>
            <div className={styles.resourceFoot}><span>current learning</span><span>{resource.delta}</span></div>
          </article>
        ))}</div>
      </section>

      <section className={styles.aiSection} aria-labelledby="ai-title">
        <div className={styles.sectionHeading}><span>AI INTERACTION QUALITY</span><h2 id="ai-title">AI needs a different critique than ordinary UI.</h2><p>A bounded review skill, grounded in primary Human–AI interaction sources, that runs only when AI behavior materially affects the user or an action.</p></div>
        <div className={styles.gateGrid}>{aiGates.map(([n, title, copy]) => <article key={title}><span>{n}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
      </section>

      <section className={styles.verificationSection}>
        <div className={styles.sectionHeading}><span>CURRENT EVIDENCE BOUNDARY</span><h2>E1 remains E1. Better infrastructure is not the same as better outcomes.</h2><p>The deterministic release contracts still define the current evidence ceiling. v0.2.1 adds a registry/schema, lint rules with mutation fixtures, evidence debt, a learning ledger and resource-value governance.</p></div>
        <div className={styles.proofPanel}>
          <div className={styles.proofBig}><strong>E1</strong><span>current CEL</span></div>
          <div className={styles.proofBig}><strong>0</strong><span>paid runtime</span></div>
          <div className={styles.proofCopy}><strong>NO INFLATION</strong><p>The next evidence jump still requires controlled runtime comparisons, repeated fresh runs and real outcome deltas.</p></div>
        </div>
        <div className={styles.loop}>{[
          ["01","Observe","Capture a real, safe-to-record failure or mechanism during work that already happens."],
          ["02","Ledger","Record resource version, expected behavior, observed behavior and human correction."],
          ["03","Eval first","Turn reproducible failure into regression while preserving separate holdouts."],
          ["04","Change minimally","Modify only the boundary or instruction linked to the hypothesis."],
          ["05","Falsify","Look for duplicated logic, overfitting, false routing and efficiency regressions."],
          ["06","Version","Change behavior version only when the system actually earned a change."],
        ].map(([n,title,copy]) => <div className={styles.loopItem} key={n}><span>{n}</span><div><strong>{title}</strong><p>{copy}</p></div></div>)}</div>
      </section>

      <section className={styles.versionSection}>
        <div className={styles.sectionHeading}><span>CONTINUOUS VERSIONS</span><h2>Versions are earned by a better system, not a bigger prompt.</h2></div>
        <div className={styles.versions}>
          <div><span>FOUNDATION</span><strong>v0.1</strong><p>Architecture, first specialists, quality gate and visible readiness model.</p></div>
          <div><span>EVIDENCE MODEL</span><strong>v0.2</strong><p>CDQI/CEL separation, hardened contracts and AI Interaction Quality.</p></div>
          <div className={styles.versionActive}><span>NOW</span><strong>v0.2.1</strong><p>Canonical registry, lint, Evidence Debt, Learning Ledger, resource audit and local-stress lane.</p></div>
        </div>
        <div className={styles.nativeLoop}><span>real work</span><i>→</i><span>learning ledger</span><i>→</i><span>failure</span><i>→</i><span>eval</span><i>→</i><span>minimal change</span><i>→</i><span>falsify</span><i>→</i><span>earned version</span></div>
      </section>

      <footer className={styles.footer}><div><strong>Compound Design · v0.2.1</strong><span>Evidence infrastructure improved. Evidence level unchanged.</span></div><span>POC · 2026</span></footer>
    </main>
  );
}
