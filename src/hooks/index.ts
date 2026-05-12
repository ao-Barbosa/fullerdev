import type { PluginConfig } from "../config/schema";
import { createSessionLifecycleHooks } from "./session-lifecycle";
import { createTodoContinuationHooks } from "./todo-continuation";
import { createContextInjectionHooks } from "./context-injection";
import { createDevOpsIntegrationHooks } from "./devops-integration";

/**
 * Compose all hooks into a single interface compatible with OpenCode's Plugin Hooks.
 */
export function createAllHooks(config: PluginConfig) {
  const session = createSessionLifecycleHooks(config);
  const todo = createTodoContinuationHooks(config);
  const context = createContextInjectionHooks(config);
  const devops = createDevOpsIntegrationHooks(config);

  return {
    /**
     * Event hook — merged from multiple hook sources.
     * All event handlers run in sequence for each event.
     */
    event: async (input: { event: { type: string; properties?: Record<string, unknown> } }) => {
      await session.event(input);
      await todo.event(input);
      await devops.event(input);
    },

    /**
     * Chat params hook — merged: devops integration + agent model routing.
     */
    "chat.params": async (
      input: {
        sessionID: string;
        agent: string;
        message: Record<string, unknown>;
      },
      output: { options: Record<string, unknown> }
    ) => {
      await devops["chat.params"](input, output);
    },

    /**
     * Tool execute before hook.
     */
    "tool.execute.before": async (
      input: { tool: string; args: Record<string, unknown> },
      output: { context?: string[] }
    ) => {
      await context["tool.execute.before"](input, output);
    },

    /**
     * Tool execute after hook — merged from multiple sources.
     */
    "tool.execute.after": async (
      input: { tool: string; args: Record<string, unknown>; result: unknown },
      output: { context?: string[] }
    ) => {
      await context["tool.execute.after"](input, output);
      await devops["tool.execute.after"](input, output as Record<string, unknown>);
    },
  };
}
