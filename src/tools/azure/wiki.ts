import { tool } from "@opencode-ai/plugin";
import type { ToolDefinition } from "@opencode-ai/plugin";

/**
 * Search Wiki pages by content.
 */
export const WIKI_SEARCH_TOOL: ToolDefinition = tool({
  description: "Search Azure DevOps Wiki pages for content matching the query. Returns page titles, paths, and content snippets.",
  args: {
    query: tool.schema.string().describe("Search query text to find in Wiki pages"),
    scope: tool.schema
      .enum(["project", "code"])
      .optional()
      .describe("Search scope: project wiki or code wiki (default: project)"),
  },
  async execute(args, ctx) {
    return `[azdev_wiki_search] Searching for "${args.query}"...`;
  },
});

/**
 * Get a Wiki page by path.
 */
export const WIKI_PAGE_TOOL: ToolDefinition = tool({
  description: "Get the full content of an Azure DevOps Wiki page by its path. Returns rendered HTML or raw markdown.",
  args: {
    path: tool.schema.string().describe("Wiki page path (e.g., '/Project/Architecture/Overview')"),
    format: tool.schema
      .enum(["markdown", "html"])
      .optional()
      .describe("Content format (default: markdown)"),
    includeSubPages: tool.schema.boolean().optional().describe("Include child pages in the response"),
  },
  async execute(args, ctx) {
    return `[azdev_wiki_page] Getting page '${args.path}'...`;
  },
});

/**
 * Create or update a Wiki page.
 */
export const WIKI_CREATE_TOOL: ToolDefinition = tool({
  description: "Create a new Wiki page or update an existing one in Azure DevOps Wiki. Supports markdown content and hierarchical paths.",
  args: {
    path: tool.schema.string().describe("Wiki page path (e.g., '/Project/Architecture/ADR-001')"),
    content: tool.schema.string().describe("Page content in markdown format"),
    comment: tool.schema.string().optional().describe("Version comment for the change"),
  },
  async execute(args, ctx) {
    return `[azdev_wiki_create] Creating page '${args.path}'...`;
  },
});

/**
 * Export all Azure DevOps Wiki tools.
 */
export function createWikiTools(): Record<string, ToolDefinition> {
  return {
    azdev_wiki_search: WIKI_SEARCH_TOOL,
    azdev_wiki_page: WIKI_PAGE_TOOL,
    azdev_wiki_create: WIKI_CREATE_TOOL,
  };
}
