import type { PluginConfig } from "../config/schema";
import type { AgentConfig } from "../config/schema";

/**
 * Built-in MCP server definitions.
 *
 * These MCP servers are registered with OpenCode and can be assigned
 * to agents via their `mcps` configuration array.
 *
 * MCP Types:
 * - Remote HTTP MCPs: External services accessed via HTTP
 * - The agent's mcp permissions control which servers it can call
 */

export interface McpDefinition {
  id: string;
  type: "http" | "stdio";
  description: string;
  /** HTTP MCP server URL */
  url?: string;
  /** Environment variables needed by this MCP */
  env?: Record<string, string>;
}

/**
 * Define all built-in MCP servers.
 */
export function getBuiltinMcps(config: PluginConfig): McpDefinition[] {
  const mcps: McpDefinition[] = [];

  // DeepWiki — Library documentation lookup via MCP
  if (!config.disabledMcps?.includes("deepwiki")) {
    mcps.push({
      id: "deepwiki",
      type: "http",
      description:
        "Fetches up-to-date official library documentation via DeepWiki. Use for API references, framework docs, and version-specific behavior.",
      url: "https://mcp.deepwiki.com/mcp",
    });
  }

  // grep.app — GitHub code search MCP
  if (!config.disabledMcps?.includes("grep_app")) {
    mcps.push({
      id: "grep_app",
      type: "http",
      description:
        "Ultra-fast code search across millions of public GitHub repositories. Find real-world usage examples, patterns, and implementations.",
      url: "https://mcp.grep.app",
    });
  }

  // Context7 — Context optimization and documentation MCP
  if (!config.disabledMcps?.includes("context7")) {
    mcps.push({
      id: "context7",
      type: "http",
      description:
        "Context-aware documentation retrieval and optimization. Provides accurate, version-specific API information and context compression.",
      url: "https://mcp.context7.com/mcp",
    });
  }

  // Web search — Exa/Tavily-powered web search MCP
  if (!config.disabledMcps?.includes("websearch")) {
    mcps.push({
      id: "websearch",
      type: "http",
      description:
        "Real-time web search for current information, documentation, and examples.",
      url: process.env.EXA_MCP_URL ?? "https://mcp.exa.ai",
      env: {
        EXA_API_KEY: process.env.EXA_API_KEY ?? "",
      },
    });
  }

  return mcps;
}

/**
 * Resolve which MCPs an agent should have access to based on config.
 * Handles wildcards (*), exclusions (!name), and explicit lists.
 */
export function resolveAgentMcps(
  agentConfig: AgentConfig,
  allMcpIds: string[],
  defaultList: string[] = []
): string[] {
  const assigned = agentConfig.mcps ?? defaultList;

  // If wildcard present, start with all MCPs
  let resolved: string[];
  if (assigned.includes("*")) {
    resolved = [...allMcpIds];
  } else {
    resolved = [];
  }

  // Process inclusions
  for (const item of assigned) {
    if (item === "*") continue;
    if (item.startsWith("!")) {
      // Exclusion
      const excluded = item.slice(1);
      resolved = resolved.filter((id) => id !== excluded);
    } else {
      // Explicit inclusion
      if (!resolved.includes(item)) {
        resolved.push(item);
      }
    }
  }

  return resolved;
}
