# Obviousness and Naming Review Checklist

Run on new or changed code. From Ousterhout, *A Philosophy of Software
Design* (2nd ed.), Chapters 14 and 18.

## The master test

- [ ] Can a first-time reader read the code quickly and guess its behavior correctly on the first try?
- [ ] Judged from the reader's perspective (code review), not the author's?
- [ ] Is important information available at the point of reading — via design, conventions, names, or comments?

## Names: precision

- [ ] Each name creates a clear image of what the entity is — and what it is not?
- [ ] No names broad enough to refer to many different things (count, status, data, x, result outside return contexts)?
- [ ] Booleans are predicates: the name reveals what `true` means?
- [ ] Sentinel/special values named for their meaning, not for being special?
- [ ] Confusable near-twins distinguished (and their relationship clarified)?
- [ ] Names not too specific (no `selection` where any range is valid)?
- [ ] Short generic loop names (`i`, `j`) only where the loop is visible at once?

## Names: consistency

- [ ] One name per recurring concept, used everywhere for that concept?
- [ ] That name never used for anything else?
- [ ] Purpose narrow enough that all uses really behave the same?
- [ ] Near-twins carry distinguishing prefixes (`srcFileBlock`, `dstFileBlock`)?
- [ ] Loop nesting conventions (`i` outermost, `j` nested) followed?

## Names: sizing

- [ ] No filler words that add no information (`fileObject`)?
- [ ] No type prefixes / Hungarian notation?
- [ ] Instance variables don't repeat the class name?
- [ ] Name length scales with distance from declaration to use?

## Names as design signal

- [ ] Any name that was hard to choose triggered a design review (split the variable, clean the abstraction) rather than a forced name?

## Formatting

- [ ] Blank lines separate major blocks within methods?
- [ ] Each non-trivial block opens with a one-line description comment?
- [ ] Dense statements spaced for readability?
- [ ] Documentation blocks indented so item boundaries are scannable?

## Unavoidable obscurity

- [ ] Event handlers state when they are invoked, in their interface comments?
- [ ] Generic containers (`Pair`, tuples) replaced with specialized classes at API boundaries?
- [ ] Declared types match allocated types?
- [ ] Code that violates reader expectations (e.g., non-exiting `main`) documents the deviation where the surprise occurs?

## Book-level red flags to scan for

- [ ] Vague Name — none present
- [ ] Hard to Pick Name — none uninvestigated
- [ ] Nonobvious Code — none undocumentated
