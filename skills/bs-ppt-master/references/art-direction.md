<!-- Parent skill: skills/bs-ppt-master/SKILL.md -->

# Art Direction

Use this reference when the task has real authority to create or change the visual system. Art direction is a thesis about how this material should be perceived, not a template shopping exercise.

## Inputs

Do not propose directions until the delivery brief, presentation insight, content shape, target environment, and current capability boundary are known. All directions must project the same canonical facts, claims, and evidence. A direction may reveal a weakness in the architecture; it may not quietly rewrite the story to make the visuals easier.

## Three Complete Directions

Each direction must contain all fields below:

```markdown
Name: [memorable, specific]
Narrative mode: [decision brief/editorial story/technical proof/etc.]
Visual thesis: [how form makes the argument legible and memorable]
Type-color system: [hierarchy, contrast, semantic color, multilingual behavior]
Composition and whitespace: [grid, density, focal strategy, page rhythm]
Image and exhibit grammar: [photography/illustration/charts/tables/diagrams/callouts]
Representative slide: [specific treatment of one real slide]
Fit: [why this audience, occasion, and content suit it]
Advantage: [what it makes unusually strong]
Risk: [where it may fail or become mannered]
Executor implications: [native objects, raster risk, fonts, media, target constraints]
```

Directions are materially different only when they create different perceptual and narrative systems. Changing colors, fonts, corner radii, or background decoration while retaining the same hierarchy, composition, imagery, and rhythm is one direction in three costumes.

Do not optimize all directions toward a safe midpoint. At least one should express a strong but task-relevant point of view. Every direction still obeys content truth, accessibility, preservation, rights, and target constraints.

## Quality Principles

- Derive visual emphasis from the belief/action delta and page role.
- Make the first three seconds intentional: the audience should know where to look and why.
- Treat typography as information architecture: hierarchy, line length, wrapping, language coverage, and distance legibility matter more than novelty.
- Use color semantically and sparingly enough that exceptions retain force.
- Make imagery specific to the subject; avoid generic stock symbolism and decorative illustration that competes with the claim.
- Choose exhibit grammar from the comparison or explanation task, not the available chart gallery.
- Design the whole-deck rhythm: density, repetition, release, transition, and climax. Variety without a governing grammar is drift.
- Minimal and rich directions both demand exact control. Minimal is not unfinished; rich is not clutter.

Reject default-gradient backgrounds, interchangeable card grids, equal-weight columns, inconsistent icon families, Office-default charts, decorative diagrams, and full-page prose unless the brief itself requires them.

## Hybrid Directions

A hybrid is valid only after the user chooses it and one governing principle resolves conflicts. Do not average directions.

Record:

- which direction owns narrative mode;
- which owns composition and rhythm;
- which owns type, color, imagery, and exhibits;
- where intentional exceptions are allowed;
- what was rejected to avoid incoherence.

If the combination has no single answer to “what makes a page belong to this deck?”, it is not ready.

## Execution Lock

Convert the selected or inherited direction into a compact, implementable lock:

```markdown
Governing principle: [one sentence]
Information hierarchy: [title/body/evidence/annotation order]
Grid and spacing: [columns, margins, baseline, density ranges]
Typography: [roles, sizes/ranges, line rules, fallback behavior]
Color: [tokens, semantic use, contrast, intentional exceptions]
Imagery: [subject, treatment, crop, resolution, rights]
Exhibits: [chart/table/diagram syntax, annotation, uncertainty]
Page rhythm: [sparse/dense/transition/climax pattern]
Capability boundary: [native, hybrid, unsupported, target-specific]
```

The lock governs the full deck but is not a recipe for identical pages. Every departure needs a narrative purpose recorded in the Detail Ledger.

## Representative-Slide Calibration

Calibrate with real content, not lorem ipsum:

1. a sparse opening or transition page;
2. a representative argument page;
3. the densest, most technical, or highest-risk exhibit page.

The set must prove hierarchy, visual identity, sparse/dense range, exhibit grammar, target-distance legibility, and executor feasibility. Render it through the intended production path. If a strong concept depends on unsupported gradients, media, animation, fonts, or editable objects, either adapt the direction honestly or change executor before scale production.

## Approval Record

Record the directions shown, the choice, requested changes, governing principle, accepted risks, capability implications, and approval source. If the user asks the agent to choose, document the rationale and make the selection reversible until calibration passes.
