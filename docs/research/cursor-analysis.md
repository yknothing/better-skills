# Cursor 流派深度分析

> 来源：Cursor 内置 skills (`~/.cursor/skills-cursor/`)
> 代表技能：`babysit`, `split-to-prs`, `loop`, `create-skill`

---

## 设计哲学

**核心理念**：一件小事做到极致。每个技能只做一件事，用精确的工具指令和硬规则来约束行为，技能之间通过调用关系组合。

## 关键技能剖析

### `babysit` — 让 PR 保持可合并（13 行）

```markdown
# Babysit PR
Your job is to get this PR to a merge-ready state.

1. Merge conflicts: Intelligently resolve any merge conflicts...
2. Comments: Review active unresolved comments (including Bugbot)...
3. CI: Fix CI issues caused by changes within this PR's scope.
   Never change CI checks/workflows just to make failures pass...
```

#### 为什么 13 行能工作

这不是偷懒——这是精确。每一句话都经过了精心设计：

- "Never change CI checks/workflows just to make failures pass" — 一个 agent 会尝试的捷径被提前堵死
- "if intents conflict, abort the merge and ask for clarification" — 精确的失败模式
- "explain when you disagree or are unsure" — 赋予 agent 说"不"的权利

### `split-to-prs` — 拆分为小 PR

#### 反直觉设计决策

**1. 硬规则优先**

> - Do not create branches, commit, push, or open PRs until the user approves the split plan.
> - Never discard user work. No destructive git commands (`reset --hard`, `clean -fdx`, branch deletion, force-push) without explicit approval.
> - Always save a recoverable snapshot before moving work around.
> - Stage only named files or hunks. No `git add .` / `git add -A`.

硬规则出现在技能的最前面，在任何流程描述之前。这确保了 agent 在读流程之前就已经被约束。

**2. 精确的备份命令**

```bash
SHA=$(git stash create "pre-split")
if [ -n "$SHA" ]; then
  git update-ref "refs/backup/pre-split-$(date +%s)" "$SHA"
fi
```

不是"保存备份"的模糊指令，而是精确的 shell 命令。这消除了 agent 在"怎么备份"上的自由发挥空间。

### `loop` — 循环执行

#### 反直觉设计决策

**1. 区分固定调度和动态调度**

不是做一个通用的循环工具，而是精确区分两种场景：
- **固定调度**：`while true; do sleep <seconds>; echo 'AGENT_LOOP_TICK...'`
- **动态调度**：基于事件触发 + 心跳回退

**2. 精确的哨兵机制**

> "Use a unique sentinel per loop so unrelated output does not trigger notifications."

每个循环有唯一的哨兵字符串，防止不同循环的输出互相干扰。这是一个只有经历过生产环境故障的人才会想到的细节。

### `create-skill` — 创建技能

#### 与 Anthropic `skill-creator` 的对比

| 维度 | Cursor `create-skill` | Anthropic `skill-creator` |
|------|----------------------|--------------------------|
| 风格 | 教程式，带完整示例 | 原则式，带设计哲学 |
| 示例 | 完整的 PDF 处理技能示例 | 分散的代码片段 |
| 反模式 | 5 个具体反模式，每个有 bad/good 对比 | 通过原则隐式表达 |
| 工作流 | 明确的 Phase 1-4 | 6 步流程 |
| 目标用户 | 需要上手指导的用户 | 理解原则的熟练用户 |

#### 可复用技术

| 技术 | 描述 | 适用场景 |
|------|------|---------|
| 极简精确 | 13 行完成一个完整工作流 | 高频、低复杂度任务 |
| 硬规则前置 | 关键约束在流程描述之前 | 防止 agent 走捷径 |
| 精确命令替代模糊指令 | 用具体 bash 命令替代"做 X"的描述 | 关键操作（备份、删除等） |
| 哨兵机制 | 唯一标识符防止输出干扰 | 后台/循环任务 |
| 固定/动态模式分离 | 根据任务性质选择调度策略 | 循环/监控类技能 |

## 设计特征总结

| 维度 | 评价 |
|------|------|
| 技能粒度 | 极小——一个技能只做一件事 |
| 指令精确度 | 精确命令为主，硬规则约束 |
| 错误预防 | 硬规则 + 精确命令 + 具体失败模式 |
| 上下文效率 | 极优——技能极短 |
| 平台依赖 | 依赖精确的工具调用语法 |
| 维护成本 | 极低——代码量少 |
| 组合方式 | 技能间通过调用关系组合 |
