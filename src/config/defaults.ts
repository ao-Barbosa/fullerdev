import type { PluginConfig, Preset } from "./schema";

/**
 * Default OpenCode Go preset — tuned for cost-efficiency with OpenCode's bundled models.
 */
export const OPENCODE_GO_PRESET: Preset = {
  orchestrator: {
    model: "opencode-go/deepseek-v4-pro",
    variant: "high",
    skills: ["*"],
    mcps: ["*", "!context7"],
  },
  oracle: {
    model: "opencode-go/deepseek-v4-pro",
    variant: "max",
    skills: ["simplify"],
    mcps: [],
  },
  librarian: {
    model: "opencode-go/minimax-m2.7",
    skills: [],
    mcps: ["websearch", "deepwiki", "context7", "grep_app"],
  },
  explorer: {
    model: "opencode-go/minimax-m2.7",
    skills: [],
    mcps: [],
  },
  designer: {
    model: "opencode-go/kimi-k2.6",
    variant: "medium",
    skills: ["agent-browser", "frontend-ui-ux"],
    mcps: [],
  },
  fixer: {
    model: "opencode-go/deepseek-v4-flash",
    variant: "high",
    skills: [],
    mcps: [],
  },
  devops: {
    model: "opencode-go/deepseek-v4-flash",
    variant: "medium",
    skills: ["azure-devops", "gitmaster"],
    mcps: ["grep_app"],
  },
};

/**
 * Default OpenAI preset for users with OpenAI API access.
 */
export const OPENAI_PRESET: Preset = {
  orchestrator: {
    model: "openai/gpt-5.5",
    variant: "high",
    skills: ["*"],
    mcps: ["*", "!context7"],
  },
  oracle: {
    model: "openai/gpt-5.5",
    variant: "high",
    skills: ["simplify"],
    mcps: [],
  },
  librarian: {
    model: "openai/gpt-5.4-mini",
    variant: "low",
    skills: [],
    mcps: ["websearch", "deepwiki", "context7", "grep_app"],
  },
  explorer: {
    model: "openai/gpt-5.4-mini",
    variant: "low",
    skills: [],
    mcps: [],
  },
  designer: {
    model: "openai/gpt-5.4-mini",
    variant: "medium",
    skills: ["agent-browser", "frontend-ui-ux"],
    mcps: [],
  },
  fixer: {
    model: "openai/gpt-5.4-mini",
    variant: "low",
    skills: [],
    mcps: [],
  },
  devops: {
    model: "openai/gpt-5.4-mini",
    variant: "medium",
    skills: ["azure-devops", "gitmaster"],
    mcps: ["grep_app"],
  },
};

/**
 * Build the full default config.
 */
export function buildDefaultConfig(): PluginConfig {
  return {
    preset: "opencode-go",
    presets: {
      "opencode-go": OPENCODE_GO_PRESET,
      openai: OPENAI_PRESET,
    },
    azureDevOps: {
      orgUrl: "https://dev.azure.com/your-org",
    },
    disabledMcps: [],
    disabledHooks: [],
    disabledSkills: [],
    disabledAgents: [],
  };
}
