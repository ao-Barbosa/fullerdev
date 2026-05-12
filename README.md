# fullerdev

> Opinionated OpenCode plugin for Azure DevOps-native multi-agent orchestration.

**7 specialized subagents** working under one orchestrator, with built-in MCPs (DeepWiki, grep.app, Context7), Azure DevOps tools (Work Items, Git, Wiki, Pipelines), curated skills, and lifecycle hooks — all tuned for teams that live in Azure DevOps.

---

## What's This Plugin

`fullerdev` is an **agent orchestration plugin** for [OpenCode](https://opencode.ai). It's built on the same architecture as `oh-my-opencode-slim` but is **VERY opinionated** about Azure DevOps:

- Every commit links to a Work Item (`AB#`)
- Branch naming follows ADO conventions
- A dedicated `devops` agent handles all ADO operations
- Built-in tools speak fluent Azure DevOps REST API
- Skills teach agents the ADO workflow

---

## Quick Start

### Install

```bash
bunx fullerdev setup
```

This adds `fullerdev` to your OpenCode plugins and generates a starter config.

### Configure

Edit `~/.config/opencode/fullerdev.jsonc`:

```jsonc
{
  "$schema": "https://unpkg.com/fullerdev@latest/fullerdev.schema.json",
  "preset": "opencode-go",
  "azureDevOps": {
    "orgUrl": "https://dev.azure.com/your-org",
    "project": "YourProject",
    "pat": "${AZURE_DEVOPS_EXT_PAT}"
  }
}
```

Set your PAT:

```bash
export AZURE_DEVOPS_EXT_PAT="your-personal-access-token"
```

### Verify

```bash
opencode
# Then type:
ping all agents
```

---

## Meet the Agents

| Agent | Role | Default Model | When to Delegate |
|-------|------|---------------|-----------------|
| **Orchestrator** | Master delegator & strategic coordinator | `opencode-go/deepseek-v4-pro` | Main agent — plans, delegates, orchestrates |
| **Explorer** | Codebase reconnaissance | `opencode-go/minimax-m2.7` | Broad/uncertain searches, discovering codebase structure |
| **Oracle** | Architecture, review, debugging | `opencode-go/deepseek-v4-pro` (max) | High-stakes decisions, code review, simplification |
| **Librarian** | Documentation & external knowledge | `opencode-go/minimax-m2.7` | Library docs, API references, GitHub examples |
| **Designer** | UI/UX implementation | `opencode-go/kimi-k2.6` | Visual interfaces, responsive layouts, design systems |
| **Fixer** | Fast implementation | `opencode-go/deepseek-v4-flash` | Well-scoped code changes, tests, bounded tasks |
| **DevOps** | Azure DevOps specialist | `opencode-go/deepseek-v4-flash` | Work Items, Git repos, Wiki, Pipelines, any ADO API |

---

## Built-in MCPs

| MCP | Purpose | Assigned By Default |
|-----|---------|--------------------|
| **DeepWiki** | Official library documentation | Librarian |
| **grep_app** | GitHub code search (millions of repos) | Librarian, DevOps |
| **Context7** | Context-aware docs & optimization | Librarian |
| **WebSearch** | Real-time web search (Exa) | Librarian |

---

## Built-in Skills

| Skill | Description | Assigned By Default |
|-------|-------------|--------------------|
| `gitmaster` | Atomic commits with AB# linking, rebase/squash workflows | DevOps |
| `frontend-ui-ux` | Design-first UI engineering, accessibility, design systems | Designer |
| `agent-browser` | Browser automation for visual verification | Designer |
| `azure-devops` | ADO Work Items, Git, Wiki, Pipelines workflow | DevOps |
| `simplify` | Behavior-preserving code simplification | Oracle |

---

## Built-in Tools

### Azure DevOps

| Tool | Description |
|------|-------------|
| `azdev_workitem_query` | Query Work Items using WIQL |
| `azdev_workitem_get` | Get a single Work Item by ID |
| `azdev_workitem_create` | Create a new Work Item |
| `azdev_workitem_update` | Update an existing Work Item |
| `azdev_workitem_link` | Link two Work Items |
| `azdev_git_repos` | List Git repositories |
| `azdev_git_repo` | Get repository details |
| `azdev_git_branches` | List branches in a repository |
| `azdev_git_prs` | List/search Pull Requests |
| `azdev_git_pr_create` | Create a Pull Request |
| `azdev_wiki_search` | Search Wiki pages |
| `azdev_wiki_page` | Get Wiki page content |
| `azdev_wiki_create` | Create/update a Wiki page |
| `azdev_pipelines_list` | List pipelines |
| `azdev_pipelines_runs` | Get pipeline runs |
| `azdev_pipelines_trigger` | Trigger a pipeline run |

### Core

| Tool | Description |
|------|-------------|
| `task` | Delegate a subtask to a specialized agent |
| `webfetch` | Fetch URL content in clean format |

---

## Built-in Hooks

| Hook | Purpose |
|------|---------|
| `session-lifecycle` | Session management, error recovery |
| `todo-continuation` | Auto-continue when todos remain (with cooldown) |
| `context-injection` | Auto-inject AGENTS.md and directory context |
| `devops-integration` | Auto-detect Work Item references, suggest AB# links |

---

## Configuration Reference

### Presets

Two built-in presets:

```jsonc
{
  "presets": {
    "opencode-go": {
      "orchestrator": { "model": "opencode-go/deepseek-v4-pro", "variant": "high", "skills": ["*"], "mcps": ["*", "!context7"] },
      "oracle": { "model": "opencode-go/deepseek-v4-pro", "variant": "max", "skills": ["simplify"], "mcps": [] },
      "librarian": { "model": "opencode-go/minimax-m2.7", "skills": [], "mcps": ["websearch", "deepwiki", "context7", "grep_app"] },
      "explorer": { "model": "opencode-go/minimax-m2.7", "skills": [], "mcps": [] },
      "designer": { "model": "opencode-go/kimi-k2.6", "variant": "medium", "skills": ["agent-browser", "frontend-ui-ux"], "mcps": [] },
      "fixer": { "model": "opencode-go/deepseek-v4-flash", "variant": "high", "skills": [], "mcps": [] },
      "devops": { "model": "opencode-go/deepseek-v4-flash", "variant": "medium", "skills": ["azure-devops", "gitmaster"], "mcps": ["grep_app"] }
    },
    "openai": {
      "orchestrator": { "model": "openai/gpt-5.5", "variant": "high", "skills": ["*"], "mcps": ["*", "!context7"] },
      "oracle": { "model": "openai/gpt-5.5", "variant": "high", "skills": ["simplify"], "mcps": [] },
      "librarian": { "model": "openai/gpt-5.4-mini", "variant": "low", "skills": [], "mcps": ["websearch", "deepwiki", "context7", "grep_app"] },
      "explorer": { "model": "openai/gpt-5.4-mini", "variant": "low", "skills": [], "mcps": [] },
      "designer": { "model": "openai/gpt-5.4-mini", "variant": "medium", "skills": ["agent-browser", "frontend-ui-ux"], "mcps": [] },
      "fixer": { "model": "openai/gpt-5.4-mini", "variant": "low", "skills": [], "mcps": [] },
      "devops": { "model": "openai/gpt-5.4-mini", "variant": "medium", "skills": ["azure-devops", "gitmaster"], "mcps": ["grep_app"] }
    }
  }
}
```

### Per-Agent Options

```jsonc
{
  "model": "provider/model-id",     // Provider and model ID
  "variant": "high",                 // low | medium | high | max (thinking effort)
  "skills": ["*", "!agent-browser"], // * = all, !name = exclude, [] = none
  "mcps": ["websearch", "grep_app"]  // * = all, !name = exclude, [] = none
}
```

### Azure DevOps Config

```jsonc
{
  "azureDevOps": {
    "orgUrl": "https://dev.azure.com/myorg",
    "project": "MyProject",
    "pat": "${AZURE_DEVOPS_EXT_PAT}",  // Env var substitution supported
    "defaultAreaPath": "MyProject\\Team",
    "defaultIterationPath": "MyProject\\Sprint 1"
  }
}
```

### Disabling Features

```jsonc
{
  "disabledMcps": ["context7"],
  "disabledHooks": ["todo-continuation"],
  "disabledSkills": ["agent-browser"],
  "disabledAgents": []
}
```

---

## Project Structure

```
fullerdev/
├── src/
│   ├── index.ts                 # Plugin entry point
│   ├── agents/
│   │   ├── orchestrator.ts      # Master delegator prompt
│   │   ├── explorer.ts          # Codebase reconnaissance prompt
│   │   ├── oracle.ts            # Architecture/review prompt
│   │   ├── librarian.ts         # Documentation research prompt
│   │   ├── designer.ts          # UI/UX implementation prompt
│   │   ├── fixer.ts             # Fast implementation prompt
│   │   └── devops.ts            # Azure DevOps specialist prompt
│   ├── config/
│   │   ├── schema.ts            # Zod config schema
│   │   ├── defaults.ts          # Default presets
│   │   └── loader.ts            # JSONC config loader
│   ├── tools/
│   │   ├── index.ts             # Tool registry aggregator
│   │   ├── core/                # core tools (task, webfetch)
│   │   └── azure/               # Azure DevOps tools
│   │       ├── work-items.ts    # Work Item CRUD + query
│   │       ├── git.ts           # Repos, branches, PRs
│   │       ├── wiki.ts          # Wiki search, read, write
│   │       └── pipelines.ts     # Pipeline list, runs, trigger
│   ├── hooks/
│   │   ├── index.ts             # Hooks composition
│   │   ├── session-lifecycle.ts # Session events
│   │   ├── todo-continuation.ts # Auto-continue
│   │   ├── context-injection.ts # AGENTS.md injection
│   │   └── devops-integration.ts # ADO-specific hooks
│   └── mcp/
│       └── index.ts             # MCP definitions + resolution
│   └── skills/
│       ├── gitmaster/SKILL.md
│       ├── frontend-ui-ux/SKILL.md
│       ├── agent-browser/SKILL.md
│       ├── azure-devops/SKILL.md
│       └── simplify/SKILL.md
├── bin/
│   └── setup.js                 # Installation script
├── package.json
├── tsconfig.json
├── LICENSE
└── README.md
```

---

## Publishing to npm

```bash
# Build the plugin
bun run build

# Publish
npm publish --access public
```

---

## License

MIT
