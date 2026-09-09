import type { Metadata } from "next";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: { absolute: "Compound Design v0.3.0-alpha.1 — Work System" },
  description: "A design engineering work system for humans and AI agents: frame, model, build, verify, polish, then compound what was learned — with an evidence system that keeps every claim inside what has been checked.",
  robots: { index: false, follow: false },
};

const stages = [
  { n: "01", name: "Frame", line: "Establish the problem, user, outcome, constraints and success conditions — and discover what a previous run already learned about this area.", resources: ["cd-frame", "prior learning", "AI fit"] },
  { n: "02", name: "Model", line: "Decide how the product must behave: entities, routes, states, transitions, edge cases and the contract Build implements.", resources: ["cd-model", "state coverage", "instructions / data / tools / actions"] },
  { n: "03", name: "Build", line: "Implement the decided contract inside the existing architecture, verify locally, and report exactly what changed.", resources: ["cd-build", "existing primitives", "write authority"] },
  { n: "04", name: "Verify", line: "Check the built result against what was decided. Report-only by default: reviewing is not permission to change.", resources: ["cd-verify", "Interface Review", "AI Interaction Review"] },
  { n: "05", name: "Polish", line: "Make a working interface deliberate — hierarchy, typography, spacing, colour, copy and feel. Only after it works.", resources: ["cd-polish", "Motion Review", "design system"] },
  { n: "06", name: "Compound", line: "Keep the one learning a future run would otherwise rediscover, and make it discoverable. Most runs keep nothing.", resources: ["cd-compound", "Learning Ledger", "Compound Refresh"] },
];

const resources = [
  { name: "Design Guide", kind: "ORCHESTRATOR · AGENT", version: "0.3.0-alpha.1", score: "—", cel: "E1", summary: "Routes work through the smallest sufficient set of stages and dispatches specialists deliberately. It owns no procedure of its own.", delta: "Rewritten as a thin router over the six loop skills" },
  { name: "Interface Review", kind: "SPECIALIST · SKILL + AGENT", version: "0.3.0-alpha.1", score: "—", cel: "E1", summary: "Finds what materially costs a user — reachability, hierarchy, states, contrast, reflow, copy — and reports it with evidence, impact and a verification state.", delta: "Rewritten as a self-contained Compound Design resource" },
  { name: "Motion Review", kind: "SPECIALIST · SKILL + AGENT", version: "0.3.0-alpha.1", score: "—", cel: "E1", summary: "Asks whether motion should exist at all before asking how it should move, then checks interruption, exit and reduced-motion behaviour.", delta: "Rewritten as a self-contained Compound Design resource" },
  { name: "Quality Gate", kind: "QUALITY · SKILL", version: "0.2.0", score: "8.75", cel: "E1", summary: "Separates construction quality from evidence and evaluates the evaluator itself before allowing any promotion claim.", delta: "Carried into v0.3 unchanged" },
  { name: "Resource Lab", kind: "LEARNING · SKILL", version: "0.2.0", score: "8.65", cel: "E1", summary: "Improves resources through reproduced failures, hypotheses, eval-first changes, holdouts and falsification attempts.", delta: "Carried into v0.3 unchanged" },
  { name: "AI Interaction Review", kind: "SPECIALIST · SKILL", version: "0.1.0", score: "8.35", cel: "E1", summary: "Reviews only user-facing AI for fit, reliance, legibility, human control, proportional autonomy and model evolution.", delta: "Carried into v0.3 unchanged" },
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
  ["01", "Work system", "Six skills for the loop, plus strategy, refresh, setup and handoff. Each declares its scope, its write authority and what it may never do."],
  ["02", "Specialists as agents", "An agent is a specialist dispatched into its own context; a skill is the procedure. An agent that restates its skill fails a deterministic test."],
  ["03", "Durable learning", "One learning per run, only when a future reader would otherwise rediscover it — and a maintenance pass whose outcomes include deletion."],
  ["04", "Discoverability", "A learning carries the literal signals that will recur, and Frame and Model run a bounded deterministic search before asking anything."],
  ["05", "Shared finding contract", "Four reviewers, one shape: evidence, impact, severity, confidence, and observed / inferred / not-verified."],
  ["06", "Installable plugin", "One canonical implementation read by Claude Code, Codex and Cursor. Self-contained: it clones nothing at runtime."],
];

const install = [
  ["01", "Add the marketplace", "/plugin marketplace add DaniloAmaralUX/compoundmetrics"],
  ["02", "Install the plugin", "/plugin install compound-design@compound-design"],
  ["03", "Set up a project", "cd-setup — diagnoses, offers each fix, changes nothing you own without asking"],
];

export default function CompoundDesignPage() {
  return (
    <main className={styles.page}>
      <nav className={styles.nav} aria-label="Compound Design">
        <div className={styles.brand}><span className={styles.mark}>CD</span><span>Compound Design</span></div>
        <div className={styles.navMeta}><span className={styles.liveDot} /> CANDIDATE · v0.3.0-alpha.1 · WORK SYSTEM</div>
      </nav>

      <header className={styles.hero}>
        <div className={styles.eyebrow}>DESIGN ENGINEERING WORK SYSTEM · HUMANS + AI AGENTS</div>
        <h1>Build the application.<br />Improve the system that builds the next one.</h1>
        <p>A loop you can install: frame the problem, model the behaviour, build it, verify it against what was decided, polish what works, then keep the one thing worth keeping where the next run will find it.</p>
        <div className={styles.heroStats}>
          <div><strong>06</strong><span>loop stages</span></div>
          <div><strong>15</strong><span>skills · 6 agents</span></div>
          <div><strong>E1</strong><span>evidence unchanged</span></div>
          <div><strong>0</strong><span>paid runtime used</span></div>
        </div>
        <p className={styles.disclaimer}>A candidate release: the architecture and the behaviour changed, and nothing was shown to work better. Runtime uplift remains not measured, v0.2.1 remains the stable evidence baseline, and the controlled-runtime pilot has never been executed.</p>
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
        <div className={styles.sectionHeading}><span>THE LOOP</span><h2 id="process-title">A loop that leaves the next project stronger.</h2><p>Craft is not a stage. It happens through specialists and decisions inside Model, Verify and Polish, and only when the work has a question that needs them. Nothing forces a small change through six stages.</p></div>
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
        <div className={styles.sectionHeading}><span>v0.3.0-alpha.1 · WORK SYSTEM</span><h2 id="infra-title">From a framework you read to a system you run.</h2><p>Six loop skills, five specialists, four operational skills and six agents, distributed as one installable plugin. No resource was promoted above E1 and no runtime was executed to build it.</p></div>
        <div className={styles.gateGrid}>{infrastructure.map(([n, title, copy]) => <article key={title}><span>{n}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
      </section>

      <section className={styles.resourcesSection} aria-labelledby="resources-title">
        <div className={styles.sectionHeading}><span>RESOURCES · CANDIDATE v0.3.0-alpha.1</span><h2 id="resources-title">A rewritten resource does not inherit evidence.</h2><p>Interface Review and Motion Review were rewritten as self-contained Compound Design resources and re-earned E1 through the deterministic contract suite. Three resources were carried over unchanged and keep the evidence they already had. A dash means construction quality has not been audited yet — it is never assumed.</p></div>
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

      <section className={styles.aiSection} aria-labelledby="install-title">
        <div className={styles.sectionHeading}><span>INSTALL</span><h2 id="install-title">One plugin, read directly by three hosts.</h2><p>Claude Code, Codex and Cursor read the same canonical skills through their own manifest, so there is no mirrored copy to drift. The installed plugin is self-contained: it clones nothing and needs no upstream checkout.</p></div>
        <div className={styles.gateGrid}>{install.map(([n, title, cmd]) => <article key={title}><span>{n}</span><h3>{title}</h3><p>{cmd}</p></article>)}</div>
        <div className={styles.nativeLoop}><span>install</span><i>→</i><span>cd-setup</span><i>→</i><span>frame</span><i>→</i><span>model</span><i>→</i><span>build</span><i>→</i><span>verify</span><i>→</i><span>polish</span><i>→</i><span>compound</span></div>
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

      <footer className={styles.footer}><div><strong>Compound Design · v0.3.0-alpha.1</strong><span>Work system added. Evidence level unchanged. Runtime uplift not measured.</span></div><span>CANDIDATE · 2026</span></footer>
    </main>
  );
}
