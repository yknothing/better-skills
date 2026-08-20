# Pattern Library

A library of reusable design patterns extracted from 10 top Agent Skills repositories. Phase 1.C of the project: each pattern lives in its own machine-readable file under `<NN-category>/<slug>.md`, with frontmatter, source attribution, and reverse links to the skills that use it.

**59 patterns** in 8 categories — **22 active** (referenced by skills in `skills.json`) + **37 proposed** (extracted from upstream research, not yet validated by an in-repo skill).

## How this library works

- **One file per pattern**, named by its kebab-case slug. Filename matches the `name:` frontmatter field, which is the same string `skills.json` references.
- **Status**:
  - `active` — at least one skill in `skills.json` references this pattern.
  - `proposed` — extracted from research; awaiting first real use.
  - `deprecated` — kept for history; new skills should not reference. (None today.)
- **Schema**: see [`_schema.md`](./_schema.md) for required frontmatter and body sections.
- **Authoring**: copy [`_template.md`](./_template.md) into the right category directory.
- **Validation**: run `bash tools/check-patterns.sh` from the repo root. It detects ghost references (a skill cites a pattern with no file), orphan active patterns (a file claims `active` but no skill cites it), filename/frontmatter mismatches, and missing required fields. Phase 2.C automates this gate.

## Categories

### 01. 行为约束模式 — Behavior Constraint
*Prevent the agent from skipping critical steps or taking shortcuts.*

| Pattern | Status | Sources | Used by |
|---------|:-:|---------|---------|
| [`anti-pattern-pre-naming`](./01-behavior-constraint/anti-pattern-pre-naming.md) — 反模式预命名 | active | Anthropic, CE, Addy Osmani | bs-prdefine, bs-prose-master, bs-skill-auditor |
| [`format-significance-gates`](./01-behavior-constraint/format-significance-gates.md) — 格式显著性门禁 | active | Anthropic | bs-prdefine, bs-ui-master |
| [`hard-rules-first`](./01-behavior-constraint/hard-rules-first.md) — 硬规则前置 | active | Cursor | (6 skills) |
| [`karpathy-behavior-guardrails`](./01-behavior-constraint/karpathy-behavior-guardrails.md) — Karpathy 行为护栏 | proposed | Karpathy | — |
| [`precise-terminal-states`](./01-behavior-constraint/precise-terminal-states.md) — 精确终端状态 | proposed | Anthropic, Cursor | — |

### 02. 交互设计模式 — Interaction Design
*Control how the agent talks to the user.*

| Pattern | Status | Sources | Used by |
|---------|:-:|---------|---------|
| [`blocking-question-tools`](./02-interaction-design/blocking-question-tools.md) — 阻塞式提问工具 | active | CE | bs-prdefine |
| [`one-question-at-a-time`](./02-interaction-design/one-question-at-a-time.md) — 一次一个问题 | active | Anthropic, CE | bs-prdefine, bs-prose-master |
| [`per-decision-rejudgment`](./02-interaction-design/per-decision-rejudgment.md) — 每次决策重判断 | proposed | Anthropic | — |
| [`rigor-gap`](./02-interaction-design/rigor-gap.md) — Rigor Gap 探测 | active | CE | bs-prdefine |
| [`scoping-synthesis`](./02-interaction-design/scoping-synthesis.md) — Scoping Synthesis | active | CE, Gstack | bs-prdefine |
| [`standalone-message-rule`](./02-interaction-design/standalone-message-rule.md) — 独立消息规则 | proposed | Anthropic | — |

### 03. 质量保证模式 — Quality Assurance
*Make sure what the skill ships is actually good.*

| Pattern | Status | Sources | Used by |
|---------|:-:|---------|---------|
| [`confidence-anchors`](./03-quality-assurance/confidence-anchors.md) — Confidence Anchor | active | CE | bs-ui-master, bs-skill-auditor |
| [`cross-reviewer-agreement`](./03-quality-assurance/cross-reviewer-agreement.md) — Cross-reviewer Agreement | proposed | CE | — |
| [`independent-verification-pass`](./03-quality-assurance/independent-verification-pass.md) — 独立验证 Pass | proposed | CE | — |
| [`interaction-state-enforcement`](./03-quality-assurance/interaction-state-enforcement.md) — 交互状态强制 | active | Taste Skill | bs-ui-master |
| [`multi-perspective-review`](./03-quality-assurance/multi-perspective-review.md) — 多视角审查面板 | active | Gstack, CE | (3 skills) |
| [`self-review-checklist`](./03-quality-assurance/self-review-checklist.md) — 自我审查清单 | active | Anthropic, CE | (4 skills) |
| [`tiered-anti-pattern-rules`](./03-quality-assurance/tiered-anti-pattern-rules.md) — 分级反模式规则 | proposed | Open Design | — |
| [`two-layer-testing`](./03-quality-assurance/two-layer-testing.md) — 两层测试系统 | proposed | Gstack | — |
| [`verification-rules`](./03-quality-assurance/verification-rules.md) — 验证规则 + 自动路由 | active | Vercel | bs-skill-auditor |

### 04. 上下文管理模式 — Context Management
*Keep the skill's token footprint honest.*

| Pattern | Status | Sources | Used by |
|---------|:-:|---------|---------|
| [`context-as-commons`](./04-context-management/context-as-commons.md) — 上下文是公共品 | proposed | Anthropic | — |
| [`evidence-dossier`](./04-context-management/evidence-dossier.md) — Evidence Dossier | proposed | CE | — |
| [`load-stub`](./04-context-management/load-stub.md) — Load Stub | proposed | CE | — |
| [`progressive-disclosure`](./04-context-management/progressive-disclosure.md) — 渐进式披露 | active | Anthropic, CE | (7 skills) |
| [`template-generation`](./04-context-management/template-generation.md) — 模板生成 | proposed | Gstack | — |

### 05. 任务路由模式 — Task Routing
*Decide which skill or which pipeline stage handles what.*

| Pattern | Status | Sources | Used by |
|---------|:-:|---------|---------|
| [`depth-tiers`](./05-task-routing/depth-tiers.md) — 深度分层 | proposed | CE | — |
| [`headless-mode`](./05-task-routing/headless-mode.md) — Headless Mode | proposed | CE, Gstack | — |
| [`multi-signal-trigger`](./05-task-routing/multi-signal-trigger.md) — 多信号触发 | proposed | Vercel | — |
| [`pipeline-architecture`](./05-task-routing/pipeline-architecture.md) — 管道架构 | active | CE, Anthropic | bs-sw-master |
| [`task-domain-classification`](./05-task-routing/task-domain-classification.md) — 任务域分类 | proposed | CE | — |
| [`three-layer-separation`](./05-task-routing/three-layer-separation.md) — 三层分离架构 | proposed | Addy Osmani | — |
| [`trigger-condition-separation`](./05-task-routing/trigger-condition-separation.md) — 触发条件分离 | proposed | Anthropic, Superpowers | — |

### 06. 执行控制模式 — Execution Control
*Govern how the agent actually does the work.*

| Pattern | Status | Sources | Used by |
|---------|:-:|---------|---------|
| [`async-verification`](./06-execution-control/async-verification.md) — 异步验证 | proposed | CE | — |
| [`continuous-execution`](./06-execution-control/continuous-execution.md) — 连续执行 | proposed | Superpowers | — |
| [`execution-posture-signals`](./06-execution-control/execution-posture-signals.md) — 执行姿态信号 | active | CE, Superpowers | bs-sw-master |
| [`freedom-spectrum`](./06-execution-control/freedom-spectrum.md) — 自由度框架 | proposed | Anthropic | — |
| [`model-tiering`](./06-execution-control/model-tiering.md) — 模型分层 | proposed | CE, Superpowers | — |
| [`parallel-safety-check`](./06-execution-control/parallel-safety-check.md) — Parallel Safety Check | proposed | CE | — |
| [`performance-guardrails`](./06-execution-control/performance-guardrails.md) — 性能护栏 | proposed | Taste Skill | — |
| [`precise-commands`](./06-execution-control/precise-commands.md) — 精确命令替代模糊指令 | active | Cursor | bs-sw-master, bs-social-card |
| [`safety-hook-interception`](./06-execution-control/safety-hook-interception.md) — 安全 Hook 拦截 | proposed | Gstack | — |
| [`sentinel-mechanism`](./06-execution-control/sentinel-mechanism.md) — 哨兵机制 | proposed | Cursor | — |
| [`system-level-test-checks`](./06-execution-control/system-level-test-checks.md) — 系统级测试检查 | proposed | CE | — |
| [`worktree-isolation`](./06-execution-control/worktree-isolation.md) — Worktree 隔离 | proposed | CE | — |

### 07. 知识管理模式 — Knowledge Management
*Capture, organize, and reuse knowledge.*

| Pattern | Status | Sources | Used by |
|---------|:-:|---------|---------|
| [`concept-glossary`](./07-knowledge-management/concept-glossary.md) — 概念词汇表 | proposed | CE | — |
| [`cross-session-decision-memory`](./07-knowledge-management/cross-session-decision-memory.md) — 跨会话决策记忆 | proposed | Gstack | — |
| [`knowledge-distillation-pipeline`](./07-knowledge-management/knowledge-distillation-pipeline.md) — 知识沉淀管道 | proposed | CE | — |
| [`knowledge-graph-linking`](./07-knowledge-management/knowledge-graph-linking.md) — 知识图谱关联 | proposed | Vercel | — |
| [`pattern-library`](./07-knowledge-management/pattern-library.md) — 模式库 | active | CE | bs-skill-forge |
| [`upstream-doc-sync`](./07-knowledge-management/upstream-doc-sync.md) — 上游文档同步 | proposed | Vercel | — |

### 08. 技能创建模式 — Skill Creation
*Meta-patterns: how to design and create the skills themselves.*

| Pattern | Status | Sources | Used by |
|---------|:-:|---------|---------|
| [`80-20-design-rules`](./08-skill-creation/80-20-design-rules.md) — 80/20 设计规则 | active | Open Design | bs-ui-master |
| [`beta-skill-pattern`](./08-skill-creation/beta-skill-pattern.md) — Beta Skill 模式 | proposed | CE | — |
| [`exhaustive-precision`](./08-skill-creation/exhaustive-precision.md) — 穷举式精确 | proposed | CE | — |
| [`minimal-precision`](./08-skill-creation/minimal-precision.md) — 极简精确 | active | Cursor | bs-social-card |
| [`named-anti-patterns`](./08-skill-creation/named-anti-patterns.md) — 命名禁止模式 | active | Taste Skill | bs-ui-master |
| [`platform-degradation-rules`](./08-skill-creation/platform-degradation-rules.md) — 平台降级规则 | active | CE | bs-skill-forge |
| [`quantifiable-design-knobs`](./08-skill-creation/quantifiable-design-knobs.md) — 可量化设计旋钮 | proposed | Taste Skill | — |
| [`soul-test`](./08-skill-creation/soul-test.md) — "灵魂" 测试 | proposed | Open Design | — |
| [`tdd-skill-creation`](./08-skill-creation/tdd-skill-creation.md) — TDD 技能创建 | active | Superpowers | bs-skill-forge |

## Sources

| Code | Repository / origin |
|------|---------------------|
| Anthropic   | Anthropic-built skills (Claude Code skill-creator, brainstorming, etc.) |
| Cursor      | Cursor-built skills (`~/.cursor/skills-cursor/`) |
| CE          | Compound Engineering plugin (EveryInc) |
| Gstack      | Gstack (Garry Tan) |
| Vercel      | Vercel plugin |
| Superpowers | Superpowers (obra) |
| Karpathy    | Karpathy guidelines (forrestchang/andrej-karpathy-skills) |
| Taste Skill | Taste Skill (Leonxlnx) |
| Open Design | Open Design (nexu-io) |
| Addy Osmani | Addy Osmani Agent Skills |

URL citations for each source land in Phase 3 of the project roadmap. See `docs/research/` for the underlying analysis files.

## Selecting patterns for a new skill

A first-pass decision tree (refine inside the skill itself):

```
Task shape:
├─ High frequency, high failure cost  → exhaustive-precision + multi-perspective-review + confidence-anchors
├─ High failure cost (deploy/security) → multi-perspective-review + independent-verification-pass + verification-rules
├─ Conversational discovery           → rigor-gap + one-question-at-a-time + scoping-synthesis + self-review-checklist
├─ Simple imperative operation        → minimal-precision + hard-rules-first + precise-commands
├─ Knowledge that needs to compound   → knowledge-distillation-pipeline + pattern-library + concept-glossary
└─ Multi-skill orchestration          → pipeline-architecture + headless-mode + progressive-disclosure
```

Always pair the chosen patterns with [`hard-rules-first`](./01-behavior-constraint/hard-rules-first.md) and [`progressive-disclosure`](./04-context-management/progressive-disclosure.md) — they are the two patterns that benefit nearly every skill regardless of category.

## Related

- [`tools/check-patterns.sh`](../../tools/check-patterns.sh) — pattern library integrity checker
- [`_schema.md`](./_schema.md) — schema for individual pattern files
- [`_template.md`](./_template.md) — copy-paste starting point
- [`docs/research/`](../research/) — the upstream analyses these patterns were extracted from
- [`skills.json`](../../skills.json) — canonical registry; the source of truth for which patterns are `active`
