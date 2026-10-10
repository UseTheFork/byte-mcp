import type { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import { getConfig } from "@/shared/config.js";
import { DomainError } from "@/shared/errors.js";
import type { CommitChanges } from "@/domains/git/application/commit-changes.js";

export function registerGitCommitTool(server: McpServer, commitChanges: CommitChanges) {
  server.registerTool(
    "git_commit",
    {
      description: "Commit the currently staged changes in a git repository",
      inputSchema: z.object({
        repoPath: z
          .string()
          .min(1)
          .optional()
          .describe("Path to the git repository; defaults to the workspace directory"),
        message: z.string().describe("Commit message"),
      }),
    },
    async ({ repoPath, message }) => {
      try {
        const commit = await commitChanges.execute({
          repoPath: repoPath ?? getConfig().workspaceDir,
          message,
        });
        return {
          content: [{ type: "text", text: `Committed ${commit.hash}: ${commit.message}` }],
        };
      } catch (error) {
        if (error instanceof DomainError) {
          return { isError: true, content: [{ type: "text", text: error.message }] };
        }
        throw error;
      }
    },
  );
}
