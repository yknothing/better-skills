# Syntax Pitfalls — traps that break rendering or reverse meaning

Syntax error rates in generated diagrams do not fall with model capability; validation loops and these known traps do the work. Consult the section for your tool while drafting, and again when a parser rejects the source.

## Mermaid

### All diagram types

- **Quote labels containing punctuation** (flowchart nodes). Parentheses, braces, quotes, `<`, `>`, `&` inside `[...]` node labels break parsing: `A["Validate (async)"]`, never `A[Validate (async)]`.
- **Reserved word `end`.** Lowercase `end` as a node ID or inside message/label text terminates `subgraph`/fragment blocks (flowchart and sequence). Use `End`, quote it, or wrap it (`(end)`).
- **IDs starting with `o` or `x`** adjacent to `--` flowchart edges parse as circle/cross edge decorations (`A --- oB`). Rename or reorder. (Flowchart-specific; class/sequence names are unaffected.)
- **Comments are `%%`.** A bare `%` inside label text historically broke older parsers; current Mermaid (11.17+) accepts it — version-dependent, probe when targeting older embedded renderers.
- **HTML entities for special characters** in text: `#59;` for `;`, `#quot;`, `#35;` for `#`.
- **Do not invent syntax.** No PlantUML constructs (`note over` outside sequence diagrams, `skinparam`, `@startuml`), no guessed arrowheads. If unsure a construct exists, check by rendering a 3-line probe first.
- Styling: `%%{init: {...}}%%` directive on line 1; `classDef`/`class` for flowcharts; themes `default`/`neutral`/`dark`/`forest`/`base`.

### classDiagram

- **Generics use tildes**: `List~Order~`. Comma generics (`Map~K, V~`) are **version-dependent**: they historically broke the parser and current Mermaid (11.17+) accepts them, but older embedded renderers (GitHub's bundled version, wiki plugins) may not. Probe on the target toolchain (3-line render) before either relying on them or mangling the model with workarounds — pre-emptive aliasing/dropping of type parameters is parser-driven model bending.
- Relationship syntax: `A <|-- B` (B inherits A), `A <|.. B` (B realizes A), `A *-- B` (A owns B), `A o-- B`, `A --> B`, `A ..> B`. Read every edge aloud after writing — reversed triangles/diamonds render fine and lie.
- Labels on relationships: `A --> B : places` — avoid parentheses inside relationship labels.
- Members: `+method(param) ReturnType`, `-field type`; annotations on their own line inside the class body: `<<interface>>`, `<<abstract>>`, `<<enumeration>>`.
- `direction TB` / `direction LR` inside the diagram; namespaces group classes: `namespace Ordering { class Order }`.

### sequenceDiagram

- **Arrow semantics** (the silent lie): `A->>B: msg` = synchronous call; `A-)B: msg` = **asynchronous**; `A-->>B: result` = reply/return. Do not use `->>` for queue publishes or fire-and-forget.
- **Activations must balance**: every `+` needs its `-` (`A->>+B: call` … `B-->>-A: reply`), every `activate` its `deactivate`. Unbalanced activation is a top parse-error source.
- **Fragments close with `end`**: `alt`/`else`, `opt`, `loop`, `par`/`and`, `critical`, `break` — each block needs its `end`; nested fragments need one each.
- **Declare participants first**, in left-to-right order: `participant OS as "Order Service"` (quotes for spaces); `actor` for humans. A typo'd name later silently creates a ghost lifeline — check the render for unexpected lifelines.
- `end` or `;` inside message text: historically parse-breaking; current Mermaid (11.17+) tolerates both in message text — version-dependent, probe on the target renderer before relying on it (wrapping/`#59;` remain the safe form). `end` as a node/participant **ID** stays reserved.
- Useful: `autonumber`; `create participant X` / `destroy X` for lifecycle; `note over A,B: text`.

### stateDiagram-v2

- `[*]` is initial or final depending on arrow direction; it cannot be styled and `[*] --> [*]` is meaningless.
- Transition labels are plain text: `S1 --> S2 : pay [balance>0] / capture` — Mermaid does not parse guard/action structure, so keep the `trigger [guard] / effect` convention inside the label text.
- **Cross-composite transitions are unsupported** (inner state of one composite → inner state of another). Restructure (transition to/from the composite boundary) or switch to PlantUML.
- Composites: `state Active { ... }`; concurrency separator `--`; pseudostates `state c <<choice>>`, `<<fork>>`, `<<join>>`.

### Coverage gaps → route to PlantUML

Mermaid has **no real activity diagram** (flowchart is a stand-in without partitions/object-flow semantics), **no component/deployment diagram** (`architecture-beta` is cloud-icon oriented), **no use case diagram in current releases** (probed: `usecase` headers are rejected on 11.17 — route use cases to PlantUML), and its C4 types are experimental with poor layout. When the reader's renderer is GitHub and the type is unsupported, either render via PlantUML to SVG and embed the image, or use a flowchart clearly labeled as a process sketch, not UML activity notation.

## PlantUML

- Every diagram sits between `@startuml` and `@enduml`; one diagram family per block.
- **Modernize the look**: `!theme plain` (or `cerulean`, `mono`); `skinparam linetype ortho` for orthogonal edges; `hide empty members` for class diagrams (removes dead compartments); `left to right direction` when hierarchy flows sideways.
- **skinparam typos fail silently** — a misspelled parameter is ignored, not rejected. Copy known-good names only.
- Arrow length is a layout instruction: `-->` spans one rank, `--->` two; use the **fewest** direction hints (`-up->`, `-right->`) that fix the layout and delete ones with no effect — contradictory hints degrade Graphviz layout.
- Class relationships mirror the semantics table (`<|--`, `<|..`, `*--`, `o--`, `-->`, `..>`); visibility `+ - # ~`; `{abstract}`, `{static}` modifiers; stereotypes `<<Entity>>`.
- Activity diagrams: use the current (colon) syntax — `:action;`, `if (cond?) then (yes) ... endif`, `fork`/`fork again`/`end fork`, `|Swimlane|` partitions.
- **C4**: `!include <C4/C4_Container>` from the stdlib, then `Person()`, `System()`, `Container()`, `ContainerDb()`, `Rel(from, to, "label", "protocol")`, `System_Boundary()`, plus `LAYOUT_WITH_LEGEND()`. Prefer this over Mermaid's experimental C4.
- Sequence: `->` sync, `-->` reply (dashed), `->>`/`-\\` for async conventions; `activate`/`deactivate` or `++`/`--` shorthands; `alt/else/opt/loop/par/group ... end`.

## The bounded repair loop

When a parser/renderer rejects the source:

1. Read the reported line/character; match it against this file's traps.
2. Fix the **syntax**, preserving the semantic content (Rule: never delete model elements to appease the parser).
3. Re-run the same validation command.
4. **Budget: 5 repair iterations.** If still failing, switch strategy — reduce to a minimal reproducer to isolate the construct, switch notation (Mermaid ↔ PlantUML) for the unsupported feature, or report the exact blocker with the last error verbatim. Do not loop blindly.
