---
name: obvious-code
description: Chooses precise, consistent names and writes code whose meaning is obvious on first reading, following John Ousterhout's "A Philosophy of Software Design" chapters 14 and 18. Use when naming variables, methods, or classes, renaming vague identifiers, making code easier to understand, receiving review feedback like "what does this do?", or deciding how to handle unavoidably obscure code such as event handlers or generic containers.
---

# Obvious Code

## Overview

Guides naming and code clarity around one test: **a first-time reader who
reads the code quickly, without much thought, should guess its behavior
correctly**. Obscurity is one of the two main causes of complexity — it forces
readers to spend time and energy gathering information, and invites
misunderstanding and bugs. The two most powerful tools are **precise,
consistent names** and **conformance to reader expectations**; when obscurity
is unavoidable, targeted comments compensate.

Derived from John Ousterhout, *A Philosophy of Software Design* (2nd ed.),
Chapters 14 and 18. Comment-writing rules live in `effective-comments`;
interface and abstraction design live in `philosophy-of-software-design`.

## When to Use

- Naming a variable, method, class, or argument — or stuck choosing a name
- A name is vague, generic (`result`, `status`, `data`, `count`), or ambiguous
- Reviewing code for readability, or answering "what does this do?" feedback
- Deciding how to document event-driven code, generic containers, or code
  that violates reader expectations
- Formatting or structuring code blocks for scannability
- NOT for writing the comments themselves — use `effective-comments`
- NOT for module/interface design decisions — use `philosophy-of-software-design`

## Core Workflow

### 1. Judge obviousness from the reader's perspective

"Obvious" is in the mind of the reader, not the author. It is easier to spot
obscurity in someone else's code, so:

- Use code review as the primary measurement: **if a reader says it isn't
  obvious, it isn't obvious** — don't argue; find out what confused them.
- Ask for each entity: *if someone saw this name in isolation, without its
  declaration, documentation, or usage, how closely could they guess what it
  refers to?*

### 2. Name for precision

A name is a form of abstraction: a few words (two or three at most) that
create an image in the reader's mind — conveying what the entity is *and what
it is not*.

- Never settle for a name that is merely "reasonably close". Take the extra
  time; mediocre names compound across thousands of variables and cause bugs
  (a single ambiguous `block` name once caused a six-month data-corruption
  hunt).
- **Vague names are the most common failure.** Replace broad nouns: `count`
  → `numActiveIndexlets`; `x`/`y` for text positions → `charIndex`/
  `lineIndex`; `blinkStatus` → `cursorVisible`.
- **Booleans must be predicates**: the name should tell readers what `true`
  means (`cursorVisible`, `receivedValidHeartbeat` — never `blinkStatus`).
- Name the special meaning of sentinel values: `VOTED_FOR_SENTINEL_VALUE` →
  `NOT_YET_VOTED`.
- Don't use `result` for values that are *not* the return value — name what
  they actually are (`mergedLine`, `totalChars`). `result` is acceptable in
  methods that return it.
- Distinguish confusable names: `socket` vs. `sock` → `sock_base` vs.
  `inet_sock`.
- Names can also be **too specific**: an argument named `selection` on a
  method that deletes any text range should be `range`.
- Exception: short generic names (`i`, `j`) are fine for loop variables in
  loops short enough to see at once.

### 3. Name consistently

For each commonly recurring concept, pick one name and enforce three rules:

1. Always use that name for that purpose (`fileBlock` always means a block
   index within a file).
2. Never use that name for anything else — two behaviors under one name is
   what made the `block` bug possible.
3. Keep the purpose narrow enough that all variables with that name really
   do behave the same.

When you need near-twins, keep the common name and add a distinguishing
prefix: `srcFileBlock`, `dstFileBlock`. In nested loops, always use `i` for
the outermost loop, `j` for the next level — readers can then make safe
assumptions on sight.

### 4. Right-size names

- Every word in a name must add information. Drop generic filler nouns
  (`fileObject` → `file`).
- No type prefixes or Hungarian notation — modern IDEs show types on demand.
- Don't repeat the class name in an instance variable (`File.fileBlock` →
  `File.block`), unless the class holds multiple kinds.
- Scale name length to distance: **the greater the distance between a name's
  declaration and its uses, the longer the name should be.** Short loop
  variables are fine precisely because declaration and use are adjacent.

### 5. Treat "hard to name" as a design smell

If you struggle to find a name that is precise, intuitive, and short, the
underlying entity probably lacks a clean definition. Don't force the name —
fix the design:

- Is one variable secretly representing several things? Split it.
- Is the abstraction muddled? Re-factor, then name the cleaner parts.

Naming is a design tool: the difficulty of choosing a good name exposes
design weaknesses early.

### 6. Format for obviousness

- Use whitespace to expose structure: blank lines between major blocks of a
  method, ideally with a one-line comment at the top of each block (see
  `effective-comments` for what that comment should say).
- Space out dense statements (`for(int pass=1;pass>=0&&!empty;pass--)` →
  `for (int pass = 1; pass >= 0 && !empty; pass--)`).
- In documentation blocks, use indentation so parameter boundaries are
  scannable.

### 7. Compensate for unavoidable obscurity

Some constructs are inherently hard to follow. When you must use them,
document the missing information at the point of confusion:

- **Event-driven code:** handlers are invoked indirectly and can't be traced
  statically. State *when* each handler is invoked in its interface comment
  ("invoked in the dispatch thread by a transport if a transport-level error
  prevents an RPC from completing").
- **Reader-expectation violations:** code that does something surprising must
  say so — e.g., a `main` whose constructor spawns threads that keep running
  after `main` returns deserves a comment at the end of `main`, in addition
  to the constructor's interface comment.
- Prefer constructs that conform to expectations; if you deviate, document.
  Software should be **designed for ease of reading, not ease of writing**.

Run [references/obviousness-checklist.md](references/obviousness-checklist.md) before finishing; worked bad→good
examples are in [references/naming-examples.md](references/naming-examples.md).

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "`block` is a reasonably close name, good enough" | Close-but-vague names invite silent misuse; the Sprite `block` bug cost six months. Take the extra minute. |
| "The Go style guide says short names are more readable" | Readability is judged by readers, not writers. Short names are fine only when used *consistently* for one meaning and close to their declaration; ambiguous reuse (`ch`, `d`) causes the same confusion as `block`. |
| "It's just one mediocre name" | Complexity is incremental — thousands of slightly-vague names add up to a system nobody can trust on first reading. |
| "The type is in the name (`filePtr`), so readers know" | IDEs resolve types instantly; type prefixes add clutter, not information. |
| "Pair<key,value> saves me defining a class" | Generic containers force every reader to decode `getKey()`/`getValue()`. Define a specialized class with meaningful names — ease of reading over ease of writing. |
| "Declaring `List` and allocating `ArrayList` is idiomatic" | The mismatch hides performance and thread-safety properties from readers of the declaration. Match them. |
| "I understand my own code fine" | Obviousness is a property of the reader's experience. If a reviewer says it's obscure, it's obscure. |
| "Renaming is cosmetic; the logic is what matters" | Names are documentation that every future reader consumes. Renaming a vague name is a bug-prevention change, not cosmetics. |

## Red Flags

- **Vague Name:** the name is broad enough to refer to many things (`count`,
  `status`, `x`, `result` outside return contexts).
- **Hard to Pick Name:** struggling to find a precise, intuitive, short name —
  a hint the underlying entity lacks a clean design.
- **Nonobvious Code:** meaning or behavior cannot be understood with a quick
  reading.
- One name used for two different kinds of things (the `block` pattern).
- Booleans whose names don't reveal what `true` means.
- Names that are confusable twins (`sock`/`socket`) with an unstated
  relationship.
- Generic containers (`Pair`, tuples) crossing an API boundary.
- Declared type differing from allocated type for the same variable.
- Code that violates conventions readers expect, without a compensating comment.
- Dense statements and unseparated blocks where structure should be visible.

## Verification

After writing or reviewing the code, confirm:

- [ ] A first-time reader's quick guess at each name's meaning would be correct, with no declaration or docs in view
- [ ] No vague names remain in the new/changed code (checklist scan of [references/obviousness-checklist.md](references/obviousness-checklist.md))
- [ ] Booleans are predicates; sentinel values are named for their meaning
- [ ] Recurring concepts use one consistent name; near-twins carry distinguishing prefixes
- [ ] No filler words, type prefixes, or class-name repetition in names
- [ ] Any name that was hard to choose triggered a design check, not just a longer name
- [ ] Code blocks are separated by whitespace, each opening with a one-line description where non-trivial
- [ ] Inherently obscure constructs (event handlers, expectation violations) carry the compensating documentation
- [ ] Reviewer feedback on non-obviousness was resolved by clarifying, not argued away
