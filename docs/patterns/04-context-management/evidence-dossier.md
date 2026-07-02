---
name: evidence-dossier
chinese_name: Evidence Dossier
category: context-management
sources:
  - CE
description: Reconnaissance agents write collected bulk evidence to a scratchpad file rather than returning it inline, keeping the main agent's context clean.
also_named_as: []
status: proposed
---

# Evidence Dossier · Evidence Dossier

> **Category**: 04. 上下文管理模式
> **Sources**: CE
> **Status**: proposed

## What this pattern is

When a reconnaissance or information-gathering sub-agent collects a large volume of evidence (logs, search results, file contents, analysis outputs), it writes the raw data to a scratchpad or dossier file rather than returning it inline in the response. The sub-agent returns only a summary — key findings, file path, and a structured index — so the main agent can consult the dossier on-demand without having its context window flooded with raw data.

## Why it works

Raw evidence is high-volume but low-density: a 500-line log file may contain 3 relevant lines. Returning it inline forces the main agent to hold all 500 lines in context to find those 3. Writing it to a file and returning a summary lets the main agent access the 3 relevant lines when needed without paying the token cost for the other 497.

## When to use it

- Multi-agent workflows where a sub-agent performs bulk data collection.
- Skills that need to gather evidence from many sources before analysis.
- Any workflow where the volume of collected data would dominate the context window if returned inline.

Skip it when the collected evidence is small enough (under ~50 lines) that the overhead of file I/O exceeds the token savings.

## Used by

No active references yet — extracted from CE (big-task-separator batch processing pattern).

## Examples

Extracted from CE; no in-repo example yet.

## Related patterns

- [`progressive-disclosure`](../04-context-management/progressive-disclosure.md) — same principle applied to static reference material; evidence-dossier applies it to runtime-collected data
- [`context-as-commons`](../04-context-management/context-as-commons.md) — evidence dossiers honor the commons by keeping bulk data out of the shared context window
- [`load-stub`](../04-context-management/load-stub.md) — the dossier file path + summary is the runtime equivalent of a load stub
