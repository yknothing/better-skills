# Agent Skills 生态调研：五大流派对比分析

> 调研日期：2026-06-16
> 调研范围：10 个顶级 Agent Skills 仓库/来源

---

## 调研目的

本项目旨在研究业界最顶级的 Agent Skills，提取可复用的设计模式和技术，打造适用于软件开发、需求分析、产品设计、视觉设计、内容创作等多场景的 Agent Skills 工具集。

本调研是架构设计的前置工作——在定义"应该怎么设计"之前，先理解"最好的那些是怎么做的"。

## 十大来源概览

### 工作流/方法论类

| 来源 | 性质 | 技能数量 | 代表技能 | 平均技能长度 |
|------|------|---------|---------|------------|
| **Anthropic** | 官方内置 | ~30+ | `skill-creator`, `brainstorming` | 150-250行 |
| **Cursor** | 官方内置 | ~15+ | `babysit`, `split-to-prs`, `loop` | 20-150行 |
| **Compound Engineering** | 创业公司/开源 | 39 | `ce-brainstorm`, `ce-plan`, `ce-code-review` | 300-800行 |
| **Gstack (Garry Tan)** | 个人/YC CEO | 40+ | `ship`, `office-hours`, `autoplan` | 生成式，可达数千行 |
| **Superpowers** | 开源社区 | 14 | `brainstorming`, `writing-skills`, `subagent-driven-development` | 200-500行 |

### 领域专业/平台类

| 来源 | 性质 | 技能数量 | 代表技能 | 设计重点 |
|------|------|---------|---------|---------|
| **Vercel** | 企业/平台 | 20+ | `nextjs`, `ai-sdk` | 验证规则 + 自动升级路由 |

### 行为约束/品味类

| 来源 | 性质 | 代表技能 | 设计重点 |
|------|------|---------|---------|
| **Karpathy Guidelines** | 社区/个人 | `karpathy-guidelines` | 对抗 LLM 系统性弱点的行为约束 |
| **Taste Skill** | 社区/个人 | `taste-skill-v1` | 可量化设计旋钮 + 禁止模式 |
| **Open Design** | 社区/开源 | `anti-ai-slop.md` | 分级反模式规则（P0/P1/P2） |
| **Emil Kowalski** | 个人/Design Eng | `emil-design-eng`, `review-animations` | 动效 craft + 严格 diff 审查 + 术语表三件套 |

### 工程纪律类

| 来源 | 性质 | 代表技能 | 设计重点 |
|------|------|---------|---------|
| **Addy Osmani Agent Skills** | 社区/个人 | `spec-driven-development`, `code-review-and-quality` | Skills/Personas/Commands 三层分离 |

## 核心发现：三个不可调和的张力

### 张力 1：简洁 vs 完备

Anthropic 和 Cursor 选择了简洁（技能短，信任 agent 填补空白）。CE 和 Gstack 选择了完备（技能长，穷举所有情况）。

**这不仅仅是偏好问题——它取决于使用频率和失败成本：**

- 每天用 10 次的技能（如 `code-review`）：值得穷举，每次节省的纠正成本乘以高频使用
- 每月用 1 次的技能（如 `setup-deploy`）：简洁即可，过度投资的 ROI 很低
- 失败成本极高的技能（如 `ship`/部署）：值得穷举，一次失败可能造成严重损害

### 张力 2：原则 vs 规则

Anthropic 给原则（"ask one question at a time"），CE 给规则（"use the platform's blocking question tool, fall back to numbered options only when..."）。

- 原则的优势：适应性强，不会因平台变化而过时
- 规则的优势：执行一致，不会被 agent "合理化"绕过

**最佳实践：关键门禁用规则，日常操作用原则。** 这正是 Anthropic 的 `<HARD-GATE>`（规则）+"ask one question at a time"（原则）的组合。

### 张力 3：单一 agent vs 多 agent 审查

Anthropic 和 Cursor 的技能是给单个 agent 用的。CE 和 Gstack 大量使用子 agent 进行验证和审查。

- 多 agent 审查成本高（token 消耗翻倍）、延迟高
- 但能捕获单一 agent 的系统性盲点
- CE 的解决方案：在用户思考时异步派发验证 agent，让延迟不可见

## 五流派的根本分歧维度

### 对 Agent 智能的信任度

```
低信任 ←──────────────────────────────────────────→ 高信任
  CE          Gstack      Vercel     Cursor    Anthropic
  穷举规范    分层审查    验证规则    精确指令    原则+边界
```

### 技能粒度

```
原子级 ←──────────────────────────────────────────→ 管道级
 Cursor     Vercel    Anthropic    CE        Gstack
 一个操作    一个领域    一个流程    一个阶段    一个完整工作流
```

### 质量保证策略

| 来源 | QA 策略 | 代表机制 |
|------|---------|---------|
| **Anthropic** | 反模式命名 + 关键门禁 | `<HARD-GATE>`, "Anti-Pattern: This Is Too Simple" |
| **Cursor** | 硬规则 + 精确命令 | "Never discard user work", "No `git add .`" |
| **CE** | 多层验证子 agent + 穷举条件 | 验证器 agent 异步检查事实声明，confidence anchor 打分 |
| **Gstack** | 多视角审查面板 | CEO→design→eng→DX 四人审查，`/autoplan` 一键运行全流程 |
| **Vercel** | 验证规则 + 自动升级建议 | `validate` 规则检测反模式并自动推荐技能升级路径 |

## 对 better-skills 的关键启示

1. **分层设计**：不是所有技能都需要 CE 级别的穷举。定义三层——轻量（Cursor 风格）、标准（Anthropic 风格）、深度（CE 风格）——根据使用频率和失败成本选择层级。

2. **提取可复用模式而非完整技能**：最有价值的知识不是某个完整的技能，而是其中的**具体技术**——比如 CE 的 "rigor gap" 框架、Anthropic 的 "反模式命名" 技术、Gstack 的 "多视角审查面板" 模式。

3. **Gstack 的模板生成系统**：用代码生成 SKILL.md 是一个被低估的创新。它允许跨技能共享 preamble、版本控制和 diff、以及针对不同平台生成不同版本。

4. **Vercel 的验证规则模式**：`validate` 规则 + `upgradeToSkill` 自动路由——不仅检测问题，还提供修复路径。

5. **不要直接抄 CE 的长度**：CE 的 800 行技能之所以有效，是因为他们有大量的实际使用反馈来打磨每一行。没有那种反馈循环，长技能更容易出错而不是更好。从短的开始，根据实际使用逐步扩展。

## 关联文档

### 核心流派深度分析
- [Anthropic 流派深度分析](anthropic-analysis.md)
- [Cursor 流派深度分析](cursor-analysis.md)
- [Compound Engineering 流派深度分析](compound-engineering-analysis.md)
- [Gstack 流派深度分析](gstack-analysis.md)
- [Vercel 流派深度分析](vercel-analysis.md)

### 补充分析
- [其他顶级仓库补充分析](top-repos-supplement.md)（Karpathy, Taste Skill, Open Design, Addy Osmani, Superpowers）

### 模式提取
- [可复用模式提取](extracted-patterns.md)（50+ 模式，8 个类别）
