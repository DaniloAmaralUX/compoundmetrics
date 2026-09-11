import type { LifelineEvent, LifelineMarker } from "@/components/lifeline/types"
import type { Level } from "./level"

/**
 * Trilho 1 — "A linha simples". Six project stages on an ordinal axis
 * (0..5): the axis is order, not calendar time. Every quoted line is a
 * PT-BR rendering of a literal from `src/content/project.ts` or the
 * release records; terms of art keep their English name, explained once.
 */
interface Fase {
  order: number
  id: string
  version: string
  name: string
  status: "feito" | "atual" | "próximo"
  junior: string[]
  pleno: string[]
  senior: LifelineEvent[]
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
    junior: [
      "Toda vez que alguém termina um trabalho bonito com um agente de IA, joga fora o caderno.",
      "A aposta: e se o caderno passasse para o próximo?",
    ],
    pleno: [
      "Um design engineer com agentes produz mais interface do que consegue julgar, e o julgamento some com a conversa.",
      "A tese escreveu uma aposta: esse julgamento pode se acumular entre projetos.",
      "Sucesso não é “o Compound vence”; é “o framework consegue descobrir que está errado”. Nada foi provado: uma tese é uma pergunta.",
    ],
    senior: [
      "Pergunta: o julgamento de design engineering pode se acumular (compound) entre projetos, em vez de zerar quando a sessão termina?",
      "Construído: o ciclo; duas fronteiras (“um artefato precisa ser merecido”, “uma alegação nunca pode exceder a sua evidência”); sucesso definido como “o framework consegue descobrir que está errado”.",
      "Aprendido: nada ainda. Uma tese é uma pergunta, não um resultado.",
      "Desconhecido: tudo o que a tese afirma.",
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
    junior: [
      "Escrevemos as primeiras páginas: cinco ajudantes, cada um com uma tarefa.",
      "Demos nota pelo capricho da escrita, não por a página funcionar.",
    ],
    pleno: [
      "Os primeiros recursos: orquestrador, especialista em interface, em motion, portão de qualidade e laboratório de recursos, cada um com escopo, fronteira de roteamento, contrato de instrução e caminho de avaliação.",
      "Notas de prontidão entre 8,0 e 8,4 numa rubrica fixa de dez pontos, rotuladas como prontidão, não verificação.",
      "O problema apareceu na hora: uma nota única corria o risco de ser lida como prova.",
    ],
    senior: [
      "Pergunta: a prática útil de design entre humano e IA pode ser codificada como recursos delimitados e testáveis?",
      "Construído: rubrica de 10 pontos em 7 dimensões; scores 8,0–8,4 rotulados explicitamente como prontidão, não verificação; para cada recurso, a prova que ainda faltava (deltas de resultado em teste A/B, rodadas repetidas de roteamento).",
      "Aprendido: uma arquitetura coerente era possível. A fraqueza era epistêmica: uma nota única de prontidão corria o risco de ser lida como prova.",
      "Desconhecido: ganho (uplift) sobre o modelo base ou o upstream direto; taxas de falso positivo e falso negativo; deltas de tokens e de chamadas de ferramenta (tool calls).",
      "Comparabilidade: não plote uma ‘melhora’ numérica de v0.1 para v0.2; as rubricas são diferentes.",
      fonte(["v0.1-readiness-audit.md", "compound-design/quality/releases/v0.1-readiness-audit.md"], ["v0.1-scores.json", "compound-design/quality/releases/v0.1-scores.json"]),
    ],
  },
  {
    order: 2,
    id: "quality-system",
    version: "v0.2",
    name: "Sistema de qualidade",
    status: "feito",
    junior: [
      "Descobrimos que “bem escrito” e “funciona” são coisas diferentes.",
      "Cada página passou a ter duas notas, e uma nunca empresta para a outra.",
    ],
    pleno: [
      "Qualidade de construção e maturidade de evidência viraram duas medidas: CDQI (0–10, quão bem foi construído) e CEL (E0–E4, quanto já foi demonstrado).",
      "Todo recurso ganhou trabalho primário, não-objetivos, severidade e contrato de saída com evidência. Uma suíte determinística passou a qualificar recursos para E1, e para nada além.",
      "Um recurso pode ter 8,8 de construção em E0, e o sistema agora diz isso.",
    ],
    senior: [
      "Pergunta: como impedir que uma nota de construção seja lida como prova?",
      "Construído: CDQI v0.2 (evidência de runtime deliberadamente removida do número); CEL E0–E4, cada nível com a alegação permitida e a proibida; suíte de contratos que qualifica para E1 e para nada além; meta-avaliação do avaliador.",
      "Aprendido: o framework ficou mais difícil de enganar. Um recurso pode marcar 8,8 de construção em E0 (bem desenhado, não mostrado funcionar), e o sistema agora diz isso.",
      "Desconhecido: ganho (uplift) em runtime, significância estatística, certificação de vendor, corroboração independente, evidência de campo; cada um listado como não reivindicado.",
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
    junior: [
      "Antes da prova de verdade, arrumamos a sala: régua fixa, perguntas escondidas e uma tranca que impede começar sem permissão.",
      "Arrumando, achamos erros na própria sala.",
    ],
    pleno: [
      "A separação entre construído e provado virou operação, sem gastar orçamento de modelo: registro canônico com schema e lint, livro de dívida de evidência, ledger de aprendizados, auditoria de valor do wrapper e o primeiro experimento de runtime controlado, pré-registrado a custo zero, com trava anti-cobrança.",
      "Sete falhas reproduzíveis da própria sala de prova foram registradas (CD-20260909-001 a 007).",
      "Preparar não paga dívida: nada rodou, nada subiu acima de E1.",
    ],
    senior: [
      "Pergunta: a separação entre construído e provado pode virar operação sem gastar orçamento de modelo?",
      "Construído: registro canônico + JSON Schema + lint com autotestes de mutação; livro de dívida de evidência (Evidence Debt) + ledger de aprendizados; auditoria de valor do wrapper; piloto E2 pré-registrado a custo zero com trava anti-cobrança.",
      "Aprendido: preparar não paga dívida de evidência. Onze falhas reproduzíveis da própria infraestrutura do experimento foram capturadas e registradas antes de qualquer modelo rodar. (o LEDGER agrupa 001–007 como E2 e 008–013 como v0.3)",
      "Desconhecido: nenhuma execução E2 rodou, nenhum ganho foi medido, nenhum recurso subiu acima de E1 e nenhuma alegação de comportamento da v0.3 foi justificada.",
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
    junior: [
      "O caderno virou uma caixa de ferramentas que você instala: 15 procedimentos e 6 ajudantes.",
      "A máquina conferiu que cada um faz o que promete, mas ninguém mediu se o trabalho fica melhor com eles.",
    ],
    pleno: [
      "O ciclo ficou executável: skills com contratos, agentes finos que apontam para elas, um formato único de finding, aprendizado durável que uma rodada futura encontra, e uma implementação canônica instalada por Claude Code, Codex e Cursor.",
      "Dois especialistas foram reescritos do zero e reconquistaram E1 em vez de herdar. Em 2026-09-09, 26 checagens determinísticas em 4 grupos passaram.",
      "É candidata: a arquitetura mudou; nada foi demonstrado funcionar melhor.",
    ],
    senior: [
      "Pergunta: o framework pode virar um sistema que você executa, em vez de um documento que você lê?",
      "Construído: 15 skills e 6 agentes, E0 → E1 em commit separado; contrato de finding (achado) e contrato de descobribilidade, testados sem modelo; manifests para três hosts (o plugin instalado não clona nada); lane candidata pré-registrada, não rodada.",
      "Aprendido: um guard (checagem automática que barra uma mudança) que não distingue uma regra de uma violação bloqueia a regra. O mesmo bug de guard voltou num segundo lugar porque a primeira correção foi aplicada a um guard, em vez de virar regra para todos. (CD-20260909-011, -012)",
      "Desconhecido: se algum recurso da v0.3 melhora um resultado em relação a nenhum recurso, ao uso direto do upstream ou ao recurso que ele substituiu. Se a descobribilidade muda decisões. Se quinze skills é o número certo.",
      "Verificação: cd:evals 26/26 (grupos 12 · 3 · 6 · 5) · cd:selftest (autoteste) 40/40 · autoteste do E2 32/32 · produção 2026-09-09 12:18 UTC (a7f8319).",
      fonte(["v0.3.0-alpha.1-WORK-SYSTEM.md", "compound-design/releases/v0.3.0-alpha.1-WORK-SYSTEM.md"], ["v0.3-contract-eval.json", "compound-design/quality/releases/v0.3-contract-eval.json"]),
    ],
  },
  {
    order: 5,
    id: "controlled-runtime",
    version: "próximo",
    name: "Runtime controlado",
    status: "próximo",
    junior: [
      "A prova está pronta em cima da mesa: as mesmas tarefas, com e sem o caderno, três vezes cada.",
      "Só falta autorizar pagar pela prova. E o caderno pode perder.",
    ],
    pleno: [
      "O experimento existe por inteiro e espera uma coisa que o projeto se recusou a assumir: runtime pago, autorizado, com orçamento.",
      "Nove tarefas de revisão de interface e onze de portão de qualidade, holdouts acima de 30%, ground truth com iscas, rubrica de sete dimensões congelada, revisão humana cega e dez condições pré-registradas em que o Compound perde.",
      "≈ US$ 15–53, 163 runs. Até rodar, “não medido” é a resposta correta.",
    ],
    senior: [
      "Pergunta: algum recurso do Compound supera a referência (baseline) relevante: nenhum recurso, uso direto do upstream ou a versão que ele substituiu?",
      "Construído: piloto pré-registrado (9 + 11 tarefas, holdouts 3/9 e 4/11, ground truth com 16 iscas (decoys), rubrica de 7 dimensões congelada, revisão humana cega); 10 condições de derrota avaliadas mecanicamente; auditoria de valor do recurso em que remoção é resultado válido.",
      "Aprendido: nada ainda.",
      "Desconhecido: tudo sobre ganho (uplift). Até isso rodar, “não medido” (not measured) é a resposta correta.",
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
