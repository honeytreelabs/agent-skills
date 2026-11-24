# Comment Examples: Bad → Good

Worked examples from Ousterhout, *A Philosophy of Software Design* (2nd ed.),
Chapter 13. Each pair shows why the bad version fails.

## 1. Comment repeats code

```
ptr_copy = get_copy(obj)        # Get pointer copy
if is_unlocked(ptr_copy):       # Is obj free?
    return obj                  # return current obj
if is_copy(ptr_copy):           # Already a copy?
    return obj                  # return obj
thread_id = get_thread_id(ptr_copy)
if thread_id == ctx.thread_id:  # Locked by current ctx
    return ptr_copy             # Return copy
```

Failures: one comment per line, all at code level. Almost every comment can be
written by looking at the adjacent line alone. The only comment carrying
non-obvious information is "Locked by current ctx".

## 2. Comment echoes the name

```
// Obtain a normalized resource name from REQ.
private static String[] getNormalizedResourceNames(HTTPRequest req) ...

// Downcast PARAMETER to TYPE.
private static Object downCastParameter(String parameter, String type) ...

// The horizontal padding of each line in the text.
private static final int textHorizontalPadding = 4;
```

Failure: each comment rearranges the words of the name. The only new word in
the second is "to". Meanwhile genuinely missing information goes undocumented:
what is a "normalized resource name"? what are the array's elements? what are
the units of padding, and is it on one side or both?

Good version — different words, added information:

```
// The amount of blank space to leave on the left and
// right sides of each line of text, in pixels.
private static final int textHorizontalPadding = 4;
```

## 3. Vague variable documentation → precision

Bad:

```
// Current offset in resp Buffer
uint32_t offset;

// Contains all line-widths inside the document and
// number of appearances.
private TreeMap<Integer, Integer> lineWidths;
```

Failures: "current" is undefined; keys/values and units unstated; missing
entries unexplained.

Good:

```
// Position in this buffer of the first object that hasn't
// been returned to the client.
uint32_t offset;

// Holds statistics about line lengths of the form <length, count>
// where length is the number of characters in a line (including
// the newline), and count is the number of lines with
// exactly that many characters. If there are no lines with
// a particular length, then there is no entry for that length.
private TreeMap<Integer, Integer> numLinesWithLength;
```

Note the improved name too: "length" suggests characters, not pixels.

## 4. Nouns, not verbs

Bad — narrates how the variable is manipulated:

```
/* FOLLOWER VARIABLE: indicator variable that allows the Receiver and the
 * PeriodicTasks thread to communicate about whether a heartbeat has been
 * received within the follower's election timeout window.
 * Toggled to TRUE when a valid heartbeat is received.
 * Toggled to FALSE when the election timeout window is reset. */
private boolean receivedValidHeartbeat;
```

Good — describes what the variable represents:

```
/* True means that a heartbeat has been received since the last time
 * the election timer was reset. Used for communication between the
 * Receiver and PeriodicTasks threads. */
private boolean receivedValidHeartbeat;
```

## 5. Low-level comment → high-level intuition

Bad — restates individual conditions, no intent:

```
// If there is a LOADING readRpc using the same session
// as PKHash pointed to by assignPos, and the last PKHash
// in that readRPC is smaller than current assigning
// PKHash, then we put assigning PKHash into that readRPC.
```

Good — the simplest sentence that explains everything:

```
// Try to append the current key hash onto an existing
// RPC to the desired server that hasn't been sent yet.
```

The good version lets a reader explain nearly every condition below it
(session test → right server; LOADING → states exist; MAX_PKHASHES_PERRPC →
per-RPC limit) and provides a basis for judging whether the code is correct.

## 6. "How we got here" comment

```
if (numProcessedPKHashes < readRpc[i].numHashes) {
    // Some of the key hashes couldn't be looked up in
    // this request (either because they aren't stored
    // on the server, the server crashed, or there
    // wasn't enough space in the response message).
    // Mark the unprocessed hashes so they will get
    // reassigned to new RPCs.
    ...
}
```

First sentence: why this code executes (high-level causes). Second sentence:
what it does, abstractly. Both belong at a different level than the loop body.

## 7. Implementation details in a class interface comment

Bad:

```
/*
 * This class implements the client side framework for index range
 * lookups. It manages a single LookupIndexKeys RPC and multiple
 * IndexedRead RPCs. Client side just includes "IndexLookup.h" in
 * its header to use IndexLookup class. Several parameters can be set
 * in the config below: ...
 */
class IndexLookup { ... }
```

Failures: RPC names, private config variables, and "include the header"
advice are implementation details or the obvious; "by providing all necessary
information" says nothing.

Good:

```
/*
 * This class is used by client applications to make range queries
 * using indexes. Each instance represents a single range query.
 *
 * To start a range query, a client creates an instance of this
 * class. The client can then call getNext() to retrieve the objects
 * in the desired range. For each object returned by getNext(), the
 * caller can invoke getKey(), getKeyLength(), getValue(), and
 * getValueLength() to get information about that object.
 */
```

## 8. Method interface comment rewritten

Bad:

```
/**
 * Check if the next object is RESULT_READY. This function is
 * implemented in a DCFT module, each execution of isReady() tries
 * to make small progress, and getNext() invokes isReady() in a
 * while loop, until isReady() returns true.
 *
 * isReady() is implemented in a rule-based approach. We check
 * different rules by following a particular order, and perform
 * certain actions if some rule is satisfied.
 *
 * \return
 * True means the next Object is available. Otherwise, return false.
 */
```

Failures: cryptic "RESULT_READY"; DCFT and the rule-based paragraph are
implementation details; "does most of the real work" information is missing.

Good:

```
/*
 * Indicates whether an indexed read has made enough progress for
 * getNext to return immediately without blocking. In addition, this
 * method does most of the real work for indexed reads, so it must
 * be invoked (either directly, or indirectly by calling getNext) in
 * order for the indexed read to make progress.
 *
 * \return
 * True means that the next invocation of getNext will not block
 * (at least one object is available to return, or the end of the
 * lookup has been reached); false means getNext may block.
 */
```

## 9. Complete interface comment with side effects defined away

```
/**
 * Copy a range of bytes from a buffer to an external location.
 *
 * \param offset
 *     Index within the buffer of the first byte to copy.
 * \param length
 *     Number of bytes to copy.
 * \param dest
 *     Where to copy the bytes: must have room for at least
 *     length bytes.
 *
 * \return
 *     The return value is the actual number of bytes copied,
 *     which may be less than length if the requested range of
 *     bytes extends past the end of the buffer. 0 is returned
 *     if there is no overlap between the requested range and
 *     the actual buffer.
 */
uint32_t Buffer::copy(uint32_t offset, uint32_t length, void* dest) ...
```

Note how out-of-range requests are defined as normal behavior (0 return
value) rather than errors — interface documentation can carry error-eliminating
semantics.

## 10. Cross-module documentation in the central declaration

```
typedef enum Status {
    ...
    STATUS_MAX_VALUE = 30,
    // Note: if you add a new status value you must make the
    // following additional updates:
    // (1) Modify STATUS_MAX_VALUE to have a value equal to the
    //     largest defined status value, and make sure its definition
    //     is the last one in the list. ...
    // (2) Add new entries in the tables "messages" and "symbols" in
    //     Status.cc.
    // (3) Add a new exception class to ClientException.h
    // (4) Add a new "case" to ClientException::throwException ...
    // (5) In the Java bindings, add a static class for the exception
    //     to ClientException.java
    // (6) Add a case for the status of the exception to throw the
    //     exception in ClientException.java
    // (7) Add the exception to the Status enum in Status.java ...
}
```

Placed where a developer adding a value must go anyway, and at the end of the
list where new entries are added.

## 11. Central design-notes file with pointer comments

When no central place exists, keep one authoritative file:

```
designNotes
-----------
Zombies
-------
A zombie is a server that is considered dead by the rest of the cluster;
any data stored on the server has been recovered and will be managed by
other servers. However, if a zombie is not actually dead (e.g., it was
just disconnected from the other servers for a while) two forms of
inconsistency can arise:
* A zombie server must not serve read requests once replacement servers
  have taken over; otherwise it may return stale data ...
* The zombie server must not accept write requests once replacement
  servers have begun replaying its log during recovery ...
```

and point to it from each dependent site:

```
// See "Zombies" in designNotes.
```
