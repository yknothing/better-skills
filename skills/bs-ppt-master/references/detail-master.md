<!-- Parent skill: skills/bs-ppt-master/SKILL.md -->

# Detail Master

Detail Master is an independent quality role throughout the lifecycle. It protects details that change truth, comprehension, credibility, style, or finish. It does not reward inconsequential pixel movement or mechanical sameness.

## Detail Ledger

Start the ledger during the brief and extend it after the execution lock:

```markdown
Canonical language:
- product/person/place names, terminology, casing, abbreviations, language rules

Canonical facts:
- numbers, dates, units, denominators, precision, qualifiers, source anchors

Callbacks:
- promise or concept -> where it is answered, repeated, or closed

Visual invariants:
- grid, type roles, spacing, color semantics, icons, imagery, exhibits, diagram syntax

Intentional exceptions:
- exception -> page -> narrative purpose -> approval

Delivery constraints:
- target, distance, aspect ratio, accessibility, editability, media, fonts
```

The ledger should stay compact enough to use. Record consequential invariants, not every coordinate.

## Four Interventions

### D1 — Specification

Run after the brief and presentation insight, before direction lock.

Check source-to-claim fidelity, names, figures, dates, units, qualifiers, terminology, source permission, promises made early, and conclusions that must answer them later. Flag unresolved contradictions before they spread into layouts.

### D2 — Calibration

Run on representative sparse and dense pages before full production.

Check hierarchy, grid, spacing, type, line breaks, color meaning and contrast, image choice/crop/focus, exhibit logic, annotation, distance readability, and whether the execution lock survives both density extremes. Confirm that intentional variation reads as purposeful rather than accidental.

### D3 — Whole deck

Run after all pages exist, before delivery polish.

Use both slide-level inspection and a contact sheet. Check title-chain progression, callbacks, terminology, legends, symbols, citations, chapter transitions, density distribution, repetition, visual drift, and climax. The contact sheet reveals rhythm and system failures that isolated pages hide; isolated pages reveal accuracy and collision problems the contact sheet hides.

### D4 — Delivery

Run on the actual final candidates, not on design sources alone.

Check rendered overflow, overlap, clipping, unsafe margins, wrapping, contrast, missing assets, font substitution, broken glyphs, master/layout relationships, placeholder behavior, editable objects, notes, links, media, animation when promised, package health, and target-environment behavior. Re-open the saved result when possible.

## Review Method

For each issue record:

```markdown
ID: D-[number]
Surface: content | callback | visual-system | rendering | native-file | target
Artifact/page: [path and slide]
Expectation: [ledger or execution-lock rule]
Observed: [specific evidence]
Consequence: [truth/comprehension/trust/style/delivery]
Disposition: FIX | INTENTIONAL_EXCEPTION | BLOCKED
Verification after fix: [render/check/target evidence]
```

An exception is intentional only if it carries a clear narrative function, remains compatible with accessibility and truth, and is recorded. “It looked better” is insufficient when the change breaks the system.

## Priority Order

Fix in this order:

1. factual contradiction, unsupported meaning, or hidden evidence;
2. preservation, rights, privacy, or target-delivery risk;
3. missing callback, broken hierarchy, or misleading exhibit;
4. unreadability, overflow, collision, font/resource failure;
5. unexplained system drift or broken deck rhythm;
6. finish issues with a real perceptual consequence.

Do not spend the review budget nudging pixels while a denominator, callback, or editability claim is unresolved.

## Independence

The final D4 review should be performed by a reviewer who did not produce the deck. If sub-agents are unavailable, open a fresh review context with only the brief, execution lock, Detail Ledger, final artifacts, and verification contract. The creator's memory of intent is not evidence that the audience can see it.

The reviewer must inspect evidence and artifacts; it cannot pass the deck by restating the checklist. A checker result validates only its own rules.

## Repair Loop

After any fix:

1. update the canonical model or execution lock if the intended rule changed;
2. regenerate only through the canonical production path;
3. re-render affected slides;
4. recheck the affected page and contact sheet;
5. repeat any V-layer invalidated by the change;
6. record fresh evidence.

Use a bounded series of materially different repair strategies. Repeating superficial adjustments is not progress. If the remaining issue cannot be resolved within the contract, mark it `BLOCKED` or obtain explicit acceptance of the precise limitation.

## Detail Report

Deliver a concise report containing:

- key facts, callbacks, and system rules verified;
- issues fixed, with post-fix evidence;
- intentional exceptions and their purpose;
- surfaces not inspectable or target behaviors not tested;
- remaining limitations and their consequence;
- independent reviewer identity/context.

The Detail Report is evidence of work performed, not a claim that every possible detail is perfect.
