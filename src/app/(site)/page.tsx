import type { Metadata } from "next";
import { navigation } from "@/content/navigation";
import { cdqi, cel } from "@/content/evidence";
import { CurrentStateBlock } from "@/components/CurrentState";
import { Cta, CtaRow, EvidenceBoundary, Row, Rows, SectionIntro } from "@/components/editorial";
import { ProcessFlow, Transformation, WhatCompounds } from "@/components/teach";
import { Term } from "@/components/Term";
import styles from "./home.module.css";

export const metadata: Metadata = {
  title: { absolute: "Compound Design" },
  description: "Um processo vivo de Design Engineering para construir com pessoas e agentes de IA, acumulando aprendizado útil entre projetos.",
};

const transformationPt = [
  { name: "Projeto 01", form: "um projeto começa" },
  { name: "Trabalho", form: "o trabalho acontece" },
  { name: "Descoberta", form: "algo importante é percebido" },
  { name: "Aprendizado", form: "uma lição que se perderia" },
  { name: "Recurso", form: "uma regra, um eval, uma skill ou um especialista" },
  { name: "O sistema melhora", form: "o jeito de trabalhar fica melhor" },
  { name: "Projeto 02 começa melhor", form: "começa com mais do que o primeiro tinha" },
] as const;

const compoundsPt = [
  ["Uma decisão", "vira uma regra"],
  ["Uma falha", "vira um eval"],
  ["Uma solução recorrente", "vira um padrão"],
  ["Uma interface recorrente", "vira um componente"],
  ["Um fluxo de trabalho útil", "vira uma skill"],
  ["Uma responsabilidade especializada", "vira um agente"],
  ["Uma lição de projeto", "melhora o próximo projeto"],
] as const;

const stagesPt = [
  { id: "frame", name: "Frame", question: "O que estamos realmente tentando resolver?", skill: "cd-frame" },
  { id: "model", name: "Model", question: "Como o produto deve se comportar?", skill: "cd-model" },
  { id: "build", name: "Build", question: "Transforme a intenção em algo real.", skill: "cd-build" },
  { id: "verify", name: "Verify", question: "O que aconteceu na prática bate com a intenção?", skill: "cd-verify" },
  { id: "polish", name: "Polish", question: "Isso está realmente deliberado?", skill: "cd-polish" },
  { id: "compound", name: "Compound", question: "O que merece melhorar o trabalho futuro?", skill: "cd-compound" },
] as const;

const navPt: Record<string, { label: string; outcome: string }> = {
  "/how-it-works": { label: "Como funciona", outcome: "Entendo como o trabalho de um projeto vira capacidade reutilizável." },
  "/lab": { label: "Lab", outcome: "Vejo o Compound acontecendo na prática." },
  "/project": { label: "Projeto", outcome: "Entendo o que este experimento é e em que ponto ele está." },
  "/resources": { label: "Recursos", outcome: "Consigo encontrar a capacidade certa para o meu trabalho." },
  "/evidence": { label: "Evidência", outcome: "Entendo claramente o que já foi demonstrado e o que ainda não foi." },
  "/learn": { label: "Guia de conceitos", outcome: "Consigo explicar o vocabulário do sistema." },
  "/guide": { label: "Guia", outcome: "Entendo o processo de ponta a ponta." },
  "/case-study": { label: "Estudo de caso", outcome: "Entendo como o projeto evoluiu e quais evidências sustentam essa história." },
};

export default function HomePage() {
  return (
    <div lang="pt-BR">
      <section className={`container ${styles.hero}`}>
        <span className="label">Design Engineering · pessoas + agentes de IA</span>
        <h1 className="display">
          Construa o produto.
          <br />
          Melhore o sistema que constrói o próximo.
        </h1>
        <p className={`lead ${styles.heroLead}`}>
          Compound Design é um processo vivo para construir com pessoas e agentes de IA sem fazer cada projeto começar do zero. A ideia é simples: o bom julgamento investido em um trabalho não deveria desaparecer quando a conversa termina. O que realmente vale a pena precisa sobreviver em uma forma que o próximo projeto consiga usar.
        </p>
      </section>

      <section className={`container ${styles.demo}`} aria-labelledby="transformation-title">
        <h2 id="transformation-title" className="sr">
          Como um projeto melhora o próximo
        </h2>
        <Transformation items={transformationPt} ariaLabel="Como um projeto melhora o próximo" />
        <p className={`small muted ${styles.demoNote}`}>
          Isso não é documentação para ler no fim. Cada etapa deixa algo para trás, e a última entrega é justamente o ponto de partida do próximo projeto.
        </p>
      </section>

      <section className="container section" aria-labelledby="compounds-title">
        <SectionIntro
          id="compounds-title"
          eyebrow="O que realmente se acumula?"
          title="Não é o volume de trabalho. É o que aprendemos e conseguimos reutilizar."
          lead="A maior parte do que acontece em um projeto não precisa ser guardada. O que realmente importa muda de forma para conseguir sobreviver ao projeto que o produziu."
        />
        <WhatCompounds items={compoundsPt} />
      </section>

      <section className="container section" aria-labelledby="loop-title">
        <SectionIntro
          id="loop-title"
          eyebrow="O ciclo"
          title="Seis perguntas, na ordem certa — e então o ciclo recomeça com mais repertório do que antes."
          lead="Craft não é uma etapa isolada. Ele aparece na qualidade das decisões, principalmente em Model, Verify e Polish, e nos especialistas chamados quando existe uma pergunta real que justifica isso."
        />
        <ProcessFlow stages={stagesPt} repeatStage={{ name: "Repetir", question: "Comece de novo com mais capacidade do que antes." }} />
      </section>

      <section className="container section" aria-labelledby="evidence-title">
        <SectionIntro
          id="evidence-title"
          eyebrow="A ideia crítica"
          title="Uma coisa pode ser muito bem construída e ainda não ter prova de que funciona. Na prática, isso é comum."
        />
        <div className={styles.boundary}>
          <EvidenceBoundary
            left="Bem construído"
            right="Útil de verdade?"
            leftNote="O recurso é bem delimitado, fundamentado, acionável, testável e fácil de manter?"
            rightNote="Ele melhora o trabalho em comparação com não usá-lo — medido, repetido e contra uma referência?"
          />
        </div>
        <div className={styles.names}>
          <div className={styles.name}>
            <span className="label">A primeira pergunta tem nome</span>
            <span className={styles.nameBig}>
              <Term id="cdqi">{cdqi.name}</Term>
            </span>
            <span className="muted">Quão bem este recurso foi construído?</span>
            <span className="small faint">{cdqi.range}, avaliado e registrado. Nunca inferido só porque a saída parece boa.</span>
          </div>
          <div className={styles.name}>
            <span className="label">A segunda também</span>
            <span className={styles.nameBig}>
              <Term id="cel">{cel.name}</Term>
            </span>
            <span className="muted">Que nível de evidência temos de que ele funciona?</span>
            <span className="small faint">{cel.range}, avançando apenas quando aparece evidência nova — nunca por construção, elogio ou popularidade.</span>
          </div>
        </div>
        <p className={`body muted ${styles.evidenceNote}`}>
          As duas coisas nunca viram uma nota única. Essa separação é uma regra do sistema — e é o que permite dizer, sem maquiagem, o que já foi demonstrado e o que ainda não foi.
        </p>
      </section>

      <section className="container section" aria-labelledby="status-title">
        <SectionIntro
          id="status-title"
          eyebrow="Onde o projeto está"
          title="Um experimento que deixa claro o que sabe — e o que ainda não sabe."
        />
        <CurrentStateBlock locale="pt-BR" />
      </section>

      <section className="container section" aria-labelledby="next-title">
        <SectionIntro
          id="next-title"
          eyebrow="Para onde seguir"
          title="Primeiro veja. Depois entenda. Só então dê nome às coisas."
          lead="Cada página existe para deixar uma ideia clara o bastante para você conseguir explicá-la depois."
        />
        <Rows>
          {navigation
            .filter((n) => n.href !== "/")
            .map((n) => {
              const translated = navPt[n.href];
              return (
                <Row
                  key={n.href}
                  href={n.href}
                  title={translated?.label ?? n.label}
                  sub={`“${translated?.outcome ?? n.outcome}”`}
                  meta={<span>{n.href}</span>}
                />
              );
            })}
        </Rows>
        <div className={styles.finalCta}>
          <CtaRow>
            <Cta href="/guide">Ler o guia</Cta>
            <Cta href="/lab">Ver o Compound acontecendo</Cta>
            <Cta href="/how-it-works">Entender o mecanismo</Cta>
          </CtaRow>
        </div>
      </section>
    </div>
  );
}
