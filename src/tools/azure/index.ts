import type { ToolDefinition } from "@opencode-ai/plugin";
import { createWorkItemTools } from "./work-items";
import { createGitTools } from "./git";
import { createWikiTools } from "./wiki";
import { createPipelineTools } from "./pipelines";

/**
 * Aggregate all Azure DevOps tools into a single registry.
 */
export function createDevOpsTools(): Record<string, ToolDefinition> {
  return {
    ...createWorkItemTools(),
    ...createGitTools(),
    ...createWikiTools(),
    ...createPipelineTools(),
  };
}
