#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const registryPath = path.resolve(here, '../registry/resource-registry.json');
const allowedCel = new Set(['E0', 'E1', 'E2', 'E3', 'E4']);
const forbiddenCertification = /(?:claude|anthropic|openai|promptfoo)\s+(?:approved|certified)/i;

export function lintRegistry(registry) {
  const errors = [];
  if (registry.framework !== 'Compound Design') errors.push('framework must be Compound Design');
  if (!/^\d+\.\d+\.\d+$/.test(registry.release ?? '')) errors.push('release must use semver');
  if (!Array.isArray(registry.resources) || registry.resources.length === 0) errors.push('resources must be a non-empty array');
  const ids = new Set();
  for (const resource of registry.resources ?? []) {
    const prefix = resource.id ? `[${resource.id}]` : '[unknown]';
    if (!resource.id || ids.has(resource.id)) errors.push(`${prefix} id missing or duplicated`);
    ids.add(resource.id);
    if (!/^\d+\.\d+\.\d+$/.test(resource.version ?? '')) errors.push(`${prefix} invalid semver`);
    if (!allowedCel.has(resource.cel)) errors.push(`${prefix} invalid CEL`);
    if (typeof resource.cdqi !== 'number' || resource.cdqi < 0 || resource.cdqi > 10) errors.push(`${prefix} CDQI must be 0..10`);
    if (!resource.job || !resource.triggers?.length || !resource.nonGoals?.length) errors.push(`${prefix} missing contract fields`);
    if (!resource.upstream?.length || !resource.provenance) errors.push(`${prefix} provenance/upstream required`);
    if ((resource.cel === 'E0' || resource.cel === 'E1') && resource.runtimeUplift !== 'not measured') errors.push(`${prefix} E0/E1 runtime uplift must remain not measured`);
    if (!Array.isArray(resource.evidenceDebt)) errors.push(`${prefix} evidenceDebt must be an array`);
    const text = JSON.stringify(resource);
    if (forbiddenCertification.test(text)) errors.push(`${prefix} vendor-certification language is forbidden`);
  }
  return errors;
}

function selfTest() {
  const base = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
  const mutations = [
    ['duplicate id', r => { r.resources[1].id = r.resources[0].id; }],
    ['inflated E1 uplift', r => { r.resources[0].runtimeUplift = '+20%'; }],
    ['invalid CDQI', r => { r.resources[0].cdqi = 11; }],
    ['missing provenance', r => { r.resources[0].upstream = []; }],
    ['invalid CEL', r => { r.resources[0].cel = 'E9'; }],
    ['vendor certification', r => { r.resources[0].job = 'Claude Approved resource for orchestration'; }]
  ];
  let passed = 0;
  for (const [name, mutate] of mutations) {
    const candidate = structuredClone(base);
    mutate(candidate);
    const errors = lintRegistry(candidate);
    if (errors.length === 0) throw new Error(`mutation escaped lint: ${name}`);
    passed += 1;
  }
  console.log(`cd-lint self-test: ${passed}/${mutations.length} mutations rejected`);
}

const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
const errors = lintRegistry(registry);
if (errors.length) {
  console.error('cd-lint failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`cd-lint passed: ${registry.resources.length} resources, release ${registry.release}, CEL ${registry.evidencePolicy.currentLevel}`);
}
if (process.argv.includes('--self-test')) selfTest();
