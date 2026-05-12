# Git Master

## Description
Comprehensive Git workflow skill for Azure DevOps-native development. Handles atomic commits with automatic Work Item linking, rebase/squash workflows, branch management with Azure Repos conventions, and history archaeology.

## When to Use
- Committing code (ALWAYS use this skill)
- Rebasing or squashing commits
- Creating branches linked to Work Items
- Investigating git history (blame, bisect, log -S)
- Preparing PRs for Azure Repos

## Workflow

### Commit
1. Stage changes atomically — one logical change per commit
2. Write descriptive commit messages following conventional commits format
3. **Always include AB#{WorkItemId}** in commit messages for Azure DevOps linking
4. Format: `type(scope): description\n\nAB#{id}`

Example:
```
feat(work-items): add priority field to work item form

Closes #12345
AB#12345
```

### Branch Management
- Branch naming: `{type}/{workitem-id}-{short-description}`
  - Types: `feature/`, `bugfix/`, `task/`, `hotfix/`
  - Example: `feature/12345-add-priority-filter`
- Always branch from the latest `main` (or configured default branch)
- Delete local branches after PR merge

### Pull Requests
- Always link to the relevant Work Item(s)
- Use PR templates from the repo when available
- Include AB# references in PR description for auto-linking
- Request reviews from appropriate team members

### Rebase/Squash
- Rebase feature branches onto main before PR
- Squash fixup commits before PR review
- Use interactive rebase for cleaning up commit history
- Never rebase shared branches (main, develop)

### History Search
- `git blame` to find who last changed a line
- `git log -S "pattern"` to search for code additions/deletions
- `git bisect` to find which commit introduced a bug
- `git log --grep="AB#12345"` to find commits linked to a Work Item
