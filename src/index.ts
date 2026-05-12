import type { Plugin, PluginModule, Hooks } from "@opencode-ai/plugin";
import { loadConfig, getActivePreset } from "./config/loader";

// Module-level log: fires on import (confirms OpenCode loaded the module)
console.log("[fullerdev] Module loaded (v0.1.0)");
import { createDevOpsTools } from "./tools/azure";
import { createCoreTools } from "./tools/core";
import { createAllHooks } from "./hooks";
import { getBuiltinMcps, resolveAgentMcps } from "./mcp";

// Agent prompts — imported for registration in the config hook
import { ORCHESTRATOR_PROMPT } from "./agents/orchestrator";
import { EXPLORER_PROMPT } from "./agents/explorer";
import { ORACLE_PROMPT } from "./agents/oracle";
import { LIBRARIAN_PROMPT } from "./agents/librarian";
import { DESIGNER_PROMPT } from "./agents/designer";
import { FIXER_PROMPT } from "./agents/fixer";
import { DEVOPS_PROMPT } from "./agents/devops";

// Re-export agent prompts for programmatic use
export { ORCHESTRATOR_PROMPT } from "./agents/orchestrator";
export { EXPLORER_PROMPT } from "./agents/explorer";
export { ORACLE_PROMPT } from "./agents/oracle";
export { LIBRARIAN_PROMPT } from "./agents/librarian";
export { DESIGNER_PROMPT } from "./agents/designer";
export { FIXER_PROMPT } from "./agents/fixer";
export { DEVOPS_PROMPT } from "./agents/devops";

// Re-export config types for consumers
export type { PluginConfig, Preset, AgentConfig, AzureDevOpsConfig } from "./config/schema";
export { PluginConfigSchema } from "./config/schema";

/**
 * FullerDev Plugin
 *
 * An opinionated multi-agent orchestration plugin for OpenCode,
 * tuned for Azure DevOps-native workflows.
 *
 * Features:
 * - 7 specialized subagents (orchestrator, explorer, oracle, librarian, designer, fixer, devops)
 * - Per-agent model and variant configuration via presets
 * - Built-in MCPs: DeepWiki, grep.app, Context7, WebSearch
 * - Built-in tools: Azure DevOps (Work Items, Git, Wiki, Pipelines) + core utilities
 * - Built-in skills: gitmaster, frontend-ui-ux, agent-browser, azure-devops, simplify
 * - Lifecycle hooks: session management, todo continuation, context injection, devops integration
 * - JSONC config with env var substitution (${AZURE_DEVOPS_EXT_PAT} etc.)
 *
 * @see https://github.com/ao-barbosa/fullerdev
 */
export const FullerDevPlugin: Plugin = async (ctx) => {
  console.log("[fullerdev] Plugin function invoked");

  const { directory } = ctx;

  // Phase 1: Load configuration (with env var resolution)
  let config;
  let preset;
  try {
    config = loadConfig(directory);
    preset = getActivePreset(config);
    console.log(`[fullerdev] Loaded preset: ${config.preset}`);
    console.log(`[fullerdev] ${Object.keys(preset).length} agents configured`);
  } catch (err) {
    console.error("[fullerdev] Config load failed:", err);
    throw err;
  }

  // Phase 2: Build tool registry
  const coreTools = createCoreTools();
  const devopsTools = createDevOpsTools();

  // Phase 3: Build MCP definitions
  const builtinMcps = getBuiltinMcps(config);
  const allMcpIds = builtinMcps.map((m) => m.id);

  // Phase 4: Build hooks
  const composedHooks = createAllHooks(config);

  // Phase 5: Assemble and return the plugin interface
  return {
    /**
     * Config hook — registers agents, MCPs, and other configuration
     * into OpenCode's runtime config.
     */
    config: async (input) => {
      console.log("[fullerdev] config hook called, registering agents & MCPs...");
      // Ensure sections exist
      input.agent ??= {};
      input.mcp ??= {};

      // Register all 7 subagents
      input.agent["orchestrator"] = {
        mode: "primary",
        color: "primary",
        description: "Master delegator and strategic coordinator — plans, delegates, orchestrates complex workflows",
        prompt: ORCHESTRATOR_PROMPT,
        model: preset.orchestrator.model,
      };
      input.agent["explorer"] = {
        mode: "subagent",
        color: "info",
        description: "Parallel search specialist for discovering unknowns across the codebase",
        prompt: EXPLORER_PROMPT,
        model: preset.explorer.model,
      };
      input.agent["oracle"] = {
        mode: "subagent",
        color: "warning",
        description: "Strategic advisor, code reviewer, and debugger — for architecture, complex bugs, simplification",
        prompt: ORACLE_PROMPT,
        model: preset.oracle.model,
      };
      input.agent["librarian"] = {
        mode: "subagent",
        color: "secondary",
        description: "Authoritative source for current library docs, API references, and real-world code examples",
        prompt: LIBRARIAN_PROMPT,
        model: preset.librarian.model,
      };
      input.agent["designer"] = {
        mode: "subagent",
        color: "success",
        description: "UI/UX specialist for intentional, polished visual experiences and design systems",
        prompt: DESIGNER_PROMPT,
        model: preset.designer.model,
      };
      input.agent["fixer"] = {
        mode: "subagent",
        color: "accent",
        description: "Fast execution specialist for well-scoped implementation tasks, tests, and bounded changes",
        prompt: FIXER_PROMPT,
        model: preset.fixer.model,
      };
      input.agent["devops"] = {
        mode: "subagent",
        color: "error",
        description: "Azure DevOps specialist — Work Items, Git repos, Wikis, Pipelines, any ADO API",
        prompt: DEVOPS_PROMPT,
        model: preset.devops.model,
      };

      // Register built-in MCP servers
      for (const mcp of builtinMcps) {
        if (!input.mcp[mcp.id]) {
          input.mcp[mcp.id] = {
            type: "remote" as const,
            url: mcp.url ?? "",
          };
        }
      }
    },

    /**
     * Tool hook — registers all custom tools.
     */
    tool: {
      ...coreTools,
      ...devopsTools,
    },

    /**
     * Chat params hook — injects agent-specific model preferences
     * and MCP permissions when delegating to subagents.
     */
    "chat.params": async (input, output) => {
      const agentName = input.agent;

      // Merge devops integration first
      await composedHooks["chat.params"](input as Parameters<typeof composedHooks["chat.params"]>[0], output);

      // Apply agent-specific config from preset
      if (agentName && preset[agentName as keyof typeof preset]) {
        const agentConfig = preset[agentName as keyof typeof preset];

        // Store agent config in options for OpenCode runtime to pick up
        output.options = output.options ?? {};
        output.options.fullerdev = {
          model: agentConfig.model,
          variant: agentConfig.variant,
          mcps: agentConfig.mcps
            ? resolveAgentMcps(agentConfig, allMcpIds)
            : undefined,
          skills: agentConfig.skills,
        };
      }
    },

    /**
     * Tool execution hooks.
     */
    "tool.execute.before": composedHooks["tool.execute.before"] as unknown as Hooks["tool.execute.before"],
    "tool.execute.after": composedHooks["tool.execute.after"] as unknown as Hooks["tool.execute.after"],

    /**
     * Event hook — session lifecycle, todo continuation, devops integration.
     */
    event: composedHooks.event as Hooks["event"],

  } satisfies Hooks;
};

// PluginModule wrapper — some OpenCode versions expect
// `{ server: Plugin }` rather than a bare Plugin function
const fullerdevPluginModule: PluginModule = {
  id: "fullerdev",
  server: FullerDevPlugin,
};

export default fullerdevPluginModule;
