import type { FastMCP } from "fastmcp";
import { CommitChanges } from "../application/commit-changes.js";
import { ListRecentCommits } from "../application/list-recent-commits.js";
import type { GitRepository } from "../application/ports.js";
import { getGitConfig } from "../config.js";
import { registerGitCommitTool } from "./tools/git-commit.js";
import { registerGitRecentCommitsTool } from "./tools/git-recent-commits.js";

export function registerGitTools(server: FastMCP, repository: GitRepository) {
  // Loaded here so an invalid config fails at startup.
  const config = getGitConfig();
  registerGitCommitTool(server, new CommitChanges(repository), config);
  registerGitRecentCommitsTool(server, new ListRecentCommits(repository));
}
