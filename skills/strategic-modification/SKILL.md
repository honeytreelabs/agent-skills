---
name: strategic-modification
description: Modifies existing code while keeping the design clean and conventions consistent, following John Ousterhout's "A Philosophy of Software Design" chapters 16 and 17. Use when changing existing code, fixing bugs in unfamiliar modules, adding features to a mature system, maintaining comments while editing, deciding whether to refactor or quick-fix, or reviewing a change for consistency with existing conventions.
---

# Strategic Modification

## Overview

Guides changes to existing code around two principles. **Stay strategic:**
ideally, when you finish each change, the system has the structure it would
have had if you had designed it from the start with that change in mind —
each minimal "smallest possible change" piles on special cases that make the
design a bit worse, and the damage accumulates. **Stay consistent:** similar
things are done in similar ways and dissimilar things differently; familiar-looking
patterns must mean what they meant last time. Includes comment maintenance
under change: stale comments erode trust in *all* comments.

Derived from John Ousterhout, *A Philosophy of Software Design* (2nd ed.),
Chapters 16 and 17. For writing comment content use `effective-comments`;
for naming use `obvious-code`; for designing new modules use
`philosophy-of-software-design`.

## When to Use

- Fixing bugs or adding features in existing code
- Touching code you didn't write (or wrote long ago)
- Deciding between a quick fix and a refactoring
- Updating code whose comments may go stale after your change
- Tempted to record important information in a commit message
- Reviewing someone else's change for consistency and comment staleness
- NOT for writing new comments from scratch — use `effective-comments`
- NOT for designing green-field modules — use `philosophy-of-software-design`
- NOT for choosing names — use `obvious-code`

## Core Workflow

### 1. Change with the end-state in mind

Before editing, ask: *if this system had been designed from the start with
this change in mind, what would its structure be?* If the current structure
isn't that, refactor toward it as part of the change — don't bolt the new
behavior onto the old shape.

- Resist the smallest-possible-change mindset: each minimal change adds a few
  special cases, dependencies, or duplicated state, and the system design
  gets a bit worse with every step of evolution.
- Even if your change needs no refactoring, fix design imperfections you
  encounter in code you're already touching. **If you're not making the
  design better, you are probably making it worse.**

### 2. Be honest about constraints

Sometimes the full refactoring genuinely doesn't fit: a three-month redesign
against a two-hour deadline, or incompatibilities affecting many teams. Then:

- Ask: *is this the best I can possibly do for a clean design given my
  current constraints?* There is often a middle path that is nearly as clean
  but takes days, not months.
- Take the quick fix only under real pressure — and schedule the cleanup
  afterward (with your team/manager if needed). Every organization should
  spend a small fraction of its effort on cleanup; it pays for itself.
- Record the debt where it will be seen (a comment at the compromise point
  and a tracking issue), not just in a commit message.

### 3. Keep comments near the code and correct

Your change probably invalidates some existing comments; update what it
invalidates, and place things so future changes stay updatable:

- The farther a comment is from its code, the less likely it gets updated —
  keep interface comments next to the code they describe (in languages with
  headers, prefer the implementation file; tools extract docs for users).
- Push implementation comments down to the **narrowest scope** covering the
  code they describe: one comment per phase, just above that phase — not one
  block narrating the whole method. A short overall-strategy comment at the
  top ("three phases: find candidates, score, choose") is fine.
- The farther a comment is from the code, the more abstract it should be —
  abstraction is what makes it survive code changes.

### 4. Move information from commit messages into code

Commit messages are the wrong home for information developers will need
later: nobody scans the log when reading code. When writing a commit
message, ask whether a future developer will need that information — if yes,
document it **in the code** (e.g., the subtle constraint that motivated the
change, so nobody "cleans it up" and re-creates the bug). Copying it into
the commit message too is fine; the code comment is what matters.

### 5. Document each decision exactly once

Duplication guarantees staleness: some copies won't get updated, and nothing
signals that they're stale.

- For a decision affecting several sites, pick the most obvious single home
  (typically the declaration comment) and leave short pointers elsewhere:
  "See the comment in xyz for an explanation."
- No obvious home? Use a central design-notes file with a labeled section,
  referenced from each dependent site (see `effective-comments`).
- Don't redocument one module's decisions in another module (e.g., a comment
  at a call site explaining what the callee does — the callee's interface
  comment owns that).
- Already documented outside the code (an RFC, a protocol spec, a user
  manual)? Reference it — `// Implements the Foo command; see the user
  manual for details.` — don't copy it into the code.

### 6. Diff-check before committing

Before committing, scan the full diff and verify: every behavior change is
reflected in the affected comments; no debugging code left behind; no stale
TODOs you claimed to fix. This is also where comment-and-code drift is
caught cheapest.

### 7. Stay consistent with existing conventions

- **When in Rome:** in a new file, look around first. Declaration order,
  brace style, camelCase vs. snake_case, error-handling idiom — anything that
  might be a convention, follow it. For design decisions, assume a similar
  decision exists somewhere; find it and mimic it.
- **Don't change existing conventions mid-change.** Having a "better idea" is
  not a sufficient excuse for inconsistency. Before upgrading a convention,
  ask: (1) do you have significant new information that didn't exist when it
  was established? (2) is the new way so much better that updating all
  existing uses is worth it? Both yes — then convert *everything*, leaving no
  trace of the old convention. Otherwise follow the old way.
- Enforce conventions with tools where possible (linters, pre-commit
  checks), and flag violations in code review — nit-picky review is how
  teams learn conventions quickly.
- **Don't over-apply it:** consistency also means dissimilar things are done
  *differently*. Forcing genuinely different things into one shape (same
  name for different concepts, a pattern that doesn't fit) creates confusion.
  Consistency works only when "if it looks like an x, it really is an x."

Run `references/modification-checklist.md` before finishing; worked examples
are in `references/consistency-examples.md`.

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "Smallest possible change is safest" | Minimal changes accumulate special cases and dependencies; design degrades with every step. The *refactored* change is often no riskier and leaves the code better. |
| "I'm not familiar with this code, better not touch much" | Unfamiliarity argues for understanding the design before editing, not for bolting on special cases. Strategic change includes reading why it's shaped as it is. |
| "Refactoring can come later, ship the fix" | Later means never without scheduling: take the quick fix under real pressure, but book the cleanup and record the debt visibly. |
| "It's one inconsistent spot, nobody will notice" | Readers assume familiar-looking patterns behave consistently; one violation makes every similar-looking spot untrustworthy. |
| "My idea is better, I'll use it in my new code" | A better idea is not a sufficient excuse. Convert all uses (both upgrade questions yes) or follow the existing convention. |
| "The full explanation is in the commit message" | Nobody scans logs while reading code. Future-needed information belongs in comments; the commit message is at most a copy. |
| "I updated the behavior, comments are close enough" | Stale comments make readers distrust all comments. Diff-check: every changed behavior reflected in comments. |
| "I'll copy the spec into comments so it's all in one place" | Duplicated external docs go stale silently. Reference the source; document each decision exactly once. |

## Red Flags

- A change that adds special cases instead of absorbing the new behavior into
  the existing abstraction
- Comments above or beside code that no longer match the behavior in the diff
- Important rationale existing only in a commit message or PR description
- The same rule documented in several places, already drifting apart
- A call-site comment explaining the callee's internals instead of pointing
  at its interface comment
- New code in a file that ignores the file's existing style or idioms
- A convention "improvement" applied in one place while old uses remain
- The same name or pattern used for genuinely different things (over-applied
  consistency)
- Debug code or unresolved TODOs in the diff about to be committed

## Verification

Before considering the change complete, confirm:

- [ ] The change leaves the codebase with the structure it would have had if designed with this change from the start — or a scheduled, recorded follow-up covers the gap
- [ ] At least one small design improvement was made in touched code (or none was needed)
- [ ] Every comment invalidated by the change was updated; the full diff was scanned for comment/code drift, debug leftovers, and stale TODOs
- [ ] Information a future developer needs lives in code comments, not only in the commit message
- [ ] Each affected design decision is documented exactly once, with pointers from dependent sites
- [ ] External documentation is referenced, not duplicated
- [ ] New code follows the conventions of its surrounding file/project; any convention upgrade converted all uses (both upgrade questions answered yes)
- [ ] Dissimilar things were *not* forced into a common shape
- [ ] The full `references/modification-checklist.md` was run
