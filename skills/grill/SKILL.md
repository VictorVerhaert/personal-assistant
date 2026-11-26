---
name: grill
description: "Use before implementing a non-trivial plan, or on demand on any plan or result. Critical pass: riskiest assumption, simpler alternative, what breaks, cheapest falsifying check."
argument-hint: "Plan or result to grill"
---

Critical pass before work starts. Cheap, not a ceremony.

## Rules

- Trivial task: skip. No extra question round.
- Per plan, 4 items, one line each: riskiest assumption, simpler alternative, what breaks, cheapest falsifying check.
- Answer from code or docs where possible. Never ask what they answer.
- Ask only items that change design, interface, data, security, or user-visible behavior. Fold into the already pending ask; 2-5 options, recommended first.
- Cheap check before Worker starts: read-only by Lead, else Scout/Worker.
- Output ≤6 lines per plan. No praise, no restating the plan.
