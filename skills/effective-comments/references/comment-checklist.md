# Comment Review Checklist

Run on every new or changed comment. From Ousterhout, *A Philosophy of
Software Design* (2nd ed.), Chapter 13.

## The master test

- [ ] Could someone who has never seen this code write this comment just by looking at the code next to it? (If yes → rewrite or delete.)
- [ ] Does the comment use different words than the name of the thing it documents, adding meaning?
- [ ] Judged from a first-time reader's perspective, not the author's?

## Variable / field declarations

- [ ] Units stated (pixels, characters, bytes, milliseconds...)?
- [ ] Boundary conditions: inclusive or exclusive?
- [ ] Null permitted, and what null implies?
- [ ] If it holds a resource: who is responsible for freeing/closing it?
- [ ] Invariants documented ("always at least one entry")?
- [ ] For maps/collections: what keys and values mean, and what a missing entry means?
- [ ] Describes what the variable *represents* (nouns), not how it is manipulated (verbs)?

## Method / function interface comments

- [ ] One-two sentences of behavior as perceived by callers?
- [ ] Every argument documented, with constraints and inter-argument dependencies?
- [ ] Return value documented, including special cases?
- [ ] All side effects documented (internal state changes, writes)?
- [ ] All possible exceptions documented?
- [ ] Preconditions minimized first, then documented?
- [ ] No implementation details leaked into the interface comment?
- [ ] A caller can use the method correctly without reading its body?

## Class / module interface comments

- [ ] High-level abstraction described, without per-method detail?
- [ ] What each instance represents stated?
- [ ] Usage-relevant limitations stated (e.g., thread-safety)?
- [ ] Nothing said that duplicates individual method comments beyond a helpful usage illustration?

## Implementation comments

- [ ] Only present where genuinely needed (long methods, complex blocks)?
- [ ] Each block comment describes what it does, abstractly — not how?
- [ ] Non-obvious loops have an iteration-level "what one iteration accomplishes" comment?
- [ ] "Why" documented for tricky code (bug fixes reference the issue tracker instead of restating)?
- [ ] No line-by-line narration at the same level as the code?

## Cross-module decisions

- [ ] One authoritative home exists (central declaration checklist or design notes file)?
- [ ] Dependent sites carry short pointer comments?
- [ ] No duplicated copies that can drift apart?

## Book-level red flags to scan for

- [ ] Comment Repeats Code — none present
- [ ] Implementation Documentation Contaminates Interface — none present
- [ ] Vague names/docs ("current", "statistics") — none present
- [ ] Cryptic interface terms without definition — none present
