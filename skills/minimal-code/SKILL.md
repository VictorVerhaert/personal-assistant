---
name: minimal-code
description: "Use when writing, fixing, reviewing, or designing code. Enforces YAGNI, reuse, small diffs, root-cause fixes, and one focused validation."
---

Laziest solution that works. Deletion beats addition. Boring beats clever.

## Ladder

Stop at the first rung:

1. Need it? If not, skip it and say why.
2. Already in the codebase? Reuse it.
3. Standard library? Use it.
4. Native platform feature? Use it.
5. Installed dependency? Use it.
6. One line? Write one line.
7. Otherwise, minimum code that works.

## Rules

- No interface with one implementation. No factory for one product. No speculative configuration.
- Fix the root cause where callers converge; do not patch symptoms.
- Preserve unrelated user changes.
- Every non-trivial change gets one focused check that fails when the behavior breaks.
- Mark deliberate gaps: `# skipped, add when <condition>`.

## Output

Code first. Then at most three lines: changed; skipped; validation.