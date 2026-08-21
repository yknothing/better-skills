<!-- Parent skill: skills/bs-ppt-master/SKILL.md -->

# Lifecycle and Preservation

Use this reference before touching a presentation. Lifecycle is an authority boundary, not a stylistic label.

## Routing Record

Record the following in the working log:

```markdown
Mode: CREATE | REVISE | FILL | ENHANCE
Authoritative inputs: [paths]
Working copy: [path or recovery method]
Authorized changes: [slides, claims, systems, or "new deck"]
Protected surfaces: [content, master, layouts, placeholders, notes, links, media, behavior]
Meaning-change authority: [yes/no + source]
Visual-system authority: [yes/no + source]
Target: [software/version/environment]
```

If the mode is unclear, inspect the actual files first. Then ask one question whose answer changes the mode. Do not ask a batch of generic discovery questions.

## CREATE

**Use when:** no authoritative deck exists, or the user explicitly authorizes a complete rebuild.

**Freedom:** high, within the brief, source truth, brand, rights, target, and approved direction.

**Preserve:** factual meaning of source material; source/evidence boundaries; required brand and legal language; target environment; selected direction and agreed delivery contract.

CREATE does not authorize invention. A blank canvas increases design freedom, not factual freedom.

## REVISE

**Use when:** an existing deck must change in a named scope.

Create two explicit lists before editing:

```markdown
Authorized:
- slide IDs/pages
- claims or data allowed to change
- visual subsystems allowed to change
- requested additions/removals

Untouched:
- all other pages and content
- notes and hidden slides
- masters, layouts, themes, and slide size
- links, actions, animation, media, and embedded objects
- accessibility metadata and document properties
```

The untouched list is the default, even when the user does not enumerate it. A technical limitation may justify a migration only after it is demonstrated, the exact loss is disclosed, and the user accepts it. Do not rebuild the entire deck because a generator cannot make a narrow edit.

After editing, compare the original and result across both lists. A visually equivalent result is not preservation if behavior, notes, links, or editability were lost.

## FILL

**Use when:** content must be placed into an existing template or controlled deck system.

**Freedom:** lowest. The template is part of the specification.

Preserve and verify:

- presentation and slide dimensions;
- theme, master, and layout identities;
- placeholder type, identity, geometry, and relationship to layouts;
- brand tokens, approved components, footer/page-number behavior, and language rules;
- existing notes, links, animation, media, and accessibility metadata unless explicitly in scope.

Map content to the template's semantic slots. If content does not fit, first edit or restructure the content within its meaning; then use another approved layout; only then ask to alter the template. Never replace the template with a look-alike because it is easier to generate.

If the executor cannot preserve the template contract, stop with `BLOCKED` or propose a disclosed alternative. A screenshot of the template is not a filled template.

## ENHANCE

**Use when:** the deck is substantially correct but weak in insight, hierarchy, design, consistency, or finish.

**Freedom:** medium and purpose-bound. Diagnose what needs enhancement before changing it.

Enhancement may improve titles, sequence, emphasis, exhibits, density, visual system, callbacks, and details. It may not silently change:

- factual meaning or evidence strength;
- an approved business position or commitment;
- brand identity or regulated language;
- audience promise, decision ask, or conclusion.

When a stronger presentation would require a meaning change, show the current and proposed meanings side by side and obtain confirmation before applying it. If confirmation is unavailable, retain the original meaning and log the stronger version as a proposal.

## Design-Freedom Test

Before Art Direction, record which of these may change: narrative mode, information hierarchy, typography, color, composition, imagery, exhibit grammar, motion, and page rhythm.

- Broad authority across these surfaces: develop three complete directions.
- Partial authority: vary only the authorized surfaces; keep inherited constraints visible.
- No meaningful authority: treat the existing system as the execution lock and skip direction theater.

`FILL` and narrow `REVISE` commonly have zero design freedom. This is not a lower-quality workflow; precision and preservation become the design challenge.

## Recovery Contract

Before the first mutation, keep the original immutable or create a recoverable copy with a clear identity. Never overwrite the only copy merely because version control, cloud history, or application recovery might exist.

At handoff report:

- original and working artifact identities;
- what changed and what was deliberately untouched;
- preservation checks actually performed;
- any surfaces that could not be compared;
- how to recover the original.

## Stop Conditions

Stop before production when:

- the authoritative input or target file is missing;
- requested scope conflicts with a protected surface;
- source truth is contradictory and the difference affects meaning;
- the required executor cannot preserve the contract;
- a meaning change, destructive migration, or raster downgrade lacks authority;
- the only available path would expose restricted material or violate asset rights.
