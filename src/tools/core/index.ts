import { tool } from "@opencode-ai/plugin";
import type { ToolDefinition } from "@opencode-ai/plugin";

/**
 * Core task delegation tool — allows the orchestrator to spawn subagent tasks.
 * This is a placeholder; the actual task delegation is handled via OpenCode's
 * session.prompt API through the orchestrator's workflow.
 */
export const TASK_TOOL: ToolDefinition = tool({
  description: "Spawn a subtask to a specialized subagent",
  args: {
    agent: tool.schema
      .string()
      .describe("Name of the subagent to delegate to (explorer, librarian, oracle, designer, fixer, devops)"),
    task: tool.schema.string().describe("Detailed task description for the subagent"),
    context: tool.schema
      .object({
        files: tool.schema.array(tool.schema.string()).optional().describe("Files relevant to this task"),
        workItemId: tool.schema.number().optional().describe("Related Azure DevOps Work Item ID"),
      })
      .optional(),
  },
  async execute(args, ctx) {
    // TODO: Implement task delegation via OpenCode session API
    return `[task] Delegating to @${args.agent}: ${args.task.slice(0, 200)}...`;
  },
});

/**
 * Web fetch tool — fetches a URL and returns cleaned content.
 * Useful for fetching documentation, articles, and API references.
 */
export const WEBFETCH_TOOL: ToolDefinition = tool({
  description: "Fetch a URL and return its content in a clean, readable format",
  args: {
    url: tool.schema.string().url().describe("The URL to fetch"),
    format: tool.schema
      .enum(["text", "markdown", "html"])
      .optional()
      .describe("Output format (default: markdown)"),
    extractMain: tool.schema
      .boolean()
      .optional()
      .describe("Extract only the main content (default: true)"),
  },
  async execute(args, ctx) {
    // TODO: Implement web fetching
    return `[webfetch] Fetching ${args.url}...`;
  },
});

/**
 * Export all core tools for registration in the plugin.
 */
export function createCoreTools(): Record<string, ToolDefinition> {
  return {
    task: TASK_TOOL,
    webfetch: WEBFETCH_TOOL,
  };
}
