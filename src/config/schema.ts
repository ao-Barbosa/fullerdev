import { z } from "zod";

/**
 * Per-agent model and skill/MCP assignment configuration.
 */
export const AgentConfigSchema = z.object({
  model: z.string().describe("Provider/model ID (e.g., 'opencode-go/deepseek-v4-pro')"),
  variant: z
    .enum(["low", "medium", "high", "max"])
    .optional()
    .describe("Thinking/reasoning effort variant"),
  skills: z
    .array(z.string())
    .optional()
    .describe("Skills assigned to this agent. Use '*' for all, '!name' to exclude."),
  mcps: z
    .array(z.string())
    .optional()
    .describe("MCP servers available to this agent. Use '*' for all, '!name' to exclude."),
});

export type AgentConfig = z.infer<typeof AgentConfigSchema>;

/**
 * Preset: a named collection of agent model/mcp/skill assignments.
 */
export const PresetSchema = z.object({
  orchestrator: AgentConfigSchema,
  oracle: AgentConfigSchema,
  librarian: AgentConfigSchema,
  explorer: AgentConfigSchema,
  designer: AgentConfigSchema,
  fixer: AgentConfigSchema,
  devops: AgentConfigSchema,
});

export type Preset = z.infer<typeof PresetSchema>;

/**
 * Azure DevOps connection configuration.
 */
export const AzureDevOpsConfigSchema = z.object({
  orgUrl: z
    .string()
    .url()
    .describe("Azure DevOps organization URL (e.g., 'https://dev.azure.com/myorg')"),
  project: z.string().optional().describe("Default project name"),
  pat: z
    .string()
    .optional()
    .describe(
      "Personal Access Token. Supports ${ENV_VAR} syntax. Falls back to AZURE_DEVOPS_EXT_PAT env var."
    ),
  defaultAreaPath: z.string().optional().describe("Default Area Path for work items"),
  defaultIterationPath: z
    .string()
    .optional()
    .describe("Default Iteration Path for work items"),
});

export type AzureDevOpsConfig = z.infer<typeof AzureDevOpsConfigSchema>;

/**
 * Full plugin configuration schema.
 */
export const PluginConfigSchema = z.object({
  $schema: z.string().optional(),
  /** Name of the active preset */
  preset: z.string().default("opencode-go"),
  /** Named presets of agent configurations */
  presets: z.record(z.string(), PresetSchema).default({}),
  /** Azure DevOps connection settings */
  azureDevOps: AzureDevOpsConfigSchema.optional(),
  /** Globally disabled MCP server IDs */
  disabledMcps: z.array(z.string()).optional().default([]),
  /** Globally disabled hook IDs */
  disabledHooks: z.array(z.string()).optional().default([]),
  /** Globally disabled skills */
  disabledSkills: z.array(z.string()).optional().default([]),
  /** Globally disabled agents */
  disabledAgents: z.array(z.string()).optional().default([]),
});

export type PluginConfig = z.infer<typeof PluginConfigSchema>;
