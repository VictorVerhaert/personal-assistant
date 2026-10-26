---
name: delegated-delivery
description: "Use when a request needs several implementation steps, multi-file mechanical edits, focused testing, or independent review. Coordinates bounded Repository Worker tasks and the Quality Gate."
argument-hint: "Implementation task and acceptance criteria"
---

Lead owns scope and final proof. Workers do bounded execution.

## Workflow

1. Create a todo list for multi-step work.
2. Ask questions whenever a decision changes the plan; challenge whether each part is needed.
3. Use Repo Recon if ownership is unknown.
4. Give Repository Worker named files, acceptance criteria, and one focused check; it owns all builds, test suites, and script execution and applies the `minimal-code` skill.
5. Read scoped changed files and Worker validation result; Quality Gate owns diff inspection.
6. For non-trivial changes, invoke Quality Gate with goal, acceptance criteria, worker-reported changed files, risk focus, and validation result. Never paste the diff; the reviewer retrieves and scopes it locally.
7. Allow one Worker repair cycle for BLOCKER or NEEDS CHANGES, then re-review. Escalate after the second cycle.

## Guardrails

- Keep one edit slice active at a time.
- Worker stops after two setup or recovery attempts, 120 seconds without useful output, or an interactive/credential/service blocker.
- Do not delegate destructive or external actions.
- Do not accept worker summaries without checking the changed files or diff.
- Treat executable checks as primary correctness evidence. The Lead adjudicates review findings but reads only cited hunks or disputed risk surfaces instead of duplicating a clean review.
- Stop at the requested behavior. Do not opportunistically refactor.