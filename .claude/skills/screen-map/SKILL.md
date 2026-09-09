---
name: screen-map
description: "Mapear cada tela e cada fluxo de um produto de referência em um screen.md por tela — fórmula de design, copy em PT-BR, estados, fluxos e o código que é a fonte da verdade. Use quando uma referência externa precisa virar um mapa de telas antes de ser construída ou traduzida; não use para revisar craft de interface (cd-interface-review) nem para decidir comportamento novo (cd-model)."
argument-hint: "[URL da referência] [diretório de saída, padrão docs/screens/<slug>]"
---

# Screen Map

**Quais telas e fluxos a referência tem, e qual é a fórmula de cada uma?**

Produz o mapa que `cd-build` implementa e `cd-verify` confere. Não decide comportamento novo: registra o que a referência faz, com o estado de verificação de cada fato.

## Quando usar

- Uma página ou produto externo vai ser reproduzido 1:1 (layout) e traduzido (conteúdo).
- Um site precisa de inventário de telas antes de qualquer decisão de build.
- Um mapa existente precisa ser reconciliado com a referência depois de uma mudança lá.

## Quando não usar

- A tela já existe localmente e a dúvida é craft — `cd-interface-review`.
- O comportamento ainda precisa ser decidido — `cd-model`.
- A pergunta é só sobre movimento — `cd-motion-review`.

## Escopo

Possui: inventário de telas, ordem das seções, tokens e grade observáveis, copy original e tradução PT-BR, estados, fluxos entre telas, evidência de cada fato e a ligação de cada tela ao código que a implementa.

Não possui: julgamento de qualidade, decisões de comportamento, implementação. Cada um é nomeado uma vez e roteado.

## Entradas

A URL da referência. O contrato `docs/screens/README.md` e o modelo `docs/screens/TEMPLATE.screen.md`. O código local existente em `src/app/` quando a tela já tem implementação.

## Procedimento

1. **Acessar a referência.** Tentar, nesta ordem: fetch direto do HTML; render com o Chromium pré-instalado (Playwright) para CSS computado e capturas; fontes secundárias (busca na web, artigos, capturas públicas). Registrar qual meio funcionou. Se nenhum meio direto funcionou, tudo o que vier de fontes secundárias é `inferred` ou `not-verified`, nunca `observed`.
2. **Inventariar telas e fluxos.** Uma tela é uma URL, um estado de rota ou uma superfície modal com propósito próprio. Um fluxo é gatilho → passos → estado final. Escrever `FLOWS.md` primeiro: ele é o índice.
3. **Por tela, extrair a fórmula.** Tokens (cor, tipografia, espaçamento, raio, sombra), grade (largura, colunas, gutters, breakpoints), hierarquia, seções em ordem, componentes, mídia. Valores computados quando houve render; caso contrário, o valor mais provável marcado como `inferred` com a regra usada.
4. **Copiar a copy.** Original verbatim quando lida; `[desconhecido]` quando não. Traduzir para PT-BR mantendo comprimento aproximado (a largura da linha é parte do layout) e registrar cada escolha de tradução que muda o sentido ou a extensão.
5. **Enumerar estados.** Vazio, carregando, parcial, erro, permissão, offline, sucesso, mais os específicos (SO detectado, autenticado, item expandido). Um estado não listado vira bug.
6. **Ligar ao código.** Preencher `source_of_truth` com os arquivos que implementam a tela. Se ainda não existem, listar os caminhos previstos e dizer que não existem. Rodar `npm run screens:sync` para gerar a seção de código; nunca escrevê-la à mão.
7. **Registrar evidência e desvios.** Cada fato de layout com estado e fonte. Cada diferença deliberada em relação à referência (fonte proprietária, mídia indisponível, link externo) em **Desvios conhecidos**.
8. **Fechar o `verification` do frontmatter** com o pior estado entre os fatos de layout, e listar em **Evidência** o que uma sessão com acesso à referência precisaria conferir.

## Autoridade de escrita

Pode escrever `docs/screens/<slug>/FLOWS.md` e `docs/screens/<slug>/<nn>-<slug>/screen.md`. Não edita código-fonte, configuração ou artefato de outra skill. Nunca commita, faz push ou abre pull request.

## Contrato de saída

```
ACESSO        <meio que funcionou: fetch | render | secundário | nenhum>
TELAS         <n> · <lista id → rota → verification>
FLUXOS        <n> · <gatilho → estado final, telas envolvidas>
TOKENS        <o que foi computado vs inferido>
COPY          <n strings · n traduzidas · n desconhecidas>
NÃO VERIFICADO <o que uma sessão com acesso precisa conferir>
DESVIOS       <diferenças deliberadas em relação à referência>
PRÓXIMO       <cd-build | reconciliar com acesso à referência>
```

## Proibido

Marcar como `observed` o que veio de fonte secundária. Inventar copy para preencher lacuna. Escrever a seção de código à mão. Decidir comportamento novo. Julgar a qualidade da referência. Omitir um estado porque a referência não o mostra.

## Dependência ausente

Referência bloqueada pela rede: dizer qual host bloqueou, mapear a partir de fontes secundárias com estado `inferred`/`not-verified`, e listar exatamente o que falta conferir. Sem Chromium: sem CSS computado, tokens ficam `inferred`. Sem código local: `source_of_truth` aponta os caminhos previstos e a seção de código fica vazia até o build.

## Conclusão

Concluído quando cada tela do inventário tem seu `screen.md` com todas as seções obrigatórias, cada fluxo de `FLOWS.md` nomeia suas telas, cada fato de layout tem estado e fonte, e `npm run screens:check` passa.

## Proveniência

Skill local deste repositório, fora do catálogo do plugin Compound Design até ter consumidor além deste projeto. O vocabulário de verificação é o de `compound-design/FINDING-CONTRACT.md`.
