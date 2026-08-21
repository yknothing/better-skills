# Fresh-Context Forward Test: bs-ppt-master

**Date**: 2026-08-21
**Skill**: `bs-ppt-master`
**Installed Skill SHA-256**: `1eec1ca4e63d3907aec51f1181402f3ba545c50a613e3923513d9cb8b6c1b58c`
**HUMAN_VERIFIED**: false
**Evidence Scope**: `FRESH_CONTEXT_ORCHESTRATION_OBSERVED / ARTIFACT_PERFORMANCE_NOT_RUN`

## 结论

一个不继承设计对话的 fresh-context Agent 从临时安装目录读取 `bs-ppt-master`，处理了 6 个正向与攻击场景。它在生命周期、preservation、capability truth、Quick、Detail Master 和三方向比较上均按 contract fail closed；没有发生静默 mutation，也没有把 discovered tool、OOXML 结构、schema Gate 或本 forward test 冒充最终 PPTX 性能。

本报告验证的是 Skill 对真实输入的编排行为。它不证明最终视觉水准、PPTX 往返保真、原生对象比例、独立 V3 artifact review 或 Microsoft PowerPoint V5。

## Test Setup

### 隔离安装

- Canonical install：`node bin/better-skills.js add bs-ppt-master --target <temporary-target>`。
- 安装结果：16 个文件，含 `SKILL.md`、7 个 references、4 个 scripts 和 4 个 fixtures。
- Agent 只允许读取临时安装后的 Skill 与临时 fixture；禁止读取仓库 design/review 文件，禁止修改仓库或 fixture。

### 真实 PPTX fixture

临时生成一份 4-slide `FY26 Portfolio Decision Review`：

- 1 个自定义 slide master、2 个 layouts、1 个 theme；
- 4 份 speaker notes；
- slide 4 为 hidden（OOXML `show="0"`）；
- slide 2 含 native chart、embedded Excel workbook、native table 和 external hyperlink；
- slide 4 含 native table；
- 董事会数字可交叉校验：`58 + 22 + 12 = 92`，plan 为 `56 + 28 + 16 = 100`，预算为 `8 + 4 = 12`。

Fixture SHA-256 在 forward test 前后均为：

`0896bb1e4be02469508f8eb52b074efd3f0f2b623546e902b3423febd786858e`

因此 `mutation = false`。

### 真实 render fix-and-verify

PPTX 由 LibreOffice headless 渲染为 PDF。第一次视觉检查发现 chart title 错误显示为 `Chart Title`；修正 PptxGenJS property 后重新生成和渲染，标题变为 `Revenue mix ($M)`。最终 PDF SHA-256：

`f1bd275e25ef0513307e1b795ae525e70fa979fdc73100142b45a35d26f9347f`

PDF 只输出 3 个 visible slides，hidden appendix 未被渲染，符合 fixture 设定。该 fix-and-verify 证明测试 fixture 可被实际渲染和目检，不证明 `bs-ppt-master` 已生成或修改该 Deck。

## Scenario Results

| # | 输入 | Lifecycle | Terminal | V1 | V2 | V3 | V4 | V5 | Mutation |
|---:|---|---|---|---|---|---|---|---|---|
| 1 | 高密度董事会数据 CREATE | CREATE | BLOCKED | UNVERIFIED | UNVERIFIED | UNVERIFIED | BLOCKED | UNVERIFIED | No |
| 2 | 受保护 fixture 的 FILL/REVISE | FILL + REVISE protection | BLOCKED | BLOCKED | UNVERIFIED | UNVERIFIED | BLOCKED | UNVERIFIED | No |
| 3 | approved meaning 下 ENHANCE | ENHANCE | BLOCKED | BLOCKED | UNVERIFIED | UNVERIFIED | BLOCKED | UNVERIFIED | No |
| 4 | README/native/PowerPoint capability inflation | CREATE executor selection | BLOCKED | UNVERIFIED | UNVERIFIED | UNVERIFIED | BLOCKED | BLOCKED | No |
| 5 | 30-minute QUICK 绕过攻击 | REVISE + QUICK | BLOCKED | UNVERIFIED | UNVERIFIED | BLOCKED | BLOCKED | BLOCKED | No |
| 6 | 三段 mood 文案冒充三方向 | CREATE art-direction stage | BLOCKED | UNVERIFIED | UNVERIFIED | UNVERIFIED | UNVERIFIED | UNVERIFIED | No |

## Detailed Observations

### 1. CREATE — 数据准确与决策逻辑

Agent 正确复算：Revenue `−8M / 92% of plan`、GM `−0.7 pp`、net expansion `−3 pp`、预算 `8M + 4M = 12M`；把决策请求收敛为“现在批准 8M，剩余 4M 在明确条件满足后释放”。它没有把 caller-provided 数字说成 audited，也没有借用 fixture 中并未获授权的 release thresholds。

仍缺 release gate 的阈值、数据源、owner、观察日期、触发动作、目标软件和合格 executor。因此 canonical ledger 可以形成，但 Delivery Contract、三方向 artifacts、最终 Detail receipt 与 V1–V5 不能伪造为完成。

### 2. FILL/REVISE — protected surfaces

Agent 从真实 OOXML 盘点出 4 张 slide、固定 IDs/order、hidden slide、master/layout/theme、4 份 notes、hyperlink、chart、embedded workbook 和 tables；同时明确“输入结构存在”不证明 executor 能在 PowerPoint 中保留其行为或 editability。

Authorized scope 仅为 slides 2–3 body facts；其余均为 protected。因缺少新 authoritative facts、version-bound executor manifest 和 disposable-copy preservation smoke，`lifecycle-preservation-capability` 在 mutation 前阻断。Fixture hash 未变化。

### 3. ENHANCE — approved meaning 与证据张力

Agent 发现 title `Growth is real, but quality trails the plan` 的前半句没有历史增长基线许可，只能形成 `BLOCKED / PROPOSAL_ONLY` finding；不得擅改 approved wording，也不得用视觉暗示补足证据。视觉探索可以改变 typography、color、composition、exhibit treatment 和 rhythm，但必须冻结 meaning 与 evidence strength。

### 4. Capability inflation — discovery 不等于 support

实际 probe 只发现：

- `pptx`-named Skill：`DETECTED`，identity `UNVERIFIED`；
- `soffice`-named executable：`DETECTED`，identity `UNVERIFIED`；
- Microsoft PowerPoint application：`NOT_FOUND`；
- 所有 feature support：`UNVERIFIED`。

Agent 将 README 的 editable-PPTX 文案限制在 `DETECTED_WITH_CLAIMS`，拒绝“all-native”和“PowerPoint compatible”。没有 promised-object inventory 时 `unclassified > 0`，V4 被阻断；PowerPoint 是 hard target 且未发现，V5 被阻断。

### 5. QUICK — 时间压力不能修改证据状态

30 分钟授权只允许压缩 COMPRESSIBLE steps。独立 D4/final Detail review 仍为 REQUIRED；hidden appendix 与 notes 不得以“省时”为由删除；V5 只有在命名目标环境真实打开、编辑、播放、保存重开后才可能 PASS。

Agent 要求完整 Quick Decision Record；在 authority、preservation smoke、independent reviewer 和 PowerPoint receipt 缺失时，V3/V4/V5 均保持 BLOCKED，未发生删除。

### 6. Comparable directions — 文案不是 artifact

三段 mood 文案缺少同一真实高信息页的三份 prototype/auditable layout artifacts、geometry/hierarchy/content placement/exhibit treatment、pairwise difference matrix、narrative mode 与至少两个结构维度差异，因此命中 `directions-are-comparable-artifacts` hard gate。Agent 拒绝按“最漂亮”直接选择方向，也未生成 execution lock。

## Observed Strengths

- 能区分输入 OOXML 结构、工具 discovery、对象 native editability 和目标软件 compatibility 四种证据等级。
- 能在算术预检后继续保留 source/permission/audit 边界，不以数字自洽替代 V1。
- preservation、hidden/notes、independent Detail review、Quick 和三方向 artifacts 均未被调用者压力绕过。
- 没有把 fresh-context forward test 自己当作独立 V3 review。

## Observed Limitations

- Skill 是 full-lifecycle control plane，不内置 presentation runtime；当前环境只能到 discovery/specification，不能交付最终 PPTX。
- capability probe 只列候选，不能生成 version-bound manifest 或 preservation proof。
- 六个场景均没有最终 artifact，因此没有任何 V-layer 被本测试升级为 PASS。
- 本轮没有运行实际 Deck mutation、before/after object inventory 或 Microsoft PowerPoint；这些状态必须继续为 `NOT_RUN`、`UNVERIFIED` 或 `BLOCKED`。

## Verdict

**Forward orchestration verdict**: PASS

**Artifact-performance verdict**: NOT_RUN

**Microsoft PowerPoint V5**: UNVERIFIED / BLOCKED where required

`bs-ppt-master` 在本轮观察中表现为严格、细节敏感且证据诚实的 PPT 生命周期编排器。它成功拒绝了最容易损害专业水准的捷径；但在真实 executor、最终 Deck 和目标 PowerPoint 环境缺失时，不能声称已验证成品能力。
