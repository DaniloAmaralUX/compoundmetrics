// The Compound Lab: a deterministic demonstration. No model runs; every finding, correction and
// learning is authored here and fixed. The same click always produces the same result.

export type Severity = "blocker" | "major" | "minor";
export type Verification = "observed" | "inferred" | "not-verified";

export interface LabFinding {
  id: string;
  short: string;
  /** Which fixture element it concerns. */
  scope: string;
  severity: Severity;
  confidence: "high" | "medium";
  /** The thing observed, quoted from the specimen. */
  evidence: string;
  where: string;
  impact: string;
  recommendation: string;
  /** How it is established at rest; `run` marks one that needs the visitor to act. */
  verification: Verification;
  needsRun?: boolean;
  source: string;
  /** What happens to it in Compound: which form, if any. */
  compound: { outcome: "learning" | "eval" | "already-covered" | "consistency"; form: string; why: string };
}

export const labFindings: LabFinding[] = [
  {
    id: "IR-01",
    short: "Email field has no label, only a placeholder",
    scope: "email field",
    severity: "blocker",
    confidence: "high",
    evidence: '<input type="email" placeholder="Email"> with no <label> and no accessible name',
    where: "the second field",
    impact: "A screen-reader user hears “edit text” and nothing else. The placeholder disappears the moment they type, so a sighted user loses the field's name too.",
    recommendation: "A visible <label for> above the field. Keep the placeholder only as an example value, if at all.",
    verification: "observed",
    source: "WCAG 1.3.1 / 4.1.2; the markup itself",
    compound: {
      outcome: "already-covered",
      form: "nothing new — the reviewer already checks accessible names",
      why: "The durability test fails: the next reviewer would not rediscover this, because reachability and names are already the first step of Interface Review. Recording it again would be a duplicate.",
    },
  },
  {
    id: "IR-02",
    short: "Validation message is far from the field it describes",
    scope: "error message",
    severity: "major",
    confidence: "high",
    evidence: "The rejection is rendered in a banner above the form; the field carries no aria-describedby and no adjacent text.",
    where: "the banner at the top of the form",
    impact: "A sighted user scans up to find out what went wrong; a screen-reader user hears nothing where their focus is. The message also does not say what a valid address looks like.",
    recommendation: "Render the message next to the field, associate it with aria-describedby, and name the recovery.",
    verification: "observed",
    source: "WCAG 3.3.1 / 3.3.3; the markup itself",
    compound: {
      outcome: "learning",
      form: "a durable learning, with signals",
      why: "The durability test passes: the next engineer building any form would rediscover this the hard way. Written once — “validation feedback should preserve spatial and programmatic association with its field” — with the literal signals that will recur: aria-describedby, error-summary, toast.",
    },
  },
  {
    id: "IR-03",
    short: "The submit button suppresses its focus ring",
    scope: "submit button",
    severity: "major",
    confidence: "high",
    evidence: "button:focus { outline: none } with no replacement indicator",
    where: "the Create account button",
    impact: "A keyboard user cannot tell when the primary action has focus. Pressing Enter on the wrong element submits nothing, or the wrong thing.",
    recommendation: "Remove the override; use the system's focus token.",
    verification: "observed",
    source: "WCAG 2.4.7; the stylesheet itself",
    compound: {
      outcome: "consistency",
      form: "a consistency finding — the design system already has a focus token",
      why: "Nothing new to learn: the product already does this well elsewhere. Polish deletes the override. A learning that the code already expresses is not written down again.",
    },
  },
  {
    id: "IR-04",
    short: "Submitting gives no feedback",
    scope: "submit state",
    severity: "major",
    confidence: "high",
    evidence: "On submit the button is disabled and nothing else changes: no status text, no live region, no progress.",
    where: "after pressing Create account",
    impact: "The person does not know whether anything happened. They press again, or leave.",
    recommendation: "Announce the state — “Creating your account…” — in a live region, and keep the button's label honest.",
    verification: "not-verified",
    needsRun: true,
    source: "A behaviour, not a line: it can only be observed by submitting",
    compound: {
      outcome: "eval",
      form: "an eval candidate — a fixture and a ground-truth expectation",
      why: "A reviewer either finds this or it does not. A fixture with a silent submit and an expected finding turns the answer into something recorded, not remembered.",
    },
  },
];

export const labFrame = {
  problem: "People start creating an account and stop. The form works — it validates, it submits, it creates the account — so the cost is in how it behaves for the person, not in whether it runs.",
  user: "Someone signing up for the first time, on any device, with or without a pointer or a screen.",
  outcome: "They know what each field wants, what went wrong when it did, and whether pressing the button did anything.",
  nonGoals: "A redesign. A new visual language. Backend or password policy.",
  success: "Every field has a name. Every error is next to its field and names the recovery. The primary action shows focus and answers when pressed.",
  next: "cd-verify",
};

export const labStages = [
  { id: "frame", n: "01", name: "Frame", question: "What are we actually solving?" },
  { id: "verify", n: "02", name: "Verify", question: "Did reality match intention?" },
  { id: "polish", n: "03", name: "Polish", question: "Is it deliberate?" },
  { id: "compound", n: "04", name: "Compound", question: "What deserves to improve future work?" },
] as const;

export const verificationStates: Array<{ id: Verification; plain: string }> = [
  { id: "observed", plain: "seen in the file, or seen happen" },
  { id: "inferred", plain: "follows from something observed plus a rule" },
  { id: "not-verified", plain: "would need a run, a render or data the reviewer did not have" },
];

export const compoundSequence = ["One-off observation", "Correction", "Durable learning", "Resource candidate", "Eval candidate", "Next project starts smarter"];
