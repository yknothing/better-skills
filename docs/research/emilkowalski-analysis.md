# Emil Kowalski Skills 流派分析

> 来源：[emilkowalski/skills](https://github.com/emilkowalski/skills)
> 作者：Emil Kowalski（Vercel / Linear 背景，Sonner 作者）
> 调研日期：2026-07-02
> 仓库定位："Skills for Design Engineers."

---

## 一、设计哲学

### 核心论点：领域专长 × AI 放大

README 明确：**skill 是领域专长的副产品，不是通用流程框架**。AI 不能替代“知道什么感觉对”，但能把已articulate 的规则规模化执行。这与 better-skills 的 Reference 策略一致——上游已经 excellent 时 curate + sync，不在本仓库重实现。

方法论原文：[Agents with Taste](https://emilkowal.ski/ui/agents-with-taste)（2026）。

### 与 better-skills 的分工

| 层 | better-skills | emilkowalski/skills |
|----|---------------|---------------------|
| 全 UI 设计 pipeline | `visual-design` (Build) | — |
| 动效实现与 craft 深度 | handoff | `emil-design-eng` (Reference) |
| 动效 diff 严格审查 | handoff | `review-animations` (Reference, user-invoked) |
| 动效术语反向查表 | — | `animation-vocabulary` (Reference) |

`visual-design` 吸收**方法论**（频率分级、Before/After/Why 审查格式、Reference handoff），**不摘录**上游 skill 正文中的曲线数值、代码片段与 glossary 条目。

---

## 二、三 skill 架构

```
animation-vocabulary  →  命名/描述动效
        ↓
emil-design-eng       →  实现与改进 UI 动效
        ↓
review-animations     →  审查 motion diff（Block / Approve）
```

| Skill | 行数 | invocation | 职责 |
|-------|------|------------|------|
| `emil-design-eng` | ~679 | model | 动效决策框架 + 组件手感 + 性能/a11y |
| `review-animations` | ~112 + STANDARDS.md | **user-only** (`disable-model-invocation`) | 十项标准 + Escalation + Before/After/Why |
| `animation-vocabulary` | ~173 | model（窄触发） | “那个效果叫什么” → 精确术语 |

**Progressive disclosure 范例：** `review-animations/SKILL.md` 管流程与输出协议；精确数值在 `STANDARDS.md` 按需加载。

---

## 三、可提取的模式（已用于 visual-design，非复制正文）

1. **频率优先于美观** — 用户一天看到几次，比“动画酷不酷”更重要；高频路径默认无动效或极轻反馈。
2. **Build / Review / Vocabulary 拆分** — 实现、审查、命名三件事不混在一个 skill 里。
3. **Before | After | Why 表格** — UI 代码审查的可验证输出格式。
4. **Remedial hierarchy** — 修复动效问题时优先删除/减弱，再谈 polish。
5. **Approval earned** — 审查 skill 默认 flag，通过需举证。

这些模式在 `docs/patterns/` 中部分已有对应（`multi-perspective-review`、`self-review-checklist`、`80-20-design-rules`）；emilkowalski 的贡献是把它们**垂直压到 design-engineering / motion 域**并做成可安装的 Reference 三件套。

---

## 四、注册与同步

`external/sources.yaml` 声明 source `emilkowalski-skills`：

```yaml
repo: https://github.com/emilkowalski/skills
skills_path: skills
skills: [emil-design-eng, review-animations, animation-vocabulary]
```

安装：

```bash
npx @yknothing/better-skills add emil-design-eng
npx @yknothing/better-skills add review-animations
npx @yknothing/better-skills add animation-vocabulary
# 或一次性：bash tools/sync.sh
```

---

## 五、Upgrade → Build 触发器（设计意图）

当 `visual-design` + `references/motion.md` 累计 ≥5 条上游有而本仓库未 enforce 的 motion 规则，且使用数据证明 Reference 在 motion 场景 consistently 优于 Build-only 时，再评估是否将 `emil-design-eng` 能力内化。在此之前保持 Reference。
