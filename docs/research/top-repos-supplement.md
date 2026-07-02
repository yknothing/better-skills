# 其他顶级技能仓库补充分析

> 来源：Shareuhack Claude Code Skills Ranking + awesome-agent-skills 榜单
> 分析仓库：Karpathy Guidelines, Taste Skill, Open Design, Addy Osmani Agent Skills, Superpowers

---

## Karpathy Guidelines（forrestchang/andrej-karpathy-skills）

### 核心价值

这不是一个"技能"——它是一个**行为约束层**。从 Karpathy 对 LLM 编码常见错误的观察中提取的 4 条指导原则，每一条都是对 LLM 系统性弱点的精确反击。

### 四条指导原则

**1. Think Before Coding（先想后写）**

> "Don't assume. Don't hide confusion. Surface tradeoffs."

对抗 LLM 的"自信幻觉"——模型倾向于隐藏不确定性而非暴露它。

**2. Simplicity First（简单优先）**

> "No features beyond what was asked. No abstractions for single-use code. If you write 200 lines and it could be 50, rewrite it."

对抗 LLM 的"过度工程化"——模型倾向于添加未要求的灵活性、配置性和抽象。

**3. Surgical Changes（外科手术式修改）**

> "Don't 'improve' adjacent code, comments, or formatting. Match existing style, even if you'd do it differently."

对抗 LLM 的"范围蔓延"——模型倾向于在修改目标代码的同时"顺便"重构周围代码。

**4. Goal-Driven Execution（目标驱动执行）**

> "Transform tasks into verifiable goals. Strong success criteria let you loop independently."

对抗 LLM 的"模糊完成"——模型倾向于在"大概完成了"的时候就停止，而非验证到确凿通过。

### 可复用技术

| 技术 | 描述 |
|------|------|
| 行为约束层 | 不是告诉 agent 怎么做，而是告诉 agent 不要做什么——对抗 LLM 的系统性弱点 |
| 可验证成功标准 | 将模糊任务转化为可验证目标（"Fix the bug" → "Write a test that reproduces it, then make it pass"） |
| 每个修改可追溯 | "Every changed line should trace directly to the user's request" |

---

## Taste Skill（Leonxlnx/taste-skill）

### 核心价值

这是一个**"反 AI 味道"前端设计技能**——精确对抗 LLM 在 UI 生成中的系统性偏差。通过可配置的"设计旋钮"（DESIGN_VARIANCE、MOTION_INTENSITY、VISUAL_DENSITY）控制输出风格。

### 最反直觉的设计

**1. 可量化旋钮替代模糊风格描述**

不是"做一个好看的 UI"，而是：
- `DESIGN_VARIANCE: 8`（1=完美对称, 10=艺术性混乱）
- `MOTION_INTENSITY: 6`（1=静态, 10=电影级动画）
- `VISUAL_DENSITY: 4`（1=画廊级留白, 10=驾驶舱级数据密度）

**2. 命名的"禁止模式"**

- "THE LILA BAN"：禁止 AI Purple/Blue 审美
- "NO Inter Font"：禁止默认字体
- "NO 3-Column Card Layouts"：禁止通用三列卡片
- "NO Generic Names"：禁止 John Doe/Sarah Chan
- "NO Startup Slop Names"：禁止 Acme/Nexus/SmartFlow

**3. "AI Tells" 分类**

将 AI 生成的特征分为 Visual & CSS、Typography、Layout & Spacing、Content & Data 四大类，每类有精确的禁止列表。

**4. 完整的交互状态强制**

> "LLMs naturally generate 'static' successful states. You MUST implement full interaction cycles: Loading, Empty, Error, Tactile Feedback."

**5. 性能护栏**

> "NEVER use React useState for magnetic hover. Use EXCLUSIVELY Framer Motion's useMotionValue."

不是只说"注意性能"，而是精确到具体的 API 选择。

### 可复用技术

| 技术 | 描述 |
|------|------|
| 可量化设计旋钮 | 用数值参数替代模糊风格描述 |
| 命名的禁止模式 | 给 AI 的审美偏差起名字，让 agent 能识别和避免 |
| AI Tells 分类 | 按视觉/排版/布局/内容分类 AI 生成特征 |
| 交互状态强制 | 要求实现 Loading/Empty/Error/Active 完整循环 |
| 性能护栏 | 精确到 API 级别的性能约束 |
| 创意武器库 | 列举高级 UI 概念（Bento Grid、Glassmorphism、Magnetic Button 等）作为灵感源而非默认值 |

---

## Open Design（nexu-io/open-design）

### 核心价值

一个**设计系统生成工具**，配套一套**"反 AI Slop"规则**——通过可检查的、具体的规则区分"人类设计"和"默认 LLM 输出"。

### 反 AI Slop 规则体系

**P0（必须修复）——七大罪：**
1. 默认 Tailwind indigo 作为强调色
2. 双色渐变 hero（purple→blue）
3. Emoji 作为功能图标
4. Display 文字使用 sans-serif（当设计种子绑定 serif 时）
5. 圆角卡片 + 彩色左边框（经典的 "AI dashboard tile"）
6. 编造的指标（"10× faster"）
7. 填充文本（lorem ipsum）

**P1（应该修复）：**
- 标准 "Hero→Features→Pricing→FAQ→CTA" 序列
- 外部占位图片 CDN
- 超过 12 个裸 hex 值在 `:root` 之外

**P2（最好修复）：**
- 无 `data-od-id` 的 section
- 装饰性 blob/wave SVG 背景
- 完美对称布局，无视觉张力

### 核心洞察

> "Aim for ~80% proven patterns + ~20% distinctive choice."

> "If a reviewer screenshots the artifact and someone outside the project can identify which product it's from — you have soul. If not, you shipped a template."

### 可复用技术

| 技术 | 描述 |
|------|------|
| 分级反模式规则 | P0/P1/P2 严重级别，精确到具体 hex 颜色值 |
| 80/20 规则 | 80% 经过验证的模式 + 20% 独特选择 |
| "灵魂" 测试 | 截图中能识别出哪个产品 → 有灵魂；不能 → 是模板 |

---

## Addy Osmani Agent Skills（addyosmani/agent-skills）

### 核心价值

一个**工程纪律框架**——将技能、角色（Personas）和斜杠命令三层分离。强调"反合理化"（Anti-Rationalization）——精确命名 agent 会使用的借口。

### 三层架构

| 层 | 定义 | 职责 |
|----|------|------|
| **Skills** | 带步骤和退出条件的工作流 | **How**——如何执行 |
| **Personas** | 带视角和输出格式的角色 | **Who**——谁在执行 |
| **Slash Commands** | 用户面向的入口点 | **When**——何时触发 |

### 反合理化（Anti-Rationalization）

> "The following thoughts are incorrect and must be ignored: 'This is too small for a skill', 'I can just quickly implement this', 'I'll gather context first'."

精确命名 agent 会使用的三个借口，让 agent 在产生这些念头时能自我识别。

### 生命周期映射

```
DEFINE → PLAN → BUILD → VERIFY → REVIEW → SHIP
```

不是模糊的"先规划再实现"，而是每个阶段都有精确的技能映射。

### 可复用技术

| 技术 | 描述 |
|------|------|
| 三层分离 | Skills/Personas/Commands 各司其职 |
| 反合理化预命名 | 精确列举 agent 会使用的借口 |
| 生命周期映射 | 每个阶段精确映射到技能 |
| 并行审查面板 | 唯一支持的多角色模式：并行 fan-out + 合并 |

---

## Superpowers（obra/superpowers）

### 核心价值

一个**完整的 AI 驱动软件开发方法论**。其 `writing-skills` 技能定义了"基于 TDD 的技能创建方法"——这是 Anthropic `skill-creator` 的方法论基础。

### 关键创新：TDD 技能创建

> "Writing skills IS Test-Driven Development applied to process documentation."

| TDD 概念 | 技能创建 |
|----------|---------|
| 测试用例 | 带子 agent 的压力场景 |
| 生产代码 | 技能文档（SKILL.md） |
| 测试失败（RED） | agent 在无技能时违反规则（基线） |
| 测试通过（GREEN） | agent 在技能指导下合规 |
| 重构 | 堵漏洞，保持合规 |

> "If you didn't watch an agent fail without the skill, you don't know if the skill teaches the right thing."

### Subagent-Driven Development

一个完整的子 agent 执行模式：
1. 派发实现子 agent
2. 派发 spec 合规审查子 agent
3. 派发代码质量审查子 agent
4. 每任务两阶段审查（spec → quality）
5. 连续执行，不在任务间暂停

### 可复用技术

| 技术 | 描述 |
|------|------|
| TDD 技能创建 | RED（基线失败）→ GREEN（合规）→ REFACTOR（堵漏洞） |
| 压力场景测试 | 用子 agent 模拟 agent 在压力下是否会违反规则 |
| 两阶段审查 | spec 合规先于代码质量 |
| 连续执行 | 不在任务间暂停或确认 |
| 模型分层 | 机械任务用便宜模型，架构/审查用最强模型 |

---

## 新发现模式汇总

从这批仓库中提取的、之前分析中未覆盖的模式：

| 模式 | 来源 | 描述 |
|------|------|------|
| **行为约束层** | Karpathy | 不是告诉 agent 怎么做，而是告诉 agent 不要做什么——对抗 LLM 的系统性弱点 |
| **可量化设计旋钮** | Taste Skill | 用数值参数替代模糊风格描述 |
| **分级反模式规则** | Open Design | P0/P1/P2 严重级别，精确到具体 hex 颜色值 |
| **80/20 设计规则** | Open Design | 80% 经过验证的模式 + 20% 独特选择 |
| **"灵魂" 测试** | Open Design | 截图中能识别出哪个产品 → 有灵魂；不能 → 是模板 |
| **三层分离架构** | Addy Osmani | Skills/Personas/Commands 各司其职 |
| **TDD 技能创建** | Superpowers | RED（基线失败）→ GREEN（合规）→ REFACTOR（堵漏洞） |
| **两阶段审查** | Superpowers | spec 合规先于代码质量 |
| **连续执行** | Superpowers | 不在任务间暂停或确认 |

---

## 关联文档

- [五大流派对比总览](README.md)
- [可复用模式提取](extracted-patterns.md)
