# UML Semantics — correctness rules per diagram type

Notation errors destroy trust: a reader who knows UML reads a reversed inheritance arrow as a factual claim about the system. These rules are checked in the semantic review pass. "It renders" is not "it is correct".

## Universal rules (all diagram types)

- **U1 — Every element traceable.** In MODEL-FROM-CODE mode, every class, method, message, and state must exist in the code at the cited location. In MODEL-FROM-DESIGN mode, every element must come from the user's stated requirements or an explicitly labeled assumption. Never pad a diagram with plausible-but-invented elements.
- **U2 — One relationship, one meaning.** Never use plain association as a default because typing `--` is easy. If the model implies ownership, lifecycle binding, or direction, encode it with the correct edge type.
- **U3 — Title states the question.** Every diagram carries a title naming what it answers ("Order lifecycle states", "Checkout: payment authorization sequence"), not the artifact type ("Class diagram").
- **U4 — Label edges that carry meaning.** An unlabeled arrow between two boxes is a claim the reader cannot check. Association names/role names, message names, and transition triggers are content, not decoration.
- **U5 — Enumerations are enumerations.** A `status: String` attribute in a domain model is a modeling failure; declare `<<enumeration>> OrderStatus` and reference it.

## Class diagrams

Relationship semantics — the #1 source of wrong diagrams:

| Relationship | Meaning | Test | Mermaid | PlantUML |
|---|---|---|---|---|
| Inheritance | B **is-a** A | Liskov: B substitutable for A | `A <\|-- B` | `A <\|-- B` |
| Realization | B implements interface A | A has no implementation | `A <\|.. B` | `A <\|.. B` |
| Composition | A **owns** B; B dies with A | Can B outlive A? No ⇒ composition | `A *-- B` | `A *-- B` |
| Aggregation | A **has** B; B outlives A | Shared/transferable parts | `A o-- B` | `A o-- B` |
| Association | A knows B (field/stable link) | A holds a reference to B | `A --> B` | `A --> B` |
| Dependency | A **uses** B transiently | Parameter, local var, return type | `A ..> B` | `A ..> B` |

- **Arrow direction:** the hollow triangle sits on the **parent/interface**; the child points to it (`Animal <|-- Dog`, read "Dog inherits Animal"). The diamond sits on the **whole**, not the part. Getting either backwards inverts the meaning.
- **Choose the weakest true relationship.** Dependency < association < aggregation < composition. Claiming composition where aggregation holds is as wrong as the reverse. When ownership is genuinely undecidable from the evidence, use association and say so.
- **Multiplicities** on both ends of structural relationships in domain models (`"1" -- "0..*"`). Omit them only in sketch-significance diagrams.
- **Visibility** markers (`+` public, `-` private, `#` protected, `~` package) when modeling from code; match the code, don't guess.
- **Abstract classes/interfaces** marked (`<<interface>>`, `<<abstract>>` or italics). An interface with attributes and full method bodies is a contradiction.
- Don't show both an association edge **and** the corresponding attribute — pick one (edge for domain models, attribute for implementation-close diagrams).

## Sequence diagrams

- **Sync vs async is semantic:** filled arrowhead + solid line = synchronous call (caller blocks); open arrowhead = asynchronous signal (caller continues). Dashed open arrow = reply. Mermaid: `->>` sync call, `-->>` reply, `-)` async. PlantUML: `->` sync, `-->` reply, `->>` async convention. Marking an event-queue publish as a sync call misstates the architecture.
- **Reply arrows** for every sync call whose return matters; label with what returns (`orderId`, not `return`).
- **Activation bars** span exactly the processing window (Mermaid `activate`/`deactivate` or `+`/`-` suffixes). A lifeline active for the whole diagram says "this never yields".
- **Participants:** declare in left-to-right conversation order; use roles/systems (`OrderService`), not vague nouns ("Backend"). Use `actor` for humans.
- **Fragments** for control flow: `alt`/`else` (exclusive branches — conditions must be exhaustive and mutually exclusive), `opt` (may not happen), `loop` (with an explicit bound/condition), `par` (concurrent). Guard text goes in brackets. Nesting deeper than 2 fragments means the diagram is answering two questions — split it.
- **One scenario per diagram.** Happy path and failure path are different diagrams unless the failure branch is ≤3 messages. Never interleave every error case into the happy path.
- Include the failure/timeout path **somewhere**: a sequence set that only shows success is architecture fiction.

## State machine diagrams

- A region has at most one **initial pseudostate** (`[*] -->`); a top-level machine normally needs one. Add a **final state** only if the object actually terminates.
- **Transitions read `trigger [guard] / effect`.** A triggerless (completion) transition is normal leaving a pseudostate (choice/junction/fork) or a state with a `do`-activity that finishes; leaving a plain wait-state with no trigger is usually an error in the model.
- Guards on transitions leaving the same state must be **mutually exclusive**; if two can be true simultaneously the machine is nondeterministic.
- States are **conditions of being** (`AwaitingPayment`), not actions (`ProcessPayment`). If it reads like a verb, it's an activity — model the doing as an `entry`/`do` behavior or reconsider the state.
- **Check completeness:** for every state, ask "what happens if event E arrives here?" for each relevant event. Unhandled = event is lost — either intended (say so in a note) or a missing transition.
- Use **composite states** when ≥3 states share the same outgoing transition (e.g. `Cancelled` reachable from anywhere inside `Active`); one edge from the composite replaces N duplicated edges.

## Activity diagrams

- Decision nodes (diamonds) need **guards on every outgoing edge** and the guards must cover all cases (`[else]` closes the set).
- Every **fork has a matching join**; unbalanced fork/join makes token semantics undefined.
- Use **swimlanes/partitions** the moment more than one actor/system performs actions; an activity diagram without lanes claims a single performer does everything.
- Activities are **verb phrases** ("Validate payment"), the inverse of state naming.

## Component & deployment diagrams

- Components connect through **interfaces** (ball = provided, socket = required), not bare lines. "A talks to B" without naming the contract is a sketch, not a component diagram.
- Dependencies point **from the consumer to the provider**.
- Deployment: nodes are execution environments/hardware; artifacts (deployables) live on nodes; components run inside artifacts. Don't mix logical components and physical nodes at one level without stereotypes.

## Use case diagrams

- Actors are **roles outside the system** (human or external system) — never internal modules.
- `<<include>>` = always happens, arrow from base to included. `<<extend>>` = conditional addition, arrow from extension **to** the base. These arrows' directions are opposite in feel — check both twice.
- Use cases are **goals** ("Place order"), not UI steps ("Click checkout button"). If a "use case" has no actor benefit, delete it.
- This diagram type earns its place only as a scope/context summary; for behavior, a sequence or activity diagram nearly always answers better.

## ER diagrams (when the question is data, not objects)

- Crow's-foot cardinality on **both** ends; every relationship line labeled with a verb.
- Mark PK/FK. In Mermaid `erDiagram`, put constraints in the attribute list (`string id PK`).
- An ER diagram and a class diagram of the same tables are different claims (storage vs behavior) — choose by the question being answered, and don't present one as the other.
