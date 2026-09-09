import type { Metadata } from "next";
import { Lab } from "@/components/Lab";
import { Cta, CtaRow, PageIntro, SectionIntro } from "@/components/editorial";
import { Term } from "@/components/Term";
import { conceptById } from "@/content/concepts";
import styles from "./lab.module.css";

export const metadata: Metadata = {
  title: "Compound Lab",
  description: "Review a small signup form, correct what you find, and watch one finding change form into something the next project will inherit. Deterministic; no model runs.",
};

const termIds = ["learning-ledger", "durable-learning", "discoverability", "finding-contract"];

export default function LabPage() {
  const terms = Object.fromEntries(
    termIds.map((id) => {
      const c = conceptById(id);
      if (!c) throw new Error(`Lab: unknown concept ${id}`);
      return [id, { title: c.title, plain: c.oneSentence }];
    }),
  );
  return (
    <>
      <PageIntro
        eyebrow="Compound Lab · illustrative · deterministic demo"
        title="Review this signup experience."
        lead="A real small interface with four defects seeded in it. Frame the review, verify it finding by finding, apply the corrections and watch the specimen change — then see which of what you found deserves to survive the project."
        aside={
          <>
            <span className="label">What runs here</span>
            <span className="small muted">Nothing. No model, no network, no randomness. Every finding, correction and learning is authored and fixed; the same click always produces the same result.</span>
          </>
        }
      />

      <section className={`container ${styles.labSection}`} aria-label="The Lab">
        <Lab terms={terms} />
      </section>

      <section className="container section" aria-labelledby="after-title">
        <SectionIntro
          id="after-title"
          eyebrow="What this was and was not"
          title="A demonstration of the mechanism, not evidence that it works."
          lead={
            <>
              The findings use the real <Term id="finding-contract">finding contract</Term>; the durability test is the one <Term id="durable-learning">Compound</Term> applies; the signals are
              what <Term id="discoverability">discovery</Term> matches on. But this page was authored by a person. Whether the resources produce this on real work, with a model, is exactly what
              has not been measured.
            </>
          }
          wide
        />
        <CtaRow>
          <Cta href="/how-it-works">The mechanism, explained</Cta>
          <Cta href="/evidence">What has and hasn&apos;t been demonstrated</Cta>
          <Cta href="/resources/cd-interface-review">The reviewer that would find these</Cta>
        </CtaRow>
      </section>
    </>
  );
}
