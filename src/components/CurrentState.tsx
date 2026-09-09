import { currentState, v } from "@/content/current-state";
import { Cta, StateCell, StateFoot, StateGrid } from "./editorial";
import { Term } from "./Term";

/**
 * The project's factual state, rendered from one source. `compact` is the Home block; `full` adds
 * the latest evidence, the next target and the verification date for the Project page.
 */
export function CurrentStateBlock({ variant = "compact" }: { variant?: "compact" | "full" }) {
  const s = currentState;
  const full = variant === "full";
  return (
    <StateGrid>
      <StateCell label="Current release" value={v(s.currentVersion)} mono note={`${s.releaseTheme} · ${s.releaseStage}. Stable evidence baseline ${v(s.stableBaseline)}.`} />
      <StateCell
        label="Current evidence"
        value={`${s.currentCEL} maximum`}
        mono
        note={
          <>
            Deterministic contracts, for every active resource. Nothing above it. <Term id="cel">What the levels mean</Term>.
          </>
        }
      />
      <StateCell label="Runtime" value={`Controlled runtime ${s.runtimeStatus}`} note={`Paid model calls in preparing the experiment: ${s.paidRuntimeCalls}. Runtime uplift ${s.runtimeUplift}.`} />
      <StateCell label="What we know" value="The active resources satisfy their declared, deterministic contracts." wide note={full ? `${s.latestEvidence.what} — ${s.latestEvidence.date}.` : undefined} />
      <StateCell label="What we don't know" value="Whether any of them improves a runtime outcome." wide note="Over no resource, over direct upstream use, or over the version it replaced. The comparison has never been run." />
      <StateCell label="Next evidence question" value="Do Compound resources outperform the relevant baseline?" wide note={full ? s.nextEvidenceTarget.what : "Pre-registered and frozen. It starts only with explicit paid-runtime authorisation."} />
      {full && <StateCell label="Last verified" value={s.lastVerifiedAt} mono note="The date the contract suite last ran on the committed tree and produced its artifact." />}
      <StateFoot>
        <span className="small faint">
          Read at build time from {s.sources.length} repository records. A route cannot state a level the registry does not hold.
        </span>
        {!full && <Cta href="/project">Explore the project</Cta>}
      </StateFoot>
    </StateGrid>
  );
}
