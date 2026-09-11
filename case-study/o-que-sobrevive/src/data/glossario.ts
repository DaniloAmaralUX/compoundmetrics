/** Fourteen one-sentence definitions, aligned with the site's Field Guide (`src/content/concepts-*.ts`). */
export const GLOSSARIO: Record<string, { termo: string; def: string }> = {
  cdqi: { termo: "CDQI", def: "Nota de construção de 0 a 10: este recurso foi bem construído? Nunca é evidência de que funciona." },
  cel: { termo: "CEL", def: "Compound Evidence Level, de E0 a E4: quão fortemente a eficácia deste recurso já foi demonstrada?" },
  e1: { termo: "E1 · contratos determinísticos", def: "Máquinas conferiram que o recurso declara e cumpre o próprio contrato, do mesmo jeito toda vez. Permite dizer “testado por contrato”, não “provado que melhora resultados”." },
  e2: { termo: "E2 · runtime controlado", def: "O recurso foi rodado contra uma referência nas mesmas tarefas, repetidas vezes, e a diferença foi registrada. Nenhum recurso aqui está em E2." },
  uplift: { termo: "Ganho em runtime", def: "A diferença medida que um recurso faz quando um modelo roda com ele versus sem ele. Aqui: não medido." },
  divida: { termo: "Dívida de evidência", def: "A distância explícita entre o que um recurso foi construído para fazer e o que já foi demonstrado." },
  holdout: { termo: "Holdout", def: "A parte da prova que você não usa enquanto melhora o sistema. Aqui, 3 de 9 e 4 de 11 tarefas." },
  preregistro: { termo: "Pré-registro", def: "Escrever tarefas, rubrica, limiares e as condições em que você perde antes de existir qualquer resultado." },
  cegamento: { termo: "Cegamento", def: "Esconder de quem pontua qual condição produziu a saída." },
  groundtruth: { termo: "Ground truth", def: "O que uma resposta correta contém, fixado antes de qualquer saída e verificável a partir da própria tarefa." },
  duravel: { termo: "Aprendizado durável", def: "Conhecimento que um leitor futuro teria que redescobrir, escrito uma vez onde uma rodada posterior vai encontrar." },
  descobribilidade: { termo: "Descobribilidade", def: "A propriedade de um aprendizado aparecer para um contexto posterior e diferente sem que ninguém saiba que ele existe." },
  audit: { termo: "Audit Score + cobertura", def: "Desempenho contra a régua congelada v3.6.0: PASS/(PASS+FAIL)×100, sempre ao lado de (PASS+FAIL)/(PASS+FAIL+NÃO VERIFICADO)×100. Não é uma nota universal de design." },
  candidata: { termo: "Release candidata", def: "Uma release que muda arquitetura ou comportamento sem evidência nova. Nunca substitui a base estável de evidência." },
}
