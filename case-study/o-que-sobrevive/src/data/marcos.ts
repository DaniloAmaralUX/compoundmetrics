import type { LifelineEvent, LifelineLegendItem, LifelineMarker } from "@/components/lifeline/types"
import { GH, asset, type Level } from "./level"

/**
 * Trilho 2 — "A linha real". The eleven captured milestones of the design
 * benchmark on a day axis (day 0 = 2026-07-13, the first artifact named
 * Compound; day 58 = 2026-09-09). Scores are the Compound Design Audit
 * Score against the frozen v3.6.0 ruler, always shown with coverage.
 * Source: case-study/design-benchmark/SUMMARY.json and case-study/history/CHRONOLOGY.md.
 */
const START_UTC = Date.UTC(2026, 6, 13)
const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"]

function fullLabel(day: number) {
  const d = new Date(START_UTC + day * 86_400_000)
  return `${d.getUTCDate()} ${MESES[d.getUTCMonth()]}`
}

interface Marco {
  id: string
  day: number
  time?: string
  tool: { id: string; name: string }
  name: string
  score: number
  coverage: number
  counts: { pass: number; fail: number; na: number; nv: number }
  crianca: string
  colega: string
  especialista: string
  photo?: boolean
  mentors?: string[]
  met?: string[]
  source: [string, string]
}

const n = (v: number) => v.toFixed(1).replace(".", ",")

export const MARCOS: Marco[] = [
  { id: "V01", day: 0, tool: { id: "compound-labs-design", name: "Compound Labs Design" }, name: "Compound Labs Design (site + /audit)", score: 54.5, coverage: 41.5, counts: { pass: 12, fail: 10, na: 1, nv: 31 },
    crianca: "A primeira coisa chamada Compound. Aqui nasce a régua de 54 itens.",
    colega: "Primeiro artefato chamado Compound (d08ec62, 13 jul). Em 16 jul, /audit com 54 checagens em 9 categorias: a régua v3.6.0, congelada para este benchmark antes de qualquer captura.",
    especialista: "Ruler: Compound Design Audit v3.6.0 @ 364430b (2026-07-16), sha256 7c7c6915…78a279; 23 itens determinísticos / 31 de julgamento, declarados antes de pontuar. As skills deste repo descendem de jakubkrehel/skills de forma independente.",
    photo: true, mentors: ["Jakub Krehel"], source: ["CHRONOLOGY.md l.23–24", "case-study/history/CHRONOLOGY.md"] },
  { id: "V02", day: 23, tool: { id: "studio-ds", name: "Studio DS" }, name: "Studio DS v1", score: 61.1, coverage: 36.7, counts: { pass: 11, fail: 7, na: 5, nv: 31 },
    crianca: "Um sistema de design inteiro em um dia.",
    colega: "Studio DS v1 construído em um dia (8 commits, 54fcaf0): landing, galeria de temas com aplicação ao vivo, componentes e suíte anti-drift.",
    especialista: "V01→V02: +6,6 de score, −4,8 de cobertura; melhorou estilo/tipo-sistema, estilo/motion, navegacao/menu-previsivel; regrediu radius, foco, contraste e semântica.",
    photo: true, source: ["SUMMARY.json V02", "case-study/design-benchmark/SUMMARY.json"] },
  { id: "V03", day: 31, tool: { id: "studio-dev-ui", name: "Studio Dev UI" }, name: "Dev Studio UI, rebuild autoral", score: 45.5, coverage: 41.5, counts: { pass: 10, fail: 12, na: 1, nv: 31 },
    crianca: "Refazer do zero uma coisa que tinha sido copiada.",
    colega: "“The sea, actually moving”: o fork de canvas-ui é refeito de forma autoral (781d086). Deploy não provado, fonte provada: confiança média.",
    especialista: "V02→V03: −15,6. Marco de código, não de deployment: o projeto Vercel foi criado nove dias depois. Contado como design state, não como URL.",
    source: ["CHRONOLOGY.md l.28, 56", "case-study/history/CHRONOLOGY.md"] },
  { id: "V04", day: 42, tool: { id: "studio-dev-ui", name: "Studio Dev UI" }, name: "Studio Dev UI, registry + originals", score: 31.8, coverage: 41.5, counts: { pass: 7, fail: 15, na: 1, nv: 31 },
    crianca: "A nota mais baixa de todas.",
    colega: "Registry, portão de honestidade da galeria e motor de URLs do playground (main d0e8931, 22–24 ago). O menor score dos onze marcos, na mesma ferramenta de V03.",
    especialista: "V03→V04: −13,7 com cobertura idêntica; novas falhas em hierarquia/headings, acessibilidade/teclado e acessibilidade/zoom; nenhuma melhora. Build com typescript.ignoreBuildErrors.",
    photo: true, source: ["SUMMARY.json V04", "case-study/design-benchmark/SUMMARY.json"] },
  { id: "V05", day: 55, tool: { id: "supernova-catalogo", name: "Supernova Catálogo" }, name: "Supernova Catálogo", score: 43.5, coverage: 42.6, counts: { pass: 10, fail: 13, na: 0, nv: 31 },
    crianca: "O caderno começa a virar sistema, num branch escondido.",
    colega: "Preset Iconiq sobre tokens Supernova (bcb35b3 → 7af6553). O branch compound-design-framework deste repositório carrega o framework v0.1 → v0.2.1, com o ledger 001–007 e o piloto E2 pré-registrado.",
    especialista: "Transferência verificada por md5: LEDGER e três agentes idênticos entre supernova-catalogo@compound-design-framework e compoundmetrics (18ffcf2). Heurísticas de Jakub Krehel e Emil Kowalski entram como wrappers v0.2; Every informa cd-compound.",
    mentors: ["Every", "Emil Kowalski", "Jakub Krehel"], met: ["Ledger CD-20260909-001 a 007", "Piloto E2: pré-registrado, não executado"], source: ["TRANSFER-GRAPH.md", "case-study/knowledge/TRANSFER-GRAPH.md"] },
  { id: "V06", day: 56, tool: { id: "geistlabsds", name: "Geist Labs DS" }, name: "Geist Labs DS", score: 45.5, coverage: 41.5, counts: { pass: 10, fail: 12, na: 1, nv: 31 },
    crianca: "Mais um laboratório de sistema de design.",
    colega: "lab-design e lab-design-timeline (7–8 set). Melhorou navegação e carga cognitiva; regrediu headings, teclado, contraste e zoom.",
    especialista: "V05→V06: +2,0 de score, −1,1 de cobertura. Lifeline (evilrabbit/lifeline@8ddbb3d) é upstream em 28e765d.",
    source: ["SUMMARY.json V06", "case-study/design-benchmark/SUMMARY.json"] },
  { id: "V07", day: 57, tool: { id: "processo", name: "Processo" }, name: "Processo (timeline estilo Lifeline)", score: 72.2, coverage: 36.7, counts: { pass: 13, fail: 5, na: 5, nv: 31 },
    crianca: "A nota mais alta. E não está no caminho até aqui.",
    colega: "Timeline no modelo Lifeline (MIT, adaptado). Maior score dos onze; e o grafo mostra que nada no compoundmetrics aponta para ele: não é um intermediário.",
    especialista: "V06→V07: +26,7. Removeu nove falhas (espaço-base, radius, teclado, foco, contraste, zoom, labels, input-16px, headings); novas: estilo/motion e navegacao/menu-previsivel. Correção à cronologia: “processo is not on the path to compoundmetrics”.",
    photo: true, mentors: ["Evil Rabbit"], source: ["CHRONOLOGY.md l.45", "case-study/history/CHRONOLOGY.md"] },
  { id: "V08", day: 58, tool: { id: "compoundmetrics", name: "Compound Metrics" }, name: "Compound Metrics v0.2.1", score: 63.6, coverage: 25.6, counts: { pass: 7, fail: 4, na: 11, nv: 32 },
    crianca: "O caderno ganha casa própria.",
    colega: "O repositório compoundmetrics é inicializado (50c7a6a) e recebe o v0.2.1 migrado (18ffcf2): uma página única. A menor cobertura dos onze (25,6%), porque a página tem pouca superfície para a régua medir.",
    especialista: "V07→V08: −8,6 de score, −11,1 de cobertura. A Timeline do site adapta o modelo de interação do Lifeline (evilrabbit/lifeline@8ddbb3d, MIT), atribuído em NOTICE e SOURCES.md.",
    mentors: ["Evil Rabbit"], source: ["CHRONOLOGY.md l.33", "case-study/history/CHRONOLOGY.md"] },
  { id: "V09", day: 58, time: "09:14", tool: { id: "studio-dev-ui", name: "Studio Dev UI" }, name: "Studio Dev UI main (hospeda a POC v0.2)", score: 33.3, coverage: 40.4, counts: { pass: 7, fail: 14, na: 2, nv: 31 },
    crianca: "A maior queda: −30,3 em um dia.",
    colega: "O main do studio-dev-ui (231889f) hospeda a página da POC v0.2. A entrada é md5-idêntica à de V08; as superfícies de descoberta e interação são do próprio Studio, e é nelas que o score cai.",
    especialista: "V08→V09: −30,3 (maior regressão), +14,8 de cobertura. Dez novas falhas, entre elas headings, teclado, alvos, semântica, zoom e labels. Duas URLs, um deployment (dpl_9DGd7…).",
    photo: true, source: ["SUMMARY.json delta", "case-study/design-benchmark/SUMMARY.json"] },
  { id: "V10", day: 58, time: "12:18", tool: { id: "compoundmetrics", name: "Compound Metrics" }, name: "Compound Design v0.3.0-alpha.1, produção", score: 63.6, coverage: 25.6, counts: { pass: 7, fail: 4, na: 11, nv: 32 },
    crianca: "O sistema de trabalho vai ao ar.",
    colega: "main = a7f8319: v0.3.0-alpha.1 em produção, e cd.guide serve o mesmo commit. Mesmo design de V08 com conteúdo v0.3; por isso fica fora da média “independente” (50,1).",
    especialista: "V09→V10: +30,3 (maior melhora, simétrica à queda anterior: é a troca de superfície, não uma correção). 26 checagens de contrato em 4 grupos passam neste dia; o ledger recebe 008–013.",
    met: ["26 checagens de contrato: 26/26", "Ledger CD-20260909-008 a 013"], source: ["v0.3-contract-eval.json", "compound-design/quality/releases/v0.3-contract-eval.json"] },
  { id: "V11", day: 58, time: "13:33", tool: { id: "compoundmetrics", name: "Compound Metrics" }, name: "Product Experience (preview, 8 rotas)", score: 50.0, coverage: 41.5, counts: { pass: 11, fail: 11, na: 1, nv: 31 },
    crianca: "A base deste estudo.",
    colega: "Preview da experiência de produto em 8 rotas (921d751). É o commit de onde o estudo de caso parte, e o último marco capturado: V01→V11 = −4,5.",
    especialista: "V10→V11: −13,6 de score, +15,9 de cobertura (mais superfície, mais falhas visíveis). Base da captura: 921d751 sobre main = a7f8319; benchmark de 11 marcos e grafo de 105 arestas (97 verificadas) gerados neste commit.",
    photo: true, met: ["Benchmark: 11 marcos, 107 findings", "Grafo de transferência: 97 de 105 arestas"], source: ["FREEZE.md", "case-study/FREEZE.md"] },
]

export const MARCOS_LEGEND: LifelineLegendItem[] = [
  { type: "mentor", label: "Fonte upstream (MIT)" },
  { type: "met", label: "Validação registrada" },
]

function scoreEvent(m: Marco, level: Level): LifelineEvent {
  const text =
    level === "crianca"
      ? `Nota ${n(m.score)} de 100 · a régua conseguiu medir ${n(m.coverage)}% dos itens`
      : `Audit Score ${n(m.score)} · cobertura ${n(m.coverage)}% · ${m.counts.pass} PASS / ${m.counts.fail} FAIL / ${m.counts.nv} não verificados`
  return { text, image: { src: asset(`captures/${m.id}.webp`), alt: `${m.id} · ${m.name} · primeira tela desktop, 1440×900` } }
}

export function marcosMarkers(level: Level): LifelineMarker[] {
  const markers: LifelineMarker[] = MARCOS.map((m) => {
    const events: LifelineEvent[] = [m[level], scoreEvent(m, level)]
    if (level === "especialista") {
      events.push([
        { type: "text", value: "Fonte: " },
        { type: "link", value: m.source[0], href: GH + m.source[1] },
      ])
    }
    return {
      id: m.id,
      year: m.day,
      age: m.id,
      label: m.time ? `${fullLabel(m.day)} · ${m.time}` : fullLabel(m.day),
      events,
      companies: [m.tool],
      ...(m.photo && {
        photos: [{ src: asset(`captures/${m.id}.webp`), alt: `${m.id} · ${m.name}`, x: 0.35, y: -150 }],
      }),
      ...(m.mentors && { mentors: m.mentors.map((name) => ({ name })) }),
      ...(m.met && { met: m.met.map((name) => ({ name })) }),
    }
  })
  // Month turns as quiet markers, so the calendar stays readable between milestones.
  const turns: LifelineMarker[] = [
    { id: "ago", year: 19, age: "", label: "1 ago", events: [] },
    { id: "set", year: 50, age: "", label: "1 set", events: [] },
  ]
  return [...markers, ...turns].sort((a, b) => a.year - b.year || (a.id < b.id ? -1 : 1))
}

export const MARCOS_BIRTH = 0
export const MEDIA_11 = 51.3
export const MEDIA_INDEPENDENTE = 50.1
export const DELTA_V01_V11 = -4.5
