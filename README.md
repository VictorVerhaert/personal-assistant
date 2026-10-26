# personal-assistant

Context-efficient personal assistant plugin for VS Code Copilot. A strong lead owns intent, decisions, and verification and keeps its context small; cheaper subagents do the bulky work and return short evidence.

## Agents

| Agent | Models | Tools | Role |
| --- | --- | --- | --- |
| Personal Assistant - Lead | Claude Opus 5.5 -> GPT-6.1 Sol | Ask, memory, skills, read, edit, delegate | Plans with the user, delegates, decides, checks |
| Research Scout | GPT-6.1 Sol -> Claude Sonnet 5.5 | All (read-only by instruction) | Web research via built-in search and fetch, repository maps |
| Repository Worker | Claude Sonnet 5.5 -> GPT-6.1 Sol | All | Named-file edits, builds, tests, scripts |
| Quality Gate | GPT-6.1 Sol -> Claude Opus 5.5 | Read, search, shell, skills | Independent correctness, security, minimal-code review |
| Quick Helper | Claude Haiku 5.5 | Read, search, edit, shell | Fully specified repetitive work |

Scout and Worker get every tool, so MCP servers you add are available to them in new sessions.

## How It Works

- **User involvement:** no fixed upfront plan or approval gate. The lead asks multiple-choice questions (recommended option first) whenever a decision affects design, interfaces, data, security, or user-visible behavior, and checks in briefly after each slice. Answers go to a `decisions.md` session file that subagents read. Subagents return `QUESTION:` instead of guessing and `ASSUMED:` for low-risk choices.
- **Delegation:** the lead delegates external facts, broad discovery, noisy output, builds, tests, and multi-file edits with named files and acceptance criteria. Subagents return capped summaries, never transcripts.
- **Review loop:** Worker changes and validates; Quality Gate reviews in fresh context; at most two repair cycles, then escalate.
- **Lean output:** caveman-style terse answers that keep negations, conditions, and uncertainty. Subagents are told reasoning is billed.
- **Minimal code:** one ladder in the `minimal-code` skill: need it, reuse, stdlib, native, installed dependency, one line, minimum.
- **Output trimming:** a `postToolUse` hook ([scripts/trim-output.js](scripts/trim-output.js)) cuts shell, search, and fetch output over 8000 characters to head, tail, and error lines, and saves the full output to a temp file.

## Skills

| Command | Purpose |
| --- | --- |
| `/delegated-research` | Source-backed research through Research Scout |
| `/repo-recon` | Repository map without filling lead context |
| `/delegated-delivery` | Bounded worker execution plus independent review |
| `/minimal-code` | Minimal design, change, and review gate |

## Install

Load the folder as a local agent plugin or add it to a Copilot plugin marketplace, then select **Personal Assistant - Lead**. Requires Node.js for the hook.

Built for the Copilot harness; the Local harness still works, without output replacement from the hook or `reasoning-effort`. Tool lists include both harness names; unknown names are ignored, so editor "unknown tool" warnings for `ask_user`, `store_memory`, or `skill` are expected before VS Code 1.144.

Web research uses the harness's built-in web search and fetch tools; no MCP server or API key is needed.

**Lead context:** choose **Context: default** (200k) for Opus in the model picker; it persists as a preference.