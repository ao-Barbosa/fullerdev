import { tool } from "@opencode-ai/plugin";
import type { ToolDefinition } from "@opencode-ai/plugin";

/**
 * List Git repositories in the project.
 */
export const GIT_REPOS_TOOL: ToolDefinition = tool({
  description: "List all Git repositories in the configured Azure DevOps project. Returns repo name, ID, default branch, size, and URL.",
  args: {},
  async execute(args, ctx) {
    return "[azdev_git_repos] Listing repositories...";
  },
});

/**
 * Get details for a specific Git repository.
 */
export const GIT_REPO_TOOL: ToolDefinition = tool({
  description: "Get detailed information about a specific Azure DevOps Git repository including default branch, size, web URL, and project reference.",
  args: {
    repositoryId: tool.schema.string().describe("Repository ID or name"),
  },
  async execute(args, ctx) {
    return `[azdev_git_repo] Getting details for '${args.repositoryId}'...`;
  },
});

/**
 * List branches in a repository.
 */
export const GIT_BRANCHES_TOOL: ToolDefinition = tool({
  description: "List branches in an Azure DevOps Git repository. Supports filtering by branch name pattern.",
  args: {
    repositoryId: tool.schema.string().describe("Repository ID or name"),
    filter: tool.schema.string().optional().describe("Filter branches by name (e.g., 'feature/*')"),
    includeLinks: tool.schema.boolean().optional().describe("Include web URLs for branches"),
  },
  async execute(args, ctx) {
    return `[azdev_git_branches] Listing branches in '${args.repositoryId}'...`;
  },
});

/**
 * List or search Pull Requests.
 */
export const GIT_PRS_TOOL: ToolDefinition = tool({
  description: "Search and list Pull Requests in an Azure DevOps Git repository. Filter by status, creator, reviewer, or target branch.",
  args: {
    repositoryId: tool.schema.string().describe("Repository ID or name"),
    status: tool.schema
      .enum(["active", "abandoned", "completed", "all"])
      .optional()
      .describe("PR status filter (default: active)"),
    creatorId: tool.schema.string().optional().describe("Filter by creator (email or display name)"),
    reviewerId: tool.schema.string().optional().describe("Filter by reviewer (email or display name)"),
    sourceRefName: tool.schema.string().optional().describe("Filter by source branch (e.g., 'refs/heads/feature/foo')"),
    targetRefName: tool.schema.string().optional().describe("Filter by target branch (e.g., 'refs/heads/main')"),
    top: tool.schema.number().optional().describe("Maximum number of PRs to return (default: 20)"),
  },
  async execute(args, ctx) {
    return `[azdev_git_prs] Searching PRs in '${args.repositoryId}'...`;
  },
});

/**
 * Create a Pull Request.
 */
export const GIT_PR_CREATE_TOOL: ToolDefinition = tool({
  description: "Create a new Pull Request in Azure DevOps. Automatically adds AB# links for work item tracking.",
  args: {
    repositoryId: tool.schema.string().describe("Repository ID or name"),
    sourceRefName: tool.schema.string().describe("Source branch (e.g., 'refs/heads/feature/my-feature')"),
    targetRefName: tool.schema.string().describe("Target branch (e.g., 'refs/heads/main')"),
    title: tool.schema.string().describe("Pull Request title"),
    description: tool.schema.string().optional().describe("Pull Request description (supports markdown)"),
    workItemIds: tool.schema
      .array(tool.schema.number())
      .optional()
      .describe("Work Item IDs to link (AB# references will be added automatically)"),
    reviewers: tool.schema
      .array(tool.schema.string())
      .optional()
      .describe("Reviewer email addresses or display names"),
    isDraft: tool.schema.boolean().optional().describe("Create as draft PR (default: false)"),
  },
  async execute(args, ctx) {
    return `[azdev_git_pr_create] Creating PR: "${args.title}"...`;
  },
});

/**
 * Export all Azure DevOps Git tools.
 */
export function createGitTools(): Record<string, ToolDefinition> {
  return {
    azdev_git_repos: GIT_REPOS_TOOL,
    azdev_git_repo: GIT_REPO_TOOL,
    azdev_git_branches: GIT_BRANCHES_TOOL,
    azdev_git_prs: GIT_PRS_TOOL,
    azdev_git_pr_create: GIT_PR_CREATE_TOOL,
  };
}
