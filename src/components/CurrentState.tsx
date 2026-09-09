import { currentState, v } from "@/content/current-state";
import { Cta, StateCell, StateFoot, StateGrid } from "./editorial";
import { Term } from "./Term";

/**
 * The project's factual state, rendered from one source. `compact` is the Home block; `full` adds
 * the latest evidence, the next target and the verification date for the Project page.
 */
export function CurrentStateBlock({
  variant = "compact",
  locale = "en",
}: {
  variant?: "compact" | "full";
  locale?: "en" | "pt-BR";
}) {
  const s = currentState;
  const full = variant === "full";
  const pt = locale === "pt-BR";

  return (
    <StateGrid>
      <StateCell
        label={pt ? "Versão atual" : "Current release"}
        value={v(s.currentVersion)}
        mono
        note={
          pt
            ? `${s.releaseTheme} · ${s.releaseStage}. Base estável de evidência: ${v(s.stableBaseline)}.`
            : `${s.releaseTheme} · ${s.releaseStage}. Stable evidence baseline ${v(s.stableBaseline)}.`
        }
      />
      <StateCell
        label={pt ? "Evidência atual" : "Current evidence"}
        value={pt ? `${s.currentCEL} no máximo` : `${s.currentCEL} maximum`}
        mono
        note={
          pt ? (
            <>
              Contratos determinísticos para todos os recursos ativos. Nada acima disso. <Term id="cel">Entenda os níveis</Term>.
            </>
          ) : (
            <>
              Deterministic contracts, for every active resource. Nothing above it. <Term id="cel">What the levels mean</Term>.
            </>
          )
        }
      />
      <StateCell
        label="Runtime"
        value={pt ? `Runtime controlado: ${s.runtimeStatus}` : `Controlled runtime ${s.runtimeStatus}`}
        note={
          pt
            ? `Chamadas pagas de modelo na preparação do experimento: ${s.paidRuntimeCalls}. Ganho em runtime: ${s.runtimeUplift}.`
            : `Paid model calls in preparing the experiment: ${s.paidRuntimeCalls}. Runtime uplift ${s.runtimeUplift}.`
        }
      />
      <StateCell
        label={pt ? "O que sabemos" : "What we know"}
        value={pt ? "Os recursos ativos atendem aos contratos determinísticos que declaram." : "The active resources satisfy their declared, deterministic contracts."}
        wide
        note={full ? `${s.latestEvidence.what} — ${s.latestEvidence.date}.` : undefined}
      />
      <StateCell
        label={pt ? "O que ainda não sabemos" : "What we don't know"}
        value={pt ? "Se algum deles melhora um resultado em runtime." : "Whether any of them improves a runtime outcome."}
        wide
        note={
          pt
            ? "Ainda não rodamos a comparação contra não usar o recurso, contra o upstream direto ou contra a versão anterior."
            : "Over no resource, over direct upstream use, or over the version it replaced. The comparison has never been run."
        }
      />
      <StateCell
        label={pt ? "Próxima pergunta de evidência" : "Next evidence question"}
        value={pt ? "Os recursos do Compound superam a referência relevante?" : "Do Compound resources outperform the relevant baseline?"}
        wide
        note={
          full
            ? s.nextEvidenceTarget.what
            : pt
              ? "Pré-registrado e congelado. Só começa com autorização explícita para runtime pago."
              : "Pre-registered and frozen. It starts only with explicit paid-runtime authorisation."
        }
      />
      {full && (
        <StateCell
          label={pt ? "Última verificação" : "Last verified"}
          value={s.lastVerifiedAt}
          mono
          note={
            pt
              ? "Data em que a suíte de contratos rodou pela última vez sobre a árvore commitada e gerou seu artefato."
              : "The date the contract suite last ran on the committed tree and produced its artifact."
          }
        />
      )}
      <StateFoot>
        <span className="small faint">
          {pt
            ? `Lido no build a partir de ${s.sources.length} registros do repositório. Nenhuma rota pode declarar um nível que o registry não tenha.`
            : `Read at build time from ${s.sources.length} repository records. A route cannot state a level the registry does not hold.`}
        </span>
        {!full && <Cta href="/project">{pt ? "Ver o projeto" : "Explore the project"}</Cta>}
      </StateFoot>
    </StateGrid>
  );
}
