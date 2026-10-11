import type { FastMCP } from "fastmcp";

import type { ListRecentCommits } from "@/domains/git/application/list-recent-commits.js";
import { getConfig } from "@/shared/config.js";
import { DomainError } from "@/shared/errors.js";

export function registerGitRecentCommitsTool(
  server: FastMCP,
  listRecentCommits: ListRecentCommits,
) {
  server.addTool({
    name: "git_recent_commits",
    description: "List the 10 most recent commits (one line each) in the workspace git repository",
    annotations: { readOnlyHint: true },
    execute: async () => {
      try {
        const commits = await listRecentCommits.execute({ repoPath: getConfig().workspaceDir });
        const text = commits.length
          ? commits.map((c) => `${c.hash} ${c.message}`).join("\n")
          : "No commits found";
        return { content: [{ type: "text", text }] };
      } catch (error) {
        if (error instanceof DomainError) {
          return { isError: true, content: [{ type: "text", text: error.message }] };
        }
        throw error;
      }
    },
  });
}
