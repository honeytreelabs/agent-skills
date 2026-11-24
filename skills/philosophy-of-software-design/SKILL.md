---
name: philosophy-of-software-design
description: Applies John Ousterhout's "A Philosophy of Software Design" principles to manage complexity when designing modules, interfaces, and abstractions. Use when creating new modules or classes, designing APIs, decomposing systems into components, splitting or merging existing code, reviewing whether code is deep enough or interfaces force callers to know internal details, choosing strategic over tactical programming, deciding where to handle errors, or refactoring to reduce change amplification and cognitive load.
---

# Philosophy of Software Design

## Overview

Guides module and interface design around one goal: **minimize the complexity
software imposes on future change**. Complexity is anything that makes software
hard to change — it shows up as change amplification, cognitive load, and
unknown unknowns. The only viable attack is to make systems *easy to understand
and easy to change*, not to wish complexity away.

The single most important idea: **deep modules** — simple interfaces hiding
powerful behavior. Derived from John Ousterhout, *A Philosophy of Software
Design* (2nd edition, Yaknyam Press).

## When to Use

- Designing a new module, class, service, or API
- Splitting or merging existing code ("better together or better apart?")
- Deciding where errors should be detected and handled
- Reviewing a design: is the interface as shallow as it can be?
- Choosing between a general-purpose abstraction and a special-purpose one
- Writing comments, names, and documentation for a design
- NOT for process questions (task breakdown, CI, review workflow) — use the
  appropriate lifecycle skills for those
- NOT for performance tuning — complexity reduction comes first; optimize
  only with evidence of a real bottleneck

## Core Workflow

### 1. Frame the design as a complexity problem

Before writing any code, answer:

- What will change about this code in the future, and how likely is that?
- What must a caller know to use this correctly? (Every item is cognitive load.)
- If a requirement changes, how many files must be touched? (Change amplification.)

Prefer **strategic programming**: invest 10–20% of effort in a better design
even when the tactical fix would work today. Working code isn't the goal —
a great design that keeps working is.

### 2. Design interfaces to be deep

```
┌─────────────────────────── module ───────────────────────────┐
│                                                               │
│  interface (small: few params, few concepts, few exceptions)  │
│ ═════════════════════════════════════════════════════════════ │
│  functionality (large: real work happens behind the wall)     │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

- The **interface** is what a developer must know to use the module: the
  signature, plus all documented side effects, preconditions, and global state
  it touches.
- **Depth = functionality ÷ interface cost.** Maximize the numerator, minimize
  the denominator.
- Practice **information hiding**: each module encapsulates design decisions
  no other module needs to know. If a hidden detail leaks into the interface
  (a parameter, a return type, a required call order), the interface gets
  shallower.
- Beware **shallow modules**: pass-through classes, getters/setters wrapping a
  field, "wrapper" layers that add a word to every method name without hiding
  anything.

### 3. Choose the right decomposition

When deciding whether two pieces of code belong together:

- **Better together** when they share information, are used together, or
  simplify the interface by merging (a combined method can hide more).
- **Better apart** when one subsystem can be understood without the other, or
  a split produces genuinely independent abstractions.
- Different layers must present **different abstractions**: a pass-through
  layer that just forwards calls with the same signature is usually wrong.
- Prefer **somewhat general-purpose** designs: design for today's need plus a
  plausible next step — not a speculative framework ("over-engineering"), and
  not a special-case tangle ("narrowing" that hardcodes the current use).
- When you find complexity at a boundary, **pull complexity downward** into
  the module: configuration parameters are usually complexity pushed upward —
  replace them with sensible internal defaults where possible.

### 4. Define errors out of existence

- Prefer designs where the error **cannot occur**: pick semantics that handle
  the edge case as normal behavior (e.g., "remove last element" is a no-op
  instead of an exception).
- For real failures, handle them at the **lowest layer that has enough
  context**; don't propagate exceptions upward just to crash or log them away.
- Every exception an interface can throw is part of its interface cost — fewer
  exceptions means a deeper module.

### 5. Design it twice, then write the comments first

- For any non-trivial decision, sketch **at least two competing designs**
  (e.g., one object-oriented, one functional; one fine-grained, one coarse).
  Compare interface cost and information hiding. Pick one — or combine.
- Write the **interface comments first** (class docstring, method contract,
  invariants), *before* the implementation. If you cannot describe the
  abstraction simply, the design is not yet good enough — iterate now, not
  after the code exists.
- Comments should explain **what** and **why**, not restate the code. Missing
  abstractions show up as "hard to comment" code.

### 6. Verify the design (before and after implementation)

Run the checklist in
[`references/design-checklist.md`](references/design-checklist.md) and fix
what fails. After implementing, re-check: did any design decision leak into
callers? Did any hidden detail become part of the interface?

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "We can refactor later, let's ship" | Tactical programming accumulates design debt that compounds; later never comes without a strategic mindset. |
| "More small classes/methods = cleaner" | Many shallow methods scatter logic across the interface; depth matters, not count. |
| "We might need this generality someday" | Speculative generality adds interface cost today for imagined needs; design for today plus one plausible step. |
| "It's just a thin wrapper" | Pass-through layers add cognitive load while hiding nothing; delete them or make them deepen something. |
| "The caller can just pass this config flag" | Every parameter pushes complexity upward onto all callers; pull it down as an internal default. |
| "Comments are for later" | If you can't write clear comments now, the design is wrong now; comments-first is a design tool, not documentation chores. |
| "This exception is fine, callers can catch it" | Each exception multiplies caller complexity; redefine semantics so the case isn't an error. |

## Red Flags

- A class whose methods all just forward to another object with the same shape
- Interfaces requiring callers to know internal ordering ("call `init()` before
  `use()`") or global state
- A change request that touches many files in lockstep (change amplification)
- New contributors asking "where do I even look?" (unknown unknowns)
- Boolean or config parameters that change a method's whole behavior
- Temporal decomposition: modules split by when things happen instead of by
  abstraction ("first parse, then later validate" in separate classes that must
  stay in sync)
- Interfaces with more exceptions than behavior
- Code that is hard to write a short, clear docstring for

## Verification

After designing (and again after implementing), confirm:

- [ ] The design was sketched at least twice, and the choice is recorded or defensible
- [ ] Interface comments were written before implementation and describe a simple abstraction
- [ ] Each module hides at least one design decision that callers never see
- [ ] No pass-through methods or layers remain in the new code
- [ ] Adding a plausible next requirement touches ideally one module
- [ ] The number of exceptions/cases a caller must handle is minimal, and edge cases are defined as normal behavior where possible
- [ ] The full [references/design-checklist.md](references/design-checklist.md) was run with items checked off
