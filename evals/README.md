# Skill Evals

How this repo measures whether its skills actually work: that they **trigger**
when they should, **stay distinct** from each other, and define **behavioral
expectations** that can be graded from an agent transcript.

Adapted from the three-tier model used by
[addyosmani/agent-skills](https://github.com/addyosmani/agent-skills), which
itself builds on Anthropic's skill-creator `evals.json` schema.

## The three tiers

| Tier | What it checks | Runs | Cost |
|---|---|---|---|
| 1. Structural | Frontmatter, naming, README catalog entry, relative links, manifest JSON | CI (`scripts/validate-skills.sh`) | Free |
| 2. Trigger & routing | Positive prompts rank their skill #1 by lexical coverage; negative prompts don't rank any skill; descriptions don't near-collide | CI (`scripts/eval-triggers.js`) | Free |
| 3. Behavioral | An agent following the skill satisfies its `cases[].expectations[]` | On demand (manual or scripted) | Tokens |

Tier 2 is a **lexical approximation** of routing (stopword-filtered token
prefix matching against each skill's description). It cannot judge semantics —
that is Tier 3's job — but it catches the two failure modes that dominate real
trigger bugs: a description missing the vocabulary users actually say (false
negative), and an over-broad description that outranks the right skill (false
positive). A Tier-2 failure usually means *fix the description, not the eval*.

## Layout

```
evals/
  <skill-name>/
    evals.json     # prompts.positive[], prompts.negative[], cases[]
```

The `prompts` section feeds Tier 2. The `cases` section defines Tier 3:
each case has an integer `id`, a `kind` (`execution` for tasks that edit
files, `dialogue` for skills whose deliverable is the conversation itself),
a realistic `prompt`, and `expectations[]` — observable facts a grader can
check in the agent's transcript or the resulting diff.

## Running

```bash
# Tier 1 + manifests + Tier 2 — deterministic, runs in CI
./scripts/validate-skills.sh
node scripts/eval-triggers.js
```

Thresholds live at the top of `scripts/eval-triggers.js`:

- `MIN_POSITIVE_COVERAGE` (0.20) — a positive prompt must reach this coverage
  of its target skill's description *and* rank it first
- `MAX_NEGATIVE_COVERAGE` (0.25) — no skill may rank above this for a
  negative prompt (negative prompts need ≥ 4 routable tokens to be meaningful)
- `MAX_JACCARD` (0.45) — pairwise description similarity limit

## Tier 3: behavioral grading (manual)

There is no automated runner yet; grade cases manually with a fresh agent
session:

1. **Execution cases:** create a scratch git repo, materialize the scenario
   described in the case prompt (write the failing/ugly code it references),
   then run the agent with the skills installed. Let it edit and commit.
2. **Dialogue cases:** start a fresh conversation with the skills installed
   and paste the prompt verbatim.
3. **Grade:** check the transcript and final diff against each expectation.
   An expectation passes only if the transcript/diff shows evidence — a
   claim without evidence fails. Record per-case pass/fail in a PR note.

Suggested cadence: run Tier 3 for all skills before a version tag, and after
any change to a skill's workflow sections (Core Workflow, Rationalizations,
Red Flags) — description-only changes only need Tier 2.

## Adding evals

- Add positive prompts phrased the way a **user would actually say it** —
  including the vocabulary the skill's description carries. If a realistic
  prompt can't route, the description is wrong.
- Negative prompts must be genuinely out-of-domain for the whole catalog
  (≥ 4 routable tokens). A prompt that correctly belongs to another skill is
  a positive prompt for that skill, not a negative.
- Every behavioral case needs at least 3 expectations, phrased as observable
  facts, not intentions ("The agent renames to a predicate-style name", not
  "The agent considers naming").
