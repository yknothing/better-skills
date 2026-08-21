# PPT Master Skill 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use `executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 `bs-ppt-architecture` 升级为唯一的自研 PPT 主入口 `bs-ppt-master`，保留已经验证的论证与 exhibit 内核，新增全生命周期、艺术指导、Detail Master、可插拔执行器和 V1–V5 成品验证，并完成迁移、评审、forward test 与全仓终审。

**Architecture:** `SKILL.md` 只负责硬规则、模式路由、七阶段总流程、资源加载和终态契约；现有 `architecture.md`、`exhibits.md` 与 claim-ledger 工具原样保留行为，五个新 reference 分别承载 Lifecycle、Art Direction、Detail Master、Executor Contract 和 Verification。一个 discovery-only probe 只记录候选工具、Skill 和应用是否被发现，绝不把 `DETECTED` 提升为 `SUPPORTED` 或 `VERIFIED`。

**Tech Stack:** Markdown Agent Skills、JSON registry/evaluation、Node.js 18+ 零依赖脚本、Bash 回归测试、Better-Skills CLI 与 Gate 1–4 工具链。

---

## 实施原则

- 设计规范以 [`docs/superpowers/specs/2026-08-21-ppt-master-skill-design.md`](../specs/2026-08-21-ppt-master-skill-design.md) 为准。
- PPT 成品检查始终称为 `V1–V5`；`Gate 1–4` 只指 Better-Skills 仓库发布流程。
- 外部 `pptx` 继续保持 external source 身份，不改名、不复制、不转为 alias。
- 旧 `docs/reviews/bs-ppt-architecture/`、旧 spec 和旧 plan 是历史证据，不批量替换。
- `git mv` 后不保留旧目录、软链接或第二份 Skill。
- 不复制 `ppt-master`、Dashi 或 Baoyu 的代码、提示词、模板、字体和资产。
- 不修改 claim-ledger checker 的行为或 fixture schema，只更新父 Skill 路径和产品名注释。
- `.claude/settings.json`、`.claude/hooks/`、`.codex/`、`AGENTS.md`、`docs/product-strategy/` 是用户既有改动，任何提交都不得包含。
- `tools/test-cli.sh` 会临时修改仓库 source fixture，只能在并行编辑结束后独占串行运行。

## 文件职责图

### 移动并修改

- `skills/bs-ppt-architecture/` → `skills/bs-ppt-master/`
- `skills/bs-ppt-master/SKILL.md`：主入口、硬规则、七阶段工作流、渐进披露、终态和输出契约。
- `skills/bs-ppt-master/references/architecture.md`：保留 belief delta、sharp claim、pillars、title chain、证据分级和文档用途例外。
- `skills/bs-ppt-master/references/exhibits.md`：保留 baseline、incompressibility、small multiples、table 和证据自足规则。
- `skills/bs-ppt-master/scripts/check-claim-ledger.js`：只更新 canonical 注释，不改行为。
- `skills/bs-ppt-master/scripts/test-checker.sh`：只更新 canonical 注释，不改断言。
- `skills/bs-ppt-master/assets/claims*.md`：只更新 parent path。

### 新建

- `skills/bs-ppt-master/references/lifecycle.md`：`CREATE / REVISE / FILL / ENHANCE` 的授权和保护契约。
- `skills/bs-ppt-master/references/art-direction.md`：三套完整方向、execution lock、校准页和审美原则。
- `skills/bs-ppt-master/references/detail-master.md`：Detail Ledger、四次介入、逐页与 contact sheet 检查、Detail Report。
- `skills/bs-ppt-master/references/executor-contract.md`：capability manifest、执行器选择、降级同意、许可证和数据边界。
- `skills/bs-ppt-master/references/verification.md`：V1–V5、修复回路、Capability Report、目标环境和终态。
- `skills/bs-ppt-master/scripts/capability-probe.js`：只读 discovery-only 探测，稳定 JSON schema。
- `skills/bs-ppt-master/scripts/test-capability-probe.js`：隔离 fixture，锁定“不把发现当验证”的行为。
- `docs/reviews/bs-ppt-master/2026-08-21-{advocate,adversary}-prompt.md`：Gate 2 生成的当前 Skill 快照。
- `docs/reviews/bs-ppt-master/2026-08-21-{advocate,adversary}-review.md`：独立评审。
- `docs/reviews/bs-ppt-master/2026-08-21-gate2-response.md`：findings 处置账本。
- `docs/reviews/bs-ppt-master/2026-08-21-forward-test.md`：fresh-context 行为测试证据。
- `docs/reviews/bs-ppt-master/2026-08-21-final-audit.md`：独立只读全仓验收。

### 修改当前真源

- `skills.json`
- `tools/test-cli.sh`
- `evaluation/datasets/batch-1-test-prompts.json`
- `README.md`
- `docs/insights/ppt-architecture.md`
- `docs/insights/ppt-attention-ledger.md`
- `skills/bs-skill-forge/SKILL.md`
- `docs/superpowers/specs/2026-08-21-ppt-master-skill-design.md`

### 保持不变

- `external/sources.yaml`
- `skills.json` 中 external `pptx` 的 source/path/tier/status
- `docs/reviews/bs-ppt-architecture/**`
- `docs/superpowers/specs/2026-08-20-mission-brand-skill-naming-design.md`
- `docs/superpowers/plans/2026-08-20-mission-brand-skill-renaming.md`

## Task 1：冻结迁移前基线

**Files:**
- Read: `skills/bs-ppt-architecture/**`
- Read: `skills.json`
- Read: `evaluation/datasets/batch-1-test-prompts.json`

- [x] **Step 1：记录工作树和外部 source 边界**

Run:

```bash
git status --short --branch
git diff HEAD -- external/sources.yaml
```

Expected: 分支为 `codex/ppt-master-skill`；`external/sources.yaml` 对 HEAD 无差异；只有已知用户文件为脏。

- [x] **Step 2：运行旧 Skill 基线**

Run:

```bash
bash tools/validate.sh skills/bs-ppt-architecture/
bash skills/bs-ppt-architecture/scripts/test-checker.sh
node tools/peer-review.js check bs-ppt-architecture
node tools/pattern-alignment.js bs-ppt-architecture --json
node evaluation/harness/runner.js --skill bs-ppt-architecture --json
```

Expected:

- Gate 1 `16 passed / 0 failed`
- claim-ledger `18 pass / 0 fail`
- Gate 2 `1/1`
- Gate 3 `0 hard_fail / 0 soft_warn`
- Gate 4 结构检查 `100`；不得称为实际 agent 或 PPTX 效果测试

## Task 2：先写身份迁移和 CLI 失败测试

**Files:**
- Modify: `tools/test-cli.sh:105-254`
- Modify: `tools/test-cli.sh:573` 之前新增 PPT 专项迁移场景

- [ ] **Step 1：把 canonical/H1/alias 预期改为新身份**

在 `expectedCanonical` 中将：

```js
'bs-ppt-architecture'
```

改为：

```js
'bs-ppt-master'
```

在 `expectedH1` 中写入：

```js
'bs-ppt-master': 'PPT Master'
```

在 `requiredDescriptionLanguage` 中写入：

```js
'bs-ppt-master': [
  'creating, revising, filling, or enhancing',
  'designed and verified together'
]
```

在 `expectedAliases` 末尾新增直接映射：

```js
'bs-ppt-architecture': 'bs-ppt-master'
```

- [ ] **Step 2：新增旧 canonical 的安装与迁移场景**

在最终结果前新增 `T28`，fixture 只使用临时 target：

```bash
echo "T28: PPT Architecture alias installs and migrates to PPT Master"
PPT_ALIAS_DIR="$SANDBOX/ppt-master-alias"
mkdir -p "$PPT_ALIAS_DIR"
out=$(run_cli add bs-ppt-architecture --target "$PPT_ALIAS_DIR" 2>&1); rc=$?
assert_exit "PPT legacy alias add exit 0" 0 "$rc"
echo "$out" | grep -q "'bs-ppt-architecture' is deprecated; using canonical skill ID 'bs-ppt-master'" && PASS=$((PASS + 1)) || FAIL=$((FAIL + 1))
assert_path_exists "PPT alias created canonical directory" "$PPT_ALIAS_DIR/bs-ppt-master/SKILL.md"
assert_path_missing "PPT alias did not create old directory" "$PPT_ALIAS_DIR/bs-ppt-architecture"

PPT_MIGRATION_DIR="$SANDBOX/ppt-master-migration"
mkdir -p "$PPT_MIGRATION_DIR"
cp -R "$REPO_ROOT/skills/bs-ppt-master" "$PPT_MIGRATION_DIR/bs-ppt-architecture"
node -e "
const fs = require('fs');
const path = require('path');
function filesUnder(root, dir = root, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) filesUnder(root, absolute, out);
    else out.push(path.relative(root, absolute).split(path.sep).join('/'));
  }
  return out;
}
const source = process.argv[1];
const target = process.argv[2];
const installed = {
  'bs-ppt-architecture': {
    source: 'self-developed',
    from: 'skills/bs-ppt-architecture',
    installed_at: '2026-01-01T00:00:00.000Z',
    method: 'copy',
    files: filesUnder(source)
  }
};
fs.writeFileSync(path.join(target, '.better-skills.json'), JSON.stringify({ version: '0.2.0-dev', installed }, null, 2) + '\n');
" "$REPO_ROOT/skills/bs-ppt-master" "$PPT_MIGRATION_DIR"; rc=$?
assert_exit "PPT legacy fixture setup exit 0" 0 "$rc"
run_cli add bs-ppt-master --target "$PPT_MIGRATION_DIR" >/dev/null 2>&1; rc=$?
assert_exit "PPT canonical add refuses duplicate legacy install" 4 "$rc"
run_cli update bs-ppt-architecture --target "$PPT_MIGRATION_DIR" >/dev/null 2>&1; rc=$?
assert_exit "PPT alias update migrates legacy install" 0 "$rc"
assert_path_exists "PPT migration created canonical directory" "$PPT_MIGRATION_DIR/bs-ppt-master/SKILL.md"
assert_path_missing "PPT migration removed old directory" "$PPT_MIGRATION_DIR/bs-ppt-architecture"
node -e "
const m = JSON.parse(require('fs').readFileSync(process.argv[1], 'utf8'));
const names = Object.keys(m.installed).sort();
if (JSON.stringify(names) !== JSON.stringify(['bs-ppt-master'])) process.exit(1);
" "$PPT_MIGRATION_DIR/.better-skills.json"; rc=$?
assert_exit "PPT migration manifest has one canonical identity" 0 "$rc"
echo
```

- [ ] **Step 3：运行测试确认 RED**

Run:

```bash
bash tools/test-cli.sh
```

Expected: T2 在 registry canonical/path/H1 尚未迁移时失败；cleanup 恢复 `skills.json` 和 `external/sources.yaml`，用户脏文件集合不增加。

## Task 3：真实迁移目录并建立 PPT Master 主入口

**Files:**
- Move: `skills/bs-ppt-architecture/` → `skills/bs-ppt-master/`
- Rewrite: `skills/bs-ppt-master/SKILL.md`
- Modify: `skills/bs-ppt-master/references/{architecture,exhibits}.md`
- Modify: `skills/bs-ppt-master/scripts/{check-claim-ledger.js,test-checker.sh}`
- Modify: `skills/bs-ppt-master/assets/claims*.md`
- Create: `skills/bs-ppt-master/references/{lifecycle,art-direction,detail-master,executor-contract,verification}.md`

- [ ] **Step 1：移动目录，不保留第二入口**

Run:

```bash
git mv skills/bs-ppt-architecture skills/bs-ppt-master
test ! -e skills/bs-ppt-architecture
```

Expected: 旧目录不存在，新目录保留 8 个既有 bundled files。

- [ ] **Step 2：先更新所有 parent path 和产品名注释**

只修改以下字符串，不改 checker 逻辑或 fixtures 数据：

```text
skills/bs-ppt-architecture/SKILL.md -> skills/bs-ppt-master/SKILL.md
bs-ppt-architecture requirements   -> bs-ppt-master Architecture requirements
load-bearing claim of bs-ppt-architecture -> load-bearing claim of bs-ppt-master
```

Run:

```bash
bash skills/bs-ppt-master/scripts/test-checker.sh
```

Expected: `18 pass / 0 fail`。

- [ ] **Step 3：重写 `SKILL.md`，只保留共享控制层**

Frontmatter 必须是：

```yaml
---
name: bs-ppt-master
description: Use when creating, revising, filling, or enhancing a PPT or slide deck whose argument, visual system, editability, details, and final artifact must be designed and verified together.
# tier: deep
---
```

H1 为 `# PPT Master`。入口正文必须包含十条不可绕过规则：生命周期先行、Brief 与 evidence 先行、内容和视觉共同演进、单一内容真源、授权范围内的三方向、关键页校准、executor 证据、四次 Detail Master、渲染后重验、目标软件未验即 `UNVERIFIED`。

入口工作流固定为：

```text
Phase 0 Route and preserve
Phase 1 Confirm the delivery brief
Phase 2 Discover the presentation insight
Phase 3 Choose and lock art direction
Phase 4 Calibrate representative slides
Phase 5 Produce from one canonical model
Phase 6 Verify, repair, and deliver
```

入口必须明确按条件加载 reference：

| 条件 | 必读 reference |
|---|---|
| 任何 PPT 任务开始 | `lifecycle.md` |
| 决策、说服、战略或 claim-heavy Deck | `architecture.md` |
| 有数据、比较、图表或表格 | `exhibits.md` |
| `CREATE` 或允许改变视觉系统 | `art-direction.md` |
| execution lock 已形成或进入最终检查 | `detail-master.md` |
| 需要生成、修改或导出文件 | `executor-contract.md` |
| 产生任何待交付 artifact | `verification.md` |

终态只允许 `DELIVERED`、`DELIVERED_WITH_ACCEPTED_LIMITATIONS`、`BLOCKED`、`DESIGN_ONLY`。

- [ ] **Step 4：新增 Lifecycle reference**

`lifecycle.md` 必须写入：四模式的 use-when、自由度和 preservation contract；原文件/可恢复副本；`REVISE` 的 authorized/untouched lists；`FILL` 的 master/layout/placeholder/slide-size 保护；`ENHANCE` 的 meaning-change confirmation；设计自由为零时不强制三方向；模式不明时一次只问一个改变判断的问题。

- [ ] **Step 5：新增 Art Direction reference**

每个方向固定包含 `name / narrative mode / visual thesis / type-color / composition-whitespace / image-exhibit grammar / representative slide / fit / advantage / risk / executor implications`。换色或换字体不算新方向；hybrid 先解决统领原则；execution lock 固定信息层级、visual grammar、page rhythm 和 capability boundary；校准页同时覆盖 sparse 和 dense。

- [ ] **Step 6：新增 Detail Master reference**

提供 Detail Ledger、Specification/Calibration/Whole-deck/Delivery 四次介入、逐页与 contact sheet 双尺度检查、intentional exception、修复后重渲染、独立 reviewer 和 Detail Report。

- [ ] **Step 7：新增 Executor Contract reference**

使用三层证据状态：`DETECTED` 仅表示发现候选；`SUPPORTED` 表示执行器有可追溯声明；`VERIFIED` 表示当前 artifact 通过 smoke/V4/V5。Capability manifest 必含 identity、lifecycle、preservation、native/hybrid/raster、master/layout/placeholder、notes/media/font、render/validation、runtime/network、license、limits 和 evidence。外部 `pptx` 是基础候选，不是完整原生运行时。

- [ ] **Step 8：新增 Verification reference**

分别定义 V1 内容与证据、V2 叙事与决策、V3 细节与视觉渲染、V4 原生文件与 package integrity、V5 目标软件。每层只有 `PASS / BLOCKED / UNVERIFIED`；PowerPoint 为默认真实性基准；结构检查或 LibreOffice 渲染不能替代 V5。输出包含 Mode、Direction、Artifact、Target、五层状态、Native/Hybrid/Raster、Detail Report 和 Remaining Risks。

## Task 4：用确定性测试实现 discovery-only probe

**Files:**
- Create: `skills/bs-ppt-master/scripts/test-capability-probe.js`
- Create: `skills/bs-ppt-master/scripts/capability-probe.js`

- [ ] **Step 1：先写隔离测试**

用 `fs.mkdtempSync(path.join(os.tmpdir(), 'ppt-master-probe-'))` 创建 `skills/pptx/SKILL.md`、`bin/soffice`、`apps/Microsoft PowerPoint.app/`。假 `soffice` 若被执行会写 sentinel。调用：

```bash
node scripts/capability-probe.js --json --isolated --skill-root <fixture>/skills --bin-root <fixture>/bin --app-root <fixture>/apps
```

断言 schema_version=1、probe_scope=`discovery-only`、三类候选为 `DETECTED`、所有 feature support 与 V5 为 `UNVERIFIED`，sentinel 不存在。再覆盖空隔离环境、未知参数、缺失参数和 human-readable 输出；在 `finally` 清理 fixture。

- [ ] **Step 2：运行测试确认 RED**

Run: `node skills/bs-ppt-master/scripts/test-capability-probe.js`

Expected: FAIL，原因是 `capability-probe.js` 尚不存在。

- [ ] **Step 3：实现最小 probe**

脚本必须是 CommonJS、零依赖、只用 `fs/path/os`；只检查路径存在和 executable bit，绝不执行候选；默认检查 repo external、`~/.agents/skills`、`~/.codex/skills`、`PATH` 和 macOS `/Applications`；`--isolated` 禁用默认路径；三个 root 参数可重复；`--json` 输出稳定 schema；未知参数或缺值退出 2；候选缺失仍退出 0；固定提示 `Discovery is not capability verification. Validate the current artifact through V4 and V5.`。

- [ ] **Step 4：运行测试确认 GREEN**

Run:

```bash
node skills/bs-ppt-master/scripts/test-capability-probe.js
node skills/bs-ppt-master/scripts/capability-probe.js --json
```

Expected: 测试全绿；真实探测结果可随本机变化，但功能和 V5 初始状态始终 `UNVERIFIED`。

## Task 5：迁移 registry、CLI、评测与当前文档真源

**Files:**
- Modify: `skills.json`
- Modify: `evaluation/datasets/batch-1-test-prompts.json`
- Modify: `README.md`
- Modify: `docs/insights/ppt-architecture.md`
- Modify: `docs/insights/ppt-attention-ledger.md`
- Modify: `skills/bs-skill-forge/SKILL.md`
- Modify: `docs/superpowers/specs/2026-08-21-ppt-master-skill-design.md`

- [ ] **Step 1：更新 registry 和一跳 alias**

将 canonical 改为 `bs-ppt-master`、path 改为 `skills/bs-ppt-master/SKILL.md`、tier 保持 deep；patterns 使用 `hard-rules-first / progressive-disclosure / verification-rules / confidence-anchors / named-anti-patterns / format-significance-gates / multi-perspective-review / 80-20-design-rules`；notes 明确 full-lifecycle、Detail Master、V1–V5 和 external `pptx` executor。Batch 1 替换旧名，aliases 新增 `"bs-ppt-architecture": "bs-ppt-master"`。

- [ ] **Step 2：运行 CLI 迁移测试确认 GREEN**

Run only after all parallel edits stop: `bash tools/test-cli.sh`

Expected: T1–T28 全部通过；external `pptx` source/path 保持通过。

- [ ] **Step 3：把 evaluation key 迁移并扩展为 12 个场景**

Key 改为 `bs-ppt-master`，tier 保持 deep。场景 ID：

```text
ppt-master-happy-create
ppt-master-edge-inert-claim
ppt-master-adversarial-hide-evidence
ppt-master-revise-preservation
ppt-master-fill-template
ppt-master-enhance-meaning
ppt-master-detail-contradiction
ppt-master-detail-style-callback
ppt-master-native-claim
ppt-master-hybrid-downgrade
ppt-master-target-unverified
ppt-master-rights-quick-pressure
```

每项填写完整 `id/name/prompt/expected_behavior/failure_mode_without_skill`，且 expected behavior 可观察。Run `node evaluation/harness/runner.js --skill bs-ppt-master --json`，Expected: 12 evals、结构与三类型完整性 100；不得宣称真实 agent/PPTX/A-B 通过。

- [ ] **Step 4：更新 README 当前真相**

更新自研列表、Batch 表、insight 关系、唯一 PPT 主入口场景和 Quick start；外部 `pptx` 只描述为 executor。修正“Gate 4 已 mechanized”和“runner not wired”的冲突：确定性结构 harness 已接通，真实 agent、LLM judge、A/B 和效果评测仍未接通。

- [ ] **Step 5：更新两个 insight，不篡改历史推导**

`ppt-architecture.md` 当前落地链接改到 `skills/bs-ppt-master/`，说明旧 Architecture 已成为内部模块和历史 alias。`ppt-attention-ledger.md` 加 superseding note：外部 `pptx` 仍是 executor，注意力/叙事/细节已整合进 `bs-ppt-master`，旧 `bs-attention-ledger` 不再单独实施。

- [ ] **Step 6：修正 Skill Forge 的重复建设测试**

PowerPoint adversarial test 必须先发现自研 `bs-ppt-master` 并建议复用或扩展；外部 `pptx` 是执行能力，而不是再次创建 PPT Skill 的理由。

- [ ] **Step 7：回写设计规范中的 probe 决策**

明确第一版 probe 只输出 `DETECTED / NOT_FOUND` 和 evidence，不生成 `SUPPORTED / VERIFIED`；后两者只能来自 executor manifest、smoke artifact 和 V4/V5。

- [ ] **Step 8：运行窄验证并提交第一批实现**

Run:

```bash
bash tools/validate.sh skills/bs-ppt-master/
bash skills/bs-ppt-master/scripts/test-checker.sh
node skills/bs-ppt-master/scripts/test-capability-probe.js
node tools/pattern-alignment.js bs-ppt-master --strict --json
node evaluation/harness/runner.js --skill bs-ppt-master --json
git diff --check
```

Stage only named task paths, inspect staged diff, then commit `feat: promote PPT architecture to PPT Master`。

## Task 6：运行独立 Gate 2 专家评审并闭环 findings

**Files:**
- Create: `docs/reviews/bs-ppt-master/2026-08-21-{advocate,adversary}-{prompt,review}.md`
- Create: `docs/reviews/bs-ppt-master/2026-08-21-gate2-response.md`
- Modify: `skills/bs-ppt-master/**` only when findings justify it

- [ ] **Step 1：从最终 `SKILL.md` 生成 prompts**

Run: `node tools/peer-review.js generate bs-ppt-master --force`

- [ ] **Step 2：分别派发 advocate 和 adversary Agent**

Advocate 检查完整 Skill tree、设计规范、registry 和测试证据。Adversary 必须攻击 capability inflation、native/hybrid/raster 混淆、preservation loss、Detail Master 自证、三方向换皮、Quick 绕过、V5 假通过、许可证/隐私和 probe 误认证。

- [ ] **Step 3：建立 findings 处置账本**

`gate2-response.md` 每项记录：

```text
finding ID
severity
decision: ACCEPT / PARTIAL / REJECT
rationale
changed files and anchors
evidence rerun
residual risk
```

所有 `CRITICAL/HIGH` 必须修复或将 Skill 标为 `BLOCKED`。不能因为 checker 接受 `REQUIRES_CHANGES` 就宣称实质通过。

- [ ] **Step 4：每次 Skill 变化后重生成 prompt 并复审**

Run:

```bash
node tools/peer-review.js generate bs-ppt-master --force
node tools/peer-review.js check bs-ppt-master --json
```

Expected: prompt 与当前 `SKILL.md` 一致；两方明确 sign-off；`HUMAN_VERIFIED` 保持 false。

## Task 7：独立 forward test

**Files:**
- Create: `docs/reviews/bs-ppt-master/2026-08-21-forward-test.md`
- No repository mutation by testing Agent

- [ ] **Step 1：在临时目录安装 canonical Skill**

Run:

```bash
PPT_MASTER_TEST_DIR="$(mktemp -d -t ppt-master-forward-XXXXXX)"
node bin/better-skills.js add bs-ppt-master --target "$PPT_MASTER_TEST_DIR"
```

- [ ] **Step 2：fresh-context Agent 执行五个行为场景**

执行 `CREATE`、`FILL`、`ENHANCE`、执行器不足拒绝虚假原生、Quick+隐藏弱证据五项。每项记录 input、阶段、artifact、观察行为、dataset 对应、V1–V5 证据和 verdict。没有生成并在目标软件打开 PPTX 时，V3–V5 必须 `UNVERIFIED`。

- [ ] **Step 3：清理明确的临时目录并记录结果**

不得使用宽泛路径；文档明确区分“编排行为通过”和“成品能力未验证”。

## Task 8：独立终审、全量 Gate 和干净提交

**Files:**
- Create: `docs/reviews/bs-ppt-master/2026-08-21-final-audit.md`
- Modify: only blocker fixes discovered by final audit

- [ ] **Step 1：派发不参与修复的只读终审 Agent**

检查 spec 覆盖、Gate 输出、Gate 2 disposition、forward test、alias、external `pptx`、历史 allowlist、package contents 和 staged 边界。

- [ ] **Step 2：运行额外 Skill surface 检查**

Run:

```bash
ruby -e 'require "yaml"; text=File.read("skills/bs-ppt-master/SKILL.md"); fm=text.match(/\A---\n(.*?)\n---\n/m)[1]; data=YAML.safe_load(fm); abort unless data["name"]=="bs-ppt-master"; abort unless data["description"].start_with?("Use when"); abort unless data["description"].bytesize <= 1024; puts data["description"].bytesize'
node -e "const r=require('./lib/resolver'); const c=r.resolveSource('bs-ppt-master'),a=r.resolveSource('bs-ppt-architecture'),p=r.resolveSource('pptx'); if(c.name!=='bs-ppt-master'||a.name!=='bs-ppt-master'||!a.aliasUsed||p.kind!=='external'||p.aliasUsed) process.exit(1)"
node bin/better-skills.js validate bs-ppt-master
npm pack --dry-run --json --ignore-scripts
```

- [ ] **Step 3：串行运行全量发布链**

```bash
bash skills/bs-ppt-master/scripts/test-checker.sh
node skills/bs-ppt-master/scripts/test-capability-probe.js
bash tools/validate.sh skills/bs-ppt-master/
node tools/validate.js --json skills/bs-ppt-master/
node tools/peer-review.js check bs-ppt-master --json
node tools/peer-review.js check --all --json
node tools/pattern-alignment.js bs-ppt-master --strict --json
node tools/pattern-alignment.js --json
bash tools/check-patterns.sh
node evaluation/harness/runner.js --skill bs-ppt-master --json
node evaluation/harness/runner.js --json
bash tools/test-cli.sh
npm run prepublishOnly
git diff --check
```

Expected: no hard failure。全仓既有 soft warning 单独记录。

- [ ] **Step 4：运行残留审计**

```bash
test ! -e skills/bs-ppt-architecture
git grep -n 'bs-ppt-architecture' -- README.md skills.json tools evaluation skills bin lib package.json external
git grep -n 'skills/bs-ppt-architecture'
git grep -n 'ppt-arch'
git grep -n 'PPT Architecture'
git grep -n 'bs-ppt-master'
git diff 58c6a0a -- external/sources.yaml
git status --short
git diff --check
```

旧名只允许存在于直接 alias、CLI migration tests、当前迁移说明、旧 reviews/specs/plans 和明确历史命名的 insight。

- [ ] **Step 5：提交评审与验收证据**

逐路径 stage，执行 `git diff --cached --check` 和 `git diff --cached --name-status`，确保没有用户文件后提交：

```bash
git commit -m "test: record PPT Master expert acceptance"
```

- [ ] **Step 6：最终报告**

分别说明做了什么、Gate 1–4 证明了什么、forward test 证明了什么、V1–V5 哪些有真实成品证据、commit 列表和未 push 状态。
