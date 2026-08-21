# Advocate Review: bs-ppt-master

**Date**: 2026-08-21
**Reviewer Role**: Advocate
**Skill**: bs-ppt-master
**HUMAN_VERIFIED**: false
**Scope Contract Version**: 1
**Reviewed Revision**: aaf2afa735a64b72ea49216b72621ba6a745e7e8
**Reviewed Skill SHA-256**: 1eec1ca4e63d3907aec51f1181402f3ba545c50a613e3923513d9cb8b6c1b58c
**Reviewed Manifest SHA-256**: b7c6c14b8ca72f90a2a2959fd45855958d9a5633752a2be66290f5b6ff713de6

## Executive Summary

最终增量复审确认：F1–F11 的 product/evidence hardening 在 revision `aaf2afa735a64b72ea49216b72621ba6a745e7e8` 保持完整，Scope Contract enforcement 现在同时绑定 exact revision、Skill hash、24-file full required set、manifest receipt 与当前文件 bytes，并对“删掉 required entry 后重算 receipt”的 omission attack fail closed。Architecture / Exhibits 内核、claim-ledger checker 与 fixtures 未被本提交改动，因此我对该 revision 给出实质性的 Gate 2 Advocate `PASS`。这不是 PPT 行为或成品质量认证：Gate 4 当前证据范围仅为 `EVAL_SCHEMA_ONLY`，behavior 明确为 `NOT_RUN`。

## Evidence Reviewed

Full manifest receipt: `b7c6c14b8ca72f90a2a2959fd45855958d9a5633752a2be66290f5b6ff713de6`

我按 force-regenerated Scope Contract v1 完整复核了 manifest 的 24/24 个文件；由 prompt entries 重算的 SHA-256 精确等于上述 receipt，且 checker 对全部 24 个当前文件逐项复算后无 stale/missing entry：

- 设计与计划：`docs/superpowers/plans/2026-08-21-ppt-master-skill.md`、`docs/superpowers/specs/2026-08-21-ppt-master-skill-design.md`。
- Registry 与 evaluation contract：`skills.json`、`evaluation/datasets/batch-1-test-prompts.json`、`evaluation/harness/runner.js`、`evaluation/harness/test-runner-scope.js`。
- 完整 `skills/bs-ppt-master/` tree：
  - `skills/bs-ppt-master/SKILL.md`
  - `skills/bs-ppt-master/assets/claims.example.md`
  - `skills/bs-ppt-master/assets/claims.exploit-probe.md`
  - `skills/bs-ppt-master/assets/claims.l0-example.md`
  - `skills/bs-ppt-master/assets/claims.noncompliant-example.md`
  - `skills/bs-ppt-master/references/architecture.md`
  - `skills/bs-ppt-master/references/art-direction.md`
  - `skills/bs-ppt-master/references/detail-master.md`
  - `skills/bs-ppt-master/references/executor-contract.md`
  - `skills/bs-ppt-master/references/exhibits.md`
  - `skills/bs-ppt-master/references/lifecycle.md`
  - `skills/bs-ppt-master/references/verification.md`
  - `skills/bs-ppt-master/scripts/capability-probe.js`
  - `skills/bs-ppt-master/scripts/check-claim-ledger.js`
  - `skills/bs-ppt-master/scripts/test-capability-probe.js`
  - `skills/bs-ppt-master/scripts/test-checker.sh`
- Gate 2 scope implementation：`tools/peer-review.js`、`tools/test-peer-review-scope.js`。

为逐项复核加固，我还读取了此前 Adversary F1–F11、当前 force-regenerated `docs/reviews/bs-ppt-master/2026-08-21-advocate-prompt.md`，并完整检查 `tools/peer-review.js` 的 manifest construction/parser/validator/check integration 与 `tools/test-peer-review-scope.js` 的正负测试。

独立重跑的命令与结果：

- `git rev-parse HEAD` → `aaf2afa735a64b72ea49216b72621ba6a745e7e8`。
- `bash tools/validate.sh skills/bs-ppt-master/` → `16 passed, 0 failed`; frontmatter name/description、2,644-word body、8/8 patterns、12/12 bundled references 均通过。
- Portable YAML check → description `182` bytes；resolver loadability → canonical `bs-ppt-master`、alias `bs-ppt-architecture -> bs-ppt-master`、external `pptx` 均按预期解析。
- `bash skills/bs-ppt-master/scripts/test-checker.sh` → `18 pass / 0 fail`。
- `node skills/bs-ppt-master/scripts/test-capability-probe.js` → `7 capability-probe tests passed`。
- `node evaluation/harness/test-runner-scope.js` → `PASS runner never upgrades schema-only checks to behavioral verification`。
- `node evaluation/harness/runner.js --skill bs-ppt-master --json` → 18 eval contracts, score `100`, `evidence_scope: EVAL_SCHEMA_ONLY`, `behavioral_verdict: NOT_RUN`, `behaviorally_verified: false`。
- `node tools/pattern-alignment.js bs-ppt-master --strict --json` → 8/8 resolved and present, 0 drift。
- `bash tools/test-cli.sh` → `86 pass / 0 fail`，包括 canonical install 与 `bs-ppt-architecture` alias migration。
- `node --check tools/peer-review.js` → PASS。
- `node tools/test-peer-review-scope.js` → `PASS: Scope Contract v1 validates exact revision, required manifest set, receipt, and current file hashes`。
- 独立 manifest probe → revision、Skill SHA、manifest SHA 全部与 prompt 相等，24 required entries 当前 hash 全部通过；错误 revision、缺失 receipt、错误 manifest receipt、self-consistent stale entry，以及删掉 required entry 后重算 receipt 的 omission case 均被拒绝。
- `node tools/peer-review.js check bs-ppt-master --json` → 当前整体 exit `1`，唯一原因是 regenerated revision 的 Adversary review 尚未生成；本 Advocate review 自身的 14/14 schema/scope checks 全绿，包括 24 required files 与 exact receipt。
- `git diff --name-only HEAD^ HEAD -- skills/bs-ppt-master skills.json evaluation docs/superpowers` 返回空；revision `aaf2afa` 只加固 peer-review required-set enforcement，没有改动 PPT Master product core。

## F1–F11 Hardening Assessment

| Finding | 加固与锚点 | 可执行性 / 复杂度判断 | Disposition |
|---|---|---|---|
| F1 Gate 4 假行为绿灯 | `evaluation/harness/runner.js:220-221,243-265` 输出 `EVAL_SCHEMA_ONLY` / `NOT_RUN`; `evaluation/harness/test-runner-scope.js:21-36` 证明 nonsense contract 不能升级为 behavior verification。 | 解决了证据语义污染，没有伪造行为结果；真实 forward behavior 仍诚实保持 `NOT_RUN`。 | **RESOLVED_AS_SCOPE** |
| F2 preservation 可自填 | `references/lifecycle.md:59,116-143` 要求 disposable-copy smoke、original/final hash、逐 surface 状态；`references/verification.md:87` 将 closure 绑定 V4。 | 从自由文本升级为 artifact-bound report；字段多但都对应真实破坏面，适合 REVISE/FILL 的高失败成本。行为 fixture 尚未运行。 | **CONTRACT_RESOLVED; BEHAVIOR NOT_RUN** |
| F3 README inflation | `references/executor-contract.md:7-18,20-44` 新增 `DETECTED_WITH_CLAIMS`，把 `SUPPORTED` 绑定 identity/version/scope/conditions/limits。 | 提前阻断错误 executor 选择；没有把某个 renderer 写死进主控 Skill。 | **CONTRACT_RESOLVED** |
| F4 native/hybrid 汇总漏洞 | `references/executor-contract.md:54-64,128` 要求 per-slide/per-object inventory，任一非装饰 flatten/unverified 即 hybrid，`unclassified > 0` 阻断 V4。 | 汇总规则可审计且没有引入渲染引擎；对象清单只在承诺 editability 时产生。 | **CONTRACT_RESOLVED; BEHAVIOR NOT_RUN** |
| F5 Detail independence 未绑定 V3 | `references/detail-master.md:89-109` 规定 independent receipt 与 hard gate；`references/verification.md:72,145` 绑定 final artifact/render 与 V3。 | Detail Master 从作者自评变成独立证据层，同时仍允许 fresh isolated context，不强依赖特定 agent runtime。 | **CONTRACT_RESOLVED; BEHAVIOR NOT_RUN** |
| F6 三方向可能只是文案 | `references/art-direction.md:22,31-44` 要求同一真实高信息页、comparable artifact 与 pairwise matrix。 | 直接检验方向差异而非增加模板数量；只在确有 design authority 时加载和执行。 | **CONTRACT_RESOLVED; BEHAVIOR NOT_RUN** |
| F7 provenance 冒充 permission | `references/executor-contract.md:93-113` 增加 Rights & Data Ledger、四种状态与 closure hard gate。 | 把 license 与 data-transfer authority 分开；是必要的 truth surface，不是装饰性流程。 | **CONTRACT_RESOLVED; BEHAVIOR NOT_RUN** |
| F8 accepted limitation 偷换 V5 | `references/verification.md:7-27,95-105,138-145` 先冻结 Delivery Contract，禁止外部硬要求因流程便利被缩小，并保留 target `UNVERIFIED`。 | 明确了谁能改什么，终态不再依赖可随意变化的 required set。 | **CONTRACT_RESOLVED; BEHAVIOR NOT_RUN** |
| F9 Quick 可口头删步骤 | `SKILL.md:28-44` 使用 `REQUIRED / COMPRESSIBLE / SKIPPABLE_WITH_RECEIPT` matrix 与 Quick Decision Record。 | Quick 成为有收据的压缩策略，而非另一套完整流程；这是控制复杂度的关键反作用机制。 | **CONTRACT_RESOLVED; BEHAVIOR NOT_RUN** |
| F10 probe 冒充 candidate identity | `scripts/capability-probe.js:111` 保留 `identity_state: UNVERIFIED`; probe test 覆盖 same-name、malformed、mismatch 与 symlink。 | name-based discovery 与 qualified identity 已分离，且 `7/7` deterministic tests 通过。 | **RESOLVED_AND_TESTED** |
| F11 Gate 2 只看 SKILL.md | `tools/peer-review.js:114-150,173-269` 构建 required scope，并校验 exact revision、Skill SHA、receipt、prompt entries、当前 bytes 与 required-set equality；`tools/test-peer-review-scope.js:59-109` 新增 omission regression。 | Force-regenerated prompt 绑定完整 24-file required set；删项后即使重算 receipt 仍被拒绝。该机制是 prompt-present 的 Scope Contract v1 路径，不是 PPT runtime 证据。 | **RESOLVED_AND_TESTED_STATICALLY** |

## Complexity and Core Preservation

当前 revision 没有改动 `SKILL.md` 或任何 PPT Master product file；Skill 仍为 267 行 / 2,644 words，具体 preservation、rights、receipt、roll-up schema 留在职责清晰的 references 中，由七条件路由按需加载。Architecture、Exhibits、四个 claim fixtures、claim-ledger checker 与其回归测试的 manifest hash 均未变化，`18/18` checker regression 继续通过，因此 belief delta、sharp claim、title chain、comparison baseline 和 exhibit non-compressibility 内核没有被审计机制吞没。

新增 ledger/report 数量确实带来重复记录风险，但每个记录目前控制不同 truth surface，且 `QUICK` matrix 允许合并 D1–D3 passes、压缩 directions/calibration，却不删除其 checks。对一个 registry tier 为 `deep`、涉及既有文件破坏、第三方权利与 native editability 承诺的 Skill，这一复杂度是与失败成本相称的；未发现应阻断发布评审的抽象或实体膨胀。

## Dimension Scores

| Dimension | Score | Key Strength | Key Concern |
|-----------|------:|--------------|-------------|
| Clarity of trigger description | 10/10 | 182-byte description 准确覆盖 CREATE/REVISE/FILL/ENHANCE 与一体化质量承诺，没有声称内置 renderer。 | None material. |
| Hard rules / safety gates | 10/10 | preservation、capability、rights、Detail receipt、V1–V5 和 target truth 都有显式 hard boundary。 | 部分 contract 仍需真实 artifact execution 才能证明 agent 会遵守。 |
| Workflow correctness | 10/10 | 七阶段从 authority/preservation 到 repair/delivery 闭环，F2–F9 的 evidence artifact 都绑定明确 owner 与 V-layer。 | 真实 executor handoff 与 repair loop behavior 尚未运行。 |
| Pattern application | 10/10 | 8/8 registry patterns 均解析且在 body 中有具体职责，progressive disclosure 控制新增契约的加载成本。 | None material. |
| Test prompt coverage | 9/10 | 18 个 contract 覆盖四生命周期、dense data、rights/data、Quick、native roll-up、README inflation 和 target honesty。 | 当前 runner 只验证 schema，不执行 expected behavior。 |
| Bundled resources | 10/10 | 七个高内聚 references、discovery-only probe、checker 与 adversarial fixtures 构成完整控制面且不引入 renderer。 | None material. |
| Maintainability | 9/10 | 核心 Architecture/Exhibits 与执行治理分层清楚；24-file required-set equality、receipt 与 current-hash enforcement 能防止漏审、删项重签或静默漂移。 | Scope enforcement 由存在的 v1 prompt 激活；review/prompt 必须作为同一审计包保存。 |
| Production readiness | 8/10 | package、frontmatter、references、resolver、alias、checker、probe、Gate 1/3 与 evaluation-scope honesty 均可执行且 green。 | 未执行真实 PPTX preservation/native/target、三方向 visual distinction 或独立 Detail behavior。 |

## Strongest Aspect

最强的设计不是某一条 checklist，而是把 Architecture、Art Direction、Detail Master、Executor 与 V1–V5 接成同一条“承诺必须沿证据链闭合”的系统：canonical model 保持内容语义一致，executor evidence state 限定可承诺能力，Detail receipt 绑定最终 render，preservation/output-class/rights ledgers 再把文件与权限风险落到具体 artifact。这样既保留 Architecture / Exhibits 的洞察内核，也让视觉野心不会越过事实、可编辑性、权利或目标环境的证据边界。

## One Improvement

下一步应执行一个最小但真实的 forward suite，而不是继续增加规则：至少包含一份带 custom master/layout、notes、links、hidden slide 与 media placeholder 的 REVISE/FILL `.pptx` fixture，以及一份 dense CREATE fixture；保存 original/final hashes、Preservation Report、promised-object inventory、三方向 artifacts、independent Detail receipt 和 V1–V5 evidence。该 suite 应专门判断 F2–F9 的行为效果，并允许诚实得到 `BLOCKED` / `UNVERIFIED`；在它运行前，不得把本轮 `EVAL_SCHEMA_ONLY` 结果表述成 production behavior。

## Verdict

**Verdict**: PASS — 76/80

我签署的是 revision `aaf2afa735a64b72ea49216b72621ba6a745e7e8`、manifest receipt `b7c6c14b8ca72f90a2a2959fd45855958d9a5633752a2be66290f5b6ff713de6` 的 Gate 2 Advocate package-design sign-off：F1–F11 均获得了与失败模式对应的加固，F10/F11 有 deterministic/static regression，Scope Contract 已覆盖 exact revision、full required set、receipt、current hash 与 omission regression，Architecture / Exhibits 与 checker 内核保持不变。该 `PASS` 不认证任何实际 Deck、视觉效果、PPTX 原生对象、PowerPoint 兼容性或 V1–V5 结果；Gate 4 仅 `EVAL_SCHEMA_ONLY`，behavior `NOT_RUN`，`HUMAN_VERIFIED` 继续为 false。
