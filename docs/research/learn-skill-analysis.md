# Learn-Anything-Skill 生态调研

> 调研日期：2026-07-02
> 调研对象：以 "learn anything" 为核心的 Agent Skill 品类
> 候选仓库：
> - [koganei/learn-anything-skill](https://github.com/koganei/learn-anything-skill) — 2 stars，原始版本
> - [vesperchinn/learn-anything-skill](https://github.com/vesperchinn/learn-anything-skill) — 0 stars，多语言分支
> - [joincanarysteal/learn-anything-with-AI-hub](https://github.com/joincanarysteal/learn-anything-with-AI-hub) — 0 stars，中文优先版

---

## 一、品类定义

"Learn Anything Skill" 是 2026 年 H1 出现的一个 Agent Skill 子品类，核心目标不是"回答问题"而是 **帮助用户真的学会**。与传统的 Q&A agent 区别在于：

| 维度 | 传统 Q&A agent | Learn Anything Skill |
|------|---------------|----------------------|
| 时间维度 | 单次回答 | 跨会话持续追踪进度 |
| 产出形态 | 聊天记录 | 持久化学习仓库（learning_path.json + progress.json + user_context.md） |
| 知识来源 | 模型参数 | spawn subagent 联网调研 + 用户提供的 PDF/slides |
| 个性化 | 单轮上下文 | 跨会话累积用户背景画像 |
| 教学法 | 平铺直叙 | 分层（Foundations/Intermediate/Advanced）+ 用例驱动 |

这个品类的"爆火"是相对的——单个仓库星数都还很低（0-2），但**多个独立实现同时出现**说明概念戳到了真实痛点：**LLM 太擅长"回答"，太不擅长"教会"**。

## 二、三个候选实现对比

### 2.1 koganei/learn-anything-skill（原始版）

**形态**：单一 `SKILL.md` 文件，62KB / 1397 行 + 一个 `learn-skill.skill`（33KB 的预编译版）+ `references/` 目录。

**风格**：**典型的 CE 穷举流派**（见本仓库 `extracted-patterns.md` 对 CE 流派的分析）。每一行 `user_context.md` 应该长什么样都写出来了。

**核心机制**：

1. **状态持久化到 `~/.claude-learn-skill/[subject-slug]/`**：
   ```
   learning_path.json     # 主题结构（永不修改）
   progress.json          # 进度追踪
   user_context.md        # 用户画像（持续增长）
   research/initial_research.md       # 主题级调研（500-1000+ 行）
   research/topic_NN_*_research.md    # 单 topic 调研（200-500+ 行）
   topics/NN_*.md                     # topic 指南
   ```

2. **两层调研**（这是最有价值的创新）：
   - **Subject-Level**：开题时一次性调研整个主题
   - **Topic-Level**：每个 topic 教学前再做一次个性化调研，**显式 incorporate `user_context.md`**

3. **CRITICAL 标记的硬规则**：
   - 永不修改 `learning_path.json` 结构（用户依赖 topic 编号）
   - `user_context.md` 必须实时更新（不是会话末）

### 2.2 vesperchinn/learn-anything-skill（多语言分支）

**形态**：仓库式（含 README / RELEASE_NOTES / ROADMAP），version 0.2.2-beta，双语（en-US / zh-CN）。

**风格**：**分层教学法**，强调 "I do / We do / You do" 渐进式教学：

- **I do**：完整演示一个例子
- **We do**：一个反例 + 一个正例对比
- **You do**：一个微任务（通常一个工作流步骤）

**核心差异**：

- **Guided Learning Mode**：创建学习仓库后**立即在 chat 里开始 Day 1**，不停留在文件列表
- **"scaffold only" 逃生口**：用户可以跳过引导直接拿文件
- **多平台适配**：Codex / Claude Code / Trae / Coze / WorkBuddy / CodeBuddy（含中国 agent 平台）
- **支持用户材料**：PDF / slides / notes / documents 作为调研依据
- **freshness 检查**：含 `09_sources/freshness_log.md`，建议每 3-6 个月复查

### 2.3 joincanarysteal/learn-anything-with-AI-hub（中文优先版）

**形态**：中文优先的 SKILL.md 工作流包。

**风格**：**导师 + 项目教练**角色，默认 **项目驱动学习 + Mastery Learning**。

**产出**：学习计划、学习笔记、课后复盘、项目任务书、掌握度检查、错题/卡点记录。

### 2.4 横向对比

| 维度 | koganei | vesperchinn | joincanarysteal |
|------|---------|-------------|-----------------|
| 行数 | 1397（单文件） | 多文件 | 中等 |
| 流派 | CE 穷举 | 分层教学 | 项目驱动 |
| 教学法 | 调研驱动 + 个性化 | I/We/You + Guided Mode | Mastery Learning |
| 多语言 | 单语 | 双语 | 中文优先 |
| 中国平台 | ❌ | ✅（Coze/Trae 等） | ✅ |
| 用户材料支持 | ❌ | ✅（PDF/slides） | 部分 |
| Freshness 追踪 | ❌ | ✅ | ❌ |
| 成熟度 | 最完整（含 references/） | beta | 早期 |

## 三、提取的可复用模式

从这三个实现里可以提取出 **5 个本仓库 `docs/patterns/` 尚未独立命名** 的模式：

### 3.1 Two-Level Research（两层调研）

**模式**：在主题级一次性广度调研 + 每个单元教学前再做一次个性化的深度调研。

**为什么有效**：单层调研要么太广（topic 不深）要么太窄（开题缺乏全局）。两层结构让 subject-level 的成本摊薄到所有 topic，topic-level 的个性化基于已累积的 user_context，**边际成本递减**。

**适用场景**：跨会话、多单元的教学/导览/排查类技能。

**对应本仓库已有模式**：与 `evidence-dossier`（CE 的侦察 agent 模式）有重叠，但 Two-Level Research 强调的是**时间维度上的分层**（开题 vs 单元），不是空间维度的批量证据收集。

### 3.2 Living Context File（活态上下文文件）

**模式**：维护一个 `user_context.md`，**实时更新**（不是会话末），跨会话累积用户画像。

**为什么有效**：解决了 LLM "金鱼记忆"问题。每次会话开始时 agent 读这个文件，比从聊天历史里重新推断高效得多。

**关键约束**：必须明确"何时更新"（koganei 列了 6 个触发点：会话开始、每个 topic、用户分享上下文、每段学习后、会话末、模式出现时）。

**风险**：文件会无界增长。koganei 版没解决，vesperchinn 也没解决。

### 3.3 Immutable Structure + Mutable State（结构不变性约束）

**模式**：`learning_path.json` 一旦创建永不修改结构，只允许追加；`progress.json` 可以频繁修改。

**为什么有效**：用户依赖 topic 编号做导航。如果 agent 决定"优化"路径顺序，已学的 topic 4 突然变成了 topic 7，进度追踪全乱。

**对应本仓库原则**：与 mattpocock 的 `single-source-of-truth` 同向，但更严格——不只是单一来源，而是**结构不可变**。

### 3.4 Guided First Session（首节引导）

**模式**：创建持久化产物后**立即在 chat 里开始第一节**，不停在"文件已生成"的总结。

**为什么有效**：对抗 agent 的"完成倾向"——agent 倾向于交付文件就停。但学习类技能的真正价值在第一次互动，不在仓库结构。

**对应本仓库已有模式**：与 `hard-rules-first` 互补——`hard-rules-first` 是"不要做什么"，Guided First Session 是"必须做什么"。

### 3.5 Scaffold Escape Hatch（脚手架逃生口）

**模式**：当技能默认走重流程（如 Guided Mode）时，**显式提供轻量逃生指令**（如 "scaffold only"）。

**为什么有效**：重流程技能的最大风险是强加于不需要它的用户。逃生口让同一技能覆盖两种用户（要引导 vs 只要文件）。

**对应本仓库原则**：与 mattpocock 的 `branching` 概念相关——技能应该有分支，而不是一刀切。

## 四、引用决策

### 推荐：koganei 版作为主引用

**理由**：

1. **最完整**：含 `references/topic_template.md` 等扩展资源
2. **单一 SKILL.md 易于 sync**：与现有 `external/sources.yaml` 机制兼容
3. **CE 流派样本价值**：本仓库现有 8 个自研技能都不是 CE 风格，引用一个 CE 流派技能作为参考样本，对今后自研"深度" tier 技能（CLAUDE.md 定义的 deep tier = CE-style exhaustive precision）有校准价值
4. **star 数虽低但概念最纯**：vesperchinn 是 fork + 多语言扩展，原始设计在 koganei

**风险与缓解**：

| 风险 | 缓解 |
|------|------|
| 62KB 单文件与 better-skills 简洁原则冲突 | 标注为"Reference（CE 流派样本）"，明确不作为自研技能的长度标杆 |
| 需要联网调研，与 mattpocock 反对"流程垄断"哲学冲突 | 这是 CE vs Anthropic 流派张力的体现，不是 bug；保留两派对比 |
| `~/.claude-learn-skill/` 目录污染用户家目录 | sync 后由用户自行决定是否启用；不在 better-skills 仓库里硬编码 |

### 不引用的部分

- **vesperchinn 多平台适配**：价值高但需要中国 agent 平台配置，超出"最小安全引用"范围
- **joincanarysteal 中文优先版**：与 koganei 重叠度高，且 koganei 的英文原版更通用

## 五、与 better-skills 的关系

### 流派张力再现

koganei 的 CE 穷举风格 vs mattpocock 的 Anthropic 精简风格，正是本仓库 `docs/research/README.md` 识别的**张力 1（简洁 vs 完备）**的活样本。引用两者让 better-skills 同时持有两极的参考点：

```
mattpocock (精简派)              koganei (穷举派)
─────────────────                ─────────────────
grill-me: 147 bytes              learn-skill: 62KB
grilling: 3 paragraphs           1397 lines
writing-great-skills: 纯 reference   CE-style exhaustive
user-invoked 优先                  model-invoked 为主
```

### 潜在 Upgrade → Build 触发点

按 CLAUDE.md 的升级触发器，learn-anything-skill 在以下情况应升级为自研：

1. 若本仓库决定做"learn" tier 自研技能（deep tier）
2. 需要 koganei 的两层调研 + vesperchinn 的多语言 + 项目驱动教学的合体
3. 累积 ≥20 条具体改进点

目前**无使用数据**，仅作为观察点。CLAUDE.md 明确要求"≥20 改进点 + ≥5 适用 pattern + A/B 通过 ≥2 实现"才能升级，现在远未达到。

## 六、后续建议

1. **引用 koganei 版到 `external/sources.yaml`**（本次执行）
2. **在 `docs/patterns/` 新增 5 个模式文件**（Two-Level Research / Living Context File / Immutable Structure + Mutable State / Guided First Session / Scaffold Escape Hatch）——但这是 Phase 1.C 的范围，本次先在本文档登记，patterns 文件等模式库扩展批次再落地
3. **观察期**：6 个月后回看 learn-anything 品类演化，决定是否升级为自研
