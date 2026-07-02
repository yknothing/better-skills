# LLM-as-Judge Prompt Template

## Usage

This template is used by the evaluation harness to construct judge prompts for each skill evaluation run. Replace `{placeholders}` with actual values.

---

## Template

```
You are evaluating the output of an AI agent that ran a skill called {skill_name} (version {skill_version}).

## Task Context
The user asked the agent to: {user_prompt}

The skill's documented purpose is: {skill_description}

## Skill Requirements
The skill was expected to produce output meeting these requirements:

{skill_requirements}

## What the Agent Did
The agent ran in working directory: {work_dir}
Exit code: {exit_code}
Duration: {duration_ms}ms
Tool calls made: {tool_call_count}

Summary of agent actions:
{agent_actions_summary}

## Files Produced
{files_list}

## Evaluation Instructions

For each check below, determine whether the requirement was met. You MUST:

1. Inspect the actual files and artifacts produced
2. Compare against the specific requirement
3. Provide concrete evidence for every judgment
4. Return results in the specified JSON schema

## Evaluation Checks

{checks_list}

## Important Rules

- Do NOT favor longer outputs over shorter ones
- Do NOT assume the first approach is better
- Base your judgment SOLELY on whether the stated requirements are met
- If a requirement is ambiguous, note it and score conservatively
- Cite specific file paths, line numbers, or artifact contents as evidence
- A "pass" means the requirement is fully met; "fail" means it is not

## Output Format

Return a JSON object matching the schema defined in the --output-schema flag.
```

---

## Check Construction Guidelines

### Good Checks (Specific, Observable, Verifiable)

```
✅ "Does src/components/Header.tsx exist and export a functional React component?"
✅ "Does package.json contain tailwindcss as a dependency?"
✅ "Does index.css contain '@import \"tailwindcss\"' as its first line?"
✅ "Are all components written as TypeScript (.tsx) files, not JavaScript (.jsx)?"
```

### Bad Checks (Vague, Subjective, Unverifiable)

```
❌ "Is the code good?"
❌ "Does it look professional?"
❌ "Is the design clean?"
❌ "Is it well-organized?"
```

### Check Categories

Tag each check with a category prefix for aggregation:

| Prefix | Category | Example |
|---|---|---|
| `file-` | File existence/structure | `file-components-exist` |
| `cmd-` | Command execution | `cmd-npm-install-ran` |
| `style-` | Style/convention adherence | `style-tailwind-classes` |
| `constraint-` | Explicit constraints | `constraint-no-css-modules` |
| `edge-` | Edge case handling | `edge-empty-input` |
| `fact-` | Factual correctness | `fact-version-number` |

---

## Few-Shot Calibration Examples

### Example 1: Excellent Output (Score: 95)

```json
{
  "overall_pass": true,
  "score": 95,
  "checks": [
    {
      "id": "file-vite-scaffold",
      "pass": true,
      "notes": "package.json exists with vite, react, and typescript dependencies. vite.config.ts is present and correctly configured."
    },
    {
      "id": "style-tailwind-config",
      "pass": true,
      "notes": "index.css contains '@import \"tailwindcss\"' as first line. vite.config.ts includes @tailwindcss/vite plugin. All components use Tailwind utility classes exclusively."
    },
    {
      "id": "file-components-exist",
      "pass": true,
      "notes": "src/components/Header.tsx and src/components/Card.tsx both exist. Header exports a functional component with title and subtitle. Card exports a reusable container component."
    },
    {
      "id": "constraint-no-css-modules",
      "pass": true,
      "notes": "No .module.css files found. No CSS modules imports in any component. All styling is via Tailwind classes."
    }
  ],
  "dimensions": {
    "correctness": 95,
    "completeness": 100,
    "style_adherence": 95,
    "constraint_satisfaction": 100,
    "edge_case_handling": 85
  },
  "issues": [
    {
      "severity": "cosmetic",
      "description": "Card.tsx uses a div wrapper that could be simplified to a fragment",
      "location": "src/components/Card.tsx:3"
    }
  ]
}
```

### Example 2: Mediocre Output (Score: 65)

```json
{
  "overall_pass": false,
  "score": 65,
  "checks": [
    {
      "id": "file-vite-scaffold",
      "pass": true,
      "notes": "Vite project scaffolded correctly with React + TypeScript template."
    },
    {
      "id": "style-tailwind-config",
      "pass": false,
      "notes": "Tailwind is configured using the legacy PostCSS approach (postcss.config.js exists) instead of the required @tailwindcss/vite Vite plugin. The CSS file uses @tailwind directives instead of @import \"tailwindcss\"."
    },
    {
      "id": "file-components-exist",
      "pass": true,
      "notes": "Header.tsx and Card.tsx exist but Card.tsx does not accept children props, making it less reusable."
    },
    {
      "id": "constraint-no-css-modules",
      "pass": true,
      "notes": "No CSS modules detected."
    }
  ],
  "dimensions": {
    "correctness": 60,
    "completeness": 75,
    "style_adherence": 50,
    "constraint_satisfaction": 60,
    "edge_case_handling": 50
  },
  "issues": [
    {
      "severity": "major",
      "description": "Tailwind configured via PostCSS instead of required Vite plugin approach",
      "location": "postcss.config.js"
    },
    {
      "severity": "minor",
      "description": "Card component is not reusable (missing children prop)",
      "location": "src/components/Card.tsx"
    }
  ]
}
```

### Example 3: Poor Output (Score: 25)

```json
{
  "overall_pass": false,
  "score": 25,
  "checks": [
    {
      "id": "file-vite-scaffold",
      "pass": false,
      "notes": "No vite.config.ts found. Project appears to have been created with create-react-app instead of Vite."
    },
    {
      "id": "style-tailwind-config",
      "pass": false,
      "notes": "No Tailwind configuration found. index.css contains regular CSS, not Tailwind imports."
    },
    {
      "id": "file-components-exist",
      "pass": false,
      "notes": "Only App.tsx exists. Header.tsx and Card.tsx are missing from src/components/."
    },
    {
      "id": "constraint-no-css-modules",
      "pass": true,
      "notes": "No CSS modules detected (though this is moot given other failures)."
    }
  ],
  "dimensions": {
    "correctness": 20,
    "completeness": 25,
    "style_adherence": 10,
    "constraint_satisfaction": 25,
    "edge_case_handling": 0
  },
  "issues": [
    {
      "severity": "critical",
      "description": "Wrong scaffolding tool used (create-react-app instead of Vite)",
      "location": "package.json"
    },
    {
      "severity": "critical",
      "description": "Tailwind CSS not configured at all",
      "location": "N/A"
    },
    {
      "severity": "critical",
      "description": "Required components Header.tsx and Card.tsx are missing",
      "location": "src/components/"
    }
  ]
}
```

---

## Calibration Procedure

1. Collect 100-200 agent outputs across different skill types and quality levels
2. Have 2-3 domain experts independently score each output using this rubric
3. Calculate inter-rater reliability (Cohen's kappa >= 0.7 target)
4. Run LLM judge on the same set with temperature=0, 3 replicates
5. Calculate Spearman correlation between LLM judge consensus and human consensus
6. If correlation < 0.80:
   - Add more few-shot examples in the failing quality range
   - Refine check descriptions to be more specific
   - Add explicit bias disclaimers for observed bias patterns
7. Re-calibrate until correlation >= 0.80
