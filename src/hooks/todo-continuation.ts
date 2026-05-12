import type { PluginConfig } from "../config/schema";

/**
 * Todo continuation hook — auto-continues orchestrator sessions when todos remain.
 * This prevents sessions from idling when there's still work to do.
 *
 * Copied and adapted from oh-my-opencode-slim's todo-continuation pattern.
 */

export interface TodoContinuationHooks {
  event: (input: { event: { type: string; properties?: Record<string, unknown> } }) => Promise<void>;
}

export function createTodoContinuationHooks(
  config: PluginConfig
): TodoContinuationHooks {
  // Track cooldowns to prevent rapid re-continuation loops
  const cooldownMap = new Map<string, number>();
  const COOLDOWN_MS = 5000; // 5s cooldown between auto-continues
  const MAX_CONTINUATIONS = 10; // Safety limit per session

  return {
    event: async ({ event }) => {
      if (event.type !== "session.idle") return;

      const sessionId = (event.properties?.session_id as string) ?? "";
      if (!sessionId) return;

      // Check if auto-continuation is disabled
      if (config.disabledHooks?.includes("todo-continuation")) return;

      // Check cooldown
      const lastContinue = cooldownMap.get(sessionId) ?? 0;
      if (Date.now() - lastContinue < COOLDOWN_MS) return;

      // TODO: Check if session has incomplete todos via OpenCode SDK
      // If so, send a continuation prompt to the session

      cooldownMap.set(sessionId, Date.now());
    },
  };
}
