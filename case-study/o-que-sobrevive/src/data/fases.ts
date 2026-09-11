import type { LifelineEvent, LifelineMarker } from "@/components/lifeline/types"
import type { Level } from "./level"

/**
 * Trilho 1 — "A linha simples". Six project stages on an ordinal axis
 * (0..5): the axis is order, not calendar time. Every quoted English line
 * is a literal from `src/content/project.ts` or the release records.
 */
interface Fase {
  order: number
  id: string
  version: string
  name: string
  status: "feito" | "atual" | "próximo"
  crianca: string[]
  colega: string[]
  especialista: LifelineEvent[]
}

const fonte = (...refs: Array<[string, string]>): LifelineEvent =>
  "Fonte: " + refs.map(([label]) => label).join(" · ")

export const FASES: Fase[] = [
  {
    order: 0,
    id: "thesis",
    version: "v0",
    name: "Tese",
    status: "feito",
    crianca: [
      "Toda vez que alguém termina um trabalho bonito com um agente de IA, joga fora o caderno.",
      "A aposta: e se o caderno passasse para o próximo?",
    ],
    colega: [
      "Um design engineer com agentes produz mais interface do que consegue julgar, e o julgamento some com a conversa.",
      "A tese escreveu uma aposta: esse julgamento pode se acumular entre projetos.",
      "Sucesso não é “o Compound vence”; é “o framework consegue descobrir que está errado”. Nada foi provado: uma tese é uma pergunta.",
    ],
    especialista: [
      "Pergunta: “Can design-engineering judgment compound across projects instead of resetting when the session ends?”",
      "Construído: o ciclo; duas fronteiras (“an artifact must be earned”, “a claim may never exceed its evidence”); sucesso definido como “the framework can discover it is wrong”.",
      "Aprendido: “Nothing yet — a thesis is a question, not a result.”",
      "Desconhecido: “Everything the thesis claims.”",
      "Data: STRATEGY.md atualizado em 2026-09-09; o primeiro artefato chamado Compound é de 2026-07-13.",
      fonte(["STRATEGY.md", "STRATEGY.md"], ["project.ts", "src/content/project.ts"]),
    ],
  },
  {
    order: 1,
    id: "resources",
    version: "v0.1",
    name: "Recursos",
    status: "feito",
    crianca: [
      "Escrevemos as primeiras páginas: cinco ajudantes, cada um com uma tarefa.",
      "Demos nota pelo capricho da escrita, não por a página funcionar.",
    ],
    colega: [
      "Os primeiros recursos: orquestrador, especialista em interface, em motion, portão de qualidade e laboratório de recursos, cada um com escopo, fronteira de roteamento, contrato de instrução e caminho de avaliação.",
      "Notas de prontidão entre 8,0 e 8,4 numa rubrica fixa de dez pontos, rotuladas como prontidão, não verificação.",
      "O problema apareceu na hora: uma nota única corria o risco de ser lida como prova.",
    ],
    especialista: [
      "Pergunta: “Can useful human + AI design practice be encoded as bounded, testable resources?”",
      "Construído: rubrica de 10 pontos em 7 dimensões; scores 8,0–8,4 “explicitly labelled readiness, not verification”; para cada recurso, a prova que ainda faltava (A/B outcome deltas, repeated routing runs).",
      "Aprendido: “A coherent architecture was possible. Its weakness was epistemic: a single readiness score risked being read as proof.”",
      "Desconhecido: uplift sobre modelo base ou upstream direto; taxas de falso positivo e negativo; deltas de tokens e tool calls.",
      "Comparabilidade: “do not plot a numeric ‘improvement’ from v0.1 to v0.2” — rubricas diferentes.",
      fonte(["v0.1-readiness-audit.md", "compound-design/quality/releases/v0.1-readiness-audit.md"], ["v0.1-scores.json", "compound-design/quality/releases/v0.1-scores.json"]),
    ],
  },
  {
    order: 2,
    id: "quality-system",
    version: "v0.2",
    name: "Sistema de qualidade",
    status: "feito",
    crianca: [
      "Descobrimos que “bem escrito” e “funciona” são coisas diferentes.",
      "Cada página passou a ter duas notas, e uma nunca empresta para a outra.",
    ],
    colega: [
      "Qualidade de construção e maturidade de evidência viraram duas medidas: CDQI (0–10, quão bem foi construído) e CEL (E0–E4, quanto já foi demonstrado).",
      "Todo recurso ganhou trabalho primário, não-objetivos, severidade e contrato de saída com evidência. Uma suíte determinística passou a qualificar recursos para E1, e para nada além.",
      "Um recurso pode ter 8,8 de construção em E0, e o sistema agora diz isso.",
    ],
    especialista: [
      "Pergunta: “How do we stop a construction score from being read as proof?”",
      "Construído: CDQI v0.2 (“runtime evidence deliberately removed from the number”); CEL E0–E4, cada nível com o claim permitido e o proibido; suíte de contratos que qualifica para E1 “and nothing more”; meta-avaliação do avaliador.",
      "Aprendido: “The framework became harder to fool. A resource can score 8.8 for construction at E0 — well designed, not shown to work — and the system now says so.”",
      "Desconhecido: uplift em runtime, significância, certificação de vendor, corroboração independente, evidência de campo — cada um listado como não reivindicado.",
      "CDQI v0.2: cd 8,45 · jakub 8,55 · emi 8,50 · cd-quality-gate 8,75 · cd-resource-lab 8,65 · cd-ai-interaction-review 8,35 (auditorias internas de construção).",
      fonte(["V0.2-EVIDENCE.md", "compound-design/quality/releases/V0.2-EVIDENCE.md"], ["CD-QUALITY-INDEX.md", "compound-design/quality/CD-QUALITY-INDEX.md"], ["CD-EVIDENCE-LEVELS.md", "compound-design/quality/CD-EVIDENCE-LEVELS.md"]),
    ],
  },
  {
    order: 3,
    id: "evidence-infrastructure",
    version: "v0.2.1",
    name: "Infraestrutura de evidência",
    status: "feito",
    crianca: [
      "Antes da prova de verdade, arrumamos a sala: régua fixa, perguntas escondidas e uma tranca que impede começar sem permissão.",
      "Arrumando, achamos erros na própria sala.",
    ],
    colega: [
      "A separação entre construído e provado virou operação, sem gastar orçamento de modelo: registro canônico com schema e lint, livro de dívida de evidência, ledger de aprendizados, auditoria de valor do wrapper e o primeiro experimento de runtime controlado, pré-registrado a custo zero, com trava anti-cobrança.",
      "Sete falhas reproduzíveis da própria sala de prova foram registradas (CD-20260909-001 a 007).",
      "Preparar não paga dívida: nada rodou, nada subiu acima de E1.",
    ],
    especialista: [
      "Pergunta: “Can the separation between built and proven be made operational without spending model budget?”",
      "Construído: registry canônico + JSON Schema + lint com mutation self-tests; Evidence Debt ledger + Learning Ledger; Wrapper Value Audit; piloto E2 pré-registrado a custo zero com anti-billing lock.",
      "Aprendido: “Preparation repays no evidence debt. Eleven reproducible failures of the experiment infrastructure itself were caught and recorded before any model ran.” (o LEDGER agrupa 001–007 como E2 e 008–013 como v0.3)",
      "Desconhecido: “No E2 run was executed, no uplift was measured, no resource moved above E1, and no v0.3 behaviour claim was justified.”",
      "Data: v0.1 → v0.2.1 no branch compound-design-framework do supernova-catalogo (2026-09-05 → 07); migrado para compoundmetrics em 2026-09-09.",
      fonte(["v0.2.1-EVIDENCE-INFRASTRUCTURE.md", "compound-design/releases/v0.2.1-EVIDENCE-INFRASTRUCTURE.md"], ["E2-PILOT-PLAN.md", "compound-design/quality/e2/E2-PILOT-PLAN.md"], ["LEDGER.md", "compound-design/learning/LEDGER.md"]),
    ],
  },
  {
    order: 4,
    id: "work-system",
    version: "v0.3.0-alpha.1",
    name: "Sistema de trabalho",
    status: "atual",
    crianca: [
      "O caderno virou uma caixa de ferramentas que você instala: 15 procedimentos e 6 ajudantes.",
      "A máquina conferiu que cada um faz o que promete, mas ninguém mediu se o trabalho fica melhor com eles.",
    ],
    colega: [
      "O ciclo ficou executável: skills com contratos, agentes finos que apontam para elas, um formato único de finding, aprendizado durável que uma rodada futura encontra, e uma implementação canônica instalada por Claude Code, Codex e Cursor.",
      "Dois especialistas foram reescritos do zero e reconquistaram E1 em vez de herdar. Em 2026-09-09, 26 checagens determinísticas em 4 grupos passaram.",
      "É candidata: a arquitetura mudou; nada foi demonstrado funcionar melhor.",
    ],
    especialista: [
      "Pergunta: “Can the framework become a system you run instead of a document you read?”",
      "Construído: 15 skills e 6 agentes, E0 → E1 em commit separado; finding contract e discoverability contract, testados sem modelo; manifests para três hosts, “the installed plugin clones nothing”; candidate lane pré-registrada, não rodada.",
      "Aprendido: “A guard that cannot tell a rule from a violation blocks the rule. The same guard bug recurred in a second place because the first fix was applied to one guard rather than turned into a rule for all of them.” (CD-20260909-011, -012)",
      "Desconhecido: “Whether any v0.3 resource improves an outcome over no resource, over direct upstream use, or over the resource it replaced. Whether discoverability changes decisions. Whether fifteen skills is the right number.”",
      "Verificação: cd:evals 26/26 (grupos 12 · 3 · 6 · 5) · cd:selftest 40/40 · e2 self-test 32/32 · produção 2026-09-09 12:18 UTC (a7f8319).",
      fonte(["v0.3.0-alpha.1-WORK-SYSTEM.md", "compound-design/releases/v0.3.0-alpha.1-WORK-SYSTEM.md"], ["v0.3-contract-eval.json", "compound-design/quality/releases/v0.3-contract-eval.json"]),
    ],
  },
  {
    order: 5,
    id: "controlled-runtime",
    version: "próximo",
    name: "Runtime controlado",
    status: "próximo",
    crianca: [
      "A prova está pronta em cima da mesa: as mesmas tarefas, com e sem o caderno, três vezes cada.",
      "Só falta autorizar pagar pela prova. E o caderno pode perder.",
    ],
    colega: [
      "O experimento existe por inteiro e espera uma coisa que o projeto se recusou a assumir: runtime pago, autorizado, com orçamento.",
      "Nove tarefas de revisão de interface e onze de portão de qualidade, holdouts acima de 30%, ground truth com iscas, rubrica de sete dimensões congelada, revisão humana cega e dez condições pré-registradas em que o Compound perde.",
      "≈ US$ 15–53, 163 runs. Até rodar, “não medido” é a resposta correta.",
    ],
    especialista: [
      "Pergunta: “Does any Compound resource outperform the relevant baseline — no resource, direct upstream use, or the version it replaced?”",
      "Construído: piloto pré-registrado (9 + 11 tarefas, holdouts 3/9 e 4/11, ground truth com 16 decoys, rubrica de 7 dimensões congelada, revisão humana cega); 10 condições de derrota avaliadas mecanicamente; resource value audit em que remoção é resultado válido.",
      "Aprendido: “Nothing yet.”",
      "Desconhecido: “Everything about uplift. Until this runs, `not measured` is the correct answer.”",
      "Hipóteses: H1 C ≥ A + 5 · H2 C não-inferior a B · H3 Quality Gate C > A sem inflação de evidência · H4 lane D isola de onde vem o valor. N efetivo 9; resolução ≈ ±5,5.",
      fonte(["E2-PILOT-PLAN.md", "compound-design/quality/e2/E2-PILOT-PLAN.md"], ["CANDIDATE-LANE.md", "compound-design/quality/e2/candidate-v0.3/CANDIDATE-LANE.md"]),
    ],
  },
]

const STATUS_LABEL: Record<Fase["status"], string> = {
  feito: "feito",
  atual: "atual · candidata",
  próximo: "próximo · bloqueado por custo",
}

export function fasesMarkers(level: Level): LifelineMarker[] {
  return FASES.map((f) => ({
    id: f.id,
    year: f.order,
    age: `${f.version} · ${STATUS_LABEL[f.status]}`,
    label: f.name,
    events: f[level],
  }))
}

export const FASES_BIRTH = 0
