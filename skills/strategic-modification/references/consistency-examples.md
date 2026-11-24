# Strategic Modification and Consistency Examples

Worked examples from Ousterhout, *A Philosophy of Software Design* (2nd ed.),
Chapters 16 and 17, annotated with the rule each demonstrates.

## 1. Overall strategy at top, details with each phase (Ch. 16.2)

```
// We proceed in three phases:
// Phase 1: Find feasible candidates
// Phase 2: Assign each candidate a score
// Phase 3: Choose the best, and remove it
```

Each phase then carries its own comment just above its first line of code.
The top comment gives the map; per-phase comments live at the narrowest
scope. Don't write one long block at the method top describing all phases in
detail — it's far from the code it describes and goes stale first.

## 2. The line-termination checker: enforcing conventions with tools (Ch. 17.2)

A mixed Unix/Windows project kept suffering editors rewriting line
terminators across whole files, making diffs useless. The convention ("newlines
only") was documented but repeatedly violated by every new developer's tools.

Fix: a short pre-commit script that checks all modified files and aborts the
commit if any contain carriage returns (and can repair damaged files on
demand). This instantly eliminated the problem class — and taught new
developers the convention.

Lesson: documentation alone doesn't ensure consistency; automated checking
that blocks non-conforming commits does.

## 3. Pointer to the single home (Ch. 16.4)

Tricky behavior of a variable affecting several usage sites is documented
once — next to the declaration — and other sites refer to it:

```
// See the comment in xyz for an explanation of the code below.
```

If the master comment is later moved or deleted, the broken pointer is
self-evident (the reader finds nothing there and can consult history).
Duplicated copies that drift apart give no such signal.

## 4. Referencing external documentation (Ch. 16.4)

A class implementing the HTTP protocol does not re-describe HTTP in its
comments; it references a source on the web. A command-implementing method
says:

```
// Implements the Foo command; see the user manual for details.
```

Readers must be able to find all needed documentation, but that doesn't mean
the code must contain it.

## 5. Subtle rationale goes into the code, not only the commit log (Ch. 16.3)

A commit fixes a subtle problem — say, a workaround whose removal would
re-create the bug. If the explanation lives only in the commit message, a
future developer "cleaning up" the odd-looking code never sees it. The
constraint gets a comment at the workaround site; the commit message may
repeat it, but the code comment is authoritative.

## 6. The two upgrade questions (Ch. 17.2, "Don't change existing conventions")

Before replacing an established convention with a "better" one:

1. Do you have significant new information that wasn't available when the
   convention was established?
2. Is the new approach so much better that updating all existing uses is
   worth the time?

Both yes → convert everything, leaving no trace of the old convention.
Otherwise → follow the existing way, even if yours is technically better:
the value of consistency usually exceeds the value of one approach over
another.

## 7. When in Rome (Ch. 17.2)

Entering a new file, observe before writing: are public members declared
before private ones? Alphabetical method order? `camelCase` or
`snake_case`? Anything that might be a convention, follow it. For design
decisions, assume a similar decision exists elsewhere in the project — find
it and mimic it rather than inventing a parallel idiom.

## 8. Consistency done wrong: forcing dissimilar things together (Ch. 17.3)

Consistency fails when over-applied: using the same variable name for things
that are really different, or forcing a task into a design pattern that
doesn't fit. The benefit exists only when readers can trust that "if it looks
like an x, it really is an x." Dissimilar things must be done differently.

## 9. Strategic vs. tactical modification (Ch. 16.1)

Tactical: "what is the smallest possible change that does what I need?" —
each edit adds special cases, and the design degrades incrementally with
every evolution step.

Strategic: the change ends with the structure the system would have had if
designed with it from the start — plus fixing small imperfections noticed in
touched code. If you're not making the design better, you're probably making
it worse.

The honest-compromise version: a three-month refactoring against a two-hour
deadline may force the quick fix — but then ask what nearly-as-clean design
is achievable now, schedule the full cleanup, and record the debt visibly.
