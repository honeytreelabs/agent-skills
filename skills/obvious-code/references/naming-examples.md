# Naming and Obviousness Examples: Bad → Good

Worked examples from Ousterhout, *A Philosophy of Software Design* (2nd ed.),
Chapters 14 and 18, annotated with the rule each one demonstrates.

## 1. One vague name, two meanings → a six-month bug (Ch. 14.1)

A file system used the variable name `block` for **two different purposes**:
sometimes a physical block number on disk, sometimes a logical block number
within a file. A logical block number was accidentally used where a physical
number was required, and an unrelated disk block was overwritten with zeroes.
Several experienced developers reviewed the faulty code and none noticed —
the name `block` created a mental assumption that its value was whatever kind
of block the surrounding code needed.

Fix: distinct names (`fileBlock`, `diskBlock`) — or better, distinct types so
the two cannot be interchanged.

Lesson: never settle for a name that is merely "reasonably close"; the bug
was not caused by a *wrong* name but by a *vague* one.

## 2. Too-generic method name (Ch. 14.3)

```
/**
 * Returns the total number of indexlets this object is managing.
 */
int IndexletManager::getCount() {...}
```

"Count of what?" A caller sees `getCount()` and must read the docs. Better:
`numActiveIndexlets` — most readers guess correctly without documentation.

## 3. Vague coordinate names (Ch. 14.3)

A GUI text editor used `x` and `y` for the position of a character in a
file. They could equally mean screen coordinates in pixels. Better:
`charIndex` and `lineIndex`, which reflect the abstractions the code
implements.

## 4. Boolean named "status" (Ch. 14.3)

```
// Blink state: true when cursor visible.
private boolean blinkStatus = true;
```

"Status" gives no clue what `true` means; "blink" doesn't say what blinks.
Better:

```
// Controls cursor blinking: true means the cursor is visible,
// false means the cursor is not displayed.
private boolean cursorVisible = true;
```

Rule: boolean names should always be predicates. Readers can now guess what
`true` means; the *why* of blinking lives in the comment.

## 5. Sentinel value named "sentinel" (Ch. 14.3)

```
// Value representing that the server has not voted (yet) for
// anyone for the current election term.
private static final String VOTED_FOR_SENTINEL_VALUE = "null";
```

The name says "special" but not *what* the special meaning is. Better:
`NOT_YET_VOTED`.

## 6. `result` for a non-return value (Ch. 14.3)

A variable named `result` in a method with no return value: it misleadingly
suggests it becomes the return value and says nothing about what it holds.
Name what it is: `mergedLine`, `totalChars`. (`result` is acceptable for the
actual return value of a method.)

## 7. Confusable twins (Ch. 14.3)

The Linux kernel has `struct socket` and `struct sock`, where a `sock`
contains a `socket` as its first element. The names are so similar it's hard
to remember which is which. Better: names that are easy to distinguish *and*
clarify the relationship, e.g. `struct sock_base` and `struct inet_sock`.

## 8. Too-specific argument name (Ch. 14.3)

```
void delete(Range selection) {...}
```

`selection` suggests only currently-selected UI text, but the method deletes
any range. More generic: `range`. (Precision cuts both ways — neither too
vague nor too specific.)

## 9. Acceptable generic names (Ch. 14.3)

```
for (i = 0; i < numLines; i++) {
    ...
}
```

`i` is fine when the loop spans a few lines and the meaning is visible at
once. If the loop grows past one screen, or the meaning isn't obvious from
context, use a descriptive name.

## 10. Extra words and type prefixes (Ch. 14.5)

- `fileObject` — "Object" adds nothing (are there files that aren't
  objects?). Use `file`.
- `filePtr` / Hungarian notation (`arru8NumberList`) — type prefixes are
  obsolete; IDEs show the type on click.
- Instance variable `fileBlock` in class `File` — the class name is already
  in context. Use `block` (unless the class holds multiple kinds).

## 11. The Go short-names debate (Ch. 14.6)

Go advocates single-letter names ("long names obscure what the code does"):

```go
func RuneCount(b []byte) int {
    i, n := 0, 0
    for i < len(b) { ... n++ }
    return n
}
```

Ousterhout's counterpoint: with `n` he ends up re-reading code to recall
what it means; `count` gives a better clue for free. The resolution:
*readability is determined by readers, not writers.* Short names are fine if
used **consistently** for exactly one meaning system-wide — ambiguous reuse
(`ch` for character or channel, `d` for data/difference/distance) recreates
the `block` bug. One point of agreement: *"The greater the distance between
a name's declaration and its uses, the longer the name should be."*

## 12. Whitespace exposes structure (Ch. 18.1)

Unreadable parameter docs (squeezed):

```
* @param numThreads The number of threads that this manager should
* spin up in order to manage ongoing connections. ... @param handler
* Used as a callback ...
```

Readable (indentation makes parameter boundaries scannable):

```
*   @param numThreads
*        The number of threads that this manager should spin up in
*        order to manage ongoing connections. ...
*   @param handler
*        Used as a callback in order to handle incoming messages ...
```

Same principle inside methods: blank lines between major blocks, ideally with
a one-line comment opening each block; and
`for(int pass=1;pass>=0&&!empty;pass--)` vs.
`for (int pass = 1; pass >= 0 && !empty; pass--)`.

## 13. Event-driven code needs "when am I invoked" docs (Ch. 18.2)

Event handlers are invoked indirectly through the event module at runtime —
control flow can't be traced statically. Compensate in the handler's
interface comment:

```
/**
 * This method is invoked in the dispatch thread by a transport if a
 * transport-level error prevents an RPC from completing.
 */
void Transport::RpcNotifier::failed() { ... }
```

## 14. Generic containers hide meaning (Ch. 18.2)

```
return new Pair<Integer, Boolean>(currentTerm, false);
```

Callers must use `result.getKey()` and `result.getValue()` — no clue what
either is. Better: define a specialized class with meaningful element names
and its own documentation. Rule: **software should be designed for ease of
reading, not ease of writing.**

## 15. Declaration/allocation type mismatch (Ch. 18.2)

```
private List<Message> incomingMessageList;
...
incomingMessageList = new ArrayList<Message>();
```

Legal, but a reader of the declaration misses the performance and
thread-safety properties that come with `ArrayList`. Match the declared type
to the allocated type.

## 16. Violated reader expectations (Ch. 18.2)

```
public static void main(String[] args) {
    ...
    new RaftClient(myAddress, serverAddresses);
}
```

Readers assume the application exits when `main` returns — but the
constructor spawns threads that keep running. Document it in the constructor's
interface comment *and* with a short comment at the end of `main`. Code is
most obvious when it conforms to expected conventions; deviations must be
documented.
