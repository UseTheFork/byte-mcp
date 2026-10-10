import type { McpServer } from "@modelcontextprotocol/server";
import { CommitChanges } from "../application/commit-changes.js";
import type { GitRepository } from "../application/ports.js";
import { registerGitCommitTool } from "./tools/git-commit.js";

export function registerGitTools(server: McpServer, repository: GitRepository) {
  registerGitCommitTool(server, new CommitChanges(repository));
}
