# Modification and Consistency Review Checklist

Run before completing a change to existing code. From Ousterhout, *A
Philosophy of Software Design* (2nd ed.), Chapters 16 and 17.

## Strategic mindset (Ch. 16.1)

- [ ] Asked: what structure would this system have if designed from the start with this change in mind?
- [ ] Did not merely bolt the change onto the old shape with special cases
- [ ] Fixed at least small design imperfections in code already being touched
- [ ] If a compromise was unavoidable: it is the best clean design achievable under the real constraints, the cleanup is scheduled, and the debt is recorded where it will be seen

## Comment placement and scope (Ch. 16.2)

- [ ] Interface comments live near the code they describe
- [ ] Implementation comments pushed to the narrowest scope covering their code (per-phase, above the phase — not one narration at method top)
- [ ] A short overall-strategy comment at the method top where useful (phases listed, details live with each phase)
- [ ] The farther a comment is from its code, the more abstract it is

## Commit messages vs. code (Ch. 16.3)

- [ ] Asked for each commit-message paragraph: will a future developer need this while reading the code?
- [ ] If yes: the information is in a code comment (commit message copy optional)

## Single source of truth (Ch. 16.4)

- [ ] Each design decision documented exactly once, at the most obvious home
- [ ] Dependent sites carry short pointers, not copies
- [ ] No call-site comments re-explaining the callee's design
- [ ] Externally documented material (specs, manuals, protocols) referenced by pointer, not copied into code

## Pre-commit diff scan (Ch. 16.5)

- [ ] Every behavior change reflected in the affected comments
- [ ] No debugging code left in the diff
- [ ] No stale TODOs in the diff

## Consistency (Ch. 17)

- [ ] Existing file/project conventions observed and followed (style, naming, ordering, error idioms)
- [ ] A similar existing design decision was found and mimicked, if one exists
- [ ] No convention changed mid-change; if upgraded, both upgrade questions were yes and *all* uses were converted
- [ ] Conventions enforced by tooling where available; violations flagged in review
- [ ] Dissimilar things were not forced into the same shape (no same-name-different-meaning, no misapplied patterns)

## Red flags to scan the diff for

- [ ] Special-case accumulation at change points
- [ ] Comment/code mismatches
- [ ] Rationale living only in the commit message
- [ ] Duplicated documentation drifting apart
- [ ] Style breaking with surrounding code
