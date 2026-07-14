<!-- Parent skill: skills/bs-skill-bootstrap/SKILL.md -->
<!-- Open this file when: Step 5 (Create Test Prompts) is reached and you need the full RED-GREEN-REFACTOR procedure -->

# TDD for Skills

> **Parent skill**: [../SKILL.md](../SKILL.md) — this is Step 5 (Create Test Prompts)
> **Prerequisites**: Step 4 complete (SKILL.md draft written), depth tier selected, patterns documented
> **Depends on**: the draft SKILL.md file at `skills/<skill-name>/SKILL.md`

## Overview

TDD for skills adapts the classic RED-GREEN-REFACTOR loop to skill creation. Instead of testing code behavior, you test agent behavior: given a prompt, does the agent follow the skill correctly? The three phases ensure skills are validated before they ship, not after.

This is the reverse polarity of ad-hoc skill writing:

- **Ad-hoc**: write the skill, then (maybe) test it, then discover failures in production.
- **TDD for skills**: write test prompts first (RED), confirm they fail without the skill, write the skill (GREEN), then tighten constraints (REFACTOR).

---

## Workflow

### RED Phase — Baseline Verification

1. Write 3 test prompts that the new skill should handle. Each prompt must cover a distinct category:

   | Category | What it tests |
   |----------|--------------|
   | **Happy path** | The skill's core workflow. A straightforward, well-formed request that exercises the full pipeline. |
   | **Edge case** | Ambiguous, incomplete, or boundary inputs. Tests the skill's clarifying questions and error handling. |
   | **Adversarial** | A request that tries to bypass the skill's constraints. Tests Hard Rules enforcement. |

2. **Executed baseline (preferred — when subagent dispatch is available):** dispatch a fresh subagent that does NOT have the skill loaded, give it the naive version of each test prompt (the request a user would make without knowing the skill exists), and record verbatim what it does — especially which steps it skips and how it justifies skipping them. An observed failure is a far stronger RED baseline than a predicted one, and the justifications you capture are raw material for the skill's Red Flags table.

3. **Control-prompt comparison (fallback — works on all platforms):** if subagents are unavailable:

   - Write the naive prompt as above. Example: instead of "use the git-commit skill to write a commit message," use "write a good commit message for these changes."
   - Predict what a skill-less agent would miss. For each test prompt, document: "Without the skill, an agent would likely: [specific failure]. With the skill, the agent should: [specific correct behavior]."
   - This prediction serves as the RED phase baseline. It is documented (not executed), so it works on any platform.

4. Record baseline results (or predictions, clearly labeled as unexecuted) in the SKILL.md Test Prompts section.

### GREEN Phase — Verification Plan

For each test prompt, document how you will verify it succeeds after the skill is complete:

1. Invoke the skill with the test prompt.
2. Compare output against the expected behavior documented in RED phase.
3. If output does not match expected behavior, the skill is incomplete — return to drafting.

### REFACTOR Phase — Close the Loopholes

Read the skill with adversarial intent. Ask: "If I were a lazy agent, how would I exploit this skill?" Close the loopholes.

Specific tactics:
- **Vague language audit**: Replace "consider" with "decide and document", "try to" with "do", "if possible" with a concrete condition.
- **Exit condition audit**: Does every step have a clear "done" signal? If not, add one.
- **Hard Rules audit**: Can any Hard Rule be circumvented by creative interpretation? Tighten the language.
- **Boundary audit**: Does the skill try to do something outside its stated boundaries? Remove it.

**Pressure-test loop (when subagent dispatch is available):** self-audit finds the loopholes you can imagine; pressure testing finds the ones you cannot.

1. Dispatch a fresh subagent WITH the skill content in context and give it the adversarial prompt, amplified with at least two combined pressures — e.g., time ("we ship in 10 minutes"), sunk cost ("we already wrote the implementation"), authority ("the tech lead said skip the checks"), exhaustion ("this is the fifth attempt, just get it done").
2. Observe whether it violates any Hard Rule. Record every rationalization it produces **verbatim** — those exact sentences are the failure modes your skill must name.
3. For each captured rationalization, add a `Thought | Reality` row to the skill's Red Flags table and tighten the rule it bypassed.
4. Re-dispatch a fresh subagent (never reuse one that has seen your fixes) and repeat until the subagent either complies or explicitly cites the skill's rule while refusing the pressure. Cap at 3 iterations; if loopholes persist, the skill's structure — not its wording — is the problem.

If subagents are unavailable, note "pressure test deferred — self-audit only" in the Test Prompts section so the gap is visible instead of silent.

### Exit Condition

3 test prompts written with expected behavior and failure modes. Proceed to Step 6 (Run Validation).

---

## Anti-patterns

- **Writing tests after the skill body.** TDD requires tests first. Writing tests after the skill means you are confirming what you already wrote, not testing what the skill should do.
- **Generic prompts.** "Create a skill" is not a test. Prompts must exercise specific behaviors: the happy path should use a realistic domain, the edge case should be genuinely ambiguous, the adversarial should be a plausible user request.
- **Skipping the adversarial prompt.** The adversarial prompt is the most important — it proves the skill's Hard Rules are enforceable, not aspirational.
- **Vague expected behavior.** "Agent produces a valid skill" is not specific enough. Name the exact steps, outputs, and gates the agent must satisfy.

---

## Related

- [../SKILL.md Step 5](../SKILL.md) — where this procedure is invoked
- [../SKILL.md Hard Rules](../SKILL.md) — constraints the adversarial prompt must test
- [../../docs/patterns/README.md](../../docs/patterns/README.md) — TDD for skills pattern origin (Superpowers)
