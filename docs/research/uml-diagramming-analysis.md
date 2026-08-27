# UML 图表领域深度分析 — bs-uml-master 的 STUDY 依据

> 调研日期：2026-08-27
> 调研方式：Web 深度调研（工具文档、C4 官方资料、LLM 图表生成论文、现有图表类技能仓库）+ 本仓库 RED 基线实测
> 服务对象：`skills/bs-uml-master/`

---

## 一、市场空白：现有图表技能解决语法，无人解决语义

对现有图表类 Agent Skill 的解剖：

| 技能 | 解决什么 | 缺什么 |
|------|---------|--------|
| [awesome-skills/mermaid-syntax-skill](https://github.com/awesome-skills/mermaid-syntax-skill) | 纯语法防错（转义、保留字，覆盖 ~90% 常见错误） | 无 UML 语义、无抽象纪律、无验证闭环 |
| [WH-2099/mermaid-skill](https://github.com/WH-2099/mermaid-skill) | 23 种图型语法参考（GitHub Actions 自动同步官方文档） | 参考堆砌；无验证步骤、无复杂度上限 |
| softaworks / ccheney 系列 mermaid-diagrams | 图型选择决策树 | 仅 Mermaid；无 PlantUML 降级路径；无渲染门禁 |
| Mermaid CLI / Fix 类技能与 MCP 验证器 | mmdc 验证 + 修复循环 | 只到语法层，不查 UML 正确性 |
| [drawio-ninja](https://github.com/simonpo/drawio-ninja) | draw.io XML 结构有效性规则 | 结构有效 ≠ 图好 |
| [Cocoon-AI architecture-diagram](https://github.com/Cocoon-AI/architecture-diagram-generator) | 手工 HTML+SVG 架构图设计系统 | 非 UML、非文本源、不可 diff |

**结论：语法层（转义/验证）和美学层（设计系统）已有人做；语义正确性、抽象层级纪律、代码取证式建模三者的组合无人做。这就是 bs-uml-master 的 BUILD 理由**（`external/sources.yaml` 中无同域上游技能，Reference-vs-Build 门通过）。

## 二、实证研究：LLM 画图的系统性弱点

1. **关系语义是重灾区**：ACM 实证研究显示 LLM 生成类图时类正确率 66%、属性 91%，而**关系正确率仅 25%**（[Evaluating LLMs on UML class diagram exercises](https://dl.acm.org/doi/fullHtml/10.1145/3674805.3690741)）。继承箭头反向、组合/聚合菱形放错端、依赖当关联，渲染正常但语义撒谎。
2. **语法错误率不随模型规模下降**：IBM [MermaidSeqBench](https://arxiv.org/abs/2511.14967)（NeurIPS 2025）与 OmniDiagram 论文均发现语法正确率"与模型规模基本无关"——**解药是验证-修复循环，不是更大的模型**。GenAIScript、Roo-Code 均独立收敛到 render-validate-repair 方案。
3. **RED 基线实测**（本仓库，2026-08-27，Sonnet 无技能）："帮我画一个电商系统的UML图" → 立即产出 12 类"大而全"类图：不问图要回答什么问题；关系几乎全用普通关联；`status` 用 String 而非枚举；无标题；交付前零验证。与文献失败模式完全吻合。

## 三、"顶级"的构成要素（EXTRACT）

1. **问题先于图型**：一图一问。C4 遵循 Shneiderman mantra（overview first, zoom and filter, details on demand）；Simon Brown："需要 4K 显示器才能读的不是图，是墙纸"。
2. **单一抽象层级 + 元素预算**：约 ≤9 个主要元素（7±2 作为务实预算而非认知定律）；混层（微服务旁边画工具类）是架构图不可读的头号原因（[C4 misuse](https://www.workingsoftware.dev/misuses-and-mistakes-of-the-c4-model/)）。
3. **语义正确性硬规则**：三角在父类端；菱形在整体端；虚线开箭头=依赖；实心箭头=同步、开箭头=异步、虚线=返回；`trigger [guard] / effect`；守卫互斥完备。
4. **代码取证式建模**：恢复设计而非实现（[srcUML](https://www.cs.kent.edu/~jmaletic/papers/ICSME16-UML.pdf)）；每个元素可 grep 回代码——机械可执行的反幻觉门禁。
5. **渲染验证闭环**：`mmdc` / `plantuml -checkonly` / Kroki POST；未经渲染器往返的图不交付；修复循环有界（≤5 次）。
6. **工具路由诚实**：Mermaid 无真正的活动图/组件图/部署图（flowchart 是代用品）、用例图 beta、C4 实验性；这些图型路由到 PlantUML（含 C4-PlantUML stdlib）。关键语法陷阱：Mermaid 保留字 `end`、逗号泛型不支持、activation 必须配对、`o`/`x` 开头 ID 与 `--` 相邻解析为边饰。

关键来源：[C4 checklist](https://c4model.com/diagrams/checklist)、[C4 notation](https://c4model.com/diagrams/notation)、[C4-PlantUML LayoutOptions](https://github.com/plantuml-stdlib/C4-PlantUML/blob/master/LayoutOptions.md)、[PlantUML command line](https://plantuml.com/command-line)、[mermaid-cli](https://github.com/mermaid-js/mermaid-cli)、[Ambler, Elements of UML 2.0 Style](https://agilemodeling.com/style/classdiagram.htm)、[text-to-diagram.com](https://text-to-diagram.com/)。

## 四、模式映射（EXTRACT → docs/patterns/）

| 领域要素 | 既有模式 |
|---------|---------|
| 语义/证据约束前置 | `hard-rules-first` (Cursor) |
| 五个参考模块按阶段加载 | `progressive-disclosure` (Anthropic/CE) |
| 渲染/语法工具产出证据 | `verification-rules` (Vercel) |
| sketch/deliverable/authoritative 三档 | `format-significance-gates` (Anthropic) |
| RENDER_VERIFIED/SYNTAX_VERIFIED/UNVERIFIED 固定词汇 | `confidence-anchors` (CE) |
| everything-diagram、confident-fiction 等命名反模式 | `named-anti-patterns` (Taste Skill) |
| 元素预算聚焦理解增量 | `80-20-design-rules` (Open Design) |
| 渲染器缺失时的降级阶梯 | `platform-degradation-rules` (CE) |

无需新增模式文件；全部复用 active 模式。

## 五、R2 修订：投影架构与布局工艺（2026-08-27）

第二轮设计讨论确立了两个补强，同日实施：

1. **规范模型 vs 呈现投影分层**。证据台账即规范模型；Mermaid / PlantUML / 纯文本 / SVG 是同一模型的四个投影后端，各自只带「陷阱表 + 验证配方 + 预算修正」三件套。纯文本的生态位是代码注释/终端（等宽网格即读者的渲染器，验证=对齐检查）；SVG 仅允许从已验证模型投影（铁律），验证=视觉+台账同步+布局量规三重检查，防 "beautiful fiction"。媒介选后端（Rule 8）。
2. **布局升格为语义通道**（Rule 9）。位置承载隐式断言（相邻=耦合、上下=层级/时序），坏布局是 wrong-by-position 的正确性缺陷。三层杠杆：模型本身（预算/拆分/图型布局风险不对称——时序图与状态机几何被语义钉死、自由图高风险）→ 引擎战术（声明顺序、方向、分组、PlantUML 隐藏边/箭头长度/最少方向提示、Mermaid ELK）→ 投影升级（PlantUML→D2/SVG）。7 点可检查量规（流向单调、交叉预算、邻近诚实、层级方向、标签纪律、媒介适配、密度均衡）+ 有界修复循环（≤5 轮后升级而非死磕或交差）。页面媒介（memo/PDF）的宽度与不可缩放约束在 Phase 0 采集。

来源补充：C4-PlantUML LayoutOptions（最少方向提示原则）、Mermaid ELK layout 选项、D2/TALA 自动布局对比（text-to-diagram.com）、UML 布局实证研究（crossing minimization 对理解度的影响，Springer s11219-006-9218-2）。
