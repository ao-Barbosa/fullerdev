# Azure DevOps

## Description
Comprehensive Azure DevOps workflow skill. Covers Azure Boards (Work Items), Azure Repos (Git), Azure Wiki, and Azure Pipelines integration. This is the PRIMARY skill for any Azure DevOps interaction — agents should load this skill before performing any ADO operations.

## When to Use
- Creating, updating, or querying Work Items in Azure Boards
- Managing Git repositories, branches, and PRs in Azure Repos
- Reading or writing Wiki documentation
- Checking or triggering Pipeline runs
- Linking development work to Work Items
- Any Azure DevOps REST API operation
- Navigating the Azure DevOps web interface

## Core Concepts

### Work Item IDs
- Format: `#12345` for inline references
- Format: `AB#12345` for automatic linking in commits and PRs
- The full URL is: `{orgUrl}/{project}/_workitems/edit/{id}`

### WIQL (Work Item Query Language)
- SQL-like syntax for querying Work Items
- Basic template:
```sql
SELECT [System.Id], [System.Title], [System.State], [System.AssignedTo]
FROM WorkItems
WHERE [System.TeamProject] = 'ProjectName'
  AND [System.State] <> 'Closed'
ORDER BY [System.ChangedDate] DESC
```

### Branch Naming Convention
- `{type}/{workitem-id}-{short-description}`
- Types: `feature/`, `bugfix/`, `task/`, `hotfix/`
- Example: `feature/12345-add-priority-filter`

### Commit Message Convention
```
type(scope): description

AB#{workitem-id}
```
- Types: feat, fix, refactor, docs, test, chore

## Work Item Workflow

### Creating a Work Item
1. Determine the appropriate type (User Story, Task, Bug, Feature, Epic)
2. Set the title to clearly describe the desired outcome
3. Write a detailed description with acceptance criteria
4. Assign to the appropriate team member
5. Set Area Path and Iteration Path (from project conventions)
6. Add relevant tags

### Updating Work Item Status
1. When starting work: Set State to "Active" (or "In Progress")
2. When work is ready for review: Set State to "Resolved" (or "In Review")
3. When work is approved: Set State to "Closed"
4. Always add a comment explaining the state change

### Querying Work Items
- Use specific filters to limit results
- Common queries:
  - My active work items
  - Work items in current sprint/iteration
  - Bugs by severity
  - Work items blocked or at risk

## Git Workflow with Azure Repos

### Setup
1. Clone the repository from Azure Repos
2. Configure git user (matches Azure DevOps identity)
3. Set up branch policies in Azure Repos (min reviewers, build validation, etc.)

### Feature Workflow
1. Create branch: `feature/{wi-id}-{description}`
2. Implement changes with AB#-linked commits
3. Push branch to Azure Repos
4. Create PR with detailed description and Work Item links
5. Address review feedback
6. Complete PR (squash merge or merge commit per team convention)
7. Update Work Item status
8. Delete feature branch

## Wiki Usage
- Search Wiki for existing documentation before writing
- Use consistent page naming: `/Area/Topic/Subtopic`
- Link Work Items from Wiki pages for traceability
- Publish architecture decision records (ADRs) to the Wiki
- Use markdown for all Wiki content

## Pipeline Integration
- Check pipeline status before merging PRs
- Trigger validation builds when needed
- Review test results in pipeline runs
- Use pipeline variables for environment-specific configuration
- Monitor deployment pipelines for release status
