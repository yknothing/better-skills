# Adversary Review: bs-ppt-master

**Date**: 2026-08-21
**Reviewer Role**: Adversary
**Skill**: bs-ppt-master
**HUMAN_VERIFIED**: false
**Scope Contract Version**: 1
**Reviewed Revision**: aaf2afa735a64b72ea49216b72621ba6a745e7e8
**Reviewed Skill SHA-256**: 1eec1ca4e63d3907aec51f1181402f3ba545c50a613e3923513d9cb8b6c1b58c
**Reviewed Manifest SHA-256**: b7c6c14b8ca72f90a2a2959fd45855958d9a5633752a2be66290f5b6ff713de6

## Summary

本轮增量复审未发现 CRITICAL、HIGH 或 MEDIUM 问题，仅保留 1 项 LOW 的证据边界说明。上轮 F11 已真正闭环：当前 24-file manifest 与 receipt、revision、Skill hash 和逐文件当前 hash 一致；删除 required entry 后重算自洽 receipt 的攻击现在被 required-scope exact-set comparison 拒绝，新增负向回归锁定了该行为。

因此 revision `aaf2afa735a64b72ea49216b72621ba6a745e7e8` 可获得 `bs-ppt-master` package 的 Gate 2 `APPROVED`。该结论严格限于 Skill package 的设计、review scope 和证据诚实性，不证明真实 agent 行为、PPTX preservation/native editability、独立 V3 质量或 Microsoft PowerPoint V5。

## Evidence Reviewed

- 已完整接收并逐项核验 manifest receipt `b7c6c14b8ca72f90a2a2959fd45855958d9a5633752a2be66290f5b6ff713de6`。从 regenerated `docs/reviews/bs-ppt-master/2026-08-21-adversary-prompt.md` 解析出 24 个 entries；重建 receipt 与声明值完全一致，24/24 当前文件 SHA-256 均匹配，无 stale/missing/unexpected entry。
- 固定身份：`git rev-parse HEAD` 为 `aaf2afa735a64b72ea49216b72621ba6a745e7e8`；`skills/bs-ppt-master/SKILL.md` SHA-256 为 `1eec1ca4e63d3907aec51f1181402f3ba545c50a613e3923513d9cb8b6c1b58c`。
- 增量实现：`tools/peer-review.js:173-269`；新增 required scope regeneration、path/hash 双向集合比较，以及 `Prompt manifest matches required scope and current files` 判定。`checkOneReview()` 将 `skillName` 传入 scope validator，实际 Gate 2 路径不会退化到无 required-scope comparison 的 helper 默认模式。
- 新增负向回归：`tools/test-peer-review-scope.js:94-109` 删除一个 generated manifest entry、重算 receipt，并断言 `Prompt manifest matches required scope and current files` 必须失败。
- 手工复现上轮 exploit：从当前 prompt 删除 `skills/bs-ppt-master/references/verification.md`，对剩余 23 entries 重算 receipt，构造 metadata/receipt 均自洽的 review，再以实际 Gate 参数调用 `validateScopeContractContent(review, prompt, "bs-ppt-master")`。结果失败，detail 精确为 `missing required: skills/bs-ppt-master/references/verification.md; unexpected: none`。
- `node tools/test-peer-review-scope.js`：PASS，输出 `Scope Contract v1 validates exact revision, required manifest set, receipt, and current file hashes`；同时保留 wrong revision、broad roots、wrong receipt、stale hash 的负向覆盖。
- 完整 manifest scope 包含：中文 design spec、实施 plan、`skills.json`、18 条 PPT evaluation 所在 dataset、Gate 4 runner/scope regression、完整 `skills/bs-ppt-master/` tree、peer-review checker 与其 scope regression。
- `bash tools/validate.sh skills/bs-ppt-master/`：16 passed / 0 failed；frontmatter、8/8 patterns、6 hard-gate tags、12/12 bundled resources 与 schema 均通过。
- `node bin/better-skills.js validate bs-ppt-master`：16 passed / 0 failed，runtime loadability 正常。portable YAML 检查确认 `name=bs-ppt-master`、description 以 `Use when` 开头且为 182 bytes。
- `bash skills/bs-ppt-master/scripts/test-checker.sh`：18 pass / 0 fail；format-clean hollow fixture 仍失败，缺少外部 ordering evidence 时 G1 保持 `UNVERIFIED`。
- `node skills/bs-ppt-master/scripts/test-capability-probe.js`：7 tests passed；同名、malformed、mismatched、symlink 候选不会取得 qualified identity，feature/V5 不由 discovery 提升。
- `node evaluation/harness/test-runner-scope.js`：PASS；nonsense expected behavior 不会得到 behavioral verification。
- `node evaluation/harness/runner.js --skill bs-ppt-master --json`：18 evals，结构契约 100；顶层与 skill 层均明确 `evidence_scope=EVAL_SCHEMA_ONLY`、`behavioral_verdict=NOT_RUN`、`behaviorally_verified=false`。
- 未取得且不属于本 package Gate 2 结论的证据：没有运行 fresh-context agent 行为测试，没有真实 PPTX preservation/native-object round trip，没有 final render/contact-sheet independent Detail receipt，没有在 Microsoft PowerPoint 中打开、编辑、播放并保存重开最终 artifact。

## F1–F11 Final Recheck

| First-round finding | Final status | Evidence / remaining boundary |
|---|---|---|
| F1 — Gate 4 schema 冒充效果 PASS | **RESOLVED** | runner 与 nonsense regression 固定 `EVAL_SCHEMA_ONLY / NOT_RUN / behaviorally_verified=false`。 |
| F2 — preservation 可自我声明 | **RESOLVED_AT_CONTRACT** | Preservation Report、mutation 前 smoke、original/final hash、逐 surface states 与 V4 blockers 已明确；真实 artifact 行为不由 Gate 2 宣称。 |
| F3 — unversioned README 冒充 `SUPPORTED` | **RESOLVED** | `SUPPORTED` 需 version-bound、claim-specific contract；README-only 为 `DETECTED_WITH_CLAIMS`。 |
| F4 — native/hybrid/raster roll-up 混淆 | **RESOLVED_AT_CONTRACT** | per-object inventory、overall roll-up 与 `unclassified > 0` V4 blocker 已明确。 |
| F5 — Detail Master 自证 V3 | **RESOLVED_AT_CONTRACT** | 独立/fresh reviewer receipt 必须绑定 final artifact 与 render/contact sheet；无 receipt 不得 V3 PASS。 |
| F6 — 三方向只是换皮 | **RESOLVED_AT_CONTRACT** | 同一真实高信息 slide、三份 comparable artifacts、pairwise matrix 与核心维度差异均为硬门。 |
| F7 — provenance 冒充 rights/data authority | **RESOLVED_AT_CONTRACT** | Rights & Data Ledger、四状态及 `UNKNOWN/PROHIBITED` hard gate 已建立。 |
| F8 — V5 可被模糊移出 required set | **RESOLVED_AT_CONTRACT** | frozen Delivery Contract、authority/change receipt 和 target `UNVERIFIED` 语言边界已建立。 |
| F9 — Quick 口头跳过质量系统 | **RESOLVED_AT_CONTRACT** | REQUIRED/COMPRESSIBLE/SKIPPABLE_WITH_RECEIPT matrix 与 Quick Decision Record 已建立。 |
| F10 — probe 冒充 candidate identity | **RESOLVED** | `*-named candidate / identity_state=UNVERIFIED` 与 7 个 regression tests 锁定 discovery boundary。 |
| F11 — Gate 2 scope 可被 omission + recomputed receipt 收缩 | **RESOLVED** | `tools/peer-review.js:231-256` 将 prompt entries 与 regenerated required scope 双向比较；`tools/test-peer-review-scope.js:94-109` 固定 missing-entry attack；手工复现得到明确 failure。 |

## Findings

### F12: Package Gate 2 不能外推真实 PPTX 或 PowerPoint V5 能力  [LOW]

**Location**: `evaluation/harness/runner.js:4-15,203-224,376-382`; `skills/bs-ppt-master/SKILL.md:149-170,244-250`; `skills/bs-ppt-master/references/verification.md:23-27,59-105`

**Exploit scenario**: 下游只看到 package Gate 2 `APPROVED`、Gate 1 16/16 或 Gate 4 结构分数 100，便声称 `bs-ppt-master` 已被证明能够保留复杂企业 PPTX、生成原生 editable objects、完成独立 Detail artifact review，或在 Microsoft PowerPoint 中正确播放。当前没有这些真实 artifact/target receipts，任何此类外推均越过证据边界。

**Root cause**: Gate 1–4 检查 Skill package；PPT V1–V5 检查某个最终 deck。当前 runner 明确不执行 agent/artifact/target，Skill 也明确 unopened target 必须 `UNVERIFIED`；风险来自对两个验证系统的错误合并，而不是当前实现的虚假声明。

**Suggested fix**: 后续独立 forward test 必须保存 fresh-context agent output、真实 `.pptx` hashes、Preservation Report、object inventory、render/contact sheet、independent Detail receipt 与目标环境行为证据。只有最终 artifact 在命名的 Microsoft PowerPoint version/environment 中实际打开、编辑、播放并保存重开后，相应 V5 才可 `PASS`；在此之前保持 `NOT_RUN / UNVERIFIED / BLOCKED`。

## Verdict

**Verdict**: APPROVED

revision `aaf2afa735a64b72ea49216b72621ba6a745e7e8` 已闭合第一轮 F1–F11 的 package-level blockers；尤其是上轮 omission + recomputed receipt attack 已由 required-scope exact-set comparison 和负向回归共同关闭。该批准仅表示 `bs-ppt-master` 的 Skill package 在固定 24-file scope 下通过独立 Gate 2 adversarial review；它不表示任何真实 PPTX 已通过 preservation/native checks，不表示 Detail Master 已在真实 artifact 上证明审美与判断力，也不表示 Microsoft PowerPoint V5 已验证。
