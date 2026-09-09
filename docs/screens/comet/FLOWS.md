---
reference: https://www.perplexity.ai/comet
route_root: /comet
mapped: 2026-09-09
access: secundário            # fetch | render | secundário | nenhum
verification: inferred
---

# Comet — mapa de fluxos

Índice de todos os fluxos que um visitante pode percorrer a partir da página de referência, e das telas que cada fluxo envolve. Cada tela tem seu `screen.md` no diretório indicado.

## Acesso à referência

`www.perplexity.ai`, `web.archive.org`, `archive.ph`, `framerusercontent.com` e as galerias de capturas foram **bloqueados pela política de rede desta sessão** (403 no proxy). Nenhum fato abaixo é `observed`. O mapeamento usa:

- uma captura verbatim de terceiro da página (2026-04) — `evidencia/captura-2026-04-web-clipper.md`;
- uma análise automática de galeria de design (2026-08) — `evidencia/galeria-2026-08-lapa-ninja.md`;
- trechos de resultados de busca (imprensa, lojas de app, central de ajuda), citados por tela.

Uma sessão com acesso à referência deve rodar `screen-mapper` de novo para promover fatos a `observed` e preencher o que está `[desconhecido]`.

## Telas

| # | Tela | Rota local | Diretório | verification |
| --- | --- | --- | --- | --- |
| 00 | Página inicial (composição) | `/comet` | `00-pagina-inicial/` | inferred |
| 01 | Cabeçalho | `/comet` (topo, fixo) | `01-cabecalho/` | inferred |
| 02 | Hero | `/comet#hero` | `02-hero/` | inferred |
| 03 | Faça qualquer coisa com o Comet | `/comet` (seção 2) | `03-faca-qualquer-coisa/` | inferred |
| 04 | Ponte para a central de recursos | `/comet` (seção 3) | `04-ponte-recursos/` | inferred |
| 05 | Seu assistente pessoal (vídeo) | `/comet` (seção 4) | `05-assistente-pessoal/` | inferred |
| 06 | Perguntas frequentes | `/comet#faq` | `06-faq/` | inferred |
| 07 | Navegue com inteligência (fechamento) | `/comet` (seção 6) | `07-navegue-com-inteligencia/` | inferred |
| 08 | Rodapé · Siga o Comet | `/comet` (rodapé) | `08-siga-o-comet/` | inferred |
| 09 | Download por plataforma | `/comet/download` | `09-download/` | inferred |
| 10 | Splash de instalação (web mobile) | `/comet` (≤ 820 px) | `10-splash-mobile/` | inferred |
| 11 | Central de recursos | externa: `perplexity.ai/comet/resources` | `11-central-de-recursos/` | not-verified |

## Fluxos

### F1 · Download desktop
**Gatilho:** clique em "Baixar o Comet" (cabeçalho, hero ou fechamento).
**Passos:** 01/02/07 → 09 (detecção de SO) → link inteligente da referência (`perplexity.sng.link/Bot2p/kkat`) → instalador `.dmg` (Mac) ou `.exe` (Windows) → primeira execução: importar dados de outro navegador, definir como padrão, entrar com conta Perplexity.
**Estado final:** Comet instalado e autenticado. Os passos após o instalador acontecem fora da página (inferido de trechos da central de ajuda).
**Telas:** 01, 02, 07, 09.

### F2 · Download mobile (handoff para loja)
**Gatilho:** o mesmo CTA em um celular, ou o splash mobile (10).
**Passos:** 10 ou 02 → 09 → App Store (`id6748622471`, iOS 18+) ou Google Play (`ai.perplexity.comet`, Android 12+).
**Estado final:** app instalado. A referência memoriza a dispensa do splash no cookie `pplx.mweb-splash-page-dismissed`.
**Telas:** 02, 09, 10.

### F3 · Explorar a central de recursos
**Gatilho:** "Formas de usar o Comet" ou "Central de recursos do Comet" (04).
**Passos:** 04 → 11 (externa).
**Estado final:** visitante na central de recursos; conteúdo dela não mapeado.
**Telas:** 04, 11.

### F4 · Expandir uma pergunta frequente
**Gatilho:** clique em uma das sete perguntas (06).
**Passos:** acordeão abre; as demais permanecem como estão.
**Estado final:** resposta visível. As respostas da referência não foram capturadas; as locais são reconstruídas a partir da central de ajuda e marcadas como tal.
**Telas:** 06.

### F5 · Assistir ao vídeo
**Gatilho:** controle nativo do `<video>` em 05.
**Passos:** reprodução inline com controles do navegador.
**Estado final:** vídeo em reprodução. O arquivo da referência (`framerusercontent.com/assets/WWSEtVm3v0IJdNpE8ss9cqjlB6M.mp4`) não pôde ser baixado; localmente o player não tem fonte.
**Telas:** 05.

### F6 · Seguir o Comet
**Gatilho:** "Siga o Comet" (08).
**Passos:** 08 → `x.com/comet` (destino inferido: conta oficial do produto).
**Telas:** 08.

### Fluxos ausentes na referência
- **Entrar / criar conta** — não existe na página; acontece dentro do navegador após a instalação.
- **Assinatura (Comet Plus, Pro, Max)** — não existe na página; preços vivem fora dela.
- **Troca de idioma** — rotas localizadas existem (`/comet/pt`), mas um seletor no cabeçalho ou rodapé é `[desconhecido]`.

## Histórico da página (para reconciliação)

| Período | Estado |
| --- | --- |
| fev–jun 2025 | teaser em `comet.perplexity.ai`: "Comet: A Browser for Agentic Search" + lista de espera |
| 9 jul 2025 | lançamento para Max; seções ancoradas (`/#values`) |
| 2 out 2025 | gratuito para todos; página vira uma página de download simples |
| nov 2025 / mar 2026 | Android e iOS entram na linha de plataformas |
| abr 2026 | estrutura mapeada aqui (captura verbatim) |
| ago 2026 | galeria confirma tema claro e vídeo full-bleed |
