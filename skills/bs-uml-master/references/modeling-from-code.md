# Modeling From Code — evidence before boxes

MODEL-FROM-CODE diagrams are factual claims about a real system. The failure mode is confident fiction: plausible class names, invented methods, guessed relationships. This workflow makes every element traceable.

## Step 1 — Scope from the question

Translate the diagram's question into a code scope before reading anything:

- Structure question → the packages/modules that own the named concern.
- Scenario question (sequence) → the entry point (route handler, CLI command, event consumer, cron job) that starts the scenario.
- Lifecycle question (state machine) → the entity's status field(s), the enum/constants behind them, and every write site.

Record the scope as a file list. If the concern can't be located (unfamiliar naming, no matches), ask the user for an entry point rather than guessing.

## Step 2 — Read and build the element ledger

Read the scoped files (not just signatures — relationship semantics live in bodies and field types). Maintain a ledger; it is working state, and its summary ships in the output contract:

```
element/edge          | evidence (file:line)        | notes
Order *-- OrderItem   | order.py:41 (items: List)   | created in __init__, no external refs escape → composition
OrderService ..> SmsClient | order_service.py:88    | constructed locally in notify() → dependency, not association
Order.status: OrderStatus  | order.py:12, enums.py:7 | 5 members
```

Evidence rules for the tricky edges:

- **Composition vs aggregation vs association:** look at construction and escape. Part constructed by the whole, never handed out, deleted with it → composition. Part passed in / shared / reassignable → aggregation or plain association. When the code doesn't decide it, use association (the weakest true claim) and note the ambiguity.
- **Inheritance/realization:** only from actual `extends`/`implements`/subclassing — never from name similarity (`UserDTO` is not a `User` subclass).
- **Dependency:** parameter/local/return usage only. If it's a stored field, it's an association.
- **Sequence messages:** each message = an actual call/publish found in the body, in source order. Async = queue/event/fire-and-forget in the code (`publish`, `send_async`, unawaited task), not your intuition about what should be async.
- **State transitions:** each transition = a write site of the status field, trigger = the operation containing the write, guard = the condition around it. Grep all writes — the transition you miss is usually in a migration script, admin handler, or error path.
- **Duck-typed/dynamic languages:** where relationships are unresolvable statically, model what is explicit and mark inferred edges with a `«inferred»` note or dashed line, and say so in the report.

## Step 3 — Curate

The ledger is raw material, not the diagram. Apply the element budget (see diagram-selection): drop framework plumbing, DTOs mirroring other classes, logging/metrics cross-cuts, getters/setters/constructors, and any class not needed to answer the question. Deliberately excluded but adjacent elements go into one line under the diagram ("Excluded: 14 DTO classes, auth middleware") — honest curation beats silent omission.

Keep members that carry the answer: for a domain diagram, attributes and key operations; for a dependency-structure diagram, often no members at all is right.

## Step 4 — Sync check before delivery

Re-check the final diagram against the ledger: every box, edge, message, and transition either has an evidence line or an assumption label. Count both directions — ledger rows dropped by curation are fine; diagram elements without ledger rows are fabrications and must be removed or evidenced.

If code changed underneath you mid-task (long sessions), re-verify the load-bearing lines before delivery.
