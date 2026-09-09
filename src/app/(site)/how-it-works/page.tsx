import type { Metadata } from "next";
import type { Example } from "@/content/types";
import { Cta, CtaRow, PageIntro, SectionIntro } from "@/components/editorial";
import { Chain, DurabilityTest, LearningTransformation, NotEverythingCompounds } from "@/components/teach";
import { Term } from "@/components/Term";
import styles from "./how.module.css";

export const metadata: Metadata = {
  title: "Como funciona",
  description: "Como o trabalho de um projeto vira capacidade reutilizável, explicado passo a passo a partir de um exemplo concreto.",
};

const signupExamplePt: Example = {
  id: "signup",
  title: "Um formulário de cadastro — e o que vale a pena levar adiante",
  setting: "Um time está construindo a criação de conta. O formulário funciona: valida os campos, envia os dados e cria a conta. Antes do Polish, o Verify encontra algo que tecnicamente funciona, mas ainda está ruim para quem usa.",
  steps: [
    {
      id: "observation",
      label: "Observação",
      title: "O feedback de validação parece desconectado do campo.",
      body: "O campo de e-mail rejeita um endereço, mas a mensagem aparece num aviso no topo do formulário. Quem está olhando precisa procurar o que deu errado; quem usa leitor de tela não recebe esse contexto no ponto em que está focado.",
      form: "uma observação pontual da revisão",
    },
    {
      id: "correction",
      label: "Correção",
      title: "Leve o feedback para o contexto do próprio campo.",
      body: "A mensagem passa a ficar junto do campo que descreve, é anunciada no contexto do foco e explica como se recuperar — por exemplo, mostrando o formato esperado para um endereço válido.",
      form: "uma correção em um formulário",
    },
    {
      id: "learning",
      label: "Aprendizado",
      title: "O feedback de validação deve permanecer associado ao campo, visualmente e no código.",
      body: "A frase deixa de falar apenas deste formulário. Ela passa no teste de durabilidade: se desaparecesse, outra pessoa provavelmente repetiria o mesmo erro no próximo formulário. Por isso, o aprendizado é registrado uma única vez junto dos sinais que ajudam a encontrá-lo de novo, como aria-describedby, error summary e regiões de toast.",
      form: "um aprendizado durável com sinais de descoberta",
    },
    {
      id: "resource",
      label: "Candidato a recurso",
      title: "Uma regra para o Interface Review.",
      body: "O Interface Review já verifica estados e alcance da interface. Esse aprendizado torna uma checagem mais precisa: feedback sem associação com o campo passa a ser um finding, com impacto conhecido e uma correção conhecida.",
      form: "uma regra dentro do procedimento de revisão",
    },
    {
      id: "eval",
      label: "Candidato a eval",
      title: "Detectar feedback de validação desconectado.",
      body: "Criamos um fixture com uma mensagem de erro separada do campo e uma expectativa explícita de que o reviewer encontre o problema. Ele encontra ou não encontra — e o resultado fica registrado, em vez de depender da memória de alguém.",
      form: "uma checagem determinística",
    },
    {
      id: "future",
      label: "Próximo projeto",
      title: "O próximo projeto encontra esse aprendizado antes de repetir o erro.",
      body: "Meses depois, o Frame faz a descoberta para uma tarefa que menciona um resumo de erros de formulário. O aprendizado aparece como restrição, com seu identificador. O problema é evitado antes do ponto em que precisou ser descoberto da primeira vez.",
      form: "uma restrição dentro de um novo Frame",
    },
  ],
};

const whatDoesNotCompoundPt = [
  "Nem toda observação vira aprendizado.",
  "Nem todo aprendizado vira regra.",
  "Nem toda regra vira skill.",
  "Nem tudo merece ser acumulado.",
];

const durabilityTestPt = "Se isso desaparecesse, uma pessoa ou agente no futuro provavelmente repetiria um trabalho importante, correria um risco ou teria de refazer uma investigação?";

export default function HowItWorksPage() {
  return (
    <div lang="pt-BR">
      <PageIntro
        eyebrow="Como funciona"
        title="Um time está construindo um fluxo de cadastro."
        lead={signupExamplePt.setting}
        aside={
          <>
            <span className="label">Ao terminar esta página</span>
            <span className="small muted">Você deve conseguir explicar como o trabalho de um projeto vira capacidade reutilizável.</span>
          </>
        }
      />

      <section className="container" aria-labelledby="example-title">
        <h2 id="example-title" className="sr">
          {signupExamplePt.title}
        </h2>
        <LearningTransformation example={signupExamplePt} formLabel="Forma que assume" />
      </section>

      <section className="container section" aria-labelledby="where-title">
        <SectionIntro
          id="where-title"
          eyebrow="Para onde o aprendizado vai"
          title="O conhecimento muda de forma até conseguir chegar ao próximo projeto."
          lead="Cada seta representa uma decisão. O sistema oferece estruturas e testes para tornar essas decisões mais consistentes, mas não decide no seu lugar o que merece sobreviver."
        />
        <div className={styles.chainWrap}>
          <Chain
            items={["Trabalho", "Observação", "Solução", "Learning Ledger", "Regra · Padrão · Skill · Agente · Eval", "Trabalho futuro"]}
            highlight={[3, 4]}
          />
        </div>
        <div className={styles.split}>
          <div className={styles.splitMain}>
            <NotEverythingCompounds lines={whatDoesNotCompoundPt} />
          </div>
          <div className={styles.splitAside}>
            <span className="label">O teste de durabilidade</span>
            <DurabilityTest text={durabilityTestPt} />
            <p className="small muted">
              Tempo gasto e tamanho da mudança não tornam algo automaticamente valioso. Se um aprendizado já pode ser recuperado de forma confiável pelo próprio código, não faz sentido registrá-lo de novo.
            </p>
          </div>
        </div>
      </section>

      <section className="container section" aria-labelledby="names-title">
        <SectionIntro
          id="names-title"
          eyebrow="Agora, os nomes"
          title="Você já viu essas três ideias funcionando. Agora fica mais fácil dar nome a elas."
        />
        <div className={styles.names}>
          <div className={styles.nameRow}>
            <span className={styles.nameTerm}>
              <Term id="durable-learning">Aprendizado durável</Term>
            </span>
            <span className="muted">A ideia que sobreviveu ao formulário porque perder aquilo faria alguém repetir trabalho, risco ou investigação no futuro.</span>
          </div>
          <div className={styles.nameRow}>
            <span className={styles.nameTerm}>
              <Term id="learning-ledger">Learning Ledger</Term>
            </span>
            <span className="muted">O lugar onde observação e correção são registradas numa estrutura consistente antes de decidir se aquilo realmente merece durar.</span>
          </div>
          <div className={styles.nameRow}>
            <span className={styles.nameTerm}>
              <Term id="discoverability">Discoverability</Term>
            </span>
            <span className="muted">É como o próximo projeto consegue encontrar esse aprendizado pelos sinais que aparecem de novo — sem depender de alguém lembrar que ele existe.</span>
          </div>
        </div>
        <div className={styles.ctas}>
          <CtaRow>
            <Cta href="/lab">Ver isso acontecendo no Lab</Cta>
            <Cta href="/resources">Ver o que já virou recurso</Cta>
          </CtaRow>
        </div>
      </section>
    </div>
  );
}
