<!-- Parent skill: skills/bs-ppt-master/SKILL.md -->

# V1–V5 Delivery Verification

These five checks verify a presentation artifact. They are separate from Better-Skills repository Gate 1–4. Run every layer required by the delivery contract and report each independently as `PASS`, `BLOCKED`, or `UNVERIFIED`.

## Evidence Rule

A layer passes only when the named final artifact was checked by an appropriate method after the last relevant change. Plans, capability discovery, source inspection, checker output, and another format's rendering cannot substitute for the missing layer.

`BLOCKED` means a required check cannot succeed under the current contract. `UNVERIFIED` means the check was not completed or evidence is insufficient. Do not omit either state from delivery.

## V1 — Content and Evidence

Verify against authoritative sources:

- names, terms, claims, numbers, dates, units, denominators, qualifiers, and citations;
- evidence strength and causal verb permission;
- uncertainty, exclusions, disagreement, and evidence gaps;
- title/body agreement and cross-slide consistency;
- asset and data provenance without fabricated sources.

Use the claim ledger when applicable. A structurally valid ledger does not prove the claims true; compare the rendered deck and source material.

**PASS evidence:** a traceable source/claim review of the final content.
**Repair owner:** Brief or Insight/Architecture.

## V2 — Narrative and Decision

Verify the deck against its real purpose and pacing:

- belief/action delta or purpose-specific outcome is clear;
- declarative title chain forms a coherent progression;
- load-bearing pages survive deletion tests and redundant inventory is removed or moved;
- decisions, options, owner, deadline, and cost of delay appear when relevant;
- opening promises, chapter transitions, callbacks, and conclusion answer one another;
- archival, compliance, education, alignment, and reader-paced exceptions remain appropriate.

**PASS evidence:** title-chain read, page-role map, callback review, and purpose-specific reviewer judgment.
**Repair owner:** Insight/Architecture or canonical model.

## V3 — Detail and Visual Rendering

Render every slide from the final candidate. Inspect pages at readable scale and as a full contact sheet.

Verify:

- no overflow, overlap, clipping, unsafe margins, broken glyphs, missing assets, or unreadable contrast;
- type, color, grid, spacing, imagery, exhibits, diagrams, annotation, and intentional exceptions follow the execution lock;
- sparse and dense pages belong to the same system;
- page rhythm, repetition, transitions, and climax work across the deck;
- target distance and aspect ratio are respected;
- Detail Ledger contradictions and callbacks are closed.

**PASS evidence:** rendered slide set, contact sheet, issue log, and post-fix re-render.
**Repair owner:** Production, Art Direction, or Detail Master.

## V4 — Native File and Package Integrity

Inspect the actual `.pptx` and, where the executor supports it, open/save/reopen it.

Verify:

- the package opens and relationships are valid;
- dimensions, theme, masters, layouts, placeholders, notes, links, media, and fonts match the delivery claim;
- objects promised as editable are inspected at object level;
- rasterized or flattened elements are enumerated;
- no broken external temporary paths, missing assets, secrets, or credential material are packaged;
- saving and reopening does not silently corrupt the file.

ZIP/package integrity is useful but does not prove target-app fidelity or editability. A renderer output does not prove the underlying objects are native.

**PASS evidence:** package/object inspection and applicable open/save/reopen results for the final file.
**Repair owner:** Executor Selection or Production.

## V5 — Target-Environment Delivery

Open the final artifact in the named target software and environment. Microsoft PowerPoint is the default truth benchmark unless another target is specified.

Verify the behaviors promised by the contract: rendering, fonts, editing, notes, links, animation, audio/video, presenter mode, save/reopen, and any required compatibility behavior.

PowerPoint, Keynote, WPS, Google Slides, LibreOffice, and browser presentations are distinct targets. Testing one does not pass another. LibreOffice rendering and package checks cannot be reported as PowerPoint verification.

If the target is unavailable, report `UNVERIFIED`. If the target demonstrates a contract-breaking failure, report `BLOCKED` unless the user explicitly accepts the named limitation and all remaining requirements pass.

**PASS evidence:** target name/version/environment, exact file, behaviors exercised, screenshots/logs when available, and reviewer identity.
**Repair owner:** Production or Executor Selection.

## Repair Loop

For any issue:

1. assign it to Brief/Insight, Art Direction, Executor Selection, Production, or Detail Master;
2. update the canonical model before regenerating if meaning or rules changed;
3. use a materially different fix, not repeated cosmetic adjustment;
4. re-render and rerun the affected V-layer;
5. rerun downstream layers invalidated by the fix;
6. retain issue and post-fix evidence in the audit trail.

Use a bounded number of attempts appropriate to the task. When distinct approaches are exhausted, stop and report the blocker or obtain explicit acceptance. Do not make the deck less truthful or the claim vaguer merely to clear a check.

## Capability Report

Include:

```markdown
Artifact: [path/hash if useful]
Executor/version: [identity]
Output class: native | hybrid | raster
Native editable objects verified: [scope + evidence]
Hybrid/raster elements: [scope + accepted loss]
Unsupported features: [scope]
Target environments verified: [software/version/behavior]
Unverified claims: [explicit]
Rights/privacy constraints: [sources and data boundary]
```

## Terminal Decision

- `DELIVERED`: all required V-layers are `PASS`.
- `DELIVERED_WITH_ACCEPTED_LIMITATIONS`: each limitation is explicit and accepted; every remaining required V-layer is `PASS`.
- `BLOCKED`: a required V-layer, right, fact, preservation promise, or capability cannot be satisfied.
- `DESIGN_ONLY`: the agreed artifact is direction/specification rather than a final PPTX.

Never use `DELIVERED` when V5 is required but `UNVERIFIED`, or when V3 has no rendered final artifact. A successful Better-Skills Gate 1–4 run verifies the Skill package, not a deck produced by the Skill.
