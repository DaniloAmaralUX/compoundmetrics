import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { ThemeProvider } from "next-themes"
import { Lifeline, LifelineLegend } from "@/components/lifeline"
import { LifelineNav } from "@/components/lifeline-shell"
import { cn } from "@/lib/utils"
import { LEVELS, LevelContext, useLevel, type Level } from "@/data/level"
import { FASES, FASES_BIRTH, fasesMarkers } from "@/data/fases"
import { DELTA_V01_V11, MARCOS, MARCOS_BIRTH, MARCOS_LEGEND, MEDIA_11, MEDIA_INDEPENDENTE, marcosMarkers } from "@/data/marcos"
import { GLOSSARIO } from "@/data/glossario"

/* ------------------------------------------------------------------ level */

const LEVEL_KEY = "oqs-level"

/** Values stored before the levels were renamed after career stages. */
const LEGACY_LEVEL: Record<string, Level> = { crianca: "junior", colega: "pleno", especialista: "senior" }

function readLevel(): Level {
  try {
    const v = localStorage.getItem(LEVEL_KEY)
    if (v === "junior" || v === "pleno" || v === "senior") return v
    if (v && v in LEGACY_LEVEL) return LEGACY_LEVEL[v]
  } catch {
    /* storage unavailable: default */
  }
  return "pleno"
}

/** Renders the copy for the current reading depth: `j` júnior, `p` pleno, `s` sênior. */
function Lv({ j, p, s, className }: { j: ReactNode; p: ReactNode; s: ReactNode; className?: string }) {
  const level = useLevel()
  const node = level === "junior" ? j : level === "senior" ? s : p
  return <div className={className}>{node}</div>
}

/* --------------------------------------------------------------- glossary */

interface PopState { key: string; x: number; y: number; below: boolean }
const GlossaryContext = createContext<{ open: (key: string, el: HTMLElement) => void; close: () => void } | null>(null)

function GlossaryProvider({ children }: { children: ReactNode }) {
  const [pop, setPop] = useState<PopState | null>(null)
  const open = useCallback((key: string, el: HTMLElement) => {
    const r = el.getBoundingClientRect()
    const below = r.top < 160
    setPop({ key, x: Math.min(Math.max(r.left + r.width / 2, 150), window.innerWidth - 150), y: below ? r.bottom + 8 : r.top - 8, below })
  }, [])
  const close = useCallback(() => setPop(null), [])
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close() }
    const onScroll = () => close()
    window.addEventListener("keydown", onKey)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("scroll", onScroll) }
  }, [close])
  const api = useMemo(() => ({ open, close }), [open, close])
  const entry = pop ? GLOSSARIO[pop.key] : null
  return (
    <GlossaryContext.Provider value={api}>
      {children}
      {/* One floating definition, like the Lifeline's hover image: outside every transformed track. */}
      <div
        role="tooltip"
        id="glossario-popover"
        aria-hidden={!pop}
        className={cn(
          "pointer-events-none fixed z-[70] w-[280px] -translate-x-1/2 rounded-xl bg-black px-4 py-3 text-[13px] leading-snug text-white shadow-2xl ring-1 ring-black/10 transition-opacity duration-200 ease-out dark:bg-white dark:text-black dark:ring-white/15",
          pop ? "opacity-100" : "opacity-0",
          pop?.below ? "translate-y-0" : "-translate-y-full",
        )}
        style={pop ? { left: pop.x, top: pop.y } : { left: 0, top: 0 }}
      >
        {entry && (
          <>
            <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.08em] opacity-60">{entry.termo}</p>
            <p>{entry.def}</p>
          </>
        )}
      </div>
    </GlossaryContext.Provider>
  )
}

/** A glossary term inline: hover or focus shows the definition; a tap toggles it. */
function T({ k, children }: { k: keyof typeof GLOSSARIO; children: ReactNode }) {
  const g = useContext(GlossaryContext)
  const ref = useRef<HTMLButtonElement>(null)
  const [held, setHeld] = useState(false)
  return (
    <button
      ref={ref}
      type="button"
      aria-describedby="glossario-popover"
      data-lifeline-interactive=""
      className="inline cursor-help rounded-sm text-inherit underline decoration-zinc-400 decoration-dotted underline-offset-[3px] transition-colors duration-300 hover:text-black hover:decoration-zinc-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring dark:decoration-zinc-600 dark:hover:text-white dark:hover:decoration-zinc-400"
      onMouseEnter={() => ref.current && g?.open(k, ref.current)}
      onMouseLeave={() => !held && g?.close()}
      onFocus={() => ref.current && g?.open(k, ref.current)}
      onBlur={() => { setHeld(false); g?.close() }}
      onClick={() => { if (!ref.current) return; if (held) { setHeld(false); g?.close() } else { setHeld(true); g?.open(k, ref.current) } }}
    >
      {children}
    </button>
  )
}

/* --------------------------------------------------------- rail labels */

/**
 * The Lifeline typesets its two column headers as "Age" / "Years". The
 * component files are used verbatim, so the words are swapped in the DOM
 * after each render instead: React never rewrites a static text node it
 * did not change, and a remount (mobile ↔ desktop) is caught by the observer.
 */
function useRailLabels(ref: React.RefObject<HTMLDivElement | null>, age: string, years: string) {
  useEffect(() => {
    const root = ref.current
    if (!root) return
    const swap = () => {
      root.querySelectorAll("p").forEach((p) => {
        const t = p.textContent?.trim()
        if (t === "Age" || t === "AGE") p.textContent = age
        else if (t === "Years" || t === "YEARS") p.textContent = years
      })
    }
    swap()
    const mo = new MutationObserver(swap)
    mo.observe(root, { childList: true, subtree: true })
    return () => mo.disconnect()
  }, [ref, age, years])
}

const RAIL_HEIGHT: Record<Level, [number, number]> = {
  junior: [480, 700],
  pleno: [620, 780],
  senior: [940, 840],
}

/* ------------------------------------------------------------ primitives */

function Section({ id, kicker, title, children, className }: { id: string; kicker: string; title: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section id={id} className={cn("mt-24 scroll-mt-24", className)} aria-labelledby={`${id}-h`}>
      <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-500 transition-colors duration-300 dark:text-zinc-600">{kicker}</p>
      <h2 id={`${id}-h`} className="mt-2 text-[clamp(26px,3.2vw,40px)] font-medium leading-[1.12] tracking-[-0.03em] text-black [text-wrap:balance] dark:text-white">{title}</h2>
      {children}
    </section>
  )
}

function Rows({ children, className }: { children: ReactNode; className?: string }) {
  return <ul className={cn("mt-6 divide-y divide-black/10 border-y border-black/10 dark:divide-white/10 dark:border-white/10", className)}>{children}</ul>
}

function Row({ label, children, meta }: { label: ReactNode; children: ReactNode; meta?: ReactNode }) {
  return (
    <li className="grid gap-x-6 gap-y-1 py-4 md:grid-cols-[11rem_1fr_auto]">
      <span className="text-[13px] font-medium text-black tabular-nums dark:text-white">{label}</span>
      <span className="text-[15px] leading-[1.55] text-zinc-500">{children}</span>
      {meta !== undefined && <span className="text-[13px] tabular-nums text-zinc-500 md:text-right">{meta}</span>}
    </li>
  )
}

function Details({ summary, children, className }: { summary: ReactNode; children: ReactNode; className?: string }) {
  return (
    <details className={cn("group mt-4 rounded-xl border border-black/10 transition-colors duration-300 open:bg-zinc-50 dark:border-white/10 dark:open:bg-zinc-950", className)}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 text-[14px] font-medium text-black marker:hidden [&::-webkit-details-marker]:hidden dark:text-white">
        <span>{summary}</span>
        <span aria-hidden="true" className="text-zinc-400 transition-transform duration-300 group-open:rotate-45">+</span>
      </summary>
      <div className="space-y-3 px-4 pb-4 text-[14px] leading-[1.6] text-zinc-500">{children}</div>
    </details>
  )
}

function Src({ path, children }: { path: string; children?: ReactNode }) {
  return <span className="text-zinc-400 tabular-nums">{children ?? path.split("/").pop()}</span>
}

/* ------------------------------------------------------------------- nav */

function LoopMark({ className }: { className?: string }) {
  // Six ticks on one ring: the loop. The gap at the top is where "repeat" re-enters with more context.
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" className={className} aria-hidden="true">
      <path d="M12 3a9 9 0 1 1-6.36 2.64" />
      <path d="M5.64 2v3.64h3.64" />
      <circle cx="12" cy="12" r="1.25" fill="currentColor" stroke="none" />
    </svg>
  )
}

function LevelSwitch({ level, onChange }: { level: Level; onChange: (l: Level) => void }) {
  const index = LEVELS.findIndex((l) => l.id === level)
  return (
    <div className="flex items-center gap-3">
      <span id="nivel-rotulo" className="hidden text-[13px] text-zinc-500 sm:inline">
        Explique como se eu fosse
      </span>
      <div
        role="radiogroup"
        aria-labelledby="nivel-rotulo"
        aria-describedby="nivel-dica"
        className="relative grid h-8 grid-cols-3 rounded-full bg-zinc-900 p-0.5 ring-1 ring-white/10"
      >
        {/* the thumb slides under the chosen word; the words themselves never move */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0.5 left-0.5 w-[calc((100%-4px)/3)] rounded-full bg-white shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.2,0.7,0.2,1)] motion-reduce:transition-none"
          style={{ transform: `translateX(${index * 100}%)` }}
        />
        {LEVELS.map((l) => (
          <button
            key={l.id}
            type="button"
            role="radio"
            aria-checked={level === l.id}
            title={l.hint}
            onClick={() => onChange(l.id)}
            className={cn(
              "relative z-10 rounded-full px-3 text-[13px] font-medium transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              level === l.id ? "text-black" : "text-zinc-500 hover:text-white",
            )}
          >
            {l.label.toLowerCase()}
          </button>
        ))}
      </div>
    </div>
  )
}

/** One line that tells the reader what just changed, announced to assistive tech. */
function LevelHint() {
  const level = useLevel()
  const text =
    level === "junior"
      ? "Você está lendo a versão para um júnior: linguagem simples, uma imagem, nenhum termo técnico."
      : level === "senior"
        ? "Você está lendo a versão para um sênior: perguntas, números e a fonte de cada afirmação, com os termos em inglês explicados em português."
        : "Você está lendo a versão para um pleno: linguagem de trabalho, termos técnicos explicados ao passar o mouse."
  return (
    <p id="nivel-dica" aria-live="polite" className="mt-5 flex items-center gap-2 text-[13px] text-zinc-500">
      <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-600" />
      <span>{text} Troque no topo da página: a linguagem técnica muda, os fatos não.</span>
    </p>
  )
}


/* ----------------------------------------------------------------- chart */

function ScoreChart() {
  const [hover, setHover] = useState<number | null>(null)
  const W = 960, H = 300, L = 40, R = 16, T = 20, B = 44
  const iw = W - L - R, ih = H - T - B
  const x = (i: number) => L + (i + 0.5) * (iw / MARCOS.length)
  const y = (v: number) => T + ih - (v / 100) * ih
  const ticks = [0, 25, 50, 75, 100]
  return (
    <figure className="mt-8">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <span className="text-[14px] font-medium text-black dark:text-white">Onze marcos contra a mesma régua</span>
        <ul className="flex items-center gap-5 text-[13px] text-zinc-500" aria-label="Legenda">
          <li className="flex items-center gap-2"><span aria-hidden="true" className="h-2 w-2 rounded-full bg-black dark:bg-white" />Audit Score</li>
          <li className="flex items-center gap-2"><span aria-hidden="true" className="h-2 w-2 rounded-full border-[1.5px] border-zinc-500" />Cobertura</li>
        </ul>
      </figcaption>
      <div className="relative mt-3 overflow-x-auto">
        <svg viewBox={`0 0 ${W} ${H}`} className="block w-full min-w-[560px] text-black dark:text-white" role="img" aria-label="Audit Score e cobertura dos onze marcos, de V01 a V11; a tabela abaixo carrega os valores">
          {ticks.map((t) => (
            <g key={t}>
              <line x1={L} x2={W - R} y1={y(t)} y2={y(t)} stroke="currentColor" strokeOpacity={0.1} />
              <text x={L - 8} y={y(t)} textAnchor="end" dominantBaseline="middle" fontSize="11" fill="currentColor" fillOpacity={0.5} style={{ fontVariantNumeric: "tabular-nums" }}>{t}</text>
            </g>
          ))}
          {MARCOS.map((m, i) => {
            const on = hover === i
            return (
              <g key={m.id} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} className="cursor-default">
                <rect x={x(i) - iw / MARCOS.length / 2} y={T} width={iw / MARCOS.length} height={ih} fill="transparent" />
                <line x1={x(i)} x2={x(i)} y1={y(m.coverage)} y2={y(m.score)} stroke="currentColor" strokeOpacity={on ? 0.35 : 0.15} strokeDasharray="2 3" />
                <circle cx={x(i)} cy={y(m.coverage)} r={on ? 6 : 4.5} fill="var(--background)" stroke="#71717a" strokeWidth={1.5} />
                <circle cx={x(i)} cy={y(m.score)} r={on ? 7.5 : 5.5} fill="var(--background)" />
                <circle cx={x(i)} cy={y(m.score)} r={on ? 5.5 : 4} fill="currentColor" />
                <text x={x(i)} y={H - B + 18} textAnchor="middle" fontSize="11" fill="currentColor" fillOpacity={on ? 1 : 0.6} style={{ fontVariantNumeric: "tabular-nums" }}>{m.id}</text>
                {(on || m.id === "V07" || m.id === "V04") && (
                  <text x={x(i)} y={y(m.score) - 12} textAnchor="middle" fontSize="11" fontWeight={500} fill="currentColor" style={{ fontVariantNumeric: "tabular-nums" }}>{m.score.toFixed(1).replace(".", ",")}</text>
                )}
              </g>
            )
          })}
        </svg>
        {hover !== null && (
          <div className="pointer-events-none absolute left-1/2 top-2 -translate-x-1/2 rounded-lg bg-black px-3 py-2 text-[12px] text-white shadow-xl dark:bg-white dark:text-black" role="status">
            <span className="font-medium">{MARCOS[hover].id}</span> · {MARCOS[hover].name} · score {MARCOS[hover].score.toFixed(1).replace(".", ",")} · cobertura {MARCOS[hover].coverage.toFixed(1).replace(".", ",")}%
          </div>
        )}
      </div>
      <p className="mt-3 text-[13px] text-zinc-500">V01→V11 = −4,5: não é uma linha subindo. Os pontos não são ligados de propósito. Cobertura é a parte da régua que pôde ser medida; um score sem ela não é mostrado.</p>
    </figure>
  )
}

/* ------------------------------------------------------------------ page */

const fmt = (v: number) => v.toFixed(1).replace(".", ",")

function Page() {
  const level = useLevel()
  const fases = useMemo(() => fasesMarkers(level), [level])
  const marcos = useMemo(() => marcosMarkers(level), [level])
  const rail1 = useRef<HTMLDivElement>(null)
  const rail2 = useRef<HTMLDivElement>(null)
  useRailLabels(rail1, "Versão", "Etapa")
  useRailLabels(rail2, "Marco", "Data")
  const [h1, h2] = RAIL_HEIGHT[level]

  return (
    <main id="top" className="mx-auto w-full max-w-5xl px-6 pb-24 pt-32">
      {/* 1 · hero */}
      <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-500 dark:text-zinc-600">Pesquisa e documentação · Compound Design · atualizado 2026-09-09</p>
      <h1 className="mt-4 text-[clamp(40px,6.4vw,84px)] font-medium leading-[1.02] tracking-[-0.03em] text-black [text-wrap:balance] dark:text-white">O Que Sobrevive</h1>
      <Lv
        className="mt-6 max-w-[62ch] space-y-4 text-[17px] leading-[1.6] text-zinc-500"
        j={<p>Toda vez que alguém termina um trabalho com um agente de IA, joga fora o caderno de anotações. O Compound é a aposta de que o caderno pode passar para o próximo. Esta página conta o que já foi feito para testar essa aposta, e o que ainda não.</p>}
        p={<p>Compound Design é um experimento em design engineering cumulativo: o julgamento gasto em um projeto pode sobreviver no seguinte, como regra, <T k="duravel">eval, skill ou especialista</T>, e essa sobrevivência pode ser mostrada em vez de afirmada. Esta página é o registro do que é, onde está, o que já demonstrou e o que ainda não.</p>}
        s={<><p>A pergunta do experimento, como está em <Src path="STRATEGY.md" />: o julgamento gasto em um projeto pode ser feito sobreviver no seguinte, como regra, <T k="duravel">eval, skill ou especialista</T>, e essa sobrevivência pode ser mostrada, em vez de só afirmada? Eval é um teste que reproduz uma falha conhecida; skill é um procedimento com contrato; especialista é um agente com escopo fixo. Esta página é o registro de prestação de contas do experimento: o que é, por que existe, onde está, o que demonstrou, o que não demonstrou e o que vem a seguir.</p><p className="text-black dark:text-white">Construa a aplicação. Melhore o sistema que constrói a próxima.</p></>}
      />
      <LevelHint />
      <dl className="mt-8 grid gap-x-8 gap-y-4 border-y border-black/10 py-5 text-[14px] sm:grid-cols-3 dark:border-white/10">
        <div><dt className="text-zinc-500">Evidência</dt><dd className="mt-1 font-medium text-black tabular-nums dark:text-white"><T k="e1">E1</T>, o máximo de qualquer recurso</dd></div>
        <div><dt className="text-zinc-500"><T k="uplift">Ganho em runtime</T></dt><dd className="mt-1 font-medium text-black tabular-nums dark:text-white">não medido · chamadas pagas: 0</dd></div>
        <div><dt className="text-zinc-500">Release</dt><dd className="mt-1 font-medium text-black tabular-nums dark:text-white">v0.3.0-alpha.1, <T k="candidata">candidata</T> · base estável v0.2.1</dd></div>
      </dl>
      <Details summary="Por que “candidata” não é “validada”">
        <p>“Uma release candidata significa que a arquitetura e o comportamento mudaram. Não significa que algo tenha sido mostrado funcionar melhor. Toda alegação neste repositório fica dentro do que foi de fato checado.” (<Src path="README.md" />, tradução)</p>
        <p>Qualidade de construção (<T k="cdqi">CDQI</T>) e maturidade de evidência (<T k="cel">CEL</T>) são dois números separados, e nenhum pode emprestar do outro. Um recurso pode estar muito bem construído e ainda não provado. Aqui, esse é o caso normal.</p>
      </Details>

      {/* 2 · the notebook */}
      <Section id="caderno" kicker="Como funciona, em uma imagem" title="O caderno de obra que passa de mão em mão">
        <Lv
          className="mt-6 max-w-[62ch] space-y-4 text-[16px] leading-[1.6] text-zinc-500"
          j={<><p>Imagine uma obra em que cada equipe, ao terminar, deixa um caderno para a próxima. Na maioria dos dias ninguém escreve nada: o dia foi normal. Quando alguém escreve, é uma página só, com uma etiqueta na borda para a próxima equipe achar.</p><p>Cada página tem duas notas: uma pelo capricho da escrita, outra por alguém ter seguido a instrução e ela ter funcionado. A segunda nota quase ninguém tem ainda.</p></>}
          p={<><p>O ciclo tem seis perguntas. A última, Compound, decide o que merece uma página no caderno: uma <T k="duravel">aprendizagem durável</T> por rodada, no máximo, com as etiquetas literais que vão se repetir, para que a rodada seguinte a <T k="descobribilidade">encontre</T> sem saber que ela existe. Na maioria das rodadas, nada é escrito. Isso é um resultado válido.</p><p>Cada recurso do caderno carrega duas notas que não se emprestam: <T k="cdqi">CDQI</T>, pela construção, e <T k="cel">CEL</T>, pela evidência de que funciona.</p></>}
          s={<><p>Compound Design é um plugin de skills (procedimentos com contrato) e agentes especialistas que estrutura o trabalho de design engineering como um loop: ao fim de cada passada, guarda a única coisa que vale guardar onde a passada seguinte vai encontrar. Craft não é uma etapa: acontece por especialistas e decisões dentro de Model, Verify e Polish, só quando o trabalho tem uma pergunta que precisa deles.</p><p>Recuperação (retrieval): <code className="text-black dark:text-white">cd.mjs discover</code> faz uma busca determinística e limitada antes de Frame e Model perguntarem qualquer coisa. Os pesos usam os campos literais do contrato: signals (sinais) 5 · concepts (conceitos) 3 · areas (áreas) 2 · palavra do título 1; no máximo 7 resultados; corte abaixo de 3 pontos. O mecanismo é testado sem modelo; o efeito nas decisões não é medido.</p></>}
        />
        <Rows>
          {[
            ["Frame", "O que estamos realmente tentando resolver?", "O que a gente está tentando consertar de verdade? E alguém já anotou isso no caderno?"],
            ["Model", "Como o produto deve se comportar?", "Como isso deve se comportar em todos os casos, até nos que ninguém desenhou?"],
            ["Build", "Transforme a intenção em algo real.", "Faz de verdade."],
            ["Verify", "O que aconteceu na prática bate com a intenção?", "Ficou como a gente combinou? Só olha e conta; não conserta."],
            ["Polish", "Isso está realmente deliberado?", "Está assim porque alguém quis, ou por acidente?"],
            ["Compound", "O que merece melhorar o trabalho futuro?", "O que merece uma página no caderno? Quase sempre, nada."],
            ["Repetir", "Comece de novo com mais capacidade do que antes.", "A próxima equipe começa com o caderno na mão."],
          ].map(([name, q, qc]) => (
            <Row key={name} label={name}>{level === "junior" ? qc : q}</Row>
          ))}
        </Rows>
        <p className="mt-6 max-w-[62ch] text-[15px] leading-[1.6] text-zinc-500">O teste de durabilidade, feito antes de escrever qualquer página: <span className="text-black dark:text-white">“Se isso desaparecesse, um humano ou agente futuro provavelmente repetiria trabalho, risco ou investigação relevantes?”</span></p>
        <Details summary="Quem faz o quê">
          <p>Compound Design não automatiza autoria. Ele roteia, estrutura, checa e lembra. O julgamento humano fica nas decisões que carregam gosto ou risco: qual problema vale resolver, o que uma boa interface parece, o que merece virar regra, e quando a evidência ainda não é boa o bastante. Revisão é só relatório por padrão: revisar algo não é permissão para mudá-lo.</p>
        </Details>
      </Section>

      {/* 3 · rail 1 */}
      <Section id="fases" kicker="Linha do tempo · camada 1" title="A linha simples: seis etapas, uma pergunta cada">
        <p className="mt-4 max-w-[62ch] text-[15px] leading-[1.6] text-zinc-500">Passe o ponteiro sobre o trilho e role: ele corre de lado. No fim do trilho a página volta a rolar. Setas do teclado funcionam quando o trilho está em foco.</p>
        <div ref={rail1} style={{ height: h1 }} className="mt-8 w-full overflow-hidden rounded-xl border border-black/10 transition-[height,border-color] duration-300 dark:border-white/10">
          <Lifeline mode="embed" markers={fases} birthYear={FASES_BIRTH} title="As seis etapas do projeto" className="h-full" />
        </div>
        <p className="mt-4 text-[13px] text-zinc-500">Espinha em ordem, não em escala de tempo: v0.1 → v0.2.1 nasceram em três dias (5–7 set 2026) num branch do supernova-catalogo, e v0.3.0-alpha.1 foi ao ar em 9 set. Cada etapa responde a uma pergunta; cada uma diz o que aprendeu e o que ainda não sabe.</p>
      </Section>

      {/* 4 · numbers */}
      <Section id="numeros" kicker="Métricas" title="Os números que importam, com a ressalva ao lado">
        <div className="mt-8 grid gap-px overflow-hidden rounded-xl border border-black/10 bg-black/10 sm:grid-cols-2 lg:grid-cols-3 dark:border-white/10 dark:bg-white/10">
          {[
            { label: "Nível de evidência", value: "E1", sub: "máximo de qualquer recurso", q: "Já foi provado que funciona?", a: "Não.", caveat: "E1 permite dizer “testado por contrato” (contract-tested). Proíbe “provado que melhora resultados”. Nada excede E1.", deep: <><p>Escada: E0 inspeção → E1 contratos determinísticos → E2 runtime controlado → E3 corroboração independente → E4 evidência de campo. “Um CDQI alto nunca sobe o CEL por si só.”</p><p><Src path="compound-design/quality/CD-EVIDENCE-LEVELS.md" /></p></> },
            { label: "Ganho em runtime", value: "não medido", sub: "chamadas pagas de modelo: 0", q: "Quanto o Compound melhora o resultado?", a: "Ainda não sabemos. A comparação nunca rodou.", caveat: "“Não medido (not measured) é a resposta correta até deixar de ser.”", deep: <><p>O site do projeto quebra o build se o registro deixar de dizer “not measured” (o valor literal, em inglês, que significa não medido) ou se o ambiente E2 registrar uma execução paga.</p><p><Src path="src/content/current-state.ts" /> · <Src path="compound-design/quality/e2/environment.json" /></p></> },
            { label: "Checagens de contrato", value: "26 / 26", sub: "4 grupos · 2026-09-09", q: "O que a máquina já conferiu?", a: "Que cada recurso declara e cumpre o próprio contrato.", caveat: "“Não prova nada sobre eficácia em runtime, que segue não medida.”", deep: <><p>Grupos (nomes literais da suíte): v0.3-skill (12 recursos), carried-over-skill (3 skills herdadas), v0.3-agent (6 agentes), discoverability (5 checagens de descobribilidade). Recursos entraram em E0 e subiram a E1 em commit separado (c61b896).</p><p><Src path="compound-design/quality/releases/v0.3-contract-eval.json" /></p></> },
            { label: "Recursos ativos", value: "15 + 6", sub: "skills · agentes", q: "Quanto existe para usar?", a: "Quinze procedimentos e seis especialistas, instalados por três hosts.", caveat: "“Tamanho de catálogo não é meta.” Se 15 é o número certo: desconhecido.", deep: <><p>“Uma skill existe quando um procedimento tem um consumidor.” Um agente nunca reescreve o procedimento da sua skill; aponta para ela, e um teste determinístico garante isso.</p><p><Src path="STRATEGY.md" /> · <Src path="README.md" /></p></> },
            { label: "Audit Score médio", value: fmt(MEDIA_11), sub: `11 marcos · V01→V11 ${fmt(DELTA_V01_V11)}`, q: "As interfaces melhoraram com o tempo?", a: "Contra esta régua, não há linha subindo.", caveat: `Só os 23 itens determinísticos; 31 de julgamento não agregados; cobertura 25,6–42,6%. Sem V10: ${fmt(MEDIA_INDEPENDENTE)}.`, deep: <><p>Score = PASS/(PASS+FAIL)×100. Cobertura = (PASS+FAIL)/(PASS+FAIL+NÃO VERIFICADO)×100. N/A (não se aplica) fica fora dos dois. “Um score nunca é mostrado sem a sua cobertura.” Não é uma nota universal de design e não sobe CEL.</p><p><Src path="case-study/design-benchmark/METHODOLOGY.md" /> · <Src path="case-study/design-benchmark/SUMMARY.json" /></p></> },
            { label: "Transferências verificadas", value: "97 / 105", sub: "arestas · 8 de 9 cadeias completas", q: "O aprendizado passou mesmo de um projeto para outro?", a: "Onde é rastreável por arquivo, sim. Treze alegações não se sustentam.", caveat: "“Nenhuma transferência foi inferida por plausibilidade.” A cadeia 013 tem regra e reuso no mesmo commit.", deep: <><p>80 nós; tipos de aresta, com os nomes literais do grafo: informed (informou) 29, reused (reutilizou) 22, created (criou) 21, promoted (promoveu) 12, migrated (migrou) 8, failure (falha) 5, superseded (superou) 5, eval-created (criou eval) 3. Quatro linhas da cronologia foram corrigidas por este grafo.</p><p><Src path="case-study/knowledge/TRANSFER-GRAPH.md" /></p></> },
          ].map((t) => (
            <div key={t.label} className="flex flex-col gap-3 bg-white p-5 transition-colors duration-300 dark:bg-black">
              <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-500 dark:text-zinc-600">{t.label}</p>
              <p className="text-3xl font-medium tracking-tight text-black tabular-nums dark:text-white">{t.value}</p>
              <p className="-mt-2 text-[13px] text-zinc-500 tabular-nums">{t.sub}</p>
              <p className="text-[14px] leading-snug text-zinc-500"><span className="text-black dark:text-white">{t.q}</span> {t.a}</p>
              <p className="text-[13px] leading-snug text-zinc-500 border-t border-black/10 pt-3 dark:border-white/10">{t.caveat}</p>
              <details className="group text-[13px]">
                <summary className="cursor-pointer list-none text-zinc-500 transition-colors duration-300 hover:text-black [&::-webkit-details-marker]:hidden dark:hover:text-white">Fórmula, fonte, o que o número não diz <span aria-hidden="true" className="inline-block transition-transform duration-300 group-open:rotate-45">+</span></summary>
                <div className="mt-2 space-y-2 leading-snug text-zinc-500">{t.deep}</div>
              </details>
            </div>
          ))}
        </div>
      </Section>

      {/* 5 · rail 2 */}
      <Section id="marcos" kicker="Linha do tempo · camada 2" title="A linha real: onze capturas, de 13 de julho a 9 de setembro de 2026">
        <p className="mt-4 max-w-[62ch] text-[15px] leading-[1.6] text-zinc-500">Sete ferramentas viraram onze marcos capturados e medidos contra a mesma régua. As capturas reais flutuam sobre o trilho: arraste, toque para ampliar. Passe o ponteiro sobre uma nota para ver a primeira tela daquele marco.</p>
        <div ref={rail2} style={{ height: h2 }} className="mt-8 w-full overflow-hidden rounded-xl border border-black/10 transition-[height,border-color] duration-300 dark:border-white/10">
          <Lifeline mode="embed" markers={marcos} birthYear={MARCOS_BIRTH} title="Os onze marcos do benchmark de design" className="h-full" />
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 text-[13px] text-zinc-500">
          <span>Dia 0 = 13 jul 2026, o primeiro artefato chamado Compound. Espaço entre marcos = tempo real.</span>
          <LifelineLegend items={MARCOS_LEGEND} />
        </div>
        <ScoreChart />
        <Rows>
          {MARCOS.map((m) => (
            <Row key={m.id} label={<>{m.id} <span className="ml-2 font-normal text-zinc-500">{m.time ? `9 set · ${m.time}` : ["13 jul","5 ago","13 ago","24 ago","6 set","7 set","8 set","9 set"][["V01","V02","V03","V04","V05","V06","V07","V08"].indexOf(m.id)]}</span></>} meta={<>{fmt(m.score)} <span className="text-zinc-400">· cob. {fmt(m.coverage)}%</span></>}>
              {m.name}
            </Row>
          ))}
        </Rows>
        <p className="mt-4 text-[13px] leading-snug text-zinc-500">Média das 11: 51,3 · V01→V11: −4,5 · falha mais persistente: <code>estilo/espaco-base</code> (10 de 11) · 107 findings com evidência · maior queda V08→V09 (−30,3) e maior subida V09→V10 (+30,3), que é troca de superfície, não correção.</p>
        <Details summary="17, 24, 8 ou 7 ferramentas?">
          <p>O brief fala em 17 ferramentas (declaração do autor). Os metadados sustentam 24 candidatas (lista Vercel limitada a 50 + git + conteúdo). 8 foram verificadas por um repositório legível; 16 são inferidas só por nome e data, e o trabalho de cliente exige revisão de privacidade. 7 ferramentas viraram 11 marcos capturados.</p>
          <p>As contagens não foram reconciliadas de propósito: “Nada foi removido para chegar a 17 e nada foi adicionado para chegar a 24.” Incertezas explícitas: a lista Vercel para em 50; ids de deployment anteriores a setembro não foram retidos; V03 talvez nunca tenha sido deployado; repositórios de cliente não são legíveis; duplicatas contam uma vez. <Src path="case-study/history/CHRONOLOGY.md" /></p>
        </Details>
        <Details summary="Limites declarados do benchmark">
          <p>Julgamento de um único avaliador, o mesmo agente que construiu V08–V11. O sandbox bloqueia *.vercel.app, Google Fonts e Unsplash, então cada captura é do commit exato construído localmente. 16 dos 24 candidatos não foram capturados. V04 e V11 foram construídos com typescript.ignoreBuildErrors (o build ignora erros de tipo). “Não prova que o Compound Design aumenta produtividade… e não sobe o CEL.” <Src path="case-study/design-benchmark/METHODOLOGY.md" /></p>
        </Details>
      </Section>

      {/* 6 · validations */}
      <Section id="validacoes" kicker="Validações" title="O que já foi validado: o que pode e o que não pode ser dito">
        <div className="mt-8 grid gap-px overflow-hidden rounded-xl border border-black/10 bg-black/10 md:grid-cols-2 dark:border-white/10 dark:bg-white/10">
          {[
            { t: "Suíte de contratos", s: "executada · 2026-09-09", c: "A máquina conferiu 26 promessas. Todas cumpridas.", pode: ["26 checagens em 4 grupos, todas passaram", "“testado por contrato” (contract-tested)", "os recursos declaram e cumprem os próprios contratos"], nao: ["“provado que melhora resultados” (proven to improve outcomes)", "“validado” (validated)", "qualquer coisa que soe como E2"], src: "compound-design/quality/releases/v0.3-contract-eval.json" },
            { t: "Benchmark de design", s: "executada a metade determinística · julgamento não agregado", c: "Onze fotos medidas com a mesma régua. A régua só alcançou metade dos itens.", pode: ["score por marco, sempre com cobertura", "falha mais persistente: estilo/espaco-base (10 de 11)", "107 findings com evidência e valor medido vs esperado"], nao: ["“aumenta produtividade”, “impacto no negócio”", "que o design melhorou ao longo do tempo (V01→V11 = −4,5)", "que sobe CEL ou mede ganho em runtime", "que o julgamento é independente: houve um único avaliador (single-rater)"], src: "case-study/design-benchmark/METHODOLOGY.md" },
            { t: "Grafo de transferência", s: "executado · leitura de arquivos, commits e md5", c: "Seguimos cada página do caderno até onde ela foi parar.", pode: ["80 nós, 105 arestas, 97 com evidência de arquivo", "8 de 9 cadeias ponta a ponta verificadas", "arquivos md5-idênticos entre supernova-catalogo e compoundmetrics"], nao: ["que a era v0 ou projetos de cliente ensinaram algo reusado", "/audit → cl-audit", "processo como intermediário do Lifeline", "Atomic Design como fonte nomeada"], src: "case-study/knowledge/TRANSFER-GRAPH.md" },
            { t: "Ledger de aprendizado", s: "13 entradas · CD-20260909-001 a 013", c: "Treze erros da própria sala de prova, anotados antes de qualquer aluno entrar.", pode: ["falhas reproduzíveis registradas, com correção humana", "“insumos de evidência” (evidence inputs)", "cadeia 013: axe mede a página em movimento → regra “página em repouso” → site-check.mjs"], nao: ["“prova de ganho” (proof of uplift)", "que sobe CEL (“não sobe o CEL por si só”)", "reuso da 013 em outra ferramenta (E55 não verificada)"], src: "compound-design/learning/LEDGER.md" },
            { t: "Piloto E2", s: "nunca executado · pré-registrado · custo bloqueado", c: "A prova está pronta, ninguém pagou por ela ainda. E o caderno pode perder.", pode: ["pré-registrado; preparação a custo zero completa; 0 chamadas pagas", "H1–H4; 163 runs planejados; ≈ US$ 15–53", "N efetivo 9; resolução ≈ ±5,5", "“‘o Compound perde’ é um desfecho aceitável e pré-registrado”"], nao: ["qualquer resultado", "“estatisticamente significativo”, “provado”, “validado”", "“ganho confiável” (reliable uplift), “verificado em runtime”, “verificado entre modelos” (cross-model)"], src: "compound-design/quality/e2/E2-PILOT-PLAN.md" },
          ].map((v) => (
            <article key={v.t} className="flex flex-col gap-3 bg-white p-5 transition-colors duration-300 dark:bg-black">
              <header>
                <h3 className="text-[15px] font-medium text-black dark:text-white">{v.t}</h3>
                <p className="mt-1 text-[12px] uppercase tracking-[0.06em] text-zinc-500">{v.s}</p>
              </header>
              <Lv
                j={<p className="text-[14px] leading-snug text-zinc-500">{v.c}</p>}
                p={<div className="grid gap-4 text-[13px] leading-snug sm:grid-cols-2"><div><p className="mb-1 font-medium text-black dark:text-white">Pode dizer</p><ul className="space-y-1 text-zinc-500">{v.pode.map((p) => <li key={p}>{p}</li>)}</ul></div><div><p className="mb-1 font-medium text-black dark:text-white">Não pode dizer</p><ul className="space-y-1 text-zinc-500">{v.nao.map((p) => <li key={p}>{p}</li>)}</ul></div></div>}
                s={<div className="grid gap-4 text-[13px] leading-snug sm:grid-cols-2"><div><p className="mb-1 font-medium text-black dark:text-white">Pode dizer</p><ul className="space-y-1 text-zinc-500">{v.pode.map((p) => <li key={p}>{p}</li>)}</ul></div><div><p className="mb-1 font-medium text-black dark:text-white">Não pode dizer</p><ul className="space-y-1 text-zinc-500">{v.nao.map((p) => <li key={p}>{p}</li>)}</ul><p className="mt-3 text-zinc-500">Fonte: <Src path={v.src} /></p></div></div>}
              />
            </article>
          ))}
        </div>
      </Section>

      {/* 7 · compõe vs não compõe */}
      <Section id="compoe" kicker="O filtro" title="O que compõe e o que não compõe">
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <div>
            <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-500 dark:text-zinc-600"><span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-pink-500" />Compõe</p>
            <ul className="mt-3 divide-y divide-black/10 border-y border-black/10 dark:divide-white/10 dark:border-white/10">
              {[["Uma decisão", "vira uma regra"], ["Uma falha", "vira um eval"], ["Uma solução recorrente", "vira um padrão"], ["Uma interface recorrente", "vira um componente"], ["Um fluxo de trabalho útil", "vira uma skill"], ["Uma responsabilidade especializada", "vira um agente"], ["Uma lição de projeto", "melhora o próximo projeto"]].map(([a, b]) => (
                <li key={a} className="flex items-baseline justify-between gap-4 py-3 text-[14px]"><span className="text-black dark:text-white">{a}</span><span className="text-right text-zinc-500">{b}</span></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-500 dark:text-zinc-600">Não compõe</p>
            <ul className="mt-3 divide-y divide-black/10 border-y border-black/10 text-[14px] text-zinc-500 dark:divide-white/10 dark:border-white/10">
              {["Nem toda observação vira aprendizado.", "Nem todo aprendizado vira regra.", "Nem toda regra vira skill.", "Nem tudo merece se acumular.", "O trabalho que saiu como esperado: “Diga isso e não escreva nada.”", "O que o código, os testes ou os tipos já dizem: um documento que os repete é drift esperando para acontecer.", "Trivialidade de sessão e preferência pessoal.", "Esforço gasto e tamanho do diff: “não conferem elegibilidade”."].map((s) => (
                <li key={s} className="py-3">{s}</li>
              ))}
            </ul>
          </div>
        </div>
        <Details summary="Os quatro achados do Lab, um a um">
          <ul className="space-y-2">
            <li><span className="text-black dark:text-white">IR-01 · campo de e-mail sem label (blocker, bloqueante)</span> → nada novo: o revisor já checa nomes acessíveis; falha o teste de durabilidade.</li>
            <li><span className="text-black dark:text-white">IR-02 · mensagem de erro longe do campo (major, grave)</span> → <T k="duravel">aprendizado durável</T> com etiquetas (aria-describedby, error-summary, toast): “o próximo engenheiro a construir qualquer formulário redescobriria isso do jeito difícil”.</li>
            <li><span className="text-black dark:text-white">IR-03 · botão suprime o anel de foco (major, grave)</span> → achado de consistência: o design system já tem o token. “Um aprendizado que o código já expressa não é escrito de novo.”</li>
            <li><span className="text-black dark:text-white">IR-04 · enviar não dá feedback (major, not-verified: grave, não verificado)</span> → candidato a eval: fixture (cenário fixo) + expectativa, “registrado, não lembrado”.</li>
          </ul>
          <p><Src path="src/content/lab.ts" /></p>
        </Details>
        <Details summary="O que paga e o que não paga dívida de evidência">
          <p>Paga: <code className="text-black dark:text-white">trabalho real → entrada no ledger → falha reproduzível → eval de regressão → mudança mínima → falsificação/holdout → decisão de versão</code>.</p>
          <p>Não paga, nos termos do próprio repositório: “uma nota mais alta atribuída a si mesmo; uma nova revisão de prompt sem falha reproduzida; elogio do modelo; screenshots de saídas boas; ferramentas do vendor usadas como se fossem certificação do vendor; passar nos mesmos exemplos usados para escrever o recurso.” <Src path="compound-design/quality/EVIDENCE-DEBT.md" /></p>
        </Details>
        <Details summary="Sete pares que o projeto se recusa a confundir">
          <p>popular ≠ provado · feito por empresa ≠ certificado · padrão oficial ≠ endosso · passar em testes determinísticos ≠ ganho em runtime · CDQI alto ≠ eficácia · mesmo vendor, modelo diferente ≠ validação independente · release candidata ≠ release validada. <Src path="src/content/evidence.ts" /></p>
        </Details>
      </Section>

      {/* 8 · deep dive */}
      <Section id="mergulho" kicker="Deep dive" title="Mergulho, para quem tem tempo">
        <Details summary="1 · O ciclo: quem decide e o que fica em cada etapa">
          <ul className="space-y-1">
            <li><span className="text-black dark:text-white">Frame</span> · humano decide o problema; artefato só quando uma restrição teria que ser redescoberta (docs/frames).</li>
            <li><span className="text-black dark:text-white">Model</span> · humano decide o comportamento; artefato: um plano quando o comportamento não cabe no código (docs/plans).</li>
            <li><span className="text-black dark:text-white">Build</span> · o código é o artefato.</li>
            <li><span className="text-black dark:text-white">Verify</span> · só relatório (report-only); findings no contrato compartilhado (9 campos, 3 severidades e três graus de confiança: observed, inferred, not-verified, isto é, observado, inferido, não verificado).</li>
            <li><span className="text-black dark:text-white">Polish</span> · especialistas de interface, motion e interação com IA, só quando há pergunta para eles.</li>
            <li><span className="text-black dark:text-white">Compound</span> · uma aprendizagem por rodada, no máximo; “A maioria das rodadas não guarda nada, e isso é um resultado válido.”</li>
          </ul>
          <p>“Craft não é uma etapa.” <Src path="src/content/guide.ts" /> · <Src path="compound-design/FINDING-CONTRACT.md" /></p>
        </Details>
        <Details summary="2 · As duas fronteiras, e uma terceira">
          <p>“Um artefato precisa ser merecido.” A maioria das rodadas não escreve documento; um arquivo durável aparece quando uma decisão, uma restrição ou uma aprendizagem teria que ser redescoberta.</p>
          <p>“Uma alegação nunca excede a sua evidência.” Qualidade de construção e maturidade de evidência são números separados, e nenhum pode emprestar do outro.</p>
          <p>“Revisão é só relatório (report-only) por padrão.” Revisar algo não é permissão para mudá-lo. <Src path="README.md" /></p>
        </Details>
        <Details summary="3 · O procedimento do Compound, em nove passos">
          <ol className="list-decimal space-y-1 pl-5">
            <li>Teste de durabilidade: “Se este aprendizado desaparecesse, um humano ou agente futuro provavelmente repetiria o erro, correria um risco relevante ou refaria uma investigação substancial?”</li>
            <li>Recuperabilidade: o código, os testes ou os tipos já dizem isso?</li>
            <li>Buscar no store: já existe? Então atualize ou supere, não duplique.</li>
            <li>Uma por rodada. A mais valiosa; as outras esperam.</li>
            <li>Etiquetas do contrato, com os nomes literais dos campos: id, title (título), date (data), areas (áreas), concepts (conceitos), applies_to (a que se aplica), signals (sinais), supersedes (o que substitui), status.</li>
            <li>Mecanismo, não narrativa: o que se repete, com os sinais literais.</li>
            <li>Provar que é encontrável: <code>cd.mjs discover</code> com um contexto diferente do original.</li>
            <li>Propor promoção (regra, eval, skill, agente), nunca executar.</li>
            <li>Redigir. Três desfechos: leve (“o desfecho correto mais comum”), delimitado, durável.</li>
          </ol>
          <p><Src path="skills/cd-compound/SKILL.md" /> · <Src path="compound-design/DISCOVERABILITY-CONTRACT.md" /></p>
        </Details>
        <Details summary="4 · Ciclo de vida de um recurso">
          <p><code className="text-black dark:text-white">Observar → Reproduzir → Adicionar eval → Baseline → Mudança mínima → Rodar de novo → Falsificar → Promover / Rejeitar / Simplificar</code>. Baseline é a medição de referência, antes da mudança. “Um recurso pode ser apagado quando um caminho mais simples é igual ou melhor.” “Mudanças de versão são merecidas.” <Src path="GOVERNANCE.md" /></p>
        </Details>
        <Details summary="5 · CDQI por dentro">
          <p>Sete dimensões com pesos: escopo e contrato 15% · roteamento e fronteiras 15% · fundamentação no domínio 15% · desenho das instruções 15% · saída e acionabilidade 15% · avaliabilidade (evalability) 15% · manutenibilidade e proveniência 10%. Faixas: 0–3,9 fraco · 4–5,9 experimental · 6–6,9 promissor · 7–7,9 bom interno · 8–8,9 forte · 9–9,6 maduro · 9,7–10 reservado.</p>
          <p>Uma falha P1 de segurança, licença, correção ou ação destrutiva bloqueia promoção, independentemente do CDQI. “Um recurso pode marcar 8,8 em E0. Isso significa que foi bem desenhado, não que funciona.” <Src path="compound-design/quality/CD-QUALITY-INDEX.md" /></p>
        </Details>
        <Details summary="6 · A escada CEL, com o que cada degrau permite dizer">
          <ul className="space-y-1">
            <li><span className="text-black dark:text-white">E0 · inspeção</span> · “bem construído / validação pendente”</li>
            <li><span className="text-black dark:text-white">E1 · determinístico</span> · “testado por contrato” (contract-tested); nunca “provado que melhora resultados”</li>
            <li><span className="text-black dark:text-white">E2 · runtime controlado</span> · “ganho (uplift) demonstrado no escopo testado”</li>
            <li><span className="text-black dark:text-white">E3 · independente</span> · “corroborado de forma independente no escopo testado”; “Usar o modelo de um vendor não é certificação do vendor.”</li>
            <li><span className="text-black dark:text-white">E4 · campo</span> · “provado em campo no escopo definido”</li>
          </ul>
          <p>Estado atual: tudo em E1. <Src path="compound-design/quality/CD-EVIDENCE-LEVELS.md" /></p>
        </Details>
        <Details summary="7 · O piloto E2 por dentro">
          <p>Condições: A modelo base · B upstream direto (jakubkrehel/skills@267330e1, plugin interfaces v1.6.3) · C Compound · D só prompt (J01, J02, J05). Tarefas: 9 de revisão de interface (holdouts J07–J09) e 11 de portão de qualidade (holdouts Q07, Q08, Q09, Q11), congeladas com SHA-256. Ground truth (gabarito fixado antes de qualquer saída): 29 itens determinísticos + 7 pendentes de humano + 16 iscas.</p>
          <p>Hipóteses: H1 C ≥ A + 5 na rubrica congelada, sem perda de recall de issues críticos · H2 C não inferior a B (“se C ≈ B sem ganho de eficiência, o wrapper deve ser simplificado ou removido”) · H3 Quality Gate C &gt; A sem inflação nem evidência alucinada · H4 a lane D isola de onde vem o valor.</p>
          <p>Constantes (nomes literais da configuração): max_turns 12 (turnos por run), max_budget_usd 1.0 (orçamento por run), repeat 3 (repetições), sem cache, workspaces descartáveis. 163 runs, 162 saídas julgadas, ≈ US$ 15–53. N efetivo 9, erro-padrão ≈ 3,3, intervalo de 90% ≈ ±5,5: “+5 fica no limite da resolução”. Dez condições em que o Compound perde, avaliadas mecanicamente. Auditoria de valor do recurso (Resource Value Audit): “REMOVER / SIMPLIFICAR é o desfecho registrado e um resultado válido do Compound. Autoria não preserva nada.” O comando se recusa a rodar sem a variável E2_PAID_RUNTIME_CONFIRMED=YES (confirmação explícita de runtime pago). <Src path="compound-design/quality/e2/E2-PILOT-PLAN.md" /></p>
        </Details>
        <Details summary="8 · A cadeia 013, passo a passo">
          <p>O axe reportou nove violações sérias de contraste em /project que sumiam um segundo depois: mediu marcadores no meio do fade (opacity 0,35 → 1, escalonado até 1 s). Correção: medir a página em repouso, esperar a entrada terminar, ignorar prefetches abortados. Separadamente, um cinza real de 3,2:1 subiu para 4,8:1.</p>
          <p>Ledger CD-20260909-013 → docs/solutions/2026-09-09-axe-contrast-during-entrance-animation.md com signals → regra em scripts/site-check.mjs → descobrível pelo contrato. Ressalva do grafo: regra e reuso caem no mesmo commit e na mesma ferramenta; reuso posterior não verificado. <Src path="docs/solutions/2026-09-09-axe-contrast-during-entrance-animation.md" /></p>
        </Details>
        <Details summary="9 · A revisão adversarial da v0.3">
          <p>“O sistema ficou mais simples ou só maior? Os dois, sinceramente.” Dois especialistas foram reescritos do zero e reconquistaram E1; três recursos foram substituídos; a lane candidata pergunta se a reescrita perdeu algo que a versão anterior tinha, e ainda não rodou. <Src path="compound-design/releases/v0.3.0-alpha.1-WORK-SYSTEM.md" /></p>
        </Details>
      </Section>

      {/* 9 · glossary */}
      <Section id="glossario" kicker="Glossário" title="Catorze termos, uma frase cada">
        <Rows>
          {Object.entries(GLOSSARIO).map(([k, g]) => (
            <Row key={k} label={g.termo}>{g.def}</Row>
          ))}
        </Rows>
      </Section>

      {/* 10 · sources */}
      <Section id="fontes" kicker="Fontes" title="Cada número tem um arquivo">
        <Rows>
          {[
            ["O ciclo, as fronteiras, E1 como máximo", "README.md"],
            ["Tese, sucesso, “não medido é a resposta correta”", "STRATEGY.md"],
            ["Princípios, escada de evidência, ciclo de vida", "GOVERNANCE.md"],
            ["As seis etapas: pergunta, construído, aprendido, desconhecido", "src/content/project.ts"],
            ["O que compõe, o que não compõe, teste de durabilidade", "src/content/examples.ts"],
            ["CDQI: dimensões, pesos, faixas", "compound-design/quality/CD-QUALITY-INDEX.md"],
            ["CEL: o que cada nível permite dizer", "compound-design/quality/CD-EVIDENCE-LEVELS.md"],
            ["Dívida de evidência e o que não a paga", "compound-design/quality/EVIDENCE-DEBT.md"],
            ["Piloto E2: hipóteses, holdouts, custo, condições de derrota", "compound-design/quality/e2/E2-PILOT-PLAN.md"],
            ["26 checagens em 4 grupos", "compound-design/quality/releases/v0.3-contract-eval.json"],
            ["Ledger: 13 entradas", "compound-design/learning/LEDGER.md"],
            ["Cronologia: 17 / 24 / 8 / 7 → 11, datas, incertezas", "case-study/history/CHRONOLOGY.md"],
            ["Régua congelada: 54 itens, v3.6.0, 2026-07-16", "case-study/FREEZE.md"],
            ["Onze scores com cobertura, médias, deltas", "case-study/design-benchmark/SUMMARY.json"],
            ["Fórmulas, limites, o que o benchmark não prova", "case-study/design-benchmark/METHODOLOGY.md"],
            ["Grafo: 80 nós, 105 arestas, 97 verificadas", "case-study/knowledge/TRANSFER-GRAPH.md"],
            ["A cadeia 013", "docs/solutions/2026-09-09-axe-contrast-during-entrance-animation.md"],
          ].map(([what, path]) => (
            <Row key={path} label={<Src path={path} />}>{what}</Row>
          ))}
        </Rows>
      </Section>
    </main>
  )
}

function Footer() {
  return (
    <footer className="border-t border-black/10 transition-colors duration-300 dark:border-white/10">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-6 py-8 text-[13px] text-zinc-500">
        <p>Modelo de interação e linguagem visual: Lifeline, de Evil Rabbit, MIT, usado como está. Fonte Geist, Vercel, SIL OFL. Nenhum autor upstream endossa o Compound Design.</p>
        <details className="group">
          <summary className="cursor-pointer list-none transition-colors duration-300 hover:text-black [&::-webkit-details-marker]:hidden dark:hover:text-white">Licença MIT do Lifeline <span aria-hidden="true" className="inline-block transition-transform duration-300 group-open:rotate-45">+</span></summary>
          <pre className="mt-3 whitespace-pre-wrap font-sans text-[12px] leading-relaxed">{`MIT License

Copyright (c) 2026 Evil Rabbit

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.`}</pre>
        </details>
        <p>Compound Design · {FASES.length} etapas · {MARCOS.length} marcos · tudo em E1. Esta página não leva a lugar nenhum além dela mesma.</p>
      </div>
    </footer>
  )
}

export function App() {
  const [level, setLevelState] = useState<Level>(readLevel)
  const setLevel = useCallback((l: Level) => {
    setLevelState(l)
    try { localStorage.setItem(LEVEL_KEY, l) } catch { /* per-viewer convenience only */ }
  }, [])

  return (
    <ThemeProvider attribute="class" forcedTheme="dark" enableSystem={false} disableTransitionOnChange>
      <LevelContext.Provider value={level}>
        <GlossaryProvider>
          <div className="min-h-dvh bg-white text-black antialiased transition-colors duration-300 dark:bg-black dark:text-white">
            <LifelineNav logo={<LoopMark className="h-6 w-6" />} logoHref="#top" logoLabel="O Que Sobrevive — início">
              <LevelSwitch level={level} onChange={setLevel} />
            </LifelineNav>
            <Page />
            <Footer />
          </div>
        </GlossaryProvider>
      </LevelContext.Provider>
    </ThemeProvider>
  )
}
