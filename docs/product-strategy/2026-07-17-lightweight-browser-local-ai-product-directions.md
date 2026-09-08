# 轻量浏览器与本地 AI 产品策略：10 个产品方向与验证路线

> 研究日期：2026-07-17  
> 使用方法：`bs-insight-product` Deep 模式  
> 场景：利用浏览器、本地模型、薄云端与现成商业基础设施，以较低成本完成产品开发、部署、获客和商业验证  
> 当前总决策：`TEST_FIRST`

## 执行摘要

本轮研究后，不建议继续优先考虑“通用本地 AI 工具”“普通网页监控器”“通用评论总结器”或“通用浏览器安全扫描器”。这些产品表面上开发轻、推理成本低，但真实经营成本已经转移到竞争、误报、规则维护、平台兼容、客服和信任责任。

当前最值得验证的三个方向是：

1. **AI Extension Behavioral Release Gate**：为 AI 浏览器扩展提供发布前行为与安全门禁，长期上限最高。
2. **Shopify / HubSpot CSV Import Preflight**：确定性最强、开发最轻、可通过具体错误信息获客。
3. **RFP / Tender Mandatory-Requirement Matrix**：单次结果价值高，适合从付费服务逐步软件化。

如果追求长期产品上限，应另外保留两个前沿期权：

- **Local-AI Reliability Plane**：客户端 AI 的能力检测、路由、质量和 fallback 控制面。
- **Private Browser Micro-Workflow Foundry**：面向组织私有分发的浏览器“最后一公里”微应用。

但当前没有任何方向具备足够的目标买方行为证据，可以诚实地进入 `PURSUE`。最合理的下一步不是直接开发完整 SaaS，而是对第一方向执行一个 14 天付费验证。

---

## 1. Discovery Route

| 项目 | 结果 |
|---|---|
| Product stage | `PRE_IDEA` |
| Primary mode | `DISCOVER`，附加 `FRONTIER` |
| Depth | `Deep` |
| Question budget | 0 |
| Questions used | 0 |
| Independence | `L1`：需求、前沿和运营三个隔离上下文完成盲首轮；仍存在同模型限制 |
| Decision at stake | 找到 5-10 个值得进入现实验证的产品方向，而不是直接批准开发 |

本轮采用 zero-question route：只使用会话材料、公开资料和独立分析，不推断创始人的渠道、能力、风险偏好或行业资源。因此：

- `PURSUE` 必须由目标用户或经济买方的真实行为证据支持；
- `CONVICTION_BET` 必须由具名 owner、可验证 founder edge、Reality Wedge 和明确损失边界支持；
- 当前两个门都没有通过。

---

## 2. Product Truth

### 2.1 Stated

- 目标是轻量开发、部署和获客，并形成真实商业变现。
- 核心机会来自浏览器、本地推理、PWA/Extension、现成支付基础设施和薄云端。
- 产品不应只包装通用 AI 能力，而应交付某个角色愿意付费的完成结果。
- 小产品应被视为市场探针；付费、复用和可重复分发同时出现后再扩大投入。
- 对尚未形成稳定市场语言的新方向，应保持基于洞察和远见的开放性，而不是用成熟市场的证据标准提前将其否决。

### 2.2 Inferred

- 初始产品应优先采用本地确定性引擎，AI 只承担分类、解释、聚类和非确定性增强。
- 云端应主要承担调度、历史、通知、团队治理、License 和无法本地完成的 fallback。
- 最好的早期产品通常具有明确输入、明确输出、低迁移成本和可直接触达的第一批用户。
- “发布失败、导入失败、遗漏关键要求”比“节省几分钟”更容易形成购买触发。

### 2.3 Out of Scope

- 不在本轮输出实施级 PRD、系统架构或完整开发计划。
- 不把公开竞品的用户量、价格或评论自动等同于目标方向的需求证明。
- 不把创始人信心、行业热度、技术趋势或多 Agent 共识当作买方证据。
- 不对任何方向作出 PMF、收入规模或必然成功的判断。

### 2.4 Evidence Ledger

| ID | Class | Claim | Source and limit |
|---|---|---|---|
| F-01 | Fact | Chrome 的内置 AI API 处于 Stable、Origin Trial、Developer Trial 等不同阶段；客户端能力并非一个稳定、统一的运行面。 | [Chrome Built-in AI APIs](https://developer.chrome.com/docs/ai/built-in-apis)，官方资料；不能证明具体买方会付费 |
| F-02 | Fact | 2026 年 4 月 Chrome Web Store 出现提交激增，审核可能从数日延长到数周；危险权限和难审代码会增加审核时间。 | [Chrome Web Store review process](https://developer.chrome.com/docs/webstore/review-process)，官方资料 |
| F-03 | Fact | Manifest V3 禁止扩展执行远程托管的 JavaScript/WASM，代码自包含、权限和数据披露是实际发布约束。 | [Remote hosted code requirements](https://developer.chrome.com/docs/extensions/develop/migrate/remote-hosted-code)，官方资料 |
| F-04 | Fact | Chrome Web Store 要求最小权限、明确的单一用途和与真实数据流相符的披露。 | [Chrome Web Store Program Policies](https://developer.chrome.com/docs/webstore/program-policies/policies)，官方资料 |
| F-05 | Fact | ASSURE 在 AI 扩展实验中发现大量安全、行为一致性和内容对齐问题，并展示自动化变形测试的可行性。 | [ASSURE](https://arxiv.org/abs/2507.05307)，研究结果；尚不等于商业需求 |
| F-06 | Fact | 通用网页变化监控已经有成熟免费和付费供给；Distill 的付费套餐从每月 15 美元起。 | [Distill pricing](https://distill.io/pricing/)，竞品证据 |
| F-07 | Fact | 通用网页抓取的浏览器免费、云端调度付费模式已成熟；Web Scraper Cloud 从每月 50 美元起。 | [Web Scraper pricing](https://webscraper.io/pricing)，竞品证据 |
| F-08 | Fact | 通用评论分析和“评论转产品洞察”已经存在 AppEngage、Kibbar 等产品。 | [AppEngage](https://www.appengage.io/)、[Kibbar](https://www.kibbar.com/)，竞品证据 |
| F-09 | Fact | 通用 CWS 提交预检已出现免费或低价产品，不能再把简单 ZIP 扫描视为明显空白。 | [CWS Submission Copilot](https://chromewebstore.google.com/detail/cws-submission-copilot-ex/bipgdjideeiobpfcnpdilolhnolefacg)、[CWS Preflight](https://cws-preflight.vercel.app/) |
| F-10 | Fact | 通用设计 token drift 扫描也已出现直接竞品。 | [Token Drift](https://chromewebstore.google.com/detail/token-drift/hndcilanhpdbeaghdjjolellpbeofiaa) |
| F-11 | Fact | 企业浏览器 DLP 已有 Nightfall 等产品；Chrome Enterprise 也在扩展管理和 AI 数据治理。 | [Nightfall DLP](https://chromewebstore.google.com/detail/nightfall-dlp-for-browser/jgmgecncmjklkabkejnjfgfkglapfgek)、[Nightfall pricing](https://www.nightfall.ai/pricing) |
| I-01 | Inference | 轻量产品最可行的切口不是再复制一个通用工具，而是把已有能力推进到“错误预防、发布决策或证据交付”的完成结果。 | 由 F-06 至 F-11 推导；置信度 75 |
| A-01 | Assumption | 小型扩展团队、代理商和垂直运营者愿意为避免一次发布、导入或交付事故直接付费。 | 这是本轮最危险假设，尚无目标买方付款证据 |
| A-02 | Assumption | 本地优先带来的隐私、离线和低边际成本，足以抵消浏览器兼容、模型下载和质量控制成本。 | 需要真实设备与真实工作流验证 |
| U-01 | Unknown | 执行者是否拥有 Chrome extension、Shopify/HubSpot migration、投标顾问或企业管理员渠道。 | 它决定前 10 位用户是否真正可达 |
| U-02 | Unknown | 目标买方对一次性报告、License、订阅或服务费的真实价格敏感度。 | 必须通过带价格的交易测试获得 |
| U-03 | Unknown | 哪一个方向与执行者的 founder edge、耐心和风险预算最匹配。 | 需要由人类 owner 决定 |

### 2.5 Riskiest Assumption

`A-01` 控制了最重要的下游决定：是否值得从一次性 concierge service 继续构建自助软件、CI、监控或团队后台。

如果目标买方只愿意使用免费脚本、原生控制台或人工检查，那么即使技术实现容易，产品也不成立。

---

## 3. Conflict Map

| ID | Claim A | Claim B | Downstream impact | Resolution | Status |
|---|---|---|---|---|---|
| C-01 | AI 扩展行为 QA 的产品上限最高 | CSV Import Preflight 更确定、更轻 | 第一款产品选择 | 分别执行小型付费测试，不合并产品 | `EXPERIMENT_NEEDED` |
| C-02 | 监控天然适合订阅 | 稳定抓取、误报、人审和支持会吞掉毛利 | 是否建设云端调度 | 只监控结构化合约或代码影响，先人工验证告警质量 | `EXPERIMENT_NEEDED` |
| C-03 | 本地隐私可能形成新控制层 | 通用 DLP 已拥挤且责任重 | 是否进入安全市场 | 只保留可逆 token 化的窄垂直版本 | `DEFERRED_WITH_BLOCK` |
| C-04 | 评论是公开、低成本的需求线索 | 评论分析已有成熟竞品且噪声较大 | 是否优先开发评论产品 | 降级为 evidence-linked backlog 并限制为用户主动导入 | `RESOLVED` |
| C-05 | 前沿基础设施可能形成更大产品 | 当前缺少真实 pilot、founder edge 和 owner | 是否批准前沿开发 | 保留期权，不授予 `CONVICTION_BET` | `DEFERRED_WITH_BLOCK` |
| C-06 | CWS 审核积压创造付费需求 | 审核延迟可能主要来自队列而非包质量 | 是否做提交预检 | 仅当历史 rejection 回放准确且有人付费时继续 | `EXPERIMENT_NEEDED` |

最强的对抗结论是：

> 推理成本低不等于产品经营成本低。对于变化监控、安全、合规和跨站扩展，真正的 COGS 往往是规则维护、误报、人审、DOM 漂移、客户支持、企业采购和事故责任。

---

## 4. Product Direction Portfolio

### 方向 1：AI Extension Behavioral Release Gate

**定位**：为 AI 浏览器扩展提供发布前行为与安全门禁，判断“这个版本是否可以发”。

| 字段 | 内容 |
|---|---|
| Best-fit user | 拥有真实用户的 AI Chrome Extension 团队、扩展开发代理商 |
| Buyer | 技术负责人、agency owner |
| Trigger | 扩展版本发布、模型升级、权限变化、CWS 重新审核 |
| Current alternative | Playwright/Puppeteer 自建脚本、人工回归、通用 E2E、开源研究框架 |
| Completed outcome | 一份含攻击/变形场景、失败复现、截图、网络轨迹和 release verdict 的证据报告 |
| Distinct mechanism | 对 DOM 噪声、语言、隐藏文本、顺序、格式和 prompt injection 做 metamorphic transformations，再验证业务和安全 invariants |
| MVP | 本地 runner + GitHub Action + HTML 报告；10-14 天 |
| First channel | 搜索公开的 `manifest_version: 3` + AI SDK GitHub 项目，为目标团队生成一个真实失败样本 |
| Revenue shape | `$199/单次 release audit`；验证后才做 `$79/月` CI |
| Primary risk | 误报、扩展适配成本、AI 扩展团队预算小、开源能力快速商品化 |
| Direction state | **第一优先，`TEST_FIRST`** |

不应一开始建设账号、dashboard、测试市场或完整 QA 平台。最先出售的产品是人工增强的 release audit。

### 方向 2：Shopify / HubSpot CSV Import Preflight

**定位**：在文件上传平台之前，本地发现并修复可预防的导入失败与数据污染。

| 字段 | 内容 |
|---|---|
| Best-fit user | Shopify migration agency、Shopify Expert、HubSpot 顾问 |
| Buyer | 顾问本人或 agency owner |
| Trigger | 商品、客户、订单或 CRM 数据迁移 |
| Current alternative | Excel 手工检查、试错上传、平台错误说明、Matrixify 等导入工具 |
| Completed outcome | 一个可安全尝试导入的文件，以及无法自动确认的店铺状态依赖项 |
| Distinct mechanism | 本地确定性检查编码、字段、locale、关联对象、格式和平台规则 |
| MVP | Browser/PWA 本地 parser；5-10 天 |
| First channel | 为具体 error code、错误信息和导入场景建立搜索页；Shopify Experts 与 HubSpot 顾问目录 |
| Revenue shape | `$19-49/文件`；代理商批量版 `$99/月` |
| Primary risk | 部分错误依赖店铺历史和账户状态，不能只从文件判断 |
| Direction state | **最稳健的轻产品，`TEST_FIRST`** |

参考：[Shopify common import issues](https://help.shopify.com/en/manual/products/import-export/common-import-issues)、[HubSpot troubleshoot import errors](https://knowledge.hubspot.com/import-and-export/troubleshoot-import-errors)。

### 方向 3：RFP / Tender Mandatory-Requirement Matrix

**定位**：不自动撰写投标答案，只保证强制要求、附件和证据缺口可追溯。

| 字段 | 内容 |
|---|---|
| Best-fit user | 投标顾问、政府采购供应商、中小型 B2B 销售团队 |
| Buyer | 投标经理、咨询公司 owner |
| Trigger | 收到 PDF、Word、补遗和附件组成的投标包 |
| Current alternative | 人工阅读、Excel compliance matrix、Loopio 等完整企业平台 |
| Completed outcome | 强制响应项、截止日期、附件、证据页、责任人和缺失材料矩阵 |
| Distinct mechanism | 本地文档解析、引用保留、版本冲突提示和人工确认边界 |
| MVP | PDF/Word parsing + OCR fallback + citation validation；2-3 周 |
| First channel | `RFP compliance matrix` 搜索意图、bid consultant 渠道 |
| Revenue shape | `$99/包`；顾问批量版 `$199-399/月` |
| Primary risk | 漏掉一个 mandatory item 的损失可能远高于产品节省的时间 |
| Direction state | **高价值、高准确率责任，`TEST_FIRST`** |

完整 RFP 平台已经证明企业预算存在，但也留下了“单次、窄结果、本地处理”的价格与复杂度空档。[Loopio pricing](https://loopio.com/pricing/)

### 方向 4：AI API Contract Drift Guard

**定位**：监控 AI API 作为“服务合约”的变化，而不是普通网页 diff。

监控范围包括：

- 模型价格和计费单位；
- context window 和 output limit；
- rate limit 与错误结构；
- endpoint、model alias 和 deprecation；
- 延迟、基本行为 canary 和兼容性；
- 哪个项目配置、预算或测试会受影响。

| 字段 | 内容 |
|---|---|
| Best-fit user | 同时依赖多个模型供应商的小型 AI SaaS 团队 |
| Buyer | CTO、技术负责人 |
| Trigger | 模型升级、价格调整、弃用、线上行为漂移 |
| Current alternative | 供应商 changelog、人工检查、通用网页监控 |
| Completed outcome | `服务变化 -> 受影响配置/预算/测试 -> 最小行动` |
| MVP | 官方来源解析 + 少量 canary probes + GitHub/Slack notification；2-3 周 |
| First channel | 免费模型服务变更索引、GitHub、模型弃用搜索词 |
| Revenue shape | `$29/月/5 endpoints`；团队版 `$99/月` |
| Primary risk | 供应商字段难统一、canary 成本、供应商快速内置同类能力 |
| Direction state | **差异化优于通用定价监控，`TEST_FIRST`** |

相关研究指出，同名模型在不同供应商、端点和时间下是持续变化的服务对象，而不是稳定商品。[Hosted Open-Weight LLM APIs study](https://arxiv.org/abs/2605.02821)

### 方向 5：Chrome Policy & Compatibility Impact Monitor

**定位**：把 Chrome 政策、API 和版本变化映射到具体仓库，而不是只告诉用户“文档变了”。

| 字段 | 内容 |
|---|---|
| Best-fit user | 维护 5 个以上扩展的 agency 或 portfolio operator |
| Buyer | 维护负责人、agency owner |
| Trigger | Chrome release、CWS policy、API deprecation、权限规则变化 |
| Current alternative | Release notes、Distill、人工逐 repo 检查、简单 CWS ZIP scanner |
| Completed outcome | `新规则 -> 受影响 repo/file/manifest key -> 截止时间 -> 最小行动` |
| MVP | 官方信息源监控 + 本地 repo scanner；7-10 天 |
| First channel | GitHub Marketplace、extension framework 合作、政策影响免费报告 |
| Revenue shape | `$39/月/5 repos`；agency `$99/月` |
| Primary risk | 重大影响事件频率不足以支撑订阅；影响映射产生误报 |
| Direction state | **`TEST_FIRST`** |

简单 CWS submission checker 已有直接供给，因此切口必须是持续、代码相关、可行动的影响分析，而不是再次做 ZIP 打分。

### 方向 6：Reviews -> Evidence-Linked Engineering Backlog

**定位**：把用户主动提供的评论转换为有原文证据、版本和复现线索的工程 backlog，而不是普通情感分析。

| 字段 | 内容 |
|---|---|
| Best-fit user | Chrome、Shopify 或其他 app publisher |
| Buyer | Product owner、独立开发者 |
| Trigger | 评论量增加、评分下降、规划下一个版本、分析竞品 |
| Current alternative | 逐条阅读、CSV 抓取、AppEngage、Kibbar、AppFollow 等产品 |
| Completed outcome | 带原文、频率、版本、影响范围和复现线索的 issue cards |
| Distinct mechanism | 用户主动导入，避免把平台抓取和 DOM 维护变成核心依赖 |
| MVP | 本地聚类、schema validation、GitHub/Linear export；7-10 天 |
| First channel | 给评论量较大的 publisher 免费发送一页真实样本 |
| Revenue shape | `$29/报告`或 `$79`永久本地版 |
| Primary risk | 评论噪声大、进入真实 backlog 的比例低、重复使用不足 |
| Direction state | **可以验证，但不是第一选择，`TEST_FIRST`** |

### 方向 7：Local-AI Reliability Plane

**定位**：为 client-side AI 提供能力检测、质量、路由和 fallback 控制面。

```text
Capability detection
        -> model download / warmup
        -> latency and quality check
        -> local / cloud routing
        -> fallback reason
        -> privacy-safe fleet telemetry
```

这不是再造模型或通用 AI sidebar。产品卖的是：

> 同一个 AI 工作流在真实设备、Chrome 版本、语言、模型状态和资源条件下仍然能完成。

| 字段 | 内容 |
|---|---|
| Initial actor | 正在把摘要、分类或结构化提取迁往 Chrome 本地 AI 的团队 |
| Reality Wedge | 一个 JS SDK + 路由器 + 隐私安全 dashboard，接入一个真实扩展 |
| Unique learning | 真实设备覆盖率、冷启动、下载失败、local-specific failure 和 fallback 信任成本 |
| Reality contact | 至少 50 台真实设备、200 次目标任务、一次由数据驱动的路由改变 |
| Upside | client-side AI 的 “Sentry + LaunchDarkly + routing layer” |
| Stop/redesign | local-specific failure 少于 5%，或普通前端监控已经足够 |
| Direction state | **Frontier candidate；目前不是 `CONVICTION_BET`** |

当前缺失：真实 pilot、founder edge、具名 owner 和明确的时间/现金/机会成本边界。

### 方向 8：Private Browser Micro-Workflow Foundry

**定位**：为组织私有部署“一个组织 x 一个站点 x 一个角色 x 一个完成结果”的浏览器扩展。

示例：

> 在 Zendesk 页面中，把工单本地转换成公司的 QA checklist，校验必填字段，再将结果写回当前系统。

| 字段 | 内容 |
|---|---|
| Initial actor | 已有组织 sponsor 的 5-20 人运营团队 |
| Current alternative | 复制粘贴、人工检查、通用 SaaS、内部脚本 |
| Reality Wedge | 一个组织、一个第三方站点、一个完成结果、10 位真实用户 |
| First channel | Google Workspace MSP、实施代理商、现有企业客户 |
| Revenue shape | `$2,000-10,000`实施费 + 维护费 |
| Unique learning | 管理员准入、DOM 漂移、本地处理接受度、真实节省时间和更新成本 |
| Stop/redesign | 部署超过两周、每周都需 DOM 修复、任务时间未降低 30% |
| Direction state | **有 sponsor 才能测试；否则 `PARK`** |

禁止一开始建设通用 workflow marketplace。最初形态应是高价定制服务和可复用内部组件。

### 方向 9：Browser-Agent Flight Recorder

**定位**：为浏览器 Agent 记录可脱敏、可回放的行动证据链。

需要回答：

- Agent 看到了什么；
- 内容来自哪里；
- 哪个模型作出了判断；
- 调用了什么工具；
- 何时得到用户确认；
- 动作产生了什么结果。

| 字段 | 内容 |
|---|---|
| Initial actor | 正在将 browser agent 用于内部低风险任务的开发团队 |
| Reality Wedge | 接入一个 agent runtime，记录五类事件、自动 redaction、session timeline 和 failure replay |
| Unique learning | 哪些证据足以解释行为、日志会泄露什么、能否降低 root-cause 时间 |
| Reality contact | 至少 50 个真实失败/异常 session，由两名 operator 完成盲复盘 |
| Upside | browser-agent 的 OpenTelemetry / incident evidence layer |
| Stop/redesign | 诊断时间未下降 30%、overhead 超过 10%、关键证据包含不可接受数据 |
| Direction state | **Frontier candidate；尚无买方证据** |

### 方向 10：Executable Expert Capsule

**定位**：把顾问的一段重复交付封装为“本地运行、专家最终复核”的可执行产品。

示例：

> 安全顾问将客户资料在本地整理成 security questionnaire evidence pack。软件提取证据、保留引用、列出缺口，但不自动作出安全认证。

| 字段 | 内容 |
|---|---|
| Initial actor | 拥有真实付费客户和重复交付流程的垂直顾问 |
| Buyer | 顾问本人，或购买咨询结果的客户 |
| Reality Wedge | 在 5 个真实付费项目中使用一个 local PWA 完成证据组织 |
| Distinct mechanism | 软件放大专家交付能力，但不假装取代高责任判断 |
| Revenue shape | 先作为咨询服务的一部分；再探索 license、项目费或规则更新费 |
| Unique learning | 哪些判断可安全编码、人工复核比例、客户是否更愿意授权本地处理 |
| Stop/redesign | 顾问时间未下降 30%，或超过 40% 字段仍需完全重做 |
| Direction state | **最具开放性的产品形态，但要求“垂直专家 + 浏览器工程”双重 founder edge** |

---

## 5. Three Distinct Product Propositions

### 5.1 Paid Wedge

**AI Extension Behavioral Release Audit**

先出售人工增强的单次 audit。只验证测试是否能发现可复现、可行动、会改变发布决定的问题。

不建设：

- 通用 QA 平台；
- 测试用例市场；
- 完整账号和团队后台；
- 所有浏览器和所有扩展类型；
- “保证通过 CWS 审核”承诺。

### 5.2 10-Star Product

**Local-AI Reliability Plane**

如果 client-side AI 真正进入大量日常工作流，理想产品不是另一个模型调用 SDK，而是跨设备、版本和模型状态保证任务完成的客户端控制面。

### 5.3 Contrarian Product

**Executable Expert Capsule**

不按普通 SaaS 逻辑追求纯自助和低人工，而是将顾问信任、专家判断、本地软件和持续规则更新组合成一种新的交付单位。

三者分别面向扩展团队、基础设施团队和专业顾问，其买方、完成结果、分发和收入结构不同，不能合并成一个“浏览器 AI 平台”。

---

## 6. Scope and Positioning Decision

### Scope posture

`SELECTIVE_EXPANSION`

保留较大的产品愿景，但第一轮只扩张能改变购买理由、证据质量或长期壁垒的部分。

### Selected initial positioning

| Positioning field | Decision |
|---|---|
| Best-fit user | 正在发布 AI Chrome Extension 的小型团队或代理商 |
| Buyer | 技术负责人或 agency owner |
| Trigger | 即将发布包含 AI 行为变化的新版本 |
| Category | AI extension behavioral release audit |
| Promised outcome | 在用户和 CWS 之前发现可复现的行为、安全和上下文污染问题 |
| Reason to believe | 浏览器内 metamorphic transformation、行为 invariant 和真实失败证据，而不是固定文本匹配 |
| Not for | 非 AI 扩展、普通单元测试、CWS 审核保证、通用网页 QA |
| Why now | AI 浏览器扩展增加，prompt injection 和非确定行为成为发布风险；CWS 审核积压放大重提成本 |
| First acquisition channel | 定向公开 GitHub 仓库，以一个真实失败样本发起联系 |

### Decision ledger

| Field | Decision |
|---|---|
| ID | `D-01` |
| Choice | 首先验证 AI Extension Behavioral Release Audit |
| Alternatives | CSV Import Preflight 作为失败后的第二实验；RFP Matrix 作为高客单备选 |
| Evidence | F-02 至 F-05、I-01；反对证据为 F-09 和 A-01 |
| Owner | 尚未指定 |
| Reversibility | 可逆；只批准 14 天实验 |
| Revisit trigger | 收到 3 个付费订金、2 个 release decision change，或实验达到失败阈值 |

---

## 7. Falsification Experiment

| Field | Contract |
|---|---|
| Assumption | `A-01`：AI 扩展团队愿为一次能够改变发布决定的行为审计付费 |
| Subjects | 30 个公开的 MV3 + AI SDK 项目；争取获得 5 个真实 build |
| Method | 对每个目标团队先展示一个可复现的 DOM、prompt-injection 或模型漂移失败；再出售完整 audit |
| Cost | 不超过 40 小时和 `$500` 测试资源 |
| Window | 14 天 |
| Success | 至少 5 个团队提供 build；至少 3 个支付 `$99` 订金；至少 2 份报告真正改变修复或发布决定 |
| Failure | 少于 2 个订金，或 5 个真实 build 中没有可行动发现 |
| Continue | 只开发 CLI、测试包和报告生成；仍不建设完整 SaaS |
| Stop | 停止添加 QA 功能，转而验证 CSV Import Preflight |
| Owner | 执行前由用户指定 |

实验优先观察行为，不接受 waitlist、口头好评或“以后可能会买”作为成功。

---

## 8. Adversarial Gate

### Evidence-Backed Product Gate

`BLOCKED`

缺少：

- 目标买方付款或订金；
- 真实 build access；
- 报告改变发布行为的证据；
- 重复购买或持续 CI 需求。

### Insight-Backed Frontier Gate

`BLOCKED`

Local-AI Reliability Plane、Browser-Agent Flight Recorder 和 Executable Expert Capsule 具备可讨论的因果机制，但当前缺少：

- 具名 human owner；
- 与所选方向匹配的 founder edge 证据；
- 真实 pilot 或组织入口；
- 明确接受的时间、现金、信誉、法律、安全和机会成本边界。

这些前沿方向不应因为缺少成熟市场证据而被删除，但也不能被包装成已经获得实施授权的 `CONVICTION_BET`。

---

## 9. Decision

`TEST_FIRST`

- 对“AI Extension Behavioral Release Gate 值得首先验证”的信心：`75`
- 对其已经存在稳定付费市场的信心：`50`
- 最强反对理由：AI 扩展团队可能规模小、预算有限，并认为 Playwright、自建脚本或开源 ASSURE 已经足够
- 下一 owner：尚未指定
- 下一行动：执行第 7 节的 14 天付费实验

该状态只授权实验，不授权完整产品开发，也不表示需求、PMF 或产品准备度已经成立。

---

## 10. Explicit No-Go List

以下方向不是绝对不存在需求，而是当前差异化、获客或维护经济性不足：

- 通用 local-AI sidebar；
- 通用网页摘要、改写和问答；
- 普通 CWS ZIP 检查器；
- 任意网页变化监控；
- 通用 design token drift scanner；
- 通用评论总结器；
- 面向个人用户的通用 PII 遮罩；
- 通用浏览器扩展风险评分；
- “任意网页 x 任意 Agent”的自动化平台；
- 仅把已有 SaaS 改成本地模型、但不改变完成结果的产品。

这些方向要重新进入候选池，必须出现新的独占渠道、具体垂直完成结果、平台失效窗口或明显不同的因果机制。

---

## 11. Research Limits

- 公开产品定价、商店用户数和产品页面是需求代理信号，不是目标产品收入证明。
- 社区讨论只能说明有人报告过问题，不能证明其代表性或付费意愿。
- 本研究未访问真实扩展构建、客户文件、投标包、销售记录或支付数据。
- 竞品和平台状态以 2026-07-17 可访问资料为准，后续可能变化。
- 本文是产品发现与实验决策文档，不是实施级 PRD、法律意见或安全认证。
