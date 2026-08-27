# Text Diagrams — when the artifact is the render

Plain-text (ASCII/Unicode box-drawing) diagrams have a legitimate niche the other backends cannot serve: **code comments, commit messages, terminal output, and any medium that guarantees a monospace font and cannot render anything else**. There, Rule 8 makes text the *correct* choice, not a degradation — the reader's renderer is the monospace grid itself.

## When to choose text

- The diagram lives inside source code, a commit message, a CLI help text, or an issue/chat that strips rendering.
- `sketch` significance thinking aids where zero tooling friction matters.
- NOT for: deliverable docs that render Mermaid natively (use Mermaid), anything needing UML relationship notation richer than boxes-and-arrows, or any diagram over the tighter budget below.

## Tighter constraints

- **Element budget ≤5** primary elements. Text has no layout engine to save you and every added box multiplies alignment work.
- Expressiveness is honest but poor: boxes, labeled arrows, vertical message flows. Do not fake UML notation that text cannot carry (no triangles/diamonds) — write the relationship kind as a word on the edge (`──inherits──▶`) or fall back to a richer backend.
- Sequence-style (participants as columns, messages as horizontal arrows) and small box-flow diagrams work; class diagrams beyond 2–3 boxes with few members do not.

## Character-set decision

- **Unicode box-drawing** (`┌─┐│└┘├┤▶`) — cleaner; safe in most modern contexts (Git, GitHub, editors).
- **Pure ASCII** (`+--+|`, `->`) — required when the destination may mangle Unicode (old toolchains, strict linters, email gateways).

Decide once per artifact and never mix.

## Pitfalls

- **Indent with spaces only.** A single tab destroys alignment in every viewer with different tab stops.
- **CJK and wide characters break the grid**: 汉字 occupy two cells in most monospace fonts but one "character" — a box containing CJK text will misalign against ASCII rulers. Either pad by display width (count CJK as 2) or keep box labels ASCII and put CJK text outside the box.
- No trailing spaces (linters strip them, shifting nothing visibly but failing checks).
- In code comments, keep every line within the file's line-length limit including the comment prefix.

## Verification recipe

There is no renderer: the block itself is the render. Verification is an **alignment check**, mechanical and cheap:

1. Every line of a box's top/bottom edge has the same display width; corners (`┌┐└┘` or `+`) pair up.
2. Every vertical connector (`│`/`|`) sits in the same column on every row it spans.
3. Every arrow points at the element it means (off-by-one columns silently retarget arrows).
4. View the block in a monospace context (editor/terminal) once, whole.

Passing 1–4 ⇒ `RENDER_VERIFIED` for this backend (record "text backend, alignment-checked"). A mechanical check without the monospace viewing ⇒ `RENDER_VERIFIED (structural)`. Always append the caveat to the delivery when the destination is not guaranteed monospace: "renders correctly only in a monospace font".
