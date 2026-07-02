# Matt Pocock Skills 流派深度分析

> 来源：[mattpocock/skills](https://github.com/mattpocock/skills)
> 作者：Matt Pocock（TypeScript 教育者，[AI Hero newsletter](https://www.aihero.dev/s/skills-newsletter) ~60k 订阅）
> 调研日期：2026-07-02
> 仓库定位："Skills for Real Engineers. Straight from my .claude directory."

---

## 一、设计哲学

### 核心论点：反流程垄断

Matt Pocock 在 README 里直接点名反对 GSD、BMAD、Spec-Kit 这一类方案：

> "Approaches like GSD, BMAD, and Spec-Kit try to help by owning the process. But while doing so, they take away your control and make bugs in the process hard to resolve."

这套哲学与 better-skills 在 `docs/research/` 中已经识别的张力直接相关：它站在 **Anthropic/Cursor 的"小而精"一端**，反对 CE/Gstack 的"穷举规范"一端。但他比 Anthropic 走得更远——不只是技能短，而是给出了一套**形式化的技能写作词汇表**（见下文 `writing-great-skills`）。

### 四个工程问题 → 四类技能

整个仓库围绕四个经典工程失败模式组织，每一条都引用一本经典软件工程书籍作为理论支撑：

| 失败模式 | 经典引用 | 技能对策 |
|---------|---------|---------|
| Misalignment（agent 没做对我想要的） | *The Pragmatic Programmer* | `grill-me` / `grill-with-docs` |
| Verbosity（agent 啰嗦、不懂项目术语） | *Domain-Driven Design* | `grill-with-docs` 构造 `CONTEXT.md` + ADR |
| Code doesn't work（代码跑不通） | *The Pragmatic Programmer* | `tdd`、`diagnosing-bugs` |
| Ball of mud（代码腐烂） | *A Philosophy of Software Design* + *Extreme Programming* | `improve-codebase-architecture`、`to-prd` |

这个映射揭示了仓库的取向：**所有技能都是为了对抗 LLM 系统性弱点**，而不是把流程本身当成产品。这与 better-skills `extracted-patterns.md` 中"对抗 LLM 系统性弱点"一节完全同向。

### 与五流派的位置

```
低信任 ←──────────────────────────────────────────→ 高信任
  CE          Gstack      Vercel     Cursor    Anthropic   mattpocock
  穷举规范    分层审查    验证规则    精确指令    原则+边界    原则+词汇表
```

mattpocock 的独特性：它在 Anthropic 的"原则+边界"基础上，**叠加了一层形式化元语言**。其他流派的 SKILL.md 是给 agent 看的说明书，而他的 `writing-great-skills` 把"如何写说明书"本身做成了一个 reference skill，并配了一份 17k 字符的术语表。

---

## 二、关键创新：user-invoked vs model-invoked 二分

这是仓库最重要的概念贡献，目前 better-skills 的 patterns 库里没有对应条目。

### 定义（来自 `writing-great-skills/GLOSSARY.md`）

- **model-invoked**：保留 `description` 字段，agent 可自主触发；付出 **context load**（描述常驻上下文窗口，消耗 token 和注意力）。
- **user-invoked**：设置 `disable-model-invocation: true`，剥离 description 的 agent 可见性，只能由人手敲触发；付出 **cognitive load**（人脑必须记得它存在）。

### 为什么重要

这个二分把"技能该不该有 description"从默认配置升级成了**第一个设计决策**。本仓库现有的 8 个自研技能都没有显式声明这个维度，等价于全部 model-invoked。

对应在 better-skills `extracted-patterns.md` 的"上下文管理模式"分类下，可以提取出一个新模式：

| 模式 | 描述 | 来源 |
|------|------|------|
| **Invocation Axis 显式声明** | 每个技能明确选择 user-invoked / model-invoked，权衡 context load 与 cognitive load | mattpocock |

### Router skill 概念

当 user-invoked 技能多到记不住时，用一个 user-invoked router 指向其他 user-invoked 技能（如 mattpocock 的 `ask-matt`）。这是一个值得 better-skills 借鉴的反"认知负载爆炸"机制。

---

## 三、被引用技能深度剖析

### 3.1 `grill-me`（productivity/user-invoked）

完整 SKILL.md 内容（147 字节）：

```markdown
---
name: grill-me
description: A relentless interview to sharpen a plan or design.
disable-model-invocation: true
---

Run a `/grilling` session.
```

**这是一个 router-style 壳技能**。实际逻辑全部委托给 model-invoked 的 `grilling`。设计意图：

- `disable-model-invocation: true` → 零 context load，用户只在想 grill 时手敲 `/grill-me`。
- 把执行委托给 model-invoked 的 `grilling`，让其他技能（如 `grill-with-docs`）也能复用同一份 grilling 逻辑。
- 这是 GLOSSARY 里 "Router Skill" 和 "Single Source of Truth" 两个原则的活样本。

### 3.2 `grilling`（productivity/model-invoked）

SKILL.md 核心内容：

```markdown
Interview me relentlessly about every aspect of this plan until we reach
a shared understanding. Walk down each branch of the design tree,
resolving dependencies between decisions one-by-one. For each question,
provide your recommended answer.

Ask the questions one at a time, waiting for feedback on each question
before continuing. Asking multiple questions at once is bewildering.

If a question can be answered by exploring the codebase, explore the
codebase instead.
```

三条 hard rules，每条都对应一个 LLM 系统性弱点：

1. **"For each question, provide your recommended answer"** — 对抗 agent 的"信息索取消极倾向"，强制它先给假设再问。
2. **"Ask the questions one at a time"** — 对抗 agent 的"批量提问倾向"，与 better-skills 已有的 `one-question-at-a-time` 模式完全同向。
3. **"If a question can be answered by exploring the codebase, explore the codebase instead"** — 对抗 agent 的"无依据提问倾向"，强制它先做 legwork。

**硬依赖结论**：只引用 `grill-me` 不引用 `grilling`，前者就是空壳。两者必须打包引用。

### 3.3 `writing-great-skills`（productivity/user-invoked，纯 reference 型）

这是仓库的元层。SKILL.md 是 reference-only（无 steps），所有定义都 progress-disclosed 到 `GLOSSARY.md`（17k 字符）。

核心贡献是一套完整词汇表，关键术语：

| 术语 | 中文释义 | 对 better-skills 的价值 |
|------|---------|----------------------|
| **Predictability** | 根本美德：每次同过程而非同输出 | 给"质量"一个可操作的定义 |
| **Leading Word** | 借预训练已有概念锚定行为（如 _red_、_fog of war_） | 本仓库 patterns 里缺失，应提取 |
| **Completion Criterion** | 步骤完成的判定，需 checkable + exhaustive | 强化 self-review-checklist |
| **Context Pointer** | 指向外部 reference 的措辞，措辞决定命中率 | 指导 `load-stub` 模式的措辞质量 |
| **Premature Completion** | 步骤未完就跳下一步 | 命名了一个本仓库未识别的反模式 |
| **No-Op** | 改变不了默认行为的指令 | 提供了 pruning 的判定测试 |
| **Sprawl / Sediment / Duplication** | 三种独立的长技能病 | 比单一"太长"诊断更精确 |

特别值得提取的两条诊断测试：

- **No-Op 测试**："does a line change behaviour versus the default?" → 句级而非行级 prune。
- **Branching-driven disclosure test**：inline 每个分支都需要的东西，pointer 后面只放某些分支需要的。

---

## 四、与 better-skills 的关系

### 互补而非重叠

| 维度 | better-skills 现状 | mattpocock 补足 |
|------|-------------------|----------------|
| 模式库 | `docs/patterns/` ~60 条描述性模式 | 一套**形式化词汇表**，让模式之间可对话 |
| 需求澄清 | `requirements-engineering`（文档化、长流程） | `grill-me`/`grilling`（即时对话、单次决策树） |
| 元技能 | `skill-bootstrap`、`skill-health`（TDD-for-skills 流程） | `writing-great-skills`（写作时的判断词汇） |
| Invocation 维度 | 未显式建模 | user/model-invoked 二分 + context/cognitive load 权衡 |

### 不引用的部分

下列技能功能与 better-skills 已有技能高度重叠，按 CLAUDE.md "Reference over rebuild" 原则保持观察：

- `tdd` ↔ 与本仓库未来可能的自研 TDD 技能重叠
- `code-review`、`diagnosing-bugs` ↔ 重叠度高且泛化
- `triage`、`to-issues`、`to-prd` ↔ 依赖外部 issue tracker（GitHub/Linear），引入会增加配置复杂度
- `improve-codebase-architecture` ↔ 价值高但依赖 HTML 报告生成，超出"最小安全引用"范围

---

## 五、引用决策记录

### 引用清单

| 技能 | 来源路径 | 类型 | tier | 理由 |
|------|---------|------|------|------|
| `grill-me` | `skills/productivity/grill-me` | user-invoked | standard | 用户点名要求；高频通用工具 |
| `grilling` | `skills/productivity/grilling` | model-invoked | standard | `grill-me` 的硬依赖（壳技能指向它） |
| `writing-great-skills` | `skills/productivity/writing-great-skills` | user-invoked (reference) | standard | 用户点名要求；元层词汇表，价值极高 |

### 引用方式

通过 `external/sources.yaml` 注册 `mattpocock-skills` source（`skills_path: skills/productivity`），由 `bash tools/sync.sh` 拉取并 symlink 到本地 agent 目录。sync.sh 的路径解析逻辑（`$SOURCE_DIR/$skills_path/$skill`）原生支持这种二级目录结构，无需改动工具。

### 后续触发 Upgrade → Build 的潜在点

按 CLAUDE.md 的策略，引用型技能在积累足够项目摩擦后可升级为自研。候选升级点：

1. `grilling` 若与 `requirements-engineering` 在使用中频繁冲突或重叠，可能值得合并出自研版。
2. `writing-great-skills` 的词汇表若被本仓库 `docs/patterns/` 大量引用，可考虑提取为自研元 skill。

目前两个候选都**没有使用数据支撑**，仅作为观察点记录。按 CLAUDE.md 的 Upgrade triggers，需要 ≥20 条具体改进点或 ≥5 条适用 pattern 才能触发，现在远未达到。
