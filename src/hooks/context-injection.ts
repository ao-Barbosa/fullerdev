import type { PluginConfig } from "../config/schema";

/**
 * Context injection hooks — inject rules, AGENTS.md files, and directory context
 * into the conversation at appropriate times.
 *
 * Pattern adapted from oh-my-opencode-slim's directory-agents-injector
 * and rules-injector hooks.
 */

export interface ContextInjectionHooks {
  "tool.execute.before": (input: {
    tool: string;
    args: Record<string, unknown>;
  }, output: { context?: string[] }) => Promise<void>;

  "tool.execute.after": (input: {
    tool: string;
    args: Record<string, unknown>;
    result: unknown;
  }, output: { context?: string[] }) => Promise<void>;
}

export function createContextInjectionHooks(
  _config: PluginConfig
): ContextInjectionHooks {
  return {
    /**
     * Before tool execution: inject relevant context.
     */
    "tool.execute.before": async (input, output) => {
      // Before reading a file, could auto-inject directory-level AGENTS.md
      if (input.tool === "read" || input.tool === "read_file") {
        // TODO: Walk directory tree to find and inject AGENTS.md files
      }
    },

    /**
     * After tool execution: inject post-tool context.
     */
    "tool.execute.after": async (_input, _output) => {
      // Post-tool processing: could truncate large outputs,
      // check for comments, inject metadata, etc.
    },
  };
}
