import type { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import { getConfig } from "@/shared/config.js";
import { DomainError } from "@/shared/errors.js";
import type { CommitChanges } from "@/domains/git/application/commit-changes.js";
import { COMMIT_TYPES } from "@/domains/git/domain/commit.js";
import type { GitConfig } from "@/domains/git/config.js";

export function registerGitCommitTool(
  server: McpServer,
  commitChanges: CommitChanges,
  config: GitConfig,
) {
  const descriptionDoc = [
    "The description part of the commit message only, without the type prefix. Short, imperative, present tense.",
    `Maximum ${config.max_description_length} characters.`,
    ...config.description_guidelines.map((guideline) => `- ${guideline}`),
  ].join("\n");

  const scopeSchema = config.scopes.length
    ? z.enum(config.scopes as [string, ...string[]])
    : z.string();

  const fullSchema = z.object({
    type: z.enum(COMMIT_TYPES).describe("The commit type (Conventional Commits)."),
    commit_message: z.string().max(config.max_description_length).describe(descriptionDoc),
    scope: scopeSchema
      .optional()
      .describe("OPTIONAL scope providing additional contextual information."),
    breaking_change: z
      .boolean()
      .optional()
      .describe("Flag indicating whether this commit introduces a breaking change."),
    breaking_change_message: z
      .string()
      .optional()
      .describe(
        "REQUIRED if breaking_change is true AND the commit_message isn't sufficiently informative. Describes the breaking change.",
      ),
    body: z
      .array(z.string())
      .optional()
      .describe(
        "OPTIONAL list of body lines with motivation for the change and contrast with previous behavior. Only needed if the commit_message isn't sufficiently informative. Use imperative, present tense: 'change' not 'changed' nor 'changes'. Explain why the change was made, not what was changed. If breaking_change is true, describe the breaking changes here.",
      ),
  });

  const disabled: Record<string, true> = {};
  if (!config.enable_scopes) disabled.scope = true;
  if (!config.enable_breaking_changes) {
    disabled.breaking_change = true;
    disabled.breaking_change_message = true;
  }
  if (!config.enable_body) disabled.body = true;

  // Disabled fields are omitted at runtime; the type stays full so handler fields are typed.
  const inputSchema = fullSchema.omit(disabled as never) as unknown as typeof fullSchema;

  server.registerTool(
    "git_commit",
    {
      description: "Commit the currently staged changes in the workspace git repository",
      inputSchema,
    },
    async ({ type, commit_message, scope, breaking_change, breaking_change_message, body }) => {
      try {
        const commit = await commitChanges.execute({
          repoPath: getConfig().workspaceDir,
          message: {
            type,
            description: commit_message,
            scope,
            breakingChange: breaking_change,
            breakingChangeMessage: breaking_change_message,
            body,
          },
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
