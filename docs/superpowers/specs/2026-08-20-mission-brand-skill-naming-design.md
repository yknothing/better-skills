# Mission-Brand Skill Naming Design

## Objective

Rename every self-developed Skill around its true operating intent and highest credible expectation. The names should behave as memorable product handles, not as compressed task descriptions. Referenced external Skills keep their upstream names, sources, and paths.

## Naming Contract

Each self-developed Skill has three naming layers:

1. **Canonical ID** — `bs-` plus no more than two core words. This is the stable machine-facing product handle.
2. **Display name** — the human-facing H1 in `SKILL.md`.
3. **Description** — the precise routing contract: trigger, capability, boundary, and important exclusions.

The canonical ID carries identity and expectation. The description carries completeness and disambiguation. A short handle must never silently widen a Skill beyond the workflow it actually implements.

## Approved Names

| Current canonical | Final canonical | Display name | True intent and boundary |
|---|---|---|---|
| `bs-define-requirements` | `bs-prdefine` | PRDefine | Define Product Requirements from ambiguity through a reviewable handoff; not a PRD template writer. |
| `bs-shape-product-direction` | `bs-insight-product` | Insight Product | Turn evidence, dissent, and adversarial pressure into a product-direction decision; not PMF certification. |
| `bs-find-early-customer-prospects` | `bs-prospect-customer` | Prospect Customer | Prospect, qualify, and rank evidence-backed first customers, then design a human validation experiment; not lead scraping or automated outreach. |
| `bs-improve-writing` | `bs-prose-master` | Prose Master | Master prose structure, rhythm, precision, audience fit, and voice preservation without inventing facts. |
| `bs-design-product-interface` | `bs-ui-master` | UI Master | Deliver a production-grade UI loop across visual direction, tokens, layout, states, motion, accessibility, and QA; not complete UX research, information architecture, journeys, or usability studies. |
| `bs-create-social-share-card` | `bs-social-card` | Social Card | Produce and validate a focused 1200x630 social share card; intentionally narrow rather than artificially branded. |
| `bs-illustrate-article` | `bs-visual-article` | Visual Article | Transform a whole article into a coherent visual reading experience through planning, generation, placement, accessibility, and consistency; not decorative image insertion. |
| `bs-implement-code-change` | `bs-sw-master` | SW Master | Master the Software change loop from acceptance criteria and isolation through tests, implementation, review, commit, and authorized push; not deployment or operations. |
| `bs-audit-agent-skills` | `bs-skill-auditor` | Skill Auditor | Perform read-only, evidence-anchored, multi-perspective Skill audits; not direct repair. |
| `bs-create-agent-skill` | `bs-skill-forge` | Skill Forge | Forge a publishable Agent Skill from idea through Reference-vs-Build, patterns, TDD, four gates, and registry integration. |

`PR` is expanded as Product Requirements on first use. `SW` is expanded as Software on first use. `UI Master` explicitly excludes the unsupported parts of a complete UX practice.

## Compatibility Architecture

The resolver canonicalizes aliases in one lookup. Therefore every historical identity must map directly to the final canonical ID; alias chains are forbidden.

| Final canonical | Historical aliases that map directly to it |
|---|---|
| `bs-prdefine` | `requirements-engineering`, `bs-requirements-engineering`, `bs-define-requirements` |
| `bs-insight-product` | `product-discovery`, `bs-product-discovery`, `bs-shape-product-direction` |
| `bs-prospect-customer` | `first-customer-finder`, `bs-first-customer-finder`, `bs-find-early-customer-prospects` |
| `bs-prose-master` | `prose-craft`, `bs-prose-craft`, `bs-improve-writing` |
| `bs-ui-master` | `visual-design`, `bs-visual-design`, `bs-design-product-interface` |
| `bs-social-card` | `social-card`, `bs-create-social-share-card` |
| `bs-visual-article` | `article-illustrate`, `bs-article-illustrate`, `bs-illustrate-article` |
| `bs-sw-master` | `dev-flow`, `bs-dev-flow`, `bs-implement-code-change` |
| `bs-skill-auditor` | `skill-health`, `bs-skill-health`, `bs-audit-agent-skills` |
| `bs-skill-forge` | `skill-bootstrap`, `bs-skill-bootstrap`, `bs-create-agent-skill` |

The `bs-social-card` handle returns to canonical status. It must not also remain an alias key. Across the registry, no alias key may be a canonical ID, every alias target must exist, and no alias may target another alias.

When a manifest contains one or more historical identities, `add` must refuse to create a duplicate and direct the user to `update`. `update`, whether addressed through a final name or a historical alias, must collapse all identities in that family into one final canonical entry.

## Repository Scope

The rename applies to all truth surfaces:

- `skills.json`, Skill directories, `SKILL.md` frontmatter, display H1s, references, scripts, and assets;
- CLI resolver behavior, help text, migration logic, and regression tests;
- evaluation dataset keys and expected paths;
- review directories and review content;
- README, project instructions, research, pattern documentation, and product-strategy references;
- any source-controlled path or content that identifies a self-developed Skill.

The nine external Skill IDs, their source repositories, and their declared paths are invariant.

The internal `pre-dev-flow-*` recovery artifact prefix is not a Skill identity and remains unchanged for backward-compatible recovery.

## Acceptance Contract

The implementation is accepted only when:

1. The ten final directories exist and each frontmatter `name` exactly matches its directory.
2. All descriptions are valid portable YAML, are within the repository length limit, and encode the disambiguation above.
3. The ten canonical IDs and twenty-nine direct aliases resolve to an existing `SKILL.md`.
4. No obsolete directory remains; historical names appear only in explicit compatibility aliases, migration tests, or this migration record.
5. CLI tests cover direct aliases, duplicate prevention, dry-run, alias-initiated update, coexisting historical identities, and update-all convergence.
6. All four repository gates pass, with no hard failures.
7. A dedicated independent Agent performs a read-only full-repository review and reports no blocking finding.
8. The staged diff contains only the intended naming/migration delivery, passes `git diff --check`, and is committed in clean logical batches before pushing to `origin`.
