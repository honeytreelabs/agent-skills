#!/usr/bin/env node
/**
 * Tier-2 evals: trigger & routing check for the skill catalog.
 *
 * Deterministic, CI-safe, no dependencies. For each skill described in
 * evals/<skill>/evals.json:
 *
 *   - positive prompts must rank that skill #1 by lexical coverage of its
 *     SKILL.md description (the vocabulary a user would actually say)
 *   - negative prompts must not rank any skill above a floor
 *   - no two skill descriptions may be near-collisions (Jaccard similarity)
 *
 * A failure usually means "fix the description, not the eval": either the
 * description is missing vocabulary users say, or it is so broad it outranks
 * the right skill.
 *
 * Lexical matching is an approximation of routing; it cannot judge semantics.
 * Behavioral correctness is Tier 3 (see evals/README.md).
 *
 * Usage: node scripts/eval-triggers.js
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const EVALS_DIR = path.join(ROOT, 'evals');

// Words ignored for routing: common English glue plus the shared book-title
// vocabulary that appears in every description and carries no routing signal.
const STOPWORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'if', 'in',
  'into', 'is', 'it', 'its', 'of', 'on', 'or', 'that', 'the', 'this', 'to',
  'use', 'used', 'uses', 'using', 'when', 'with', 'you', 'your',
  'following', 'john', 'ousterhout', 'philosophy', 'software', 'design',
  'designs', 'chapters', 'chapter',
]);

const MIN_POSITIVE_COVERAGE = 0.20; // positive prompt: target skill coverage floor
const MAX_NEGATIVE_COVERAGE = 0.25; // negative prompt: no skill may exceed this
const MIN_NEGATIVE_TOKENS = 4;      // negatives shorter than this are unreliable
const MAX_JACCARD = 0.45;           // description pair collision threshold

function tokenize(text) {
  return text
    .toLowerCase()
    .split(/[^a-z]+/)
    .filter((w) => w.length > 1 && !STOPWORDS.has(w));
}

// Prefix match (shorter word >= 3 chars) stands in for stemming:
// "document" ~ "documentation", "review" ~ "reviewing", "bug" ~ "bugs".
function matches(a, b) {
  const [short, long] = a.length <= b.length ? [a, b] : [b, a];
  return short.length >= 3 && long.startsWith(short);
}

function extractDescription(skillName) {
  const skill = fs.readFileSync(
    path.join(ROOT, 'skills', skillName, 'SKILL.md'), 'utf8');
  const m = skill.match(/^description:\s*(.+)$/m);
  if (!m) throw new Error(`no description frontmatter for skill '${skillName}'`);
  return m[1];
}

function jaccard(a, b) {
  const A = new Set(a);
  const B = new Set(b);
  const inter = [...A].filter((x) => B.has(x)).length;
  return inter / (A.size + B.size - inter);
}

function rank(promptTokens, descriptions) {
  const promptTokensUniq = [...new Set(promptTokens)];
  return Object.entries(descriptions)
    .map(([skill, tokens]) => {
      const covered = promptTokensUniq.filter((t) =>
        tokens.some((d) => matches(t, d))
      ).length;
      return { skill, coverage: covered / promptTokensUniq.length };
    })
    .sort((a, b) => b.coverage - a.coverage);
}

let errors = 0;
const fail = (msg) => {
  console.error(`FAIL: ${msg}`);
  errors++;
};

const evals = {};
for (const dir of fs.readdirSync(EVALS_DIR).sort()) {
  const skillDir = path.join(EVALS_DIR, dir);
  if (!fs.statSync(skillDir).isDirectory()) continue;
  const file = path.join(skillDir, 'evals.json');
  if (!fs.existsSync(file)) continue;
  evals[dir] = { ...JSON.parse(fs.readFileSync(file, 'utf8')), skillDir };
}

if (Object.keys(evals).length === 0) {
  console.error('FAIL: no evals.json found under evals/');
  process.exit(1);
}

// Descriptions come from SKILL.md (single source of truth), keyed by the
// skill name declared in the frontmatter-adjacent directory.
const descriptions = {};
for (const [name, data] of Object.entries(evals)) {
  const skillName = data.skill || name;
  if (!fs.existsSync(path.join(ROOT, 'skills', skillName, 'SKILL.md'))) {
    fail(`evals/${name} refers to unknown skill '${skillName}'`);
    continue;
  }
  descriptions[skillName] = tokenize(extractDescription(skillName));
}

// 1. Positive prompts must rank their skill first.
for (const [name, data] of Object.entries(evals)) {
  const skillName = data.skill || name;
  for (const prompt of data.prompts?.positive ?? []) {
    const promptTokens = tokenize(prompt);
    if (promptTokens.length === 0) {
      fail(`${name}: positive prompt has no routable tokens: "${prompt}"`);
      continue;
    }
    const ranked = rank(promptTokens, descriptions);
    const top = ranked[0];
    console.log(
      `  "${prompt.slice(0, 60)}${prompt.length > 60 ? '…' : ''}"` +
        ` -> ${top.skill} (${(top.coverage * 100).toFixed(0)}%)`
    );
    if (top.skill !== skillName) {
      fail(`${name}: positive prompt routes to '${top.skill}' instead of '${skillName}'`);
    } else if (top.coverage < MIN_POSITIVE_COVERAGE) {
      fail(
        `${name}: positive prompt coverage ${(top.coverage * 100).toFixed(0)}% ` +
          `below floor ${(MIN_POSITIVE_COVERAGE * 100).toFixed(0)}%`
      );
    }
  }
  // 2. Negative prompts must not strongly match any skill.
  for (const prompt of data.prompts?.negative ?? []) {
    const promptTokens = tokenize(prompt);
    if (promptTokens.length < MIN_NEGATIVE_TOKENS) {
      fail(
        `${name}: negative prompt too short to be meaningful ` +
          `(${promptTokens.length} tokens < ${MIN_NEGATIVE_TOKENS})`
      );
      continue;
    }
    const ranked = rank(promptTokens, descriptions);
    const top = ranked[0];
    console.log(
      `  [neg] "${prompt.slice(0, 54)}${prompt.length > 54 ? '…' : ''}"` +
        ` -> ${top.skill} (${(top.coverage * 100).toFixed(0)}%)`
    );
    if (top.coverage >= MAX_NEGATIVE_COVERAGE) {
      fail(
        `negative prompt routes too strongly to '${top.skill}' ` +
          `(${(top.coverage * 100).toFixed(0)}% >= ${(MAX_NEGATIVE_COVERAGE * 100).toFixed(0)}%)`
      );
    }
  }
}

// 3. Description near-collision check.
const names = Object.keys(descriptions).sort();
for (let i = 0; i < names.length; i++) {
  for (let j = i + 1; j < names.length; j++) {
    const sim = jaccard(descriptions[names[i]], descriptions[names[j]]);
    if (sim >= MAX_JACCARD) {
      fail(
        `descriptions of '${names[i]}' and '${names[j]}' near-collide ` +
          `(Jaccard ${sim.toFixed(2)} >= ${MAX_JACCARD})`
      );
    }
  }
}

// 4. Behavioral cases must be well-formed (graded in Tier 3).
for (const [name, data] of Object.entries(evals)) {
  for (const c of data.cases ?? []) {
    if (typeof c.id !== 'number') fail(`${name}: case missing numeric id`);
    if (!c.prompt) fail(`${name}: case ${c.id} missing prompt`);
    if (!Array.isArray(c.expectations) || c.expectations.length === 0) {
      fail(`${name}: case ${c.id} missing expectations[]`);
    }
    if (c.kind && !['execution', 'dialogue'].includes(c.kind)) {
      fail(`${name}: case ${c.id} has unknown kind '${c.kind}'`);
    }
  }
}

console.log(
  errors === 0
    ? `OK: ${Object.keys(evals).length} skill eval(s) pass trigger & routing checks`
    : `${errors} error(s)`
);
process.exit(errors === 0 ? 0 : 1);
