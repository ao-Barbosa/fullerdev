import { tool } from "@opencode-ai/plugin";
import type { ToolDefinition } from "@opencode-ai/plugin";

/**
 * Query Work Items using WIQL (Work Item Query Language).
 */
export const WORKITEM_QUERY_TOOL: ToolDefinition = tool({
  description:
    "Query Azure DevOps Work Items using WIQL. Returns matching work item IDs and fields. Use this to find work items by title, state, assigned to, area path, iteration path, or custom fields.",
  args: {
    query: tool.schema
      .string()
      .describe(
        "WIQL query string. Example: \"SELECT [System.Id], [System.Title], [System.State] FROM WorkItems WHERE [System.TeamProject] = 'MyProject' AND [System.State] <> 'Closed' ORDER BY [System.ChangedDate] DESC\""
      ),
    top: tool.schema.number().optional().describe("Maximum number of results to return (default: 50, max: 200)"),
  },
  async execute(args, ctx) {
    // TODO: Implement WIQL query via azure-devops-node-api WorkItemTrackingApi
    return `[azdev_workitem_query] Querying: ${args.query.slice(0, 100)}...`;
  },
});

/**
 * Get a single Work Item by ID with all fields.
 */
export const WORKITEM_GET_TOOL: ToolDefinition = tool({
  description: "Get full details of a single Azure DevOps Work Item by its ID. Returns all system and custom fields, including description, acceptance criteria, and relations.",
  args: {
    id: tool.schema.number().describe("The Work Item ID (e.g., 12345)"),
    expand: tool.schema
      .enum(["all", "relations", "fields", "links", "none"])
      .optional()
      .describe("Fields to expand (default: all)"),
  },
  async execute(args, ctx) {
    return `[azdev_workitem_get] Getting work item #${args.id}...`;
  },
});

/**
 * Create a new Work Item.
 */
export const WORKITEM_CREATE_TOOL: ToolDefinition = tool({
  description: "Create a new Work Item in Azure Boards. Supports User Stories, Tasks, Bugs, Features, Epics, and custom work item types. Automatically uses the configured default Area Path and Iteration Path.",
  args: {
    type: tool.schema
      .string()
      .describe("Work item type: 'User Story', 'Task', 'Bug', 'Feature', 'Epic', or custom type name"),
    title: tool.schema.string().describe("Work item title"),
    description: tool.schema.string().optional().describe("Work item description (supports markdown)"),
    assignedTo: tool.schema.string().optional().describe("Email or display name of the person to assign to"),
    areaPath: tool.schema.string().optional().describe("Area Path (overrides default from config)"),
    iterationPath: tool.schema.string().optional().describe("Iteration Path (overrides default from config)"),
    tags: tool.schema.array(tool.schema.string()).optional().describe("Tags to apply"),
    parentId: tool.schema.number().optional().describe("Parent Work Item ID to link as child of"),
  },
  async execute(args, ctx) {
    return `[azdev_workitem_create] Creating ${args.type}: "${args.title}"...`;
  },
});

/**
 * Update an existing Work Item.
 */
export const WORKITEM_UPDATE_TOOL: ToolDefinition = tool({
  description: "Update fields of an existing Azure DevOps Work Item. Use this to change state, reassign, update description, add acceptance criteria, or modify any field.",
  args: {
    id: tool.schema.number().describe("The Work Item ID to update"),
    updates: tool.schema
      .array(
        tool.schema.object({
          op: tool.schema.enum(["add", "remove", "replace", "move", "copy", "test"]).describe("Patch operation"),
          path: tool.schema.string().describe("JSON pointer path to the field (e.g., '/fields/System.State')"),
          value: tool.schema.any().optional().describe("New value for the field"),
        })
      )
      .describe("Array of JSON Patch operations to apply"),
    comment: tool.schema.string().optional().describe("Optional comment to add to the discussion"),
  },
  async execute(args, ctx) {
    return `[azdev_workitem_update] Updating work item #${args.id}...`;
  },
});

/**
 * Link two Work Items.
 */
export const WORKITEM_LINK_TOOL: ToolDefinition = tool({
  description: "Create a link relationship between two Work Items (parent/child, related, predecessor/successor, etc.)",
  args: {
    sourceId: tool.schema.number().describe("Source Work Item ID"),
    targetId: tool.schema.number().describe("Target Work Item ID"),
    relationType: tool.schema
      .enum([
        "Child",
        "Parent",
        "Related",
        "Predecessor",
        "Successor",
        "Duplicate",
        "Duplicate Of",
      ])
      .describe("Type of relationship to create"),
  },
  async execute(args, ctx) {
    return `[azdev_workitem_link] Linking #${args.sourceId} -> #${args.targetId} (${args.relationType})...`;
  },
});

/**
 * Export all Azure DevOps Work Item tools.
 */
export function createWorkItemTools(): Record<string, ToolDefinition> {
  return {
    azdev_workitem_query: WORKITEM_QUERY_TOOL,
    azdev_workitem_get: WORKITEM_GET_TOOL,
    azdev_workitem_create: WORKITEM_CREATE_TOOL,
    azdev_workitem_update: WORKITEM_UPDATE_TOOL,
    azdev_workitem_link: WORKITEM_LINK_TOOL,
  };
}
