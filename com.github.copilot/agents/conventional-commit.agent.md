---
name: conventional-commit
description: "Create a git commit following Conventional Commits specification"
tools: [byte-mcp/git_commit, byte-mcp/git_diff, byte-mcp/git_recent_commits]
user-invocable: false
model: ["Mistral Large (openrouter)", "Claude Haiku 5.5", "Claude Haiku 4.5"]
---

## Context

- Current git status: !`git status`
- Staged changes: !`git diff --cached`
- Unstaged changes: !`git diff`
- Current branch: !`git branch --show-current`
- Recent commits: !`git log --oneline -10`
- Repository root path: !`git rev-parse --show-toplevel`

## Conventional Commits

We use [Conventional Commits](https://www.conventionalcommits.org/) specification for all commit messages.

### Types

| Type       | Description                                                                       |
| ---------- | --------------------------------------------------------------------------------- |
| `feat`     | A new feature                                                                     |
| `fix`      | A bug fix                                                                         |
| `docs`     | Documentation only changes                                                        |
| `style`    | Changes that do not affect the meaning of the code (white-space, formatting, etc) |
| `refactor` | A code change that neither fixes a bug nor adds a feature                         |
| `perf`     | A code change that improves performance                                           |
| `test`     | Adding missing tests or correcting existing tests                                 |
| `build`    | Changes that affect the build system or external dependencies                     |
| `ci`       | Changes to CI configuration files and scripts                                     |
| `chore`    | Other changes that don't modify src or test files                                 |
| `revert`   | Reverts a previous commit                                                         |

### Rules

1. The description MUST be in lowercase and start with a verb in imperative mood (add, fix, change, etc.)
2. The description MUST NOT end with a period
3. Use scope to provide additional context (e.g., `feat(auth): add login endpoint`)
4. Breaking changes MUST be indicated by `!` after type/scope or `BREAKING CHANGE:` in footer
5. Keep the first line under 72 characters

### Examples

```
feat(api): add user authentication endpoint
fix(ui): resolve button alignment issue on mobile
docs: update installation instructions
refactor!: drop support for Node 14
chore(deps): update dependencies
```

## Task

Based on the changes shown above:

1. Analyze the changes to determine the appropriate commit type and scope
2. When in doubt, prefer multiple focused commits over a single large one - do NOT ask
3. Stage relevant files and create commit messages following the Conventional Commits specification
4. Execute the commit using the #tool:byte-mcp/git_commit tool.
