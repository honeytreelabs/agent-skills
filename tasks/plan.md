# Implementation Plan: `effective-comments` skill

Source spec: Chapter 13 of *A Philosophy of Software Design* (2nd ed.),
extracted from `/workspace/a-philosophy-of-software-design-2nd-edition-2nbsped-173210221x-9781732102217.epub` (OEBPS/part0017.xhtml)

## Overview

Create a new agent skill, `effective-comments`, that distills Chapter 13
("Comments Should Describe Things that Aren't Obvious from the Code") into an
actionable workflow for writing and reviewing comments. The guiding principle:
comments must add information that isn't obvious from the code — either at a
lower level of detail (**precision**) or a higher level (**intuition**). The
skill covers the four comment categories, interface-vs-implementation
separation, what/why-not-how implementation comments, and cross-module design
notes.

## Architecture Decisions

- **Name:** `effective-comments` (lowercase, hyphenated, matches directory).
- **Structure:** `SKILL.md` + two references. The chapter's code examples
  (bad→good comment pairs) exceed 100 lines, so they go to
  `references/comment-examples.md`; the review checklist goes to
  `references/comment-checklist.md`. No `scripts/` — nothing runnable needed.
- **Scope boundary:** Chapter 12 (the four excuses) and Chapter 15
  (comments-first as design tool) are covered by the existing
  `philosophy-of-software-design` skill; this skill focuses on *what and how*
  to comment (Ch. 13). Cross-reference, don't duplicate.
- **Core workflow** (the spine of SKILL.md):
  1. Adopt comment conventions (use doc-tool conventions if available:
     Javadoc/Doxygen/godoc)
  2. Categorize the comment: interface / data-structure member /
     implementation / cross-module — each has different rules
  3. Choose the level of detail: precision (lower-level) or intuition
     (higher-level) — never the same level as the code
  4. Interface comments define the abstraction: behavior, args, return,
     side effects, exceptions, preconditions — no implementation details
  5. Implementation comments: what and why, not how
  6. Cross-module decisions get one authoritative home (design notes file,
     enum declarations) referenced from each dependent site
- **Rationalizations & red flags** pulled straight from the chapter:
  repeating-the-code comments, same-words-as-the-name comments, implementation
  documentation contaminating interfaces, vague variable docs, nouns-not-verbs.

## Task List

### Phase 1: Skill skeleton
- [ ] Task 1: Create `skills/effective-comments/SKILL.md` with frontmatter
      (`name`, `description` with what+when triggers, <1024 chars), Overview
      (credit Ousterhout Ch. 13), and When to Use (triggers + exclusions,
      pointing to `philosophy-of-software-design` for adjacent chapters).
      **Dependencies:** None. **Scope:** S (1 file)

### Phase 2: Core content
- [ ] Task 2: Write the Core Workflow section (the 6 steps above, each with
      concrete rules and ASCII guidance where helpful) plus Common
      Rationalizations and Red Flags sections from the chapter.
      **Dependencies:** Task 1. **Scope:** S (1 file)

- [ ] Task 3: Create `references/comment-examples.md` with the chapter's
      bad→good comment pairs: repeating-code comments, name-echoing comments,
      vague variable docs (offset, lineWidths), nouns-vs-verbs
      (receivedValidHeartbeat), high-level loop comment, IndexLookup class
      interface rewrite, isReady method rewrite, Status enum cross-module
      comment, designNotes pattern. Each pair annotated with *why* the bad
      version fails. **Dependencies:** Task 1. **Scope:** S (1 file)

- [ ] Task 4: Create `references/comment-checklist.md` — a review checklist
      mirroring the chapter's tests: "could someone who never saw the code
      write this comment?", units/boundaries/null/ownership/invariants for
      variables, interface-completeness for methods, implementation-leak
      check, cross-module discoverability. **Dependencies:** Task 1.
      **Scope:** S (1 file)

### Phase 3: Integration & verification
- [ ] Task 5: Add Verification section to SKILL.md (evidence-checkable exit
      criteria referencing the checklist) and update `README.md` skill table
      + roadmap. **Dependencies:** Tasks 2–4. **Scope:** S (2 files)

- [ ] Task 6: Run `./scripts/validate-skills.sh`, self-review against the
      skill-anatomy doc, commit.
      **Dependencies:** Task 5. **Scope:** S

## Checkpoint: Complete
- [ ] Validator passes for both skills
- [ ] SKILL.md < ~160 lines; examples and checklist live in references/
- [ ] Every claim traces back to Chapter 13 content (no invented rules)
- [ ] Committed

## Risks and Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|
| SKILL.md bloats into a chapter summary | Medium | Keep workflow imperative and terse; push examples to references |
| Description too generic to trigger | Medium | Include concrete triggers: writing interface docs, reviewing comments, vague names/units |
| Overlap with existing skill's comments-first content | Low | Explicit "When NOT to use" + cross-reference |

## Open Questions
- Skill name: `effective-comments` vs. `comments-describe-the-nonobvious`
  (closer to the chapter's principle, longer). Default: `effective-comments`.
