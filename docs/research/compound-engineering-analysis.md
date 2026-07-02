# Compound Engineering 流派深度分析

> 来源：EveryInc/compound-engineering-plugin (GitHub)
> 代表技能：`ce-brainstorm`、`ce-plan`、`ce-code-review`、`ce-work`、`ce-compound`、`ce-ideate`

---

## 设计哲学

**核心理念**：穷举式精确——每个可能的歧义点都被显式处理。结构工程工作使每个单元让下一个单元更容易，捕获可复用知识使工具集随着每次使用变得更聪明。

## 核心概念（来自 CONCEPTS.md）

### 管道架构

```
ce-ideate → ce-brainstorm → ce-plan → ce-work → ce-compound
   ↑           ↑              ↑         ↑          ↑
  生成创意    定义需求       技术规划    执行实现    沉淀知识
```

每个阶段产出耐用的工件交给下一阶段。研究在每个需要的阶段收集，而不是在下游重新收集。

### 关键概念词汇

| 概念 | 定义 |
|------|------|
| **Skill** | 斜杠调用的能力，是用户接触的主要入口。编排：可以逐步拉取自己的引用文件，分派 agent 做限定范围的工作。 |
| **Agent** | 专门的、单一目的的工作者，被 Skill 分派到独立的隔离上下文中运行并返回结果。Agent 不直接由用户调用。 |
| **Learning** | 已解决的过去问题的文档化解决方案——bug 修复、约定或工作流模式——作为复合知识的单元存储。 |
| **Pattern doc** | 从多个 Learning 中泛化出的更广泛的规则指导。比单一事件的 Learning 更有影响力，但过时后风险更高。 |
| **Evidence dossier** | 由廉价侦察 agent 收集的批量证据工件——带源指针的逐字引用——写入暂存区而非内联返回。 |
| **Load stub** | 当内容移到引用文件后在 Skill 中留下的残留：一个加载指令，命名引用包含什么以及跳过它的失败模式。 |
| **Confidence anchor** | 离散的、自我评分的置信度值，每个级别绑定一个模型可以诚实应用的行为标准。 |
| **Reviewer persona** | 单视角审查 agent，从特定角度评估工作——安全、正确性、范围、设计等。 |
| **Headless mode** | 显式选择的无值守运行模式，产出书面报告作为交付物，对真正模糊的决策保守地推迟而不是猜测。 |
| **Beta skill** | 稳定 Skill 的并行副本，后缀 `-beta`，用于在不影响用户的情况下试验新版本。 |

## 关键技能剖析

### `ce-brainstorm` — 需求探索（~300 行 SKILL.md + 大量引用文件）

#### 最反直觉的设计决策

**1. Phase 1.2 "Rigor Gaps"——6 种需求缺陷探测**

不是问泛泛的"还有什么需求？"，而是精确命名了 6 种 agent 可以系统性地在用户输入中检测到的缺口：

| Gap 类型 | 检测条件 | 探测问题 |
|----------|---------|---------|
| **Evidence gap** | 用户声称需求但未提供可观察行为证据 | "What's the most concrete thing someone has already done about this?" |
| **Specificity gap** | 受益人描述太抽象 | "Name a specific person and what changes for them when this ships." |
| **Counterfactual gap** | 未描述当前解决方案和成本 | "What's the current workaround, even if messy — and what does it cost?" |
| **Attachment gap** | 用户固着于特定方案形状而非价值 | "What would the smallest version that still delivers real value look like?" |
| **Durability gap** (Deep-product only) | 价值主张依赖可能改变的现状 | "How does this fare under the most plausible near-term shifts?" |

这些探测问题是**开放式的**——不是选择题。一个菜单会暗示哪些类型的证据算数；一个开放式探测迫使真实的观察或揭示真实的不确定性。

**2. Phase 2.6 "异步验证"**

在向用户展示 Phase 2.5 的综合摘要的同时，**在后台派发一个验证 agent** 去检查事实声明。验证 agent 在用户的思考时间内运行——不增加感知延迟。

> "Pass it the claim list, the grounding dossier path, and this instruction: verify each claim directly against the codebase — return confirmed, refuted, or unverifiable."

**3. 输出格式的四级优先级解析**

Phase 0.0 用了 ~30 行来规定输出格式（md vs html）的解析逻辑：
1. CLI arg (`output:md` / `output:html`)
2. Config file (`brainstorm_output:` key)
3. Default (`md`)
4. Pipeline override (force `md` in LFG/headless contexts)

**4. 模型分层**

子 agent 按任务类型分配到不同模型层级：
- **Extraction tier**: 最便宜的模型（检索和引用）
- **Generation tier**: 中等模型（证据驱动的验证）
- **Ceiling tier**: 对话本身运行在主模型上

### `ce-plan` — 技术规划（~800 行 SKILL.md + 大量引用文件）

#### 最反直觉的设计决策

**1. Plan Depth 分层**

不是所有计划都需要相同的详尽程度：
- **Lightweight**: 2-4 个实现单元，省略可选章节
- **Standard**: 3-6 个单元，完整核心模板
- **Deep**: 4-8 个单元，分阶段交付，更深入的风险处理

**2. 从需求到计划的结构化溯源**

Phase 0.3 定义了从上游 brainstorm 文档到计划的精确信息传递：
- 携带所有 R-ID（需求）、A-ID（角色）、F-ID（关键流程）、AE-ID（验收示例）
- 保留 "Deferred for later" 和 "Outside this product's identity" 的范围边界
- 阻塞问题必须解决或显式假设，不能静默跳过

**3. Phase 0.7/5.1.5 "Scoping Synthesis"**

在投入昂贵的 Phase 1 研究之前（或之后，如果有上游 brainstorm），向用户展示范围综合——**计划将针对什么、不针对什么**。这是一个轻量级的确认门禁，防止在错误的方向上投入大量研究。

**4. Confidence Check and Deepening (Phase 5.3)**

写完计划后，自动评估是否需要"深化"——通过派发子 agent 来验证计划的结构完整性、风险处理的充分性、和跨系统思考的深度。深化的触发条件包括：
- 风险信号（认证、支付、数据迁移、外部 API）
- 本地模式薄弱（<3 个直接示例）
- 外部研究是负载关键（外部发现塑造了关键决策）

### `ce-code-review` — 代码审查（~700 行 SKILL.md）

#### 最反直觉的设计决策

**1. 14 个审查角色 + 分层触发**

- **Always-on（始终运行）**: correctness, testing, maintainability, project-standards + 2 CE agents
- **Cross-cutting conditional（按 diff 触发）**: security, performance, api-contract, data-migration, reliability, adversarial, previous-comments
- **Stack-specific conditional（按技术栈触发）**: julik-frontend-races, swift-ios

不是"审查所有东西"，而是根据 diff 内容精确选择审查角色。

**2. Confidence Anchor 系统**

不是连续的 0-100 分数，而是 5 个离散锚点：`{0, 25, 50, 75, 100}`。每个锚点有行为定义，防止模型在"80 vs 85"上做无意义的区分。

**3. Cross-reviewer agreement promotion**

当 2+ 独立审查者标记同一问题时，置信度提升一级：`50→75, 75→100, 100→100`。这是一种廉价的多眼验证机制。

**4. Stage 5b Validation Pass**

不是信任审查者的发现，而是为每个存活发现派发一个独立的**验证 agent**。验证 agent 不参与审查，独立检查发现是否真实。被验证 agent 拒绝的发现会被丢弃。

**5. 审查范围模式（local-aligned vs pr-remote）**

精确区分了"本地工作树就是 PR 分支"和"远程 PR，本地树不相关"两种情况，每种有不同的 diff 获取策略和文件检查权限。

### `ce-work` — 执行实现（~380 行）

#### 最反直觉的设计决策

**1. 子 agent 隔离策略**

- **Worktree isolation**: 每个并行子 agent 获得自己的 git worktree，在自己的分支上工作
- **Shared-directory fallback**: 当 worktree 不可用时，子 agent 不 commit，编排者统一处理
- **Parallel Safety Check**: 在并行派发前检查文件冲突，预测 merge 冲突

**2. System-Wide Test Check**

在标记任务完成前，agent 必须执行 5 个系统级问题：
- 当这段代码运行时，什么会被触发？（回调、中间件、观察者——追溯两层）
- 我的测试是否覆盖了真实的调用链？（不仅仅是 mock）
- 失败是否会导致孤立状态？
- 还有哪些其他接口暴露了这个行为？
- 各层的错误策略是否一致？

**3. "执行姿态"（Execution Posture）**

计划可以携带轻量级的执行姿态信号——`Execution note: Start with a failing integration test` 或 `Execution note: Add characterization coverage before modifying this legacy parser`——但不展开为 RED/GREEN/REFACTOR 微步骤。

### `ce-compound` — 知识沉淀

#### 核心洞察

> "Each documented solution compounds your team's knowledge. The first time you solve a problem takes research. Document it, and the next occurrence takes minutes."

知识以 `docs/solutions/` 中的结构化 YAML 前置元数据文件存储。分为两条轨道：
- **Bug track**: 问题、症状、什么没起作用、解决方案、为什么有效、预防
- **Knowledge track**: 上下文、指导、为什么重要、何时应用、示例

## 可复用技术

| 技术 | 描述 | 来源技能 | 适用场景 |
|------|------|---------|---------|
| Rigor Gap 框架 | 系统性地检测用户需求中的 6 种缺口 | ce-brainstorm | 需求分析类技能 |
| 异步验证 | 在用户思考时派发验证 agent | ce-brainstorm | 任何需要事实检查的技能 |
| 多级输出格式解析 | CLI arg > config > default > pipeline override | ce-brainstorm, ce-plan | 需要灵活输出的技能 |
| 模型分层 | 按任务复杂度分配不同模型 | ce-brainstorm, ce-ideate | 需要大量子 agent 的技能 |
| Plan Depth 分层 | 根据工作复杂度调整计划详尽度 | ce-plan | 规划类技能 |
| 结构化溯源 | 从需求到计划的精确 ID 传递 | ce-plan | 多阶段管道技能 |
| Scoping Synthesis | 在投入昂贵研究前确认范围 | ce-plan | 任何有研究成本的技能 |
| 多角色审查面板 | 按 diff 内容选择审查角色 | ce-code-review | 审查/评估类技能 |
| Confidence Anchor | 离散锚点替代连续分数 | ce-code-review | 任何需要评分的技能 |
| 独立验证 pass | 独立验证 agent 检查发现 | ce-code-review | 高风险的审查/评估 |
| 审查范围模式 | 区分本地/远程审查 | ce-code-review | 代码审查技能 |
| Worktree 隔离 | 并行子 agent 在独立 worktree 中工作 | ce-work | 并行执行类技能 |
| 系统级测试检查 | 5 个问题追溯跨层影响 | ce-work | 实现/测试类技能 |
| 执行姿态信号 | 轻量级信号而非微步骤展开 | ce-work | 从计划到执行的交接 |
| 知识沉淀管道 | 结构化捕获问题解决方案 | ce-compound | 知识管理类技能 |
| Load stub 模式 | 引用文件的内容摘要留在主体中 | 全部 | 渐进式披露 |
| Headless mode | 无值守运行，保守推迟模糊决策 | 全部 | 自动化/管道场景 |

## 设计特征总结

| 维度 | 评价 |
|------|------|
| 技能粒度 | 大——一个技能覆盖一个完整的工程阶段 |
| 指令精确度 | 穷举式——每个歧义点都被显式处理 |
| 错误预防 | 多层验证子 agent + 穷举条件分支 + confidence anchor |
| 上下文效率 | 大量使用引用文件 + load stub 模式 |
| 平台依赖 | 依赖子 agent 基础设施 |
| 维护成本 | 高——需要持续堵漏洞，但有结构化反馈循环 |
| 适用场景 | 高频使用 + 高失败成本的技能 |
