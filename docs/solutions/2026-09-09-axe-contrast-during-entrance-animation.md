---
id: CD-SOL-20260909-01
title: Automated contrast checks must run on the page at rest, after entrance animations settle
date: 2026-09-09
areas: [site, accessibility, motion, checks]
concepts: [contrast, axe, animation, opacity, verification]
applies_to: any page whose text fades or settles in on load and is checked by an automated accessibility tool
signals: ["color-contrast", "axe.run", "animation-delay", "opacity: 0.35", "prefers-reduced-motion", "requestfailed", "ERR_ABORTED"]
supersedes: null
status: active
---

# Automated contrast checks must run on the page at rest

## What happened

The site's deterministic check ran axe-core immediately after `networkidle`. On `/project` it reported nine `color-contrast` violations of impact *serious* on the timeline markers. The colours were fine: the markers were mid-way through a 600 ms settle animation from `opacity: 0.35`, staggered by up to a second, and axe measures the contrast of the text as painted at that instant.

A second false signal came from the same run: Playwright reported `requestfailed` for `Link` prefetches that the browser aborted when the page was closed (`net::ERR_ABORTED`) — not a broken asset.

## The rule

An automated accessibility check is a measurement of the page **at rest**. Wait for entrance animations to finish (or run with reduced motion) before measuring, and treat an aborted prefetch as noise, not a failure. Otherwise the check reports the animation, not the design — and a team that trusts it either "fixes" colours that were correct or learns to ignore the tool.

## The fix that was applied

`scripts/site-check.mjs` waits 1.6 s after `networkidle` before injecting axe, and ignores `requestfailed` events whose error is `ERR_ABORTED`. The one real contrast failure found the same day — the third grey (`--faint`) at 3.2:1 on the ground — was fixed by raising it to 4.8:1, and is recorded separately from the false ones.

## Why it is worth keeping

The same tool on the same page can produce a serious-looking failure and a clean pass a second apart. Anyone adding an entrance animation to a checked page will hit this again, and the first instinct is to change colours. This note exists so the next check is written against the page at rest from the start.
