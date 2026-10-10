import type { McpServer } from "@modelcontextprotocol/server";
import { CommitChanges } from "../application/commit-changes.js";
import type { GitRepository } from "../application/ports.js";
import { getGitConfig } from "../config.js";
import { registerGitCommitTool } from "./tools/git-commit.js";

export function registerGitTools(server: FastMCP, repository: GitRepository) {
  // Loaded here so an invalid config fails at startup.
  const config = getGitConfig();
  registerGitCommitTool(server, new CommitChanges(repository), config);
}
