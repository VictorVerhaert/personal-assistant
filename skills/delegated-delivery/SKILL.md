---
name: delegated-delivery
description: "Use when a request needs several implementation steps, multi-file mechanical edits, focused testing, or independent review. Coordinates bounded Repository Worker tasks and the Quality Gate."
argument-hint: "Implementation task and acceptance criteria"
---

Lead owns scope and final proof. Workers do bounded execution.

## Workflow

1. Create a VS Code todo list for multi-step work.
2. Ask only questions that change the plan.
3. Use Repo Recon if ownership is unknown.
4. Give Repository Worker named files, acceptance criteria, and one focused check; it owns builds, tests, and scripts.
5. Read scoped changed files and Worker validation result; Quality Gate owns diff inspection.
6. For non-trivial changes, invoke Quality Gate with goal and validation result.
7. Allow one Worker repair cycle for BLOCKER or NEEDS CHANGES, then re-review. Escalate after the second cycle.

## Guardrails

- Keep one edit slice active at a time.
- Worker stops after two setup or recovery attempts, 120 seconds without useful output, or an interactive/credential/service blocker.
- Do not delegate destructive or external actions.
- Do not accept worker summaries without checking the changed files or diff.
- Stop at the requested behavior. Do not opportunistically refactor.