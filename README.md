# Agent Skills

A curated collection of agent skills for AI coding agents, distilled from
classic software engineering books and hard-won practitioner experience.

## Repository layout

```
.
├── skills/                    # One directory per skill
│   └── <skill-name>/
│       ├── SKILL.md           # Required: the skill definition
│       └── references/        # Optional: long checklists and reference docs
├── .claude-plugin/            # Claude Code plugin + marketplace manifests
├── .github/workflows/         # CI: validates skills on every PR/push
├── docs/
│   └── skill-anatomy.md       # How to write a skill in this repo
├── scripts/
│   └── validate-skills.sh     # Frontmatter + catalog consistency checks
├── CONTRIBUTING.md
└── LICENSE
```

A `skills/<name>/scripts/` directory is allowed for runnable helpers but only
exists when a skill needs one.

## Available skills

| Skill | Source | What it covers |
|---|---|---|
| [`philosophy-of-software-design`](skills/philosophy-of-software-design/SKILL.md) | *A Philosophy of Software Design* (John Ousterhout, 2nd ed.) | Managing complexity: deep modules, information hiding, strategic programming, design it twice, comments first |
| [`effective-comments`](skills/effective-comments/SKILL.md) | *A Philosophy of Software Design*, Ch. 13 | Comments that add non-obvious information: precision vs. intuition, interface vs. implementation docs, cross-module design notes |
| [`obvious-code`](skills/obvious-code/SKILL.md) | *A Philosophy of Software Design*, Ch. 14+18 | Precise, consistent names and code that is obvious on first reading: naming rules, design smells, formatting, reader expectations |

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
npx skills add honeytreelabs/agent-skills --skill obvious-code                    # precise names, code obvious on first reading
```

Once installed, the skills are discovered by your agent automatically and
activate based on what you are doing — writing interface documentation
triggers `effective-comments`, naming a variable or deciphering unclear code
triggers `obvious-code`, designing a new module triggers
`philosophy-of-software-design`.

Prefer a native integration? Install as a Claude Code plugin:

```
/plugin marketplace add honeytreelabs/agent-skills
/plugin install agent-skills@honeytreelabs-agent-skills
```

> If the marketplace clone fails over SSH, use the full HTTPS URL in the
> first command: `/plugin marketplace add https://github.com/honeytreelabs/agent-skills.git`

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
- *A Philosophy of Software Design*, Ch. 16+17 — modifying existing code, consistency
  (consistency is partially covered by `obvious-code`; this skill would extend it)
- *The Pragmatic Programmer* — DRY, orthogonality, tracer bullets, boilerplate
- *Working Effectively with Legacy Code* — seams, characterization tests
- *Refactoring* (Fowler) — refactoring catalog, code smells → refactorings
- *Domain-Driven Design* — bounded contexts, ubiquitous language
