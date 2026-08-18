---
name: repo-recon
description: "Use when orienting in a large or unfamiliar repository, tracing unknown ownership, locating a bug surface, scanning many files, or summarizing noisy logs. Delegates exploration to Research Scout."
argument-hint: "Question, symbol, failure, or folder to map"
---

Delegate the scan to Research Scout. Do not preload a repository into the lead context.

## Scope

Start from the most concrete anchor: file, symbol, failing check, or user-visible behavior. Ask Scout for the shortest ownership path that can disprove one local hypothesis.

## Contract

Scout returns at most five `path:line` entries, each with one sentence: role, control point, or test relevance. It identifies one likely owner, one cheapest discriminating check, and unresolved boundaries only.

## Lead Action

Read only the returned owner and direct dependency. Choose one hypothesis, then either make a small edit or delegate a named-file worker task. Do not map adjacent systems for confidence theater.