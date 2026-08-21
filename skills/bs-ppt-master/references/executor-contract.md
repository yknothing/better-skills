<!-- Parent skill: skills/bs-ppt-master/SKILL.md -->

# Executor Contract

PPT Master is an executor-neutral control layer. Select tools from evidence, lifecycle fit, and delivery needs. Never let the installed tool define the product promise after the fact.

## Evidence States

- `NOT_FOUND` — no candidate was found in the inspected locations.
- `DETECTED` — a candidate path, binary, application, or Skill exists. This proves discovery only.
- `SUPPORTED` — an attributable manifest, documentation surface, or maintained adapter declares a capability with known conditions and limits.
- `VERIFIED` — the current artifact passed the relevant smoke, V4, or V5 check using the named tool and environment.
- `UNVERIFIED` — no adequate current evidence exists. This is the default for feature and target claims.

`DETECTED` must never be promoted to `SUPPORTED` or `VERIFIED` by inference. A binary called `soffice`, an application bundle named PowerPoint, or an installed `pptx` Skill does not prove a particular file can preserve masters, edit charts, play video, or render correctly.

The bundled `scripts/capability-probe.js` is discovery-only. It never executes a candidate and never verifies a feature.

## Capability Manifest

Complete one manifest per serious executor candidate:

```markdown
Identity and version: [name/version/path]
Evidence source/date: [manifest, docs, adapter, or smoke artifact]
Lifecycle modes: [CREATE/REVISE/FILL/ENHANCE]
Preservation: [existing PPTX, untouched slides, masters/layouts/placeholders]
Output class: [native/hybrid/raster by object type]
Objects: [text, shape, image, table, chart, diagram]
Behavior: [notes, links, animation, audio, video]
Fonts and assets: [embed/substitute/package behavior]
Render path: [preview/contact sheet]
Validation path: [package/object/target checks]
Runtime and network: [dependencies, local service, external service, target app]
License and attribution: [code, adapter, fonts, templates, assets]
Known limits and failure modes: [explicit]
Evidence status: [DETECTED/SUPPORTED/VERIFIED per claim]
```

Broad marketing or README language is weaker than a versioned manifest or current smoke artifact. Record the evidence source, not just the conclusion.

## Native, Hybrid, and Raster

- **Native** means the final PPTX contains object types that remain editable and behave as claimed in the verified target.
- **Hybrid** means some elements are native and some are flattened or externally dependent. Enumerate which is which.
- **Raster** means a page or element is an image. It may preserve pixels but not semantic editability.

HTML is a valid authoring and review surface, but not proof of PPTX fidelity. SVG, canvas, CSS effects, gradients, filters, and browser layout may be flattened or altered in export. A screenshot deck must be called a screenshot deck.

## Selection Order

Choose by:

1. an executor explicitly required by the user that can meet the contract;
2. lifecycle preservation fit;
3. current hard delivery requirements;
4. native editability and round-trip fidelity;
5. visual, data, media, and interaction needs;
6. available render and validation evidence;
7. target-software verification path;
8. rights, privacy, cost, and speed.

The external `pptx` Skill is a default editable-PPTX candidate when installed and suitable, not a complete native runtime and not an automatic pass. Independent PPT systems may be connected through adapters; they remain external dependencies and retain their licenses.

## Downgrade Decision

When no candidate meets the contract, stop before production and offer bounded choices:

- adapt the design to verified native primitives;
- install or select a more suitable executor;
- accept a hybrid file and enumerate rasterized or unsupported elements;
- explicitly accept a whole-slide screenshot deck;
- accept `DESIGN_ONLY` without claiming final PPTX readiness.

For each option state what is preserved, what is lost, which V-layers remain possible, target risk, and recovery path. Consent must identify the actual loss; acceptance of “a fallback” is too vague.

## Rights, Privacy, and Runtime

- Do not copy code, prompts, templates, fonts, or assets from reference repositories.
- Preserve license and attribution requirements when calling independently installed tools or using third-party assets.
- Keep restricted material local unless the current project rules and user authorize the named service and data scope.
- Bind preview services to loopback by default and close them after use.
- Do not package secrets, hidden review comments, credential files, or local temporary paths into the deck.
- Record external font, image, icon, video, template, and data rights.

## Evidence Ledger

For every delivery claim, record:

```markdown
Claim: [e.g. charts remain editable]
Executor/version: [identity]
Artifact: [exact file]
Evidence: [manifest, object inspection, open/save/reopen, rendered result]
State: SUPPORTED | VERIFIED | UNVERIFIED
Limits: [object types, slides, target, conditions]
```

A state applies only to its recorded scope. One verified native chart does not verify every chart, animation, master, or future deck.
