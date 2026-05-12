import type { PluginConfig } from "../config/schema";

/**
 * Session lifecycle hooks — handle session creation, idle events, and error recovery.
 * These hook into OpenCode's `event` hook to monitor session state.
 */

export interface SessionLifecycleHooks {
  event: (input: { event: { type: string; properties?: Record<string, unknown> } }) => Promise<void>;
}

export function createSessionLifecycleHooks(
  _config: PluginConfig
): SessionLifecycleHooks {
  return {
    event: async ({ event }) => {
      switch (event.type) {
        case "session.created":
          // Log session creation; could initialize session-specific state
          break;

        case "session.idle":
          // Session completed — opportunity for post-session actions:
          // - Auto-link commits to work items
          // - Trigger CI if needed
          // - Send notifications
          break;

        case "session.error":
          // Handle session errors — could auto-recover or notify
          break;

        case "session.deleted":
          // Clean up session-specific resources
          break;

        default:
          break;
      }
    },
  };
}
