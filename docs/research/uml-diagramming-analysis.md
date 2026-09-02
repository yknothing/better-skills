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

## 六、R3 修订：跨模型鲁棒性（2026-08-31，由首个外部使用样本驱动）

Haiku 4.5 携带本技能画本仓库 UML 的实测（`docs/reviews/bs-uml-master/2026-08-31-haiku-usage-review.md`）暴露了新失败类别——**合规表演（compliance theater）**：弱模型复刻技能的*格式*（声明字段、结构、notes）而跳过技能的*工作*（读代码建台账、验证收据、真记法），且格式反过来给未验证内容镀上权威（无收据的 `RENDER_VERIFIED` 比没有更糟）。

由此提炼的跨模型设计原则——**约束力阶梯**，强制力自弱到强：

1. 散文规则（只约束强模型——弱模型略读）
2. 结构化输出契约（缺项可见）
3. 必填占位符模板（缺项在格式上即残缺）
4. **确定性校验器**（模型无关——R3 落地 `scripts/check-delivery.js`：收据缺失的 State 行、Evidence/Excluded 缺失、声明图型与源码头不符（伪类图）、超预算无理由，全部机械拒绝；夹具实测对 Haiku 失败画像 4/4 命中）
5. 生成/验证上下文分离（生成者不能自我认证——authoritative 级已有，Phase 2.A 机械化后全面覆盖）

**抗退化机制**（技能如何随模型进化不降反升）：

- **不变量与时代层分离**：语义规则/证据纪律/预算是不变量（uml-semantics 等模块），工具语法陷阱是时代层（syntax-pitfalls，每条已 probe-scoped 带版本与探针指令，可优雅过期）。裁剪目标永远是时代层。
- **技能增益（skill lift）可测**：RED 基线按模型定期重跑；某维度上基线追平技能输出时，对应散文即死重——技能应随模型变强而*变薄*，留下的是工具、契约与领域不变量。
- **使用样本即纵向基准**：同一提示词 × 不同模型/时期的产出对照（本次 Haiku 样本为第一个数据点），比合成评测更真实。
- 改进点台账 schema v1 落地（`docs/reviews/_improvement-points-schema.md`），IP-1..IP-9 为首批数据，供未来 bs-skill-refiner 消费。


## 七、R7 修订：验证入口的约束力（2026-09-02，由完整会话复盘驱动）

第四个使用样本不是一张图，而是一条**轨迹**：Haiku 4.5 三天 11 个版本（`docs/reviews/bs-uml-master/2026-09-02-haiku-usage-review-4.md`），零次调用任何校验器，从 v3 起每版都有一张状态图在页面钉死的 mermaid 10.6.1 上解析失败（"空白页"真因），却被归咎于 CDN，继而逃逸为测试页/极简页/文本版/表格版；批评引发的是加层加图（3→4→6 张、单图 23 节点），契约自 v5 起消失；虚构实体（`batch_id`、`UNFROZEN`、`Registrar`、C1–C6）借形似的 `file:line` 引用洗白。

由此对约束力阶梯的修正——**第 4 级校验器若须经第 1 级散文抵达，其约束力等于散文**。R3–R6 的全部机械关卡都挂在"对 markdown 草稿运行 check-delivery"这一个入口之后；HTML 交付不产生这份 markdown，"必须写镜像"是散文，于是整条链路被绕过。R7 的对策：

1. **一条命令的验证入口**（`scripts/verify-delivery.js`）：markdown 或 HTML 直接输入（HTML 自动生成镜像），逐图在本地渲染器**和页面钉死的 CDN 版本**上解析（按需安装），渲染、按媒介适配检查、契约检查、引用完整性检查，输出带哈希戳的收据（行格式满足 C8）。原则：让合规路径成为最省力路径；工具生成收据（生成/验证分离的第 5 级），而不是模型誊写。
2. **引用完整性**（`scripts/check-evidence.js`）：`file:line` 逐条解析，路径/行号不存在即 FAIL，引用行上的标识符在被引文件中不存在即"虚构签名"。C3 只能证明引用存在，这一步证明引用可能为真。
3. **症状分诊配方**：空白页 = 钉死渲染器上的解析错误（先解析、再修、最后才查 CDN），禁止以降级后端逃逸症状。
4. **批评下修订协议**：先测量、走阶梯、元素数不增、每轮一杆、两轮不过即提一个范围问题、契约与收据跨版本不消失。
5. **时代层记忆**："你记得的版本不是你验证过的版本"——CDN 钉到验证所用版本，或在钉死版本上验证。

抗退化含义：使用样本从"单图评审"扩展到"轨迹评审"——一个会话的版本序列本身就是纵向基准（版本数、契约存活率、校验器调用次数、元素数走势），能直接读出技能在弱模型上的约束力曲线；这些指标应进入未来 bs-skill-refiner 的采集 schema。
