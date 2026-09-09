// The Compound Design guide: the process, told the way a guide tells it.
//
// Structure and register follow Every's Compound Engineering guide (philosophy → the loop →
// the plugin → beliefs to let go → beliefs to adopt → getting started → three questions →
// best practices). Every mechanism named here is Compound Design's own and is documented in
// skills/, agents/ and compound-design/; nothing is borrowed prose. Factual state (version,
// counts, level) is never written here — the page reads it from current-state.ts.

export const guideHero = {
  eyebrow: "A guide, and a process",
  title: "Compound Design",
  subtitle: "Make every unit of design work compound into the next.",
  lede: "Compound Design came out of building web applications with AI agents and noticing something uncomfortable: a design engineer working through agents produces more interface than they can carefully judge, and the judgment they do apply disappears with the transcript. We turned the fix into a process — frame, model, build, verify, polish, then keep the one thing worth keeping — and into a plugin that installs it into the coding agent you already use. We're sharing it because we think this is how design engineering will be done, and because the process is built to find out if we're wrong.",
  platforms: "For Claude Code, Codex and Cursor · one canonical implementation, three hosts",
  cta: "Install the plugin",
  secondary: "Read the process",
};

export const philosophy = {
  eyebrow: "The philosophy",
  title: "Every unit of design work should make the next one easier — not harder.",
  problem: [
    "Most products get harder to design over time. Each screen adds a one-off: a spacing value nobody remembers choosing, an error message that names no recovery, a state nobody designed. After a few years a team spends more time negotiating with its own interface than improving it, and every new feature is a negotiation with the old ones.",
    "AI agents make this worse before they make it better. They produce interface faster than anyone can judge it, and when the session ends, the judgment goes with it. What you get is more screens and less system.",
  ],
  turn: [
    "Compound Design flips this on its head. Instead of screens adding debt, they teach the system. A review finding becomes a rule. A failure becomes an eval. A repeated solution becomes a pattern, a recurring interface becomes a component, a useful workflow becomes a skill. When they are codified, the lessons of one project become the starting capability of the next.",
    "Not everything compounds, and that is the point. Most of what happens in a project is not worth keeping. The little that is has to change form to survive, and it has to pass one test before it is written down.",
  ],
};

export const loopIntro = {
  eyebrow: "The main loop",
  title: "Frame → Model → Build → Verify → Polish → Compound → Repeat",
  body: [
    "The first five steps should be familiar to any design engineer. It's the sixth that separates Compound Design from design work with AI assistance. This is where the gains accumulate. Skip it, and you've built a good interface and kept nothing.",
    "The loop works the same whether you are fixing one form field in ten minutes or shipping a checkout over several days. Nothing forces a small change through six stages: the orchestrator picks the smallest sufficient path, and craft is not a stage — it is a quality of the answers at Model, Verify and Polish.",
    "Most thinking happens before and after the interface gets built. Frame and Verify are where the process spends its judgment. Build is where the agent spends its tokens.",
  ],
};

export interface LoopStage {
  id: string;
  n: string;
  name: string;
  question: string;
  actions: string[];
  owner: string;
  artifact: string;
  skill: string;
}

export const loopStages: LoopStage[] = [
  {
    id: "frame",
    n: "01",
    name: "Frame",
    question: "What are we actually solving?",
    actions: ["Restate the request as the problem underneath it", "Discover what a previous run already learned here", "Name the user, the outcome and the non-goals", "Write the constraints and what counts as done"],
    owner: "A person decides. The agent grounds the question in the repository.",
    artifact: "A frame — in the response, or a file only when a decision would otherwise be rediscovered.",
    skill: "cd-frame",
  },
  {
    id: "model",
    n: "02",
    name: "Model",
    question: "How should the product behave?",
    actions: ["Read the system that already exists", "Model entities, routes and relationships", "Enumerate every state, especially the ones nobody designed", "Separate instructions, data, tools and actions where AI is involved", "Write the contract Build implements"],
    owner: "The agent proposes. A person closes the open decisions.",
    artifact: "A behaviour contract Build can implement and Verify can check without re-deciding anything.",
    skill: "cd-model",
  },
  {
    id: "build",
    n: "03",
    name: "Build",
    question: "Make it real.",
    actions: ["Implement the contract inside the existing architecture", "Prefer the primitives the codebase already has", "Run the project's own checks", "Report exactly what changed, including what the contract did not ask for"],
    owner: "The agent. If you trust the model, there's no need to watch every line.",
    artifact: "A change, and a report of it.",
    skill: "cd-build",
  },
  {
    id: "verify",
    n: "04",
    name: "Verify",
    question: "Did reality match intention?",
    actions: ["Run the deterministic checks first", "Walk the model's states one by one", "Check reachability, focus and names", "Report findings in the shared shape. Don't fix them."],
    owner: "The agent reports. Reviewing is not permission to change.",
    artifact: "Findings: evidence, impact, severity, confidence, and observed / inferred / not-verified.",
    skill: "cd-verify",
  },
  {
    id: "polish",
    n: "05",
    name: "Polish",
    question: "Is it deliberate?",
    actions: ["Compare with sibling surfaces before changing anything", "Delete before you add", "Rewrite copy to name the action and the recovery", "Ask whether motion should exist at all before asking how it should move"],
    owner: "A person judges. Specialists are dispatched only when the work has a question for them.",
    artifact: "An interface that works and is deliberate — in that order.",
    skill: "cd-polish",
  },
  {
    id: "compound",
    n: "06",
    name: "Compound",
    question: "What deserves to improve future work?",
    actions: ["Capture the one learning a future run would otherwise rediscover", "Make it findable: the literal signals that will recur", "Update the system: a rule, an eval, a skill or a specialist", "Verify the learning: would the next run find it before repeating the mistake?"],
    owner: "A person decides what survives. Most runs keep nothing, and that is a valid result.",
    artifact: "One durable learning, or none.",
    skill: "cd-compound",
  },
];

export const compoundStep = {
  eyebrow: "Compound — the most important step",
  title: "The first five steps produce an interface. The sixth produces a system that designs interfaces better each time.",
  body: "This is the step teams skip, because the feature is already shipped and nothing visible is waiting. Compound Design makes it a stage with a procedure, a bar and a write authority. It writes one learning per run, only when the learning passes the durability test, with the frontmatter that lets the next Frame find it without anyone remembering it exists.",
  test: "If this disappeared, would a future human or agent likely repeat meaningful work, risk or investigation?",
  testNote: "Effort spent and the size of the change confer no eligibility. A learning already recoverable from the code is not written down again.",
};

export const phases = {
  eyebrow: "Who does what",
  title: "People at the beginning and the end. Agents in the middle.",
  body: "At the beginning, a person decides what is worth building and what would count as done. In the middle, the agent models, builds, checks and reports. At the end, a person judges whether the interface is good enough for users and whether the system learned anything reusable. The process is a sandwich: agents are the filling, people are the bread.",
  roles: [
    { role: "Design engineer", owns: "Frame, the open decisions in Model, the judgment in Polish, and the decision of what compounds.", never: "Reviews every pixel. If the result can't be trusted, the fix is in the system." },
    { role: "Orchestrator", owns: "Routing: the smallest sufficient path through the loop, and which specialist owns a judgment it should not make itself.", never: "Performs a stage's procedure when that stage's skill exists." },
    { role: "Specialists", owns: "Interface craft, motion, and user-facing AI — dispatched into their own context, only when the work has a question for them.", never: "Modify source. Report-only, one finding shape, no exceptions." },
    { role: "Quality gate", owns: "Saying no. Construction quality and evidence maturity, kept apart, before any promotion claim.", never: "Lets a good output count as evidence." },
    { role: "Learning curator", owns: "Keeping the learning store true, distinct and findable — including by deleting.", never: "Silently corrects the guidance it audits." },
  ],
};

export const plugin = {
  eyebrow: "The plugin",
  title: "What's in the box.",
  body: "One canonical directory of skills, a handful of thin agents that point at them, and manifests for three hosts. The installed plugin clones nothing and calls no model on its own. Compute lives in the agent you already run.",
  install: [
    ["01", "Add the marketplace", "/plugin marketplace add DaniloAmaralUX/compoundmetrics"],
    ["02", "Install the plugin", "/plugin install compound-design@compound-design"],
    ["03", "Set up a project", "/cd-setup"],
  ] as const,
  installNote: "Setup diagnoses, offers each fix, and changes nothing you own without asking. Codex and Cursor read the same directory through their own manifests.",
  whereTitle: "Where things live",
  where: [
    ["STRATEGY.md", "The anchor. Frame and Model read it every run. Short is a feature."],
    [".compound-design/config.yaml", "Team defaults: artifact root, review mode, runtime policy. A per-checkout override is never committed."],
    ["docs/frames/", "What a piece of work is actually solving. Written only when a decision would otherwise be rediscovered."],
    ["docs/plans/", "How the product must behave — the contract Build implements and Verify checks."],
    ["docs/solutions/", "Your institutional knowledge. One learning per run, each with the literal signals that will recur, so the next run finds it before repeating the mistake."],
    ["docs/handoffs/", "One immutable, pointer-first handoff per session end, so the next session can resume without re-reading everything."],
  ],
  whereNote: "Project work memory lives under one root you configure. The framework's own evidence system lives elsewhere and never mixes with it.",
  commandsTitle: "Core commands",
  commands: [
    ["cd-frame", "When the request arrived as a solution, start here."],
    ["cd-model", "When behaviour needs deciding before code."],
    ["cd-build", "Implement the contract. Run the checks. Report what changed."],
    ["cd-verify", "Check reality against intention. Report-only."],
    ["cd-polish", "Make it deliberate, after it works."],
    ["cd-compound", "Keep the one thing worth keeping."],
    ["cd-strategy", "Write or refresh the anchor."],
    ["cd-compound-refresh", "Audit the learning store. Keep, update, consolidate, replace or delete."],
    ["cd-setup", "Diagnose a repository and offer each fix."],
    ["cd-handoff", "Leave a session so the next one can resume."],
  ],
  specialistsTitle: "Specialists",
  specialists: [
    ["Interface Review", "What in this interface materially costs the user?"],
    ["Motion Review", "Should this move at all — and if so, how?"],
    ["AI Interaction Review", "Can people rely on this AI well, and stay in control?"],
    ["Quality Gate", "Is it well built, and separately, is it proven?"],
    ["Resource Lab", "How does a resource improve without a bigger prompt?"],
  ],
};

export const learningFilm = {
  eyebrow: "Where the learning goes",
  title: "Knowledge changes form on its way to the next project.",
  body: "Every arrow is a decision someone has to make. The system provides the forms and the tests; it does not decide for you what deserves to survive.",
  chain: ["Work", "Observation", "Solution", "Learning Ledger", "Rule · Pattern · Skill · Agent · Eval", "Future work"],
  tilesLabel: "What compounds",
};

export const beliefsToLetGo = {
  eyebrow: "Beliefs to let go",
  title: "Eight things to unlearn.",
  body: "Compound Design asks for a few habits most design engineers were trained into. Each one felt like craft. Each one stops scaling the moment an agent is doing the drawing.",
  items: [
    { belief: "‘The interface must be drawn by hand’", answer: "Who draws it — a person or an agent — doesn't matter. What matters is that someone decided what it must do, and someone judged whether it does. Those two jobs are yours. The drawing is not." },
    { belief: "‘Every screen must be reviewed pixel by pixel’", answer: "If you don't trust the result, fix the system: a rule, an eval, a specialist. Don't compensate by looking at everything yourself. A review that has to see every pixel is a review that will stop happening." },
    { belief: "‘Taste can't be written down’", answer: "Some of it can't. Most of it is a decision that was made once and never recorded. Write the decision down where the next run will find it, and keep the taste for what is left." },
    { belief: "‘The mockup is the primary artifact’", answer: "A system that produces good interfaces is worth more than any one interface. The model, the rule and the eval outlive the mockup. Treat the mockup as an input to Frame, not the output of the work." },
    { belief: "‘Craft is the last stage’", answer: "Craft is not a stage. It is the quality of the answers at Model, Verify and Polish, expressed through the specialists they call. An interface polished before it works is polished twice." },
    { belief: "‘First attempts should be good’", answer: "First attempts are mostly wrong. That is what Verify is for. The process assumes correction and budgets for it; it does not apologise for it." },
    { belief: "‘The design is mine’", answer: "It belongs to the team, the product and the users. What is yours is the judgment — and the judgment is worth more once it is in the system than it ever was in your head." },
    { belief: "‘A claim is fine if the output looks good’", answer: "A good output is not evidence. A thing can be well built and still unproven; usually, it is. Compound Design keeps two numbers and never merges them, so the site — and your team — can say plainly what has and has not been shown." },
  ],
  transitionsTitle: "Transition challenges",
  transitions: [
    { name: "Less drawing feels like less design", body: "It isn't. The design moved from the screen to the frame and the model, where it is cheaper to fix and possible to check." },
    { name: "Letting go feels risky", body: "It is, without safety nets. The loop's answer is not more review; it is deterministic checks, report-only findings, and a stage that refuses to move until the contract holds." },
    { name: "Who designed this?", body: "You did the deciding. The agent did the rendering. The record — frame, model, findings, learning — says so, in a form the next person can read." },
  ],
};

export const beliefsToAdopt = {
  eyebrow: "Beliefs to adopt",
  title: "What replaces them.",
  items: [
    { name: "Extract your taste into the system", body: "Every time you correct the same thing twice, you are paying for a rule you haven't written. Put it in the strategy anchor, in a specialist's procedure, or in an eval. Correcting it in a review neither scales nor lets the rest of the team learn." },
    { name: "Two numbers, never one", body: "Construction quality asks whether a resource is bounded, grounded, actionable, testable and maintainable. Evidence maturity asks whether it has been shown to make the work better, against a baseline, more than once. A high construction score at a low evidence level is the normal case. The vocabulary exists to keep it visible." },
    { name: "An artifact must be earned", body: "Most runs write no document. A frame, a plan or a learning appears when a decision, a constraint or a lesson would otherwise have to be rediscovered — lightweight in the response, bounded for the session, durable on disk. Bureaucracy-as-code is the failure mode this rule prevents." },
    { name: "Review reports. People decide.", body: "Reviewing something is not permission to change it. Every reviewer emits one finding shape — evidence, impact, severity, confidence, verification state — and applying a finding is a separate, explicit act." },
    { name: "Make the environment agent-native", body: "If a design engineer can see or run something, the agent should be able to see or run it too: the dev server, the checks, the design system, the prior learning. An agent that cannot run the check reports the check as not verified, never as passed." },
    { name: "Models are the new mockups", body: "Fixing behaviour in a model is cheaper than fixing it in a screen, and cheaper still than fixing it in production. A model that lists every state — including the ones nobody designed — is the most valuable document the loop produces." },
    { name: "Budget the compound step", body: "If it isn't on the calendar, it doesn't happen. One learning per run is the bar, and most runs keep nothing. Institutionally, that means the last stage of every piece of work is scheduled, owned and allowed to conclude ‘nothing survives’." },
  ],
  principlesTitle: "Core principles",
  principles: [
    "Every unit of design work makes the next one easier.",
    "Taste belongs in the system, not in the review.",
    "Teach the system. Don't do the work yourself.",
    "Build checks, not gatekeepers.",
    "Make the environment agent-native.",
    "An artifact must be earned.",
    "A claim never exceeds its evidence.",
    "Ship more interface. Draw less.",
  ],
  universal: "The principles extend beyond interface work to research, content and product decisions. The steps are the same: frame, model, build, verify, polish, compound.",
};

export const gettingStarted = {
  eyebrow: "Getting started",
  title: "Find yourself on the ladder.",
  body: "There are six stages against which a design engineer — or a team — can plot themselves. Skipping stages doesn't work: each one builds the trust the next one spends.",
  stages: [
    { n: "0", name: "Manual design", body: "Mockups by hand, handoff by document, review by meeting. The system learns nothing between projects." },
    { n: "1", name: "Chat-based assistance", body: "You ask a model for a component and paste it in. Faster, but the judgment still lives in your head and leaves with the tab." },
    { n: "2", name: "Agentic tools with screen-by-screen review", body: "The agent builds; you inspect every screen. Most teams plateau here, because the review is the bottleneck and nothing is written down." },
    { n: "3", name: "Frame-first, review-by-contract", body: "You write the frame and the model. You review against them, not against every pixel. This is where everything changes. Compound Design begins here.", key: true },
    { n: "4", name: "Request to pull request", body: "You describe the outcome. The loop runs. You judge at Polish and decide at Compound. The findings arrive in one shape, and the learning is on disk before the branch merges." },
    { n: "5", name: "Parallel, across a team", body: "Several loops run at once. The learning store is shared, refreshed on a schedule, and allowed to delete. The process is institutional: anyone can run it, and the record shows who decided what." },
  ],
  levelTitle: "How to level up",
  levels: [
    { from: "0 → 1", name: "Start collaborating", body: "Use a model for the parts you would have searched for anyway.", move: "Keep a running note of prompts that produced interface you kept." },
    { from: "1 → 2", name: "Let the agent in", body: "Give it the repository, the dev server and the checks.", move: "Write STRATEGY.md — the anchor every run reads before it asks you anything." },
    { from: "2 → 3", name: "Trust the frame", body: "Write the frame and the model before the screen. Review against them. This is the key transition.", move: "When the result is wrong, document what the frame or the model missed — not what the screen got wrong." },
    { from: "3 → 4", name: "Describe, don't draw", body: "State the outcome and the constraints; let the loop choose the path.", move: "Run cd-setup on every repository and build a library of outcome-focused frames." },
    { from: "4 → 5", name: "Run it as an institution", body: "Several people, several loops, one store.", move: "Schedule cd-compound-refresh and let it delete what is no longer true." },
  ],
};

export const threeQuestions = {
  eyebrow: "Three questions",
  title: "Ask these before you accept an interface.",
  body: "Agents know where their weaknesses are, but you have to ask. The finding contract makes the answer explicit: every claim is observed, inferred or not verified, and a check that could not be run is never reported as passed.",
  questions: ["What would this cost a user if it were wrong?", "What did you observe, and what did you infer?", "What are you least confident about?"],
};

export interface Practice {
  id: string;
  name: string;
  lede: string;
  traditional?: string[];
  compound?: string[];
  points?: string[];
  code?: string;
  soon?: boolean;
}

export const practices: Practice[] = [
  {
    id: "designers",
    name: "Working with designers",
    lede: "The handoff was the problem, not the designer.",
    traditional: ["Designer draws in a design tool", "Engineer rebuilds it from a screenshot", "Review argues about the difference", "The decision is lost with the thread"],
    compound: ["Designer and engineer write the frame together", "Model names every state, including the ones the mockup didn't", "The agent builds against the design system the team already has", "Interface Review checks consistency with sibling surfaces", "Polish happens with the designer, on the working interface", "Compound records the decision where the next project will find it"],
  },
  {
    id: "taste",
    name: "Codifying design taste",
    lede: "A skill is taste that survived the person who had it.",
    code: `# skill: our-design-system
- Spacing comes from the scale. A one-off value is a finding, not a fix.
- An error names the recovery, never only the failure.
- Motion exists only when it explains a change of state.
- Meaning is never carried by colour alone.
- Reuse the primitive before writing a new one.`,
    points: ["Start from corrections you have made twice.", "Each line must be checkable by Verify or by a specialist.", "Put it where the agent reads it every run, not in a document nobody opens."],
  },
  {
    id: "review",
    name: "Review as a report",
    lede: "A finding is a claim with evidence. Everything else is commentary.",
    points: [
      "One shape for every reviewer: evidence, impact, severity, confidence, verification state, source.",
      "Three severities. One blocker outranks any number of minors, and severity is never inflated to make a review look important.",
      "A finding without evidence and impact is dropped. ‘It could be better’ is not a finding.",
      "One root cause is one finding, however many places it appears.",
      "Fixes are ordered by cost: delete the problem, use the platform default, reuse what exists, correct the value — and only then add something.",
    ],
  },
  {
    id: "store",
    name: "Keeping the store true",
    lede: "Institutional knowledge rots unless something is allowed to delete it.",
    points: [
      "Every learning gets exactly one outcome on refresh: keep, update, consolidate, replace or delete.",
      "Nothing is archived in place. Version history is the archive.",
      "Accuracy always runs; worth runs only when someone asks for a cleanup and confirms it.",
      "A learning that contradicts a skill is reported, never silently corrected.",
    ],
  },
  {
    id: "evidence",
    name: "Evidence discipline",
    lede: "The framework is allowed to say no — to itself first.",
    points: [
      "Construction quality and evidence maturity are separate numbers, and neither may borrow from the other.",
      "A resource reaches the first evidence level only by passing a deterministic contract suite, in its own commit.",
      "The controlled-runtime experiment is pre-registered with the conditions under which Compound loses, and it refuses to start without explicit paid-runtime authorisation.",
      "A resource that adds nothing over the open-source work it learned from is removed, not defended.",
    ],
  },
  {
    id: "team",
    name: "Team standards",
    lede: "Rules the organisation adopts, not suggestions the individual remembers.",
    points: [
      "A frame nobody approved is a guess. Silence is not approval; it is the absence of a decision.",
      "Review is not permission to change. Applying a finding is a separate act, by the owner.",
      "Handoffs are pointers, not copies: what matters at each reference, never the reference reproduced.",
      "Every claim on a public surface is derived from the repository's own records, and a guard fails the build when one is restated or inflated.",
    ],
  },
  {
    id: "ai",
    name: "User-facing AI",
    lede: "When the interface contains a model, six more questions apply.",
    points: [
      "AI fit — would deterministic UI be clearer, cheaper or more reliable?",
      "Reliance — can people accept good output and detect or reject bad output?",
      "Legibility — can the person understand enough of what the AI is doing to act well?",
      "Human control — are edit, reject, stop, approval and undo cheaper than recovery?",
      "Autonomy — does action power scale with consequence and reversibility?",
      "Evolution — can model, provider and data changes be regression-tested and rolled back?",
    ],
  },
  { id: "research", name: "User research", lede: "Research that never reaches a frame never reaches a screen.", soon: true },
  { id: "content", name: "Copy and content", lede: "Copy is part of the model, reviewed like code.", soon: true },
];

export const closing = {
  title: "Build the application. Improve the system that builds the next one.",
  cta: "Install the plugin",
  secondary: "See what has been encoded",
};

export const guideFooter = {
  follow: "Follow the project",
  wordmark: "Compound",
};

export const guideNav = {
  brand: "Compound Design",
  cta: "Install the plugin",
  chapters: [
    ["philosophy", "Philosophy"],
    ["loop", "The loop"],
    ["roles", "Who does what"],
    ["plugin", "The plugin"],
    ["learning", "Where learning goes"],
    ["unlearn", "Beliefs to let go"],
    ["adopt", "Beliefs to adopt"],
    ["start", "Getting started"],
    ["questions", "Three questions"],
    ["practices", "Best practices"],
  ] as const,
};
