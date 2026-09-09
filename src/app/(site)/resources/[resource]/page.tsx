import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Defs, EvidenceBadge, PageIntro, Row, Rows, SectionIntro } from "@/components/editorial";
import { Markdown } from "@/components/Markdown";
import { Term } from "@/components/Term";
import { conceptById } from "@/content/concepts";
import { currentState } from "@/content/current-state";
import { evidenceLevels } from "@/content/evidence";
import generated from "@/content/generated/resources.json";
import { kindLabel, resourceById, resourceGroups, resources } from "@/content/resources";
import type { Resource } from "@/content/types";
import styles from "./resource.module.css";

const REPO = "https://github.com/DaniloAmaralUX/compoundmetrics/blob/main";

export function generateStaticParams() {
  return resources.map((r) => ({ resource: r.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ resource: string }> }): Promise<Metadata> {
  const r = resourceById((await params).resource);
  if (!r) return {};
  return { title: r.publicName, description: r.oneSentence };
}

function section(r: Resource, ...ids: string[]) {
  for (const id of ids) {
    const s = r.sections.find((x) => x.id === id);
    if (s) return s;
  }
  return undefined;
}

function Block({ label, section: s, fallback }: { label: string; section?: { markdown: string }; fallback?: React.ReactNode }) {
  if (!s && !fallback) return null;
  return (
    <div className={styles.block}>
      <span className="label">{label}</span>
      {s ? <Markdown text={s.markdown} /> : <div className={styles.fallback}>{fallback}</div>}
    </div>
  );
}

export default async function ResourcePage({ params }: { params: Promise<{ resource: string }> }) {
  const r = resourceById((await params).resource);
  if (!r) notFound();
  const group = resourceGroups.find((g) => g.id === r.group)!;
  const level = evidenceLevels.find((l) => l.id === r.cel)!;
  const ledger = (generated as unknown as { ledger: Array<{ id: string; resource: string; lesson: string; impact: string; observed_at: string }> }).ledger.filter((e) => e.resource === r.id);
  const isAgent = r.kind !== "skill";
  const whenToUse = section(r, "when-to-use", "dispatch-when");
  const whenNotToUse = section(r, "when-not-to-use", "do-not-dispatch-when");
  const runs = r.runs ? resourceById(r.runs) : undefined;

  return (
    <>
      <PageIntro
        eyebrow={`${kindLabel[r.kind]} · ${group.name}`}
        title={r.publicName}
        lead={r.oneSentence}
        aside={
          <>
            <EvidenceBadge cel={r.cel} cdqi={r.cdqi} />
            <span className="small muted mono">v{r.version}</span>
            <span className={`small faint mono ${styles.techId}`}>{r.id}</span>
          </>
        }
      />

      <div className={`container ${styles.layout}`}>
        <div className={styles.main}>
          <div className={styles.block}>
            <span className="label">What it does</span>
            <p className={styles.question}>{r.question}</p>
            <p className="body">{r.job}</p>
            {r.sections.length > 0 && !isAgent && r.sections[0].id === "when-to-use" && (
              <p className="body muted">{(generated as unknown as { items: Record<string, { lede: string }> }).items[r.id]?.lede}</p>
            )}
            {runs && (
              <p className="body muted">
                Runs the <Link href={`/resources/${runs.id}`} className={styles.inlineLink}>{runs.publicName}</Link> procedure. This agent does not restate it; the skill owns it, and a copy here
                would drift.
              </p>
            )}
          </div>

          <Block
            label={isAgent ? "Dispatch when" : "When to use"}
            section={whenToUse}
            fallback={
              r.triggers.length ? (
                <ul>
                  {r.triggers.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              ) : undefined
            }
          />
          <Block
            label={isAgent ? "Do not dispatch when" : "When not to use"}
            section={whenNotToUse}
            fallback={
              r.nonGoals.length ? (
                <ul>
                  {r.nonGoals.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              ) : undefined
            }
          />

          <div className={styles.block}>
            <span className="label">Example</span>
            <p className={styles.example}>{r.example}</p>
          </div>

          <Block label="Input" section={section(r, "inputs", "specialism")} />
          <Block label="Output" section={section(r, "output-contract", "returns", "output", "review-output")} />
          <Block label="Boundaries" section={section(r, "scope", "boundaries")} />
          <Block label="Write authority" section={section(r, "write-authority", "tool-policy")} />
          <Block label="Forbidden" section={section(r, "forbidden")} />

          <details className={styles.disclosure}>
            <summary className={styles.summary}>
              <span>Read the full procedure</span>
              <span className="small faint mono">
                {r.path} · {r.lines} lines · {r.sections.length} sections
              </span>
            </summary>
            <div className={styles.full}>
              {r.sections.map((s) => (
                <div key={s.id} className={styles.block} id={`section-${s.id}`}>
                  <h3 className="h3">{s.heading}</h3>
                  <Markdown text={s.markdown} />
                </div>
              ))}
            </div>
          </details>
        </div>

        <aside className={styles.side}>
          <div className={styles.sideBlock}>
            <span className="label">Evidence</span>
            <Defs
              items={[
                [
                  <Term key="cel" id="cel">
                    CEL
                  </Term>,
                  <>
                    <span className="mono">{r.cel}</span> — {level.name.toLowerCase()}. Can say: <span className="mono">{level.canSay}</span>. Runtime uplift {currentState.runtimeUplift}.
                  </>,
                ],
                [
                  <Term key="cdqi" id="cdqi">
                    CDQI
                  </Term>,
                  r.cdqi === null ? "Not audited. A construction score is written down after a construction audit, never assumed from a passing contract suite." : <span className="mono">{r.cdqi.toFixed(2)}</span>,
                ],
              ]}
            />
          </div>
          <div className={styles.sideBlock}>
            <span className="label">
              <Term id="evidence-debt">Evidence debt</Term>
            </span>
            {r.evidenceDebt.length ? (
              <ul className={styles.sideList}>
                {r.evidenceDebt.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            ) : (
              <span className="small muted">None recorded.</span>
            )}
          </div>
          <div className={styles.sideBlock}>
            <span className="label">Known failures</span>
            {ledger.length ? (
              <ul className={styles.sideList}>
                {ledger.map((e) => (
                  <li key={e.id}>
                    <span className="mono faint">{e.id}</span> · {e.lesson}
                  </li>
                ))}
              </ul>
            ) : (
              <span className="small muted">No failure has been recorded against this resource in the Learning Ledger. That is a statement about the ledger, not about the resource.</span>
            )}
          </div>
          <div className={styles.sideBlock}>
            <span className="label">
              <Term id="provenance">Provenance</Term>
            </span>
            <p className="small">Built within Compound Design.{r.upstream.filter((u) => !/^Compound Design/.test(u)).length ? ` Informed by ${r.upstream.filter((u) => !/^Compound Design/.test(u)).join("; ")}.` : ""}</p>
            {section(r, "provenance") && <Markdown text={section(r, "provenance")!.markdown} />}
            {r.supersedes && (
              <p className="small muted">
                Supersedes <span className="mono">{r.supersedes.id}</span> ({r.supersedes.publicName}, v{r.supersedes.version}, {r.supersedes.cel}
                {r.supersedes.cdqi !== null ? `, CDQI ${r.supersedes.cdqi.toFixed(2)}` : ""}). The superseded resource keeps its historical evidence; this one inherited none of it.
              </p>
            )}
            <p className="small faint">No upstream author endorses this resource.</p>
          </div>
          <div className={styles.sideBlock}>
            <span className="label">Related resources</span>
            <Rows>
              {r.related
                .map((id) => resourceById(id))
                .filter((x): x is Resource => Boolean(x))
                .map((x) => (
                  <Row key={x.id} href={`/resources/${x.id}`} title={x.publicName} meta={<span>{kindLabel[x.kind].toLowerCase()}</span>} />
                ))}
            </Rows>
          </div>
          <div className={styles.sideBlock}>
            <span className="label">Field Guide</span>
            <Rows>
              {r.concepts
                .map((id) => conceptById(id))
                .filter((c): c is NonNullable<typeof c> => Boolean(c))
                .map((c) => (
                  <Row key={c.id} href={`/learn/${c.id}`} title={c.title} />
                ))}
            </Rows>
          </div>
          <div className={styles.sideBlock}>
            <span className="label">Technical</span>
            <Defs
              items={[
                ["id", <span key="id" className="mono">{r.id}</span>],
                ["kind", kindLabel[r.kind].toLowerCase()],
                ["file", <a key="file" className={`mono ${styles.inlineLink}`} href={`${REPO}/${r.path}`} rel="noopener">{r.path}</a>],
              ]}
            />
          </div>
        </aside>
      </div>

      <section className="container section" aria-label="Back">
        <SectionIntro eyebrow="Keep inspecting" title="Every resource on one page." />
        <Link href="/resources" className={styles.inlineLink}>
          ← All resources
        </Link>
      </section>
    </>
  );
}
