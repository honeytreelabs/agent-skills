# Agent Skills

A curated collection of agent skills for AI coding agents, distilled from
classic software engineering books and hard-won practitioner experience.

## Repository layout

```
.
├── skills/                    # One directory per skill
│   └── <skill-name>/
│       ├── SKILL.md           # Required: the skill definition
│       ├── references/        # Optional: long checklists and reference docs
│       └── scripts/           # Optional: runnable helpers
├── docs/
│   └── skill-anatomy.md       # How to write a skill in this repo
└── CONTRIBUTING.md
```

## Available skills

| Skill | Source | What it covers |
|---|---|---|
| [`philosophy-of-software-design`](skills/philosophy-of-software-design/SKILL.md) | *A Philosophy of Software Design* (John Ousterhout, 2nd ed.) | Managing complexity: deep modules, information hiding, strategic programming, design it twice, comments first |
| [`effective-comments`](skills/effective-comments/SKILL.md) | *A Philosophy of Software Design*, Ch. 13 | Comments that add non-obvious information: precision vs. intuition, interface vs. implementation docs, cross-module design notes |

## Quick Start

**Fastest path — any agent, one command.** The open
[skills CLI](https://github.com/vercel-labs/skills) installs into 70+ agents
(Claude Code, Cursor, Codex, Copilot, Cline, and more):

```bash
npx skills add honeytreelabs/agent-skills            # install all skills
npx skills add honeytreelabs/agent-skills --list     # browse before installing
```

Or grab individual skills:

```bash
npx skills add honeytreelabs/agent-skills --skill philosophy-of-software-design   # deep modules, information hiding, strategic design
npx skills add honeytreelabs/agent-skills --skill effective-comments              # comments that add non-obvious information
```

Once installed, the skills are discovered by your agent automatically and
activate based on what you are doing — writing interface documentation
triggers `effective-comments`, designing a new module triggers
`philosophy-of-software-design`.

Prefer a native integration? For Claude Code, this repository can also be
installed as a plugin.

## Writing a new skill

See [`docs/skill-anatomy.md`](docs/skill-anatomy.md) for the format, then copy
an existing skill as a starting point. Rules of thumb:

- `SKILL.md` is the only required file; add `references/` only when material
  exceeds ~100 lines.
- The `description` frontmatter is what the agent sees at discovery time —
  it must state both **what** the skill does and **when** to use it.
- Keep the workflow concrete and verifiable; include rationalizations and
  red flags so agents can't talk themselves out of the process.

## Roadmap: skills from books

Planned candidates for future skills derived from books:

- *A Philosophy of Software Design*, Ch. 12+15 — why comments are worth writing, comments-first as a design tool (complements `effective-comments`)
- *A Philosophy of Software Design*, Ch. 14+18 — choosing names, code should be obvious
- *A Philosophy of Software Design*, Ch. 16+17 — modifying existing code, consistency
- *The Pragmatic Programmer* — DRY, orthogonality, tracer bullets, boilerplate
- *Working Effectively with Legacy Code* — seams, characterization tests
- *Refactoring* (Fowler) — refactoring catalog, code smells → refactorings
- *Domain-Driven Design* — bounded contexts, ubiquitous language
