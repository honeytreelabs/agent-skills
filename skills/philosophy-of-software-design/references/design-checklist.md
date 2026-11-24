# Design Review Checklist

Run this checklist when designing a new module or reviewing a design, per
*A Philosophy of Software Design* (Ousterhout, 2nd ed.).

## Complexity Symptoms

The design is suspect if any of these are present:

- [ ] **Change amplification** — a small conceptual change requires edits in many places
- [ ] **Cognitive load** — using the module requires the developer to hold many facts in mind (ordering constraints, config flags, side effects)
- [ ] **Unknown unknowns** — it's unclear what must be known/checked to complete a task safely

## Module Depth

- [ ] The interface (signature + documented behavior + touched global state) is small relative to the functionality it provides
- [ ] Each module hides at least one significant design decision
- [ ] No method or class exists purely to pass through calls unchanged
- [ ] Abstractions differ between layers (no "same words, next level down")
- [ ] Splitting a module would not expose shared internal knowledge; merging would not create an incoherent grab-bag

## Information Hiding & Decomposition

- [ ] Design decisions that are likely to change are buried inside, not exposed in signatures
- [ ] No internal detail has leaked into the interface (parameter types, call ordering, required companion calls)
- [ ] Separate concerns are separated; coupled concerns are together
- [ ] Decomposition is by abstraction, not by time or implementation order

## Generality & Error Handling

- [ ] The design covers today's need plus one plausible extension — no more
- [ ] No special-case code paths for the currently-known single use
- [ ] Configuration parameters are minimal; defaults live inside the module where possible
- [ ] Errors are defined out of existence where semantics allow
- [ ] Remaining errors are handled at the lowest layer with enough context
- [ ] The set of exceptions a caller must know about is as small as possible

## Design Process

- [ ] At least two alternative designs were considered
- [ ] Interface comments (class + public methods) were written before implementation
- [ ] Comments explain what/why, not a restatement of the code
- [ ] Names are precise and consistent; no `temp`/`data`/`manager` placeholders
- [ ] The most important modules got the most design attention (strategic programming)
