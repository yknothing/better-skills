# Gstack 流派深度分析

> 来源：garrytan/gstack (GitHub) — YC CEO Garry Tan 的个人 Claude Code 配置
> 代表技能：`ship`、`office-hours`、`autoplan`、`careful`

---

## 设计哲学

**核心理念**：用 AI 覆盖完整软件工程流程——从产品构思到部署验证。每个技能是一个"角色"：CEO 审查员、工程经理、设计师、QA 负责人、发布工程师、调试员。通过**多视角审查面板**和**模板生成系统**确保一致性和质量。

## 关键创新

### 1. 模板生成系统

Gstack 最大的技术创新：SKILL.md 文件不是手写的，而是从 `.tmpl` 模板通过 `gen-skill-docs.ts` 生成的。

```
SKILL.md.tmpl → gen-skill-docs.ts → SKILL.md
      ↑                                  ↑
   手写编辑                         自动生成，不手动编辑
```

**优势**：
- 跨技能共享 preamble（工具列表、配置检测、遥测等）
- 模板变更自动传播到所有技能
- 版本控制和 diff 友好（改 .tmpl 即可）
- 针对不同平台生成不同版本

**代价**：
- 需要构建步骤
- 模板系统本身需要维护
- 生成的文件不能手动编辑（需要额外的纪律）

### 2. 多视角审查面板（autoplan）

`/autoplan` 一键运行完整的四阶段审查管道：

```
CEO review → Design review → Engineering review → DX review
```

每个审查从不同视角评估计划：
- **CEO review**：在需求中找到"10 星产品"——最好的产品方向
- **Design review**：每个设计维度 0-10 评分，解释什么是 10
- **Engineering review**：锁定架构、数据流、边缘情况、测试
- **DX review**：TTHW（Time To Hello World）、魔法时刻、摩擦点、角色轨迹

### 3. 两层测试系统

```
bun test          # Tier 1: 免费，<2s — skill 验证 + 生成质量
bun run test:evals # Tier 2: 付费，diff-based — LLM judge + E2E
```

Tier 1 是静态验证（YAML frontmatter、目录结构、生成质量）。Tier 2 是动态评估（LLM-as-judge + E2E via `claude -p`）。按 diff 选择测试范围，只运行受影响的测试。

### 4. 反直觉设计决策

#### "Boil the Ocean" — 完整性原则

> "Completeness is cheap. Don't recommend shortcuts when the complete implementation is achievable."

不是敏捷的"最小可行产品"，而是"AI 可以处理完整的实现，不要因为人类的成本约束而推荐捷径"。

#### "Search Before Building"

三层知识优先级：
1. **Layer 1 (tried-and-true)**: 经过验证的现有模式
2. **Layer 2 (new-and-popular)**: 新兴的最佳实践
3. **Layer 3 (first-principles)**: 从第一性原理推导

> "Prize Layer 3 above all."

#### 安全护栏（`careful` 技能）

用 Hook 系统在 Bash 命令执行前检查破坏性模式：

```yaml
hooks:
  PreToolUse:
    - matcher: "Bash"
      hooks:
        - type: command
          command: "bash $HOME/.claude/skills/gstack/careful/bin/check-careful.sh"
```

不是依赖 agent 记住"不要删东西"，而是**在操作系统层面拦截**。

#### 上下文保存/恢复

`/context-save` 和 `/context-restore` 跨会话保存工作状态（git 状态、决策、剩余工作）。这解决了 agent 会话丢失上下文的根本问题。

#### 跨模型基准测试

`/benchmark-models` 在 Claude、GPT、Gemini 之间对比同一个技能的表现。这为"哪个模型最适合哪个技能"提供了数据驱动的基础。

### 5. 与 CE 的对比

| 维度 | Gstack | Compound Engineering |
|------|--------|---------------------|
| 技能粒度 | 管道级——一个技能覆盖完整工作流 | 阶段级——一个技能覆盖一个工程阶段 |
| 质量保证 | 多视角审查面板（人工角色隐喻） | 子 agent 验证 + confidence anchor |
| 代码生成 | 模板系统（.tmpl → SKILL.md） | 手写 SKILL.md + 大量引用文件 |
| 平台定位 | 个人/小团队 | 团队/组织 |
| 测试基础设施 | 两层（免费静态 + 付费 E2E） | 内置在技能流程中 |
| 知识管理 | gbrain 语义搜索 + decisions.jsonl | docs/solutions/ + CONCEPTS.md |

## 可复用技术

| 技术 | 描述 | 适用场景 |
|------|------|---------|
| 模板生成 | 用代码生成 SKILL.md，跨技能共享 preamble | 拥有多个技能且需要一致性的项目 |
| 多视角审查面板 | 从 CEO/设计/工程/DX 四个视角审查 | 计划/设计审查类技能 |
| 两层测试 | 免费静态验证 + 付费动态评估 | 技能质量保证 |
| 安全 Hook 拦截 | 在操作系统层面拦截破坏性命令 | 安全/运维类技能 |
| 上下文保存/恢复 | 跨会话保存工作状态 | 长周期任务 |
| 跨模型基准测试 | 同一技能在不同模型上对比 | 技能优化/模型选择 |
| "Boil the Ocean" | AI 速度下的完整性原则 | 任务范围决策 |
| 三层知识搜索 | tried-and-true → new-and-popular → first-principles | 研究/调研类技能 |

## 设计特征总结

| 维度 | 评价 |
|------|------|
| 技能粒度 | 管道级——一个技能覆盖完整工作流 |
| 指令精确度 | 生成式精确——模板确保一致性 |
| 错误预防 | 多视角审查 + 安全 Hook + 测试系统 |
| 上下文效率 | 生成式 preamble 共享，但生成文件较大 |
| 平台依赖 | 深度集成 Claude Code + 自定义 CLI 工具 |
| 维护成本 | 中——模板系统需要维护，但变更自动传播 |
| 适用场景 | 个人/小团队的全栈开发流程 |
