# personal-assistant

Context-efficient personal assistant plugin for VS Code Copilot. A powerful lead keeps intent, decisions, and verification; versatile subagents absorb source gathering, large-repository exploration, bounded edits, and independent review.

## Architecture

| Agent | Models | Authority | Use |
| --- | --- | --- | --- |
| Personal Assistant - Lead | Claude Opus 5.5 -> GPT-6.1 Sol | Final decisions, bounded Git diagnostics, and validation | General work and coordination |
| Research Scout | GPT-6.1 Sol -> Claude Sonnet 5.5 | Read-only | Tavily research, large-repo scans, noisy output |
| Repository Worker | Claude Sonnet 5.5 -> GPT-6.1 Sol | Named files only | Bounded edits and focused tests |
| Quality Gate | GPT-6.1 Sol -> Claude Opus 5.5 | Read-only | Fresh-context correctness, security, and minimal-code review |
| Quick Helper | Claude Haiku 5.5 | Named files; runs only provided scripts or verbatim commands | Cheap, fully specified repetitive tasks: log/entry scans, extraction, small mechanical edits |

Research and implementation use `GPT-6.1 Sol` and `Claude Sonnet 5.5`. `Claude Opus 5.5` and `GPT-6.1 Sol` handle final decisions and independent review, where deeper reasoning has the highest leverage. `Claude Haiku 5.5` takes cheap, fully specified bulk work.

## Routing

The lead delegates external facts, unknown or broad repository discovery, more than two files or 200 lines of investigation, noisy output, and multi-file mechanical edits. It performs small known edits and final synthesis directly. Every subagent returns a compact evidence contract, never a raw transcript.

All builds, test suites, and arbitrary scripts run through **Repository Worker**. It tries the narrowest documented command, permits two setup or recovery attempts, and returns `BLOCKED` for interactive input, credentials, unavailable services, undeclared downloads, permission changes, or 120 seconds without useful output. The lead directs the next action; it does not consume context retrying shell work.

For non-trivial changes, the bounded loop is `Worker change and validate -> Quality Gate review -> Worker repair and revalidate -> Quality Gate re-review`. The Lead sends intent, acceptance criteria, changed paths, risk focus, and validation results, not a copied diff. Quality Gate retrieves repository status and expands only relevant hunks in a fresh context. It permits two worker-validation cycles, then escalates with evidence.

The package carries the caveman communication style, a minimal-code ladder, repository memory, VS Code todo tracking, explicit confirmation for consequential actions, focused validation, and a Quality Gate after non-trivial changes.

## Commands

The following packaged skills are the reusable slash-command workflows. Plugin manifests load skills directly; VS Code `.prompt.md` files are workspace/user customizations and are not a plugin manifest component.

| Command | Purpose |
| --- | --- |
| `/delegated-research` | Current, source-backed research through Research Scout |
| `/repo-recon` | Large-repository map without filling lead context |
| `/delegated-delivery` | Bounded worker execution plus independent review |
| `/minimal-code` | Minimal design, change, and review gate |

## Install

The folder is a complete plugin: `plugin.json` declares agents and skills. Add it to a Copilot plugin marketplace or load it as a local plugin directory, then reload Copilot custom agents. Select **Personal Assistant - Lead** in chat.

> **Highly recommended: install Tavily yourself.** The plugin does not bundle an MCP server. Research Scout uses the `io.github.tavily-ai/tavily-mcp` server; install it from the VS Code MCP gallery into your user `mcp.json`, where it prompts once for your API key. Without it, Scout falls back to generic web search.

## Validation

1. Ask the lead for a current technical recommendation: it should delegate to Research Scout and cite compact findings.
2. Ask it to map an unfamiliar repository: Scout should return a short ownership map, not raw search output.
3. Request a multi-file change: Repository Worker should receive named files and one focused check; Quality Gate should review the diff.

## Research Basis

- [GitHub Copilot models and pricing](https://docs.github.com/en/copilot/reference/copilot-billing/models-and-pricing): model tiers and multipliers behind each agent's model pair.
- [Anthropic: Effective context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents): clean subagent context, compressed results, and selective context.
- [Anthropic: Multi-agent research](https://www.anthropic.com/engineering/multi-agent-research-system): explicit delegation contracts, effort budgets, and small outcome-focused evaluations.
- [Anthropic: Agent evals](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents): deterministic tests are the primary correctness grader for coding agents.
- [OpenAI agent cookbook](https://developers.openai.com/cookbook/topic/agents): current orchestration, compaction, and evaluation references.
- [OpenAI: Agent improvement loop](https://developers.openai.com/cookbook/examples/agents_sdk/agent_improvement_loop): connect traces, evaluation, and bounded harness improvements.
- [VS Code custom agents](https://code.visualstudio.com/docs/copilot/customization/custom-agents): focused roles, minimal tools, and clear boundaries.
- [GitHub Copilot plugins](https://docs.github.com/en/copilot/concepts/agents/about-plugins): portable agent, skill, and MCP packaging.