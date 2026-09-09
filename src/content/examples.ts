import type { Example } from "./types";

// One concrete example, used by How it Works and by the Lab, so the visitor meets the same
// knowledge changing form in both places.
export const signupExample: Example = {
  id: "signup",
  title: "A signup form, and what survives it",
  setting: "A team is building account creation. The form works: it validates, it submits, it creates the account. Verify runs on it before Polish.",
  steps: [
    {
      id: "observation",
      label: "Observation",
      title: "Validation feedback feels disconnected from its field.",
      body: "The email field rejects an address, and the message appears in a banner at the top of the form. A sighted user scans up to find out what went wrong; a screen-reader user hears nothing where their focus is.",
      form: "a one-off note in a review",
    },
    {
      id: "correction",
      label: "Correction",
      title: "Bring the feedback into the field's interaction context.",
      body: "The message moves next to the field it describes, is announced where focus is, and names the recovery: what a valid address looks like.",
      form: "a change to one form",
    },
    {
      id: "learning",
      label: "Learning",
      title: "Validation feedback should preserve spatial and programmatic association with its field.",
      body: "That sentence is no longer about this form. It passes the durability test — if it vanished, the next engineer building a form would rediscover it the hard way — so it is written down once, with the literal signals that will recur: aria-describedby, the error-summary pattern, the toast region.",
      form: "a durable learning with signals",
    },
    {
      id: "resource",
      label: "Resource candidate",
      title: "An Interface Review rule.",
      body: "Interface Review already checks states and reachability. The learning sharpens one check: feedback that is not associated with its field is a finding, with a known impact and a known fix.",
      form: "a line in a reviewer's procedure",
    },
    {
      id: "eval",
      label: "Eval candidate",
      title: "Detect detached validation feedback.",
      body: "A fixture with a detached error message and a ground-truth expectation that the reviewer reports it. The reviewer either finds it or it does not; the answer is recorded, not remembered.",
      form: "a deterministic check",
    },
    {
      id: "future",
      label: "Future project",
      title: "The next project meets the learning before repeating the mistake.",
      body: "Months later, Frame runs discovery on a request that mentions a form error summary. The learning surfaces, with its id, as a constraint. The mistake is avoided earlier than it was found the first time.",
      form: "a constraint in a new frame",
    },
  ],
};

export const whatCompounds: Array<[string, string]> = [
  ["A decision", "becomes a rule"],
  ["A failure", "becomes an eval"],
  ["A repeated solution", "becomes a pattern"],
  ["A recurring interface", "becomes a component"],
  ["A useful workflow", "becomes a skill"],
  ["A specialised responsibility", "becomes an agent"],
  ["A project lesson", "improves the next project"],
];

export const whatDoesNotCompound = [
  "Not every observation becomes a learning.",
  "Not every learning becomes a rule.",
  "Not every rule becomes a skill.",
  "Not everything deserves to compound.",
];

export const durabilityTest =
  "If this disappeared, would a future human or agent likely repeat meaningful work, risk or investigation?";

export const loop = [
  { id: "frame", name: "Frame", question: "What are we actually solving?", skill: "cd-frame" },
  { id: "model", name: "Model", question: "How should the product behave?", skill: "cd-model" },
  { id: "build", name: "Build", question: "Make it real.", skill: "cd-build" },
  { id: "verify", name: "Verify", question: "Did reality match intention?", skill: "cd-verify" },
  { id: "polish", name: "Polish", question: "Is it deliberate?", skill: "cd-polish" },
  { id: "compound", name: "Compound", question: "What deserves to improve future work?", skill: "cd-compound" },
] as const;

export const repeat = { name: "Repeat", question: "Start with more capability than before." };

export const transformation = [
  "Project 01",
  "Work",
  "Discovery",
  "Learning",
  "Resource",
  "System improves",
  "Project 02 starts better",
];
