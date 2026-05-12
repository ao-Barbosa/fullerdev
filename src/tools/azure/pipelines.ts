import { tool } from "@opencode-ai/plugin";
import type { ToolDefinition } from "@opencode-ai/plugin";

/**
 * List pipelines in the project.
 */
export const PIPELINES_LIST_TOOL: ToolDefinition = tool({
  description: "List all pipelines in the configured Azure DevOps project. Returns pipeline ID, name, folder, and URL.",
  args: {
    folder: tool.schema.string().optional().describe("Filter by pipeline folder path"),
    top: tool.schema.number().optional().describe("Maximum results (default: 100)"),
  },
  async execute(args, ctx) {
    return "[azdev_pipelines_list] Listing pipelines...";
  },
});

/**
 * Get pipeline runs (builds).
 */
export const PIPELINES_RUNS_TOOL: ToolDefinition = tool({
  description: "Get recent runs of a specific Azure DevOps pipeline. Returns run ID, status, result, start time, and URL.",
  args: {
    pipelineId: tool.schema.number().describe("Pipeline definition ID"),
    statusFilter: tool.schema
      .enum(["all", "running", "completed", "none"])
      .optional()
      .describe("Filter by run status (default: all)"),
    resultFilter: tool.schema
      .enum(["succeeded", "partiallySucceeded", "failed", "canceled", "all"])
      .optional()
      .describe("Filter by run result (default: all)"),
    top: tool.schema.number().optional().describe("Maximum runs to return (default: 10)"),
    branchName: tool.schema.string().optional().describe("Filter by source branch"),
  },
  async execute(args, ctx) {
    return `[azdev_pipelines_runs] Getting runs for pipeline #${args.pipelineId}...`;
  },
});

/**
 * Trigger a pipeline run.
 */
export const PIPELINES_TRIGGER_TOOL: ToolDefinition = tool({
  description: "Trigger a new run of an Azure DevOps pipeline. Supports specifying branch, variables, and YAML override.",
  args: {
    pipelineId: tool.schema.number().describe("Pipeline definition ID to trigger"),
    branch: tool.schema.string().optional().describe("Branch to build (default: default branch)"),
    variables: tool.schema
      .record(tool.schema.string(), tool.schema.string())
      .optional()
      .describe("Pipeline variables as key-value pairs"),
    reason: tool.schema
      .enum(["manual", "individualCI", "batchedCI", "schedule", "pullRequest"])
      .optional()
      .describe("Reason for the build (default: manual)"),
  },
  async execute(args, ctx) {
    return `[azdev_pipelines_trigger] Triggering pipeline #${args.pipelineId}...`;
  },
});

/**
 * Export all Azure DevOps Pipeline tools.
 */
export function createPipelineTools(): Record<string, ToolDefinition> {
  return {
    azdev_pipelines_list: PIPELINES_LIST_TOOL,
    azdev_pipelines_runs: PIPELINES_RUNS_TOOL,
    azdev_pipelines_trigger: PIPELINES_TRIGGER_TOOL,
  };
}
