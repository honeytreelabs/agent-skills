# Skill Anatomy

How skill files are structured in this repository. Adapted from the
[agent skills spec](https://agentskills.io).

## File Location

Every skill lives in its own directory under `skills/`:

```
skills/
  skill-name/
    SKILL.md           # Required: the skill definition
    references/        # Optional: reference docs loaded on demand
    scripts/           # Optional: runnable helpers
```

`SKILL.md` is the only required file. Add `references/` or `scripts/` only
when the skill actually needs them.

## SKILL.md Format

### Frontmatter (Required)

```yaml
---
name: skill-name-with-hyphens
description: Guides agents through [task/workflow]. Use when [trigger conditions].
---
```

**Rules:**
- `name`: lowercase, hyphen-separated, must match the directory name.
- `description`: starts with what the skill does in third person, then one or
  more "Use when" trigger conditions. Max 1024 characters. It is injected into
  the agent's context at discovery time, so it must contain both *what* and
  *when* — never a summary of the workflow steps (the agent would follow the
  summary instead of reading the skill).

### Recommended Sections

```markdown
# Skill Title

## Overview
One-two sentences: what this skill does and why it matters.
Credit the source book/paper if the skill is derived from one.

## When to Use
- Triggering conditions
- When NOT to use (exclusions)

## Core Workflow
Numbered, actionable steps. Concrete commands over vague advice.
Use ASCII flowcharts where decision points exist.

## Key Principles / Techniques
Detailed guidance for specific scenarios, with examples.

## Common Rationalizations
| Rationalization | Reality |
|---|---|
| Excuse to skip a step | Why the excuse is wrong |

## Red Flags
- Observable signs the skill is being violated

## Verification
- [ ] Exit criteria, each verifiable with evidence
```

### Section Purposes

- **Overview** — the elevator pitch.
- **When to Use** — positive triggers and negative exclusions.
- **Core Workflow** — the heart. Must be specific: "Run `npm test` and verify
  all tests pass", not "make sure the tests work".
- **Common Rationalizations** — excuses agents use to skip steps, paired with
  rebuttals. This prevents the agent from rationalizing its way out of the
  process.
- **Red Flags** — observable violations, useful in review and self-monitoring.
- **Verification** — exit criteria checkable with evidence.

## Supporting Files

Create supporting files only when:
- Reference material exceeds ~100 lines (keep SKILL.md focused)
- Runnable scripts are needed
- Checklists are long enough to justify a separate file

Keep patterns and principles inline when under 50 lines. Never create empty
`scripts/` or `references/` directories just to mirror other skills.
