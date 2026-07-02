# Pattern Library

> 从 10+ 个顶级 Agent Skills 仓库中提取的 50+ 可复用设计模式
> 按功能分为 8 个类别

---

## 1. 行为约束模式（Behavior Constraint）

防止 agent 跳过关键步骤或走捷径。

| 模式 | 描述 | 来源 |
|------|------|------|
| **格式显著性门禁** | 用 XML 标签/全大写创建视觉上不可忽视的屏障 | Anthropic |
| **反模式预命名** | 提前命名 agent 可能使用的合理化借口 | Anthropic, CE |
| **硬规则前置** | 关键约束在流程描述之前，确保 agent 在读取流程前已被约束 | Cursor |
| **精确终端状态** | 明确命名下一步 + 明确列出禁止的操作 | Anthropic, Cursor |
| **Karpathy 行为护栏** | Think before coding, Simplicity first, Surgical changes, Goal-driven execution | Karpathy |
| **反合理化预命名** | 精确列举 agent 会使用的借口让 agent 自我识别 | Addy Osmani, CE |

## 2. 交互设计模式（Interaction Design）

控制 agent 如何与用户交互。

| 模式 | 描述 | 来源 |
|------|------|------|
| **一次一个问题** | 每条消息只问一个问题，避免稀释回答质量 | Anthropic, CE |
| **独立消息规则** | 重要信息必须独占一条消息，不与其他内容混合 | Anthropic |
| **每次决策重判断** | 不因"已启用"而默认使用某功能，每次决策都重新判断 | Anthropic |
| **阻塞式提问工具** | 优先使用平台的 AskUserQuestion 等阻塞式工具 | CE |
| **Rigor Gap 探测** | 系统性检测 6 种需求缺口（Evidence/Specificity/Counterfactual/Attachment/Durability/Stakeholder） | CE |
| **Scoping Synthesis** | 内部三桶草稿（Stated/Inferred/Out of scope）→ 用户确认 | CE, Gstack |

## 3. 质量保证模式（Quality Assurance）

确保技能产出质量。

| 模式 | 描述 | 来源 |
|------|------|------|
| **自我审查清单** | Placeholder scan → Consistency → Scope → Ambiguity | Anthropic, CE |
| **多视角审查面板** | 从多个角色视角（CEO/Design/Engineering/DX）审查同一产出 | Gstack, CE |
| **Confidence Anchor** | 离散锚点（0/25/50/75/100）替代连续分数，防止假精度 | CE |
| **独立验证 Pass** | 独立验证 agent 检查发现，不参与原始审查 | CE |
| **Cross-reviewer Agreement** | 2+ 审查者同意时置信度 +1 级 | CE |
| **验证规则 + 自动路由** | 检测反模式并自动推荐修复路径 | Vercel |
| **两层测试系统** | 免费静态验证 + 付费动态评估（LLM judge + E2E） | Gstack |
| **分级反模式规则** | P0（必须修复）/ P1（应该修复）/ P2（最好修复） | Open Design |
| **交互状态强制** | 要求实现 Loading/Empty/Error/Active 完整循环 | Taste Skill |

## 4. 上下文管理模式（Context Management）

管理技能在上下文窗口中的 token 消耗。

| 模式 | 描述 | 来源 |
|------|------|------|
| **渐进式披露** | 三级加载：元数据 → SKILL.md body → 引用文件（按需） | Anthropic, CE |
| **Load Stub** | 内容移到引用文件后，在主体中留下精确的加载指令 | CE |
| **上下文是公共品** | 每个 token 都在排挤用户对话和其他技能——简洁是道德责任 | Anthropic |
| **Evidence Dossier** | 侦察 agent 收集的批量证据写入暂存区而非内联返回 | CE |
| **模板生成** | 用代码（.tmpl → gen-skill-docs.ts → SKILL.md）生成技能 | Gstack |

## 5. 任务路由模式（Task Routing）

控制 agent 如何选择技能和工作流。

| 模式 | 描述 | 来源 |
|------|------|------|
| **多信号触发** | 通过路径/命令/对话多个信号检测技能需求 | Vercel |
| **触发条件分离** | description 只写触发条件，不写工作流总结（CSO 原则） | Anthropic, Superpowers |
| **管道架构** | 明确的上游→下游技能链，每阶段产出耐用工件 | CE, Anthropic |
| **任务域分类** | 区分软件任务/非软件任务/快速帮助 | CE |
| **深度分层** | Lightweight/Standard/Deep 三级，根据任务复杂度选层级 | CE |
| **Headless Mode** | 无值守运行，保守推迟模糊决策 | CE, Gstack |
| **三层分离架构** | Skills/Personas/Commands 各司其职 | Addy Osmani |

## 6. 执行控制模式（Execution Control）

控制 agent 如何执行任务。

| 模式 | 描述 | 来源 |
|------|------|------|
| **自由度框架** | 根据任务脆弱性匹配指令精确度（高/中/低自由度） | Anthropic |
| **Worktree 隔离** | 并行子 agent 在独立 worktree 中工作，避免文件冲突 | CE |
| **Parallel Safety Check** | 并行派发前构建 file-to-unit 映射，检测文件重叠 | CE |
| **异步验证** | 在用户思考时派发验证 agent，不增加感知延迟 | CE |
| **执行姿态信号** | 轻量级信号（test-first/characterization-first）而非微步骤展开 | CE, Superpowers |
| **哨兵机制** | 唯一标识符防止不同循环的输出互相干扰 | Cursor |
| **安全 Hook 拦截** | 在操作系统层面（PreToolUse hook）拦截破坏性命令 | Gstack |
| **系统级测试检查** | 5 个跨层问题（触发链/真实链/孤立状态/其他接口/错误策略一致性） | CE |
| **连续执行** | 不在任务间暂停或确认，减少用户打断 | Superpowers |
| **模型分层** | 机械任务用便宜模型，架构/审查用最强模型 | CE, Superpowers |
| **精确命令替代模糊指令** | 用具体 bash 命令（git stash create + git update-ref）替代"做 X" | Cursor |
| **性能护栏** | API 级别的性能约束（useMotionValue 而非 useState 用于动画） | Taste Skill |

## 7. 知识管理模式（Knowledge Management）

捕获、组织和复用知识。

| 模式 | 描述 | 来源 |
|------|------|------|
| **知识沉淀管道** | 结构化捕获问题解决方案（Bug track / Knowledge track） | CE |
| **模式库** | 从多个解决方案中泛化的更广泛规则 | CE |
| **概念词汇表** | 项目共享领域词汇（CONCEPTS.md） | CE |
| **上游文档同步** | 从官方文档自动同步最新信息 | Vercel |
| **知识图谱关联** | 技能之间的结构化交叉引用（upgradeToSkill） | Vercel |
| **跨会话决策记忆** | 附加式、事件溯源的决策存储（decisions.jsonl） | Gstack |

## 8. 技能创建模式（Skill Creation）

用于设计和创建技能本身的元模式。

| 模式 | 描述 | 来源 |
|------|------|------|
| **TDD 技能创建** | RED（基线失败）→ GREEN（合规）→ REFACTOR（堵漏洞） | Superpowers |
| **极简精确** | 用最少行数完成完整工作流（13 行 babysit） | Cursor |
| **穷举式精确** | 每个可能的歧义点都被显式处理 | CE |
| **Beta Skill 模式** | 稳定技能旁创建 -beta 并行副本进行试验 | CE |
| **平台降级规则** | 当平台不支持某功能时的回退策略 | CE |
| **可量化设计旋钮** | 用数值参数（1-10）替代模糊风格描述 | Taste Skill |
| **命名禁止模式** | 给 AI 审美偏差起名字（THE LILA BAN, NO Inter Font） | Taste Skill |
| **80/20 设计规则** | 80% 验证模式 + 20% 独特选择 | Open Design |
| **"灵魂" 测试** | 截图中能识别出哪个产品 → 有灵魂；不能 → 是模板 | Open Design |

---

## 模式组合示例

### 高频代码审查技能
```
格式显著性门禁 + 多视角审查面板 + Confidence Anchor + 独立验证 Pass + 渐进式披露
```

### 轻量级开发辅助技能
```
极简精确 + 硬规则前置 + 精确命令替代模糊指令 + 哨兵机制
```

### 需求分析/头脑风暴技能
```
Rigor Gap 探测 + 一次一个问题 + 阻塞式提问工具 + 自我审查清单 + Scoping Synthesis
```

### 知识沉淀技能
```
知识沉淀管道 + 模式库 + 概念词汇表 + 上游文档同步
```

---

## 模式选择决策树

```
任务特征评估：
├─ 高频使用（每天 10+ 次）→ 穷举式精确 + 多视角审查
├─ 高失败成本（部署/安全）→ 多视角审查 + 独立验证 + Confidence Anchor
├─ 需要探索/对话 → Rigor Gap + 一次一个问题 + Scoping Synthesis
├─ 简单操作 → 极简精确 + 硬规则前置 + 精确命令
├─ 知识需要积累 → 知识沉淀管道 + 模式库 + 概念词汇表
└─ 多技能协作 → 管道架构 + Headless Mode + 渐进式披露
```

---

## 来源缩写

| 缩写 | 全称 |
|------|------|
| Anthropic | Anthropic 官方内置 skills |
| Cursor | Cursor 官方内置 skills |
| CE | Compound Engineering Plugin (EveryInc) |
| Gstack | Gstack (Garry Tan) |
| Vercel | Vercel Plugin |
| Superpowers | Superpowers (obra) |
| Karpathy | Karpathy Guidelines |
| Taste Skill | Taste Skill (Leonxlnx) |
| Open Design | Open Design (nexu-io) |
| Addy Osmani | Addy Osmani Agent Skills |
