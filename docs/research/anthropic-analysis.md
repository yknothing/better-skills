# Anthropic 流派深度分析

> 来源：Claude Code 内置 skills、anthropic-agent-skills marketplace
> 代表技能：`skill-creator`、`brainstorming`

---

## 设计哲学

**核心理念**："Default assumption: Claude is already very smart. Only add context Claude doesn't already have."

信任 agent 的智能，给原则和边界而非穷举规则。技能告诉 agent **原则和边界**，不规定每一步怎么做。

## 关键技能剖析

### `skill-creator` — 如何设计技能

#### 反直觉设计决策

**1. "Context window is a public good"**

这不是一句口号。这句话直接挑战了技能作者的默认倾向——往技能里塞更多"有用的信息"。它建立了一个零和博弈的心智模型：你加的每个 token，都在排挤用户对话、系统 prompt、其他技能的元数据。这让"简洁"从美德变成了**道德责任**。

**2. "Degrees of Freedom" 框架**

根据任务的脆弱性和可变性来匹配指令的精确度：

- **高自由度（文字指导）**：多个方法都可行，决策依赖上下文
- **中自由度（伪代码或带参数的脚本）**：有偏好模式但允许变化
- **低自由度（具体脚本，少参数）**：操作脆弱易错，一致性关键

这揭示了大多数糟糕技能的根本问题：对所有任务用了同一级别的精确度。

**3. description 的"触发条件优先"规则**

> "Include all 'when to use' information here - Not in the body. The body is only loaded after triggering, so 'When to Use This Skill' sections in the body are not helpful to Claude."

技能发现机制的根本性洞察：description 是技能的"搜索引擎片段"，body 是"加载后的说明书"。把触发条件放在 body 里，就像把目录放在书的第 50 页。

**4. 禁止额外文件**

> "Do NOT create extraneous documentation: README.md, INSTALLATION_GUIDE.md, CHANGELOG.md..."

技能不是给人读的项目——它是给 AI agent 用的工具。README 对 agent 是噪音，CHANGELOG 是垃圾。

**5. 渐进式披露（Progressive Disclosure）**

三级加载系统：
1. **元数据（name + description）**：始终在上下文中（~100词）
2. **SKILL.md body**：技能触发时加载（<5k词）
3. **捆绑资源**：按需加载（无限制，脚本可执行而无需加载到上下文窗口）

#### 可复用技术

| 技术 | 描述 | 适用场景 |
|------|------|---------|
| 上下文是公共品 | 将简洁视为道德责任而非美德 | 所有技能设计 |
| 自由度框架 | 根据任务脆弱性匹配精确度 | 技能设计时的结构决策 |
| 触发条件分离 | description 只写触发条件，不写工作流总结 | 技能的 description 字段 |
| 渐进式披露 | SKILL.md 为索引，细节在支持文件中按需加载 | 大型技能的内容组织 |
| 反模式命名 | 精确命名 agent 会使用的合理化借口 | 防止 agent 跳过关键步骤 |

### `brainstorming` — 从创意到设计文档

#### 反直觉设计决策

**1. `<HARD-GATE>` 标签**

不是 "You should not implement yet"，而是用 XML 标签和全大写建立了一道**视觉上不可忽视的屏障**。这是在 prompt 设计中使用"格式显著性"来控制注意力。

**2. 命名反模式**

> "Anti-Pattern: 'This Is Too Simple To Need A Design'"

精确命名了 agent 会使用的合理化借口。通过在 agent 产生这个念头之前就命名它，让 agent 能在产生这个念头时自我识别。

**3. "Offer MUST be its own message"**

> "This offer MUST be its own message. Do not combine it with clarifying questions, context summaries, or any other content."

一个用户体验规则，不是技术规则。理解了一个微妙的问题：当重要信息和其他内容混在一起时，用户会扫过而不是真正处理。

**4. 精确的终端状态**

> "The terminal state is invoking writing-plans. Do NOT invoke frontend-design, mcp-builder, or any other implementation skill. The ONLY skill you invoke after brainstorming is writing-plans."

精确命名下一个技能、列出禁止调用的技能、使用大写 ONLY——消除 agent 在流程转换点上的模糊性。

**5. Spec Self-Review 清单**

先让 agent 自己审查自己的输出，再交给用户：
1. Placeholder scan（TBD/TODO 扫描）
2. Internal consistency（内部一致性）
3. Scope check（范围检查）
4. Ambiguity check（歧义检查）

"Fix any issues inline. No need to re-review — just fix and move on" 避免了完美主义的无限循环。

**6. Visual Companion 的 "per-question decision"**

> "Even after the user accepts, decide FOR EACH QUESTION whether to use the browser or the terminal."

不是"接受了就用到底"，而是每次决策都重新判断。防止视觉工具从"有用的选项"滑向"默认行为"。

#### 可复用技术

| 技术 | 描述 | 适用场景 |
|------|------|---------|
| 格式显著性门禁 | 用 XML 标签/全大写创建视觉上不可忽视的屏障 | 关键的不允许行为 |
| 反模式预命名 | 提前命名 agent 可能使用的合理化借口 | 防止跳过流程 |
| 独立消息规则 | 重要信息必须独占一条消息 | 用户交互设计 |
| 精确终端状态 | 明确命名下一个技能 + 禁止调用的技能 | 技能链的交接点 |
| 自我审查清单 | agent 先审查自己的输出再交给用户 | 质量保证 |
| 每次决策重判断 | 不因"已启用"而默认使用某功能 | 工具/模式的使用控制 |

## 设计特征总结

| 维度 | 评价 |
|------|------|
| 技能粒度 | 中等——一个技能覆盖一个完整工作流 |
| 指令精确度 | 原则为主，关键点用精确规则 |
| 错误预防 | 反模式命名 + 关键门禁 |
| 上下文效率 | 三级渐进式披露，严格 token 预算 |
| 平台依赖 | 依赖 Claude 的智能来填充原则之间的空白 |
| 维护成本 | 低——改原则即可，不需要穷举条件分支 |
