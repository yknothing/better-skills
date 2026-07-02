# 可复用模式提取

> 从五大流派的精英技能中提取的可复用设计模式和技术
> 这些模式可以被重新组合到不同领域的技能中

---

## 模式分类体系

基于五大流派的交叉分析，提取出的模式按功能分为 8 个类别：

### 1. 行为约束模式（Behavior Constraint）

防止 agent 跳过关键步骤或走捷径的模式。

| 模式 | 描述 | 来源 | 示例 |
|------|------|------|------|
| **格式显著性门禁** | 用 XML 标签/全大写创建视觉上不可忽视的屏障 | Anthropic | `<HARD-GATE>Do NOT implement until design is approved</HARD-GATE>` |
| **反模式预命名** | 提前命名 agent 可能使用的合理化借口 | Anthropic | "Anti-Pattern: 'This Is Too Simple To Need A Design'" |
| **硬规则前置** | 关键约束在流程描述之前 | Cursor | "Never discard user work. No destructive git commands." |
| **精确终端状态** | 明确命名下一步 + 禁止的操作 | Anthropic | "The ONLY skill you invoke after brainstorming is writing-plans." |

### 2. 交互设计模式（Interaction Design）

控制 agent 如何与用户交互的模式。

| 模式 | 描述 | 来源 | 示例 |
|------|------|------|------|
| **一次一个问题** | 每条消息只问一个问题 | Anthropic + CE | "Ask one question at a time. One question per turn." |
| **独立消息规则** | 重要信息必须独占一条消息 | Anthropic | "This offer MUST be its own message." |
| **每次决策重判断** | 不因"已启用"而默认使用某功能 | Anthropic | "Decide FOR EACH QUESTION whether to use the browser or terminal." |
| **阻塞式提问工具** | 优先使用平台的阻塞式提问工具而非内联文本 | CE | "Use AskUserQuestion when available. Fall back to numbered options only when no blocking tool exists." |
| **Rigor Gap 探测** | 系统性地检测用户需求中的缺口 | CE | Evidence gap, Specificity gap, Counterfactual gap, Attachment gap, Durability gap |
| **Scoping Synthesis** | 在投入昂贵工作前向用户确认范围 | CE + Gstack | 内部三桶草稿（Stated/Inferred/Out of scope）→ 用户确认 |

### 3. 质量保证模式（Quality Assurance）

确保技能产出质量的模式。

| 模式 | 描述 | 来源 | 示例 |
|------|------|------|------|
| **自我审查清单** | agent 先审查自己的输出再交给用户 | Anthropic | Placeholder scan → Consistency check → Scope check → Ambiguity check |
| **多视角审查面板** | 从多个角色视角审查同一产出 | Gstack + CE | CEO→Design→Engineering→DX 四人审查 |
| **Confidence Anchor** | 离散锚点（0/25/50/75/100）替代连续分数 | CE | 每个锚点绑定行为标准，防止假精度 |
| **独立验证 Pass** | 独立验证 agent 检查发现，不参与原始审查 | CE | Stage 5b: 为每个发现派发独立验证器 |
| **Cross-reviewer Agreement** | 多审查者同意时提升置信度 | CE | 2+ 审查者标记同一问题 → 置信度 +1 级 |
| **验证规则 + 自动路由** | 检测反模式并自动推荐修复路径 | Vercel | `validate` 规则 + `upgradeToSkill` 自动推荐 |
| **两层测试系统** | 免费静态验证 + 付费动态评估 | Gstack | `bun test` (free, <2s) + `bun run test:evals` (paid, LLM judge) |

### 4. 上下文管理模式（Context Management）

管理技能在上下文窗口中的 token 消耗的模式。

| 模式 | 描述 | 来源 | 示例 |
|------|------|------|------|
| **渐进式披露** | SKILL.md 为索引，细节在引用文件中按需加载 | Anthropic + CE | 三级加载：元数据 → body → 引用文件 |
| **Load Stub** | 当内容移到引用文件后，在主体中留下精确的加载指令 | CE | 命名引用内容 + 跳过它的失败模式 |
| **上下文是公共品** | 将简洁视为道德责任 | Anthropic | "Every token you add displaces conversation history and other skills" |
| **Evidence Dossier** | 侦察 agent 收集的批量证据写入暂存区而非内联返回 | CE | 引用带 `file:line` 指针，最多 150 行 |
| **模板生成** | 用代码生成 SKILL.md，跨技能共享 preamble | Gstack | `.tmpl → gen-skill-docs.ts → SKILL.md` |

### 5. 任务路由模式（Task Routing）

控制 agent 如何选择技能和工作流的模式。

| 模式 | 描述 | 来源 | 示例 |
|------|------|------|------|
| **多信号触发** | 通过路径/命令/对话多个信号检测技能需求 | Vercel | pathPatterns + bashPatterns + promptSignals |
| **触发条件分离** | description 只写触发条件，不写工作流总结 | Anthropic | 防止 agent 在加载技能前"知道"要做什么 |
| **管道架构** | 明确的上游→下游技能链 | CE + Anthropic | ideate → brainstorm → plan → work → compound |
| **任务域分类** | 区分软件任务/非软件任务/快速帮助 | CE | Phase 0.1b: 三向路由 |
| **深度分层** | 根据工作复杂度选择不同的详尽程度 | CE | Lightweight / Standard / Deep |
| **Headless Mode** | 无值守运行，保守推迟模糊决策 | CE + Gstack | 管道/自动化场景 |

### 6. 执行控制模式（Execution Control）

控制 agent 如何执行任务的模式。

| 模式 | 描述 | 来源 | 示例 |
|------|------|------|------|
| **自由度框架** | 根据任务脆弱性匹配指令精确度 | Anthropic | 高/中/低自由度 |
| **Worktree 隔离** | 并行子 agent 在独立 worktree 中工作 | CE | `isolation: "worktree"` + 合并冲突处理 |
| **Parallel Safety Check** | 并行派发前检查文件冲突 | CE | 构建 file-to-unit 映射 → 检测重叠 |
| **异步验证** | 在用户思考时派发验证 agent | CE | Phase 2.6: 验证 agent 在用户思考时间内运行 |
| **执行姿态信号** | 轻量级信号（如 test-first）而非微步骤展开 | CE | `Execution note: Start with a failing integration test` |
| **哨兵机制** | 唯一标识符防止输出干扰 | Cursor | `AGENT_LOOP_TICK_<purpose>` |
| **安全 Hook 拦截** | 在操作系统层面拦截破坏性命令 | Gstack | PreToolUse hook + `check-careful.sh` |

### 7. 知识管理模弎（Knowledge Management）

捕获、组织和复用知识的模式。

| 模式 | 描述 | 来源 | 示例 |
|------|------|------|------|
| **知识沉淀管道** | 结构化捕获问题解决方案 | CE | Bug track / Knowledge track → `docs/solutions/` |
| **模式库** | 从多个解决方案中泛化的更广泛规则 | CE | Pattern docs: 比单个 Learning 更有影响力 |
| **概念词汇表** | 项目共享领域词汇 | CE | `CONCEPTS.md`: 领域实体、命名流程、状态概念 |
| **上游文档同步** | 从官方文档自动同步最新信息 | Vercel | `upstream/SKILL.md` |
| **知识图谱关联** | 技能之间的结构化交叉引用 | Vercel | `upgradeToSkill` 形成交叉引用网络 |
| **跨会话决策记忆** | 附加式、事件溯源的决策存储 | Gstack | `decisions.jsonl` + `gstack-decision-search` |

### 8. 技能创建模式（Skill Creation）

用于设计和创建技能本身的元模式。

| 模式 | 描述 | 来源 | 示例 |
|------|------|------|------|
| **TDD 技能创建** | RED（基线失败）→ GREEN（合规）→ REFACTOR（堵漏洞） | Anthropic | 先写测试场景，再写技能 |
| **极简精确** | 用最少的行数完成一个完整工作流 | Cursor | `babysit`: 13 行 |
| **穷举式精确** | 每个可能的歧义点都被显式处理 | CE | `ce-plan`: 800 行 + 引用文件 |
| **精确命令替代模糊指令** | 用具体 bash 命令替代"做 X"的描述 | Cursor | `git stash create` + `git update-ref` |
| **Beta Skill 模式** | 稳定技能的并行副本用于试验 | CE | `-beta` 后缀，手动调用，稳定后提升 |
| **平台降级规则** | 当平台不支持某个功能时的回退策略 | CE | 子 agent 不支持模型选择 → 继承模型 + read budget |

---

## 模式组合示例

以下是如何组合上述模式来构建不同场景的技能：

### 场景 A：高频代码审查技能

```
格式显著性门禁（关键不允许行为）
+ 多视角审查面板（从安全/正确性/可维护性/性能审查）
+ Confidence Anchor（离散置信度打分）
+ 独立验证 Pass（验证 agent 检查发现）
+ 渐进式披露（核心流程在 SKILL.md，详细规则在引用文件）
```

### 场景 B：轻量级开发辅助技能

```
极简精确（<50 行）
+ 硬规则前置（关键约束）
+ 精确命令替代模糊指令
+ 哨兵机制（如果涉及后台任务）
```

### 场景 C：需求分析/头脑风暴技能

```
Rigor Gap 探测（检测需求缺陷）
+ 一次一个问题（交互节奏）
+ 阻塞式提问工具（交互方式）
+ 自我审查清单（质量保证）
+ Scoping Synthesis（投入工作前确认范围）
```

### 场景 D：知识沉淀技能

```
知识沉淀管道（结构化捕获）
+ 模式库（泛化规则）
+ 概念词汇表（共享词汇）
+ 上游文档同步（保持最新）
```

---

## 模式选择决策树

```
用户请求 → 评估任务特征：
  ├─ 高频使用（每天 10+ 次）？→ 考虑穷举式精确
  ├─ 高失败成本（部署/安全）？→ 考虑多视角审查 + 独立验证
  ├─ 需要探索/对话？→ 考虑 Rigor Gap + 一次一个问题
  ├─ 简单操作？→ 考虑极简精确 + 硬规则前置
  ├─ 知识需要积累？→ 考虑知识沉淀管道 + 模式库
  └─ 多技能协作？→ 考虑管道架构 + Headless Mode
```

---

## 关联文档

- [Anthropic 流派深度分析](anthropic-analysis.md)
- [Cursor 流派深度分析](cursor-analysis.md)
- [Compound Engineering 流派深度分析](compound-engineering-analysis.md)
- [Gstack 流派深度分析](gstack-analysis.md)
- [Vercel 流派深度分析](vercel-analysis.md)
- [五大流派对比总览](README.md)
