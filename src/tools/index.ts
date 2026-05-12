import type { ToolDefinition } from "@opencode-ai/plugin";
import { createCoreTools } from "./core";
import { createDevOpsTools } from "./azure";

/**
 * Aggregate all plugin tools into a single registry.
 * Registers with OpenCode's tool hook in the plugin entry point.
 */
export function createAllTools(): Record<string, ToolDefinition> {
  return {
    ...createCoreTools(),
    ...createDevOpsTools(),
  };
}
