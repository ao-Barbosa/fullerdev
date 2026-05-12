import type { PluginConfig } from "../config/schema";

/**
 * Azure DevOps integration hooks — automatic linking and workflow integration.
 *
 * These hooks enable:
 * - Auto-linking commits to referenced Work Items
 * - Notifying on PR status changes
 * - Updating Work Item state based on PR activity
 * - Injecting Work Item context into relevant conversations
 */

export interface DevOpsIntegrationHooks {
  "chat.params": (
    input: {
      sessionID: string;
      agent: string;
      message: Record<string, unknown>;
    },
    output: { options: Record<string, unknown> }
  ) => Promise<void>;

  "tool.execute.after": (
    input: { tool: string; args: Record<string, unknown> },
    _output: Record<string, unknown>
  ) => Promise<void>;

  event: (input: {
    event: { type: string; properties?: Record<string, unknown> };
  }) => Promise<void>;
}

export function createDevOpsIntegrationHooks(
  _config: PluginConfig
): DevOpsIntegrationHooks {
  return {
    /**
     * Chat params hook — detect Work Item references in user messages
     * and inject context. The input.message contains the full UserMessage
     * with parts that include the text content.
     */
    "chat.params": async (input, output) => {
      const message = input.message ?? {};
      const parts = (message.parts as Array<Record<string, unknown>>) ?? [];

      // Collect all text from message parts
      const text = parts
        .filter((p) => p.type === "text")
        .map((p) => String(p.text ?? ""))
        .join(" ");

      if (!text) return;

      // Detect Work Item references: #12345 or AB#12345
      const wiRefs = text.match(/(?:AB)?#(\d{3,})/g);
      if (wiRefs && wiRefs.length > 0) {
        output.options = output.options ?? {};
        output.options.azdev_workitems = wiRefs;
      }
    },

    /**
     * After git operations, suggest linking to Work Items.
     */
    "tool.execute.after": async (input, _output) => {
      if (input.tool === "bash") {
        const command = String(input.args?.command ?? "");

        // After a commit, check if it references a Work Item
        if (command.includes("git commit")) {
          // TODO: Check if commit message includes AB# reference
          // If not, prompt to add one
        }

        // After PR creation, ensure work item linking
        if (command.includes("git push") || command.includes("pr create")) {
          // TODO: Auto-detect branch naming patterns for work item linking
        }
      }
    },

    /**
     * React to session events for Azure DevOps integration.
     */
    event: async ({ event }) => {
      switch (event.type) {
        case "session.created":
          // Could pre-fetch relevant Work Items for the session
          break;

        case "session.idle":
          // Could auto-update Work Items based on what was accomplished
          break;

        default:
          break;
      }
    },
  };
}
