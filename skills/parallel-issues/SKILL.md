---
name: parallel-issues
description: "Use when working several issues at once. One worktree, branch, and PR per issue; batched questions and review."
argument-hint: "Issues (≤3) and base branch"
---

One Lead, one worktree per issue, batched steering.
Lead runs steps 2-4 and 9 itself (overrides Delegate rule; user approves via permissions). Workers edit/run only inside their worktree.

## Workflow

1. More than 3 issues: ask which 3 run first. Never drop any silently.
2. Preflight: main tree clean (`git status --short`); `git fetch`; `origin/<base>` exists. Else stop, ask. Worktree dir `<repo>-wt/<slug>`: sibling of repo, outside it.
3. Per issue: `git worktree add ../<repo>-wt/<slug> -b <type>/<slug> origin/<base>` (not local base).
4. Env per worktree: setup script documented in repo README/AGENTS/scripts, if any; ask user OK before first run in a session. Else copy `.env*` only if `git check-ignore` confirms ignored. Report copied files. Never commit them.
5. Run `grill` on all plans; send one batched ask.
6. One background Repository Worker per worktree, scoped to its path, `TDD` when complex. Follow `delegated-delivery` per worktree.
7. Quality Gate per worktree.
8. Present one table: issue | branch | verdict | changed files | open decisions.
9. Commit in worktree after Quality Gate LGTM and user OK; then push, open PR per issue. After merge and user OK: `git worktree remove`, delete branch.

## Guardrails

- No cross-worktree edits.
- One batched ask/report per batch, not per issue.
- Blocked worker does not stall others.
- Push, PR, merge, worktree removal: explicit user OK each time.
