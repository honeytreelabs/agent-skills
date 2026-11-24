# Implementation Plan: `obvious-code` skill

Source spec: Chapters 14 ("Choosing Names") and 18 ("Code Should be Obvious")
of *A Philosophy of Software Design* (2nd ed.), extracted from
`/workspace/a-philosophy-of-software-design-2nd-edition-2nbsped-173210221x-9781732102217.epub`
(OEBPS/part0018.xhtml and part0022.xhtml)

## Overview

Create a new agent skill, `obvious-code`, combining Chapter 14 (choosing
precise, consistent names) and Chapter 18 (making code obvious). These pair
naturally: the chapter on obviosity explicitly names good names (Ch. 14) and
consistency (Ch. 17) as the two most important techniques for making code
obvious. The skill's guiding test: a first-time reader's quick, unreflective
guess about what code does should be correct.

## Architecture Decisions

- **Name:** `obvious-code` (short, states the outcome; naming is covered as
  the primary technique, made explicit in the description triggers).
- **Structure:** `SKILL.md` + two references (same pattern as
  `effective-comments`). `references/naming-examples.md` holds the chapters'
  bad→good pairs (Sprite `block` bug, `getCount`, `blinkStatus`, `Pair`
  containers, the Go short-names debate). `references/obviousness-checklist.md`
  is the review checklist. No `scripts/`.
- **Scope boundary:** Ch. 17 (consistency) is referenced but not duplicated;
  comment-writing rules live in `effective-comments`; interface design lives
  in `philosophy-of-software-design`. This skill covers names + obviousness
  techniques + obscurity causes (event-driven code, generic containers,
  declaration/allocation mismatches, violated reader expectations).
- **Core workflow:**
  1. Judge obviousness from the reader's perspective (reviews, not author)
  2. Name for precision: create an image; avoid vague names; don't settle
     for "reasonably close"
  3. Name consistently: one name per purpose, prefixes for near-twins,
     `i`/`j` loop conventions
  4. Right-size names: avoid extra words, no type prefixes, drop class-name
     repetition; longer names for greater distance from declaration
  5. Treat "hard to pick name" as a design smell — consider refactorings
  6. Format for obviousness: whitespace to expose block structure
  7. Compensate for unavoidable obscurity: comments for event handlers,
     expectation-violating code, and paired declaration/allocation types

## Task List

### Phase 1: Skeleton
- [ ] Task 1: `skills/obvious-code/SKILL.md` frontmatter, Overview, When to
      Use (triggers + exclusions). **Dependencies:** None. **Scope:** S

### Phase 2: Core content
- [ ] Task 2: Core Workflow, Rationalizations, Red Flags (Vague Name, Hard to
      Pick Name, Nonobvious Code — the book's own red flags).
      **Dependencies:** Task 1. **Scope:** S
- [ ] Task 3: `references/naming-examples.md` — bad→good pairs from both
      chapters, annotated. **Dependencies:** Task 1. **Scope:** S
- [ ] Task 4: `references/obviousness-checklist.md`. **Dependencies:** Task 1.
      **Scope:** S

### Phase 3: Integration & verification
- [ ] Task 5: Verification section in SKILL.md; README catalog + roadmap
      update (remove Ch. 14+18 entry, add Ch. 17 note). **Dependencies:**
      Tasks 2–4. **Scope:** S
- [ ] Task 6: Validate, self-review against skill-anatomy, commit.
      **Dependencies:** Task 5. **Scope:** S

## Checkpoint: Complete
- [ ] Validator passes for all three skills
- [ ] Every rule traces to Ch. 14 or Ch. 18
- [ ] Committed

## Risks and Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|
| Overlap with `effective-comments` (names in comments vs. names) | Low | Naming here is about identifiers; comments about docs. Cross-reference both ways |
| Generic name `obvious-code` hard to trigger | Medium | Description carries concrete triggers: naming variables/methods, vague names, unclear code, review feedback |

## Open Questions
- None. Name confirmed as `obvious-code` per plan.
