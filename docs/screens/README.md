# screens

Mapa de telas e fluxos escrito no formato `screen.md`. Um diretório por produto de referência, um `screen.md` por tela.

Este diretório é memória de trabalho do projeto, não infraestrutura do framework. Ele acompanha `docs_root` em `.compound-design/config.yaml`.

## O que é um `screen.md`

Um `screen.md` é a **fórmula de design de uma tela**: tokens, grade, hierarquia, seções em ordem, componentes, estados, movimento, acessibilidade e copy — tudo em português — mais o **código que implementa essa tela**.

Regra central: **o código é a fonte da verdade do design.** A seção `## Código (fonte da verdade)` de cada `screen.md` é gerada a partir dos arquivos listados em `source_of_truth` no frontmatter, nunca escrita à mão. Quem quer mudar o design muda o código e roda o sincronizador; quem edita o bloco de código dentro do `.md` perde a edição na próxima sincronização e falha o `screens:check`.

```bash
npm run screens:sync    # regenera a seção de código de todo screen.md a partir dos arquivos-fonte
npm run screens:check   # falha se algum screen.md estiver fora de sincronia ou sem seção obrigatória
```

## Estados de verificação

O mapeamento de uma referência externa herda o vocabulário de `compound-design/FINDING-CONTRACT.md`:

- **`observed`** — lido diretamente da página de referência (DOM, CSS computado, captura de tela) nesta sessão.
- **`inferred`** — deduzido de algo observado mais uma regra nomeada (por exemplo: uma fonte terceira cita o título; a ordem das seções segue o padrão do site).
- **`not-verified`** — plausível, não checado. Precisaria de acesso à página, de um render ou de dado que a sessão não tinha.

Cada `screen.md` declara `verification` no frontmatter e cada fato de layout carrega seu estado na tabela **Evidência**. Um mapeamento feito sem acesso à página **nunca** marca `observed`.

## Estrutura

```text
docs/screens/
  README.md                       este contrato
  TEMPLATE.screen.md              modelo de screen.md
  <referência>/
    FLOWS.md                      índice de fluxos: gatilho → passos → estado final, com as telas envolvidas
    <nn>-<slug>/screen.md         uma tela
```

## Seções obrigatórias de um `screen.md`

1. `## Identidade` — nome, rota local, URL de referência, papel no fluxo, viewport de referência.
2. `## Fórmula de design` — tokens, grade, tipografia, hierarquia, ritmo vertical.
3. `## Estrutura` — seções em ordem, do topo ao rodapé, com o componente que as implementa.
4. `## Copy (PT-BR)` — tabela original → tradução → observação. Original em branco quando não foi lido.
5. `## Estados` — vazio, carregando, parcial, erro, permissão, offline, sucesso, e os específicos da tela.
6. `## Fluxos` — o que leva a esta tela, o que sai dela.
7. `## Movimento` — se existe movimento, o que dispara, duração, easing, `prefers-reduced-motion`.
8. `## Acessibilidade` — ordem de foco, nomes acessíveis, contraste computado, reflow.
9. `## Evidência` — tabela fato → estado de verificação → fonte.
10. `## Desvios conhecidos` — onde a implementação local difere da referência e por quê.
11. `## Código (fonte da verdade)` — gerada, entre `<!-- code:start -->` e `<!-- code:end -->`.

## Frontmatter

```yaml
---
id: comet-00-landing            # <referência>-<nn>-<slug>, estável
title: Comet — página inicial
reference: https://www.perplexity.ai/comet
route: /comet
verification: not-verified      # observed | inferred | not-verified — o pior estado entre os fatos de layout
date: 2026-09-09
source_of_truth:
  - src/app/comet/page.tsx
  - src/app/comet/comet.module.css
---
```
