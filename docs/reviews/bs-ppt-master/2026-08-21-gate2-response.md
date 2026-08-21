# Gate 2 Finding Response: bs-ppt-master

**Date**: 2026-08-21
**Reviewed Revision**: `aaf2afa735a64b72ea49216b72621ba6a745e7e8`
**Reviewed Skill SHA-256**: `1eec1ca4e63d3907aec51f1181402f3ba545c50a613e3923513d9cb8b6c1b58c`
**Reviewed Manifest SHA-256**: `b7c6c14b8ca72f90a2a2959fd45855958d9a5633752a2be66290f5b6ff713de6`
**HUMAN_VERIFIED**: false

## 结论

第一轮 Adversary 提出的 1 个 CRITICAL、7 个 HIGH、3 个 MEDIUM 已全部在 Skill contract 或仓库监督工具中闭环。最终 Advocate verdict 为 `PASS — 76/80`；最终 Adversary verdict 为 `APPROVED`。两者只批准 `bs-ppt-master` package 的设计、边界与可审计性，不证明真实 Deck 的视觉水平、PPTX 往返保真、原生可编辑性或 Microsoft PowerPoint 兼容性。

## 处置记录

| Finding | Disposition | 实施证据 | 剩余边界 |
|---|---|---|---|
| F1 — schema-only Gate 4 被误作效果 PASS | **ACCEPT / RESOLVED** | `evaluation/harness/runner.js` 固定输出 `EVAL_SCHEMA_ONLY / NOT_RUN / behaviorally_verified=false`；`evaluation/harness/test-runner-scope.js` 证明 nonsense fixture 不能升级为行为通过。 | 真实行为必须由 fresh-context forward test 单独记录。 |
| F2 — preservation 可由 agent 自我声明 | **ACCEPT / CONTRACT_RESOLVED** | `references/lifecycle.md` 要求 mutation 前 disposable-copy smoke、原始/最终 hash、protected-surface matrix；`references/verification.md` 将 required `UNVERIFIED/LOST` 绑定为 V4 阻断。 | 本轮没有执行真实内容修改和往返保存，因此 artifact preservation 仍非 `PASS`。 |
| F3 — README 可膨胀为 `SUPPORTED` | **ACCEPT / RESOLVED** | `references/executor-contract.md` 将 `SUPPORTED` 限定为 version-bound、claim-specific、含 scope/conditions/limits 的 contract；普通 README 只能到 `DETECTED_WITH_CLAIMS`。 | 无。 |
| F4 — native/hybrid/raster 汇总漏洞 | **ACCEPT / CONTRACT_RESOLVED** | 同一 reference 增加 per-object inventory、overall roll-up 与 `unclassified > 0` 阻断；9 native + 1 raster 不能汇总为 native。 | 未对实际交付 PPTX 运行 object inventory。 |
| F5 — Detail Master 自证 V3 | **ACCEPT / CONTRACT_RESOLVED** | `references/detail-master.md` 要求 fresh isolated reviewer、artifact/render hashes 与独立 receipt；无 receipt 时 V3 必须 `UNVERIFIED`。 | 本轮不伪造独立 artifact receipt。 |
| F6 — 三方向仅为 mood 文案 | **ACCEPT / CONTRACT_RESOLVED** | `references/art-direction.md` 要求同一真实高信息页的三份 comparable artifacts、pairwise difference matrix、narrative mode 与至少两个核心维度差异。 | 视觉效果仍须在实际任务中观察。 |
| F7 — 权利与数据权限缺少硬门 | **ACCEPT / RESOLVED** | `references/executor-contract.md` 增加 Rights & Data Ledger：`VERIFIED / USER_ATTESTED / UNKNOWN / PROHIBITED`；UNKNOWN/PROHIBITED 阻断生产或传输。 | 用户授权仍必须来自当前任务，不能由 provenance 推断。 |
| F8 — V5 可从 required set 中悄悄移除 | **ACCEPT / RESOLVED** | `references/verification.md` 在生产前冻结 Delivery Contract；外部 hard requirement 不得因方便而缩减，授权变更后仍保留明确的 target `UNVERIFIED`。 | 当前机器未发现 Microsoft PowerPoint，因此 V5 不得为 `PASS`。 |
| F9 — Quick 可口头跳过质量系统 | **ACCEPT / RESOLVED** | `SKILL.md` 增加 REQUIRED/COMPRESSIBLE/SKIPPABLE_WITH_RECEIPT matrix 与七字段 Quick Decision Record；独立 Detail review、V1–V5 状态和权限边界不可跳过。 | Quick 只压缩过程，不降低真实状态。 |
| F10 — capability probe 夸大 candidate identity | **ACCEPT / RESOLVED** | probe 输出 `*-named ... candidate` 和 `identity_state=UNVERIFIED`；7 条回归覆盖 empty、malformed、mismatch、symlink、重复 roots、参数与 human boundary。 | 发现候选不等于执行器能力。 |
| F11 — Gate 2 只审 SKILL.md / evidence scope 可绕过 | **ACCEPT / RESOLVED** | `tools/peer-review.js` 绑定 exact revision、Skill hash、完整 required-set manifest receipt，并逐文件复算 current hash；`tools/test-peer-review-scope.js` 覆盖 wrong revision、missing/wrong receipt、stale hash，以及“删除 entry 后重算 receipt”的 omission attack。 | checker 证明证据范围一致，不证明 reviewer 的主观判断必然正确。 |
| F12 — Gate 2 被外推为真实 PPTX/PowerPoint 证明 | **ACCEPT / BOUNDARY_RETAINED** | 两份最终 review 均明确限定为 package Gate 2；forward behavior 与 V1–V5 另存独立报告。 | 未取得命名版本 Microsoft PowerPoint 的打开、编辑、播放、保存重开证据时，V5 保持 `UNVERIFIED`。 |

## 验证摘要

- Gate 1：`16/16`。
- Claim-ledger regression：`18/18`。
- Capability-probe regression：`7/7`。
- Scope Contract negative regression：PASS，包括 omission + recomputed receipt。
- Gate 2 checker：Advocate 与 Adversary 均 `14/14`，完整 required manifest `24/24`。
- Gate 3：`8/8` patterns，0 hard fail，0 soft warn。
- Gate 4：18 条 eval contract，structural score 100；证据范围严格为 `EVAL_SCHEMA_ONLY`，behavior `NOT_RUN`。

## 最终边界

Gate 2 已完成。真实调用行为记录在 `2026-08-21-forward-test.md`；最终全仓独立验收记录在 `2026-08-21-final-audit.md`。在这两份证据未形成前，不使用 `DELIVERED`、`PowerPoint compatible`、`all-native` 或“已验证效果”等表述。
