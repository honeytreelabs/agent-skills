---
name: effective-comments
description: Writes and reviews code comments that add information not obvious from the code, following John Ousterhout's "A Philosophy of Software Design" chapter 13. Use when writing interface/class/method documentation, documenting variables, fields, or return values, explaining tricky implementation blocks, deciding what deserves a comment, or reviewing whether existing comments are useful.
---

# Effective Comments

## Overview

Guides writing and reviewing comments around one principle: **comments should
describe things that aren't obvious from the code**. Programming languages
cannot capture all the information in the developer's mind — units, boundary
conditions, invariants, intent, rules like "always invoke `a` before `b`", and
above all abstractions. Comments record that information. Good comments sit at
a *different* level of detail than the code: lower (**precision**) or higher
(**intuition**) — never the same level, which just repeats the code.

Derived from John Ousterhout, *A Philosophy of Software Design* (2nd ed.),
Chapter 13. For when to write comments (comments-first as a design tool) and
why the common excuses fail, see the `philosophy-of-software-design` skill.

## When to Use

- Writing a class, method, function, or field comment
- Documenting variables whose units, boundaries, or meaning aren't clear
- Explaining tricky code blocks, bug fixes, or non-obvious rules
- Reviewing a diff: are the new comments useful, or do they repeat the code?
- Deciding whether a comment is needed at all
- NOT for deciding whether to write comments at all, or comments-first
  workflow — use `philosophy-of-software-design`
- NOT as a substitute for better code or better names: if something can be
  made obvious in the code itself, do that instead

## Core Workflow

### 1. Adopt conventions first

Decide what you comment and how, before writing any:

- If a doc tool exists for the language (Javadoc, Doxygen, godoc, docstrings),
  follow its conventions — imperfect but consistent and tool-processed.
- Otherwise borrow conventions from a similar language or project.
- Conventions ensure consistency *and* guarantee comments actually get
  written: no plan means no comments.

Every class gets an interface comment, every method gets an interface
comment, and every significant variable gets a comment. Commenting everything
is easier than agonizing over each exception.

### 2. Categorize the comment, then follow its rules

| Category | Where | What it must convey |
|---|---|---|
| **Interface** | Before a module/class/method declaration | The abstraction: behavior as perceived by callers |
| **Data structure member** | Next to a field/variable declaration | Exact meaning, units, boundaries, invariants |
| **Implementation** | Inside a method body | What each major block does and why; not how |
| **Cross-module** | Central notes file or the most central declaration | Dependencies spanning module boundaries |

The first two categories matter most; they define the abstraction callers
rely on.

### 3. Choose the level of detail: precision or intuition

- **Precision (lower-level):** clarify exact meaning. Primary tool for
  variable declarations, arguments, and return values. Cover:
  - Units (pixels? characters? bytes? milliseconds?)
  - Boundary conditions (inclusive or exclusive?)
  - Null semantics (is null permitted, and what does it imply?)
  - Ownership (who frees/closes the resource?)
  - Invariants ("always contains at least one entry"; also what a *missing*
    entry means)
- **Intuition (higher-level):** explain intent and give a simple mental
  model. Primary tool for interface comments and block comments. Ask: *What
  is this code trying to do? What is the simplest thing that explains
  everything in it?*
- Test: a comment at the *same* level as the code repeats the code. If you
  find one-per-line comments, you are describing the wrong level.
- When documenting variables, think **nouns, not verbs**: describe what the
  variable *represents*, not how it is manipulated.

### 4. Interface comments define the abstraction

A developer must be able to use a module correctly by reading only its
externally visible declarations plus their comments — never the body.

A method interface comment must include:

1. One or two sentences describing the behavior as callers perceive it
2. Each argument and the return value, with constraints and inter-argument
   dependencies
3. Every side effect (anything affecting future behavior that isn't part of
   the result: internal state changes, file writes)
4. Every exception that can emanate from it
5. Any preconditions (minimize them first, then document the survivors)

A class interface comment describes the overall abstraction, what each
instance represents, and limitations relevant to deciding whether to use it
(e.g., thread-safety). It omits method-level detail — individual method
comments carry that.

**Never include implementation details in an interface comment.** If the
interface documentation must describe the implementation, the module is
shallow — fix the design, not the comment. Implementation remarks that are
genuinely useful belong inside the body, separated from the interface.

### 5. Implementation comments: what and why, not how

- Most short methods need none.
- For longer methods, add one comment before each major block describing what
  it does, abstractly ("Phase 1: Scan active RPCs to see if any have
  completed."), and before non-trivial loops describe what one iteration
  accomplishes.
- Explain **why** where it isn't obvious: non-obvious bug-fix code (refer to
  the issue tracker rather than restating the report), subtle constraints,
  "how we got here" context.
- Comment important local variables only when their span is large and their
  name can't carry the meaning.

### 6. Give cross-module decisions one authoritative home

Design decisions spanning modules (protocols, error-handling schemes,
invariants shared by sender and receiver) cause many bugs and need
documentation that is *discoverable*:

- If one obvious central place exists (a shared enum, a type declaration),
  put the full checklist there — e.g., "if you add a value you must also
  update (1)… (2)… (3)…".
- Otherwise maintain a central `designNotes` file with labeled sections, and
  leave a short pointer comment at each dependent site: `// See "Zombies" in
  designNotes.`
- Do not duplicate cross-module docs at every site; duplication goes stale.

### 7. Review each comment against the non-obviousness test

For every comment, ask:

- **Could someone who has never seen the code write this comment just by
  looking at the code next to it?** If yes, delete or rewrite it.
- Does it use words that merely echo the name of the thing it documents? If
  yes, rewrite with different words that add meaning.
- "Obvious" is judged from the perspective of a **first-time reader**, not
  the author. If a reviewer says something isn't obvious, don't argue —
  clarify it, in comments or in code.

Run the full [references/comment-checklist.md](references/comment-checklist.md) before considering the work
done. Worked bad→good examples for every rule above are in
[references/comment-examples.md](references/comment-examples.md).

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "The code is self-documenting; the name says it all" | Names can't carry units, boundaries, invariants, side effects, or intent. Self-documenting code reduces the *need* for comments; it doesn't eliminate abstractions that only comments can define. |
| "This comment is close enough — it repeats the code a bit" | Repeating comments teach readers that comments are worthless, so they stop reading the ones that matter. |
| "I'll just reword the method name into a sentence" | Name-echoing comments add only words like "to". Use different words that add information. |
| "Readers can figure out the details from the code" | That forces every user of the module to reverse-engineer it. They should need only the declarations plus comments. |
| "The implementation section belongs in the interface doc so users see how clever it is" | Users don't need it; it buries the abstraction. If usage requires knowing the implementation, the module is shallow. |
| "That reviewer just didn't read carefully" | Non-obvious is defined by the reader, not the author. Fix the comment or the code. |
| "No comment needed — it's just a getter" | True occasionally, but defaulting to commenting everything is cheaper than litigating each exception. |

## Red Flags

- **Comment Repeats Code:** the comment's information is immediately obvious
  from the adjacent code, or the comment merely reassembles the words of the
  entity's name.
- **Implementation Documentation Contaminates Interface:** an interface
  comment describes internals users don't need (internal RPCs, private
  config, algorithm structure).
- **Vague documentation:** "current offset", "contains statistics" — no
  units, no entry-format, no meaning for missing entries.
- **Verb-style variable docs:** the comment narrates how the variable is
  toggled/manipulated instead of what it represents.
- **Same-level comments:** one comment per line of code, all at code level.
- **Missing interface elements:** args, return, side effects, or exceptions
  absent from a method's interface comment.
- **Duplicated cross-module docs:** the same rule restated in several files,
  already contradicting each other.
- **Cryptic interface terms:** the comment uses undefined vocabulary
  ("RESULT_READY") that a user can't be expected to know.

## Verification

After writing or reviewing comments, confirm:

- [ ] Every class, method, and significant variable has a comment following the project's conventions
- [ ] For each comment: a reader who had never seen the adjacent code could not have written it
- [ ] Variable comments state units, boundaries, null semantics, ownership, and invariants where applicable
- [ ] Method interface comments cover behavior, arguments, return value, side effects, exceptions, and preconditions — with no implementation details
- [ ] A caller could use the module from declarations + comments alone, without reading bodies
- [ ] Implementation comments describe what and why, at a higher level than the code; no line-by-line narration
- [ ] Cross-module decisions have one authoritative, discoverable home with pointers from dependent sites
- [ ] The full [references/comment-checklist.md](references/comment-checklist.md) was run on the new/changed comments
