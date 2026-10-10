import type { FastMCP } from "fastmcp";
import { z } from "zod";
import { getConfig } from "@/shared/config.js";
import { DomainError } from "@/shared/errors.js";
import type { LintFiles } from "@/domains/lint/application/lint-files.js";

export function registerLintFilesTool(server: FastMCP, lintFiles: LintFiles) {
  server.addTool({
    name: "lint_files",
    description:
      "Run the configured lint commands on files in the workspace. Each file is passed to the commands that handle its language.",
    parameters: z.object({
      files: z
        .array(z.string().min(1))
        .min(1)
        .describe("File paths to lint, relative to the workspace directory"),
    }),
    execute: async ({ files }) => {
      try {
        const { runs, unmatched } = await lintFiles.execute({
          workspaceDir: getConfig().workspaceDir,
          files,
        });

        const sections = runs.map(
          (r) =>
            `$ ${r.argv.join(" ")}\nexit code: ${r.exitCode}${r.output ? `\n${r.output}` : ""}`,
        );
        if (unmatched.length) {
          sections.push(`No lint command configured for:\n${unmatched.join("\n")}`);
        }
        return { content: [{ type: "text", text: sections.join("\n\n") }] };
      } catch (error) {
        if (error instanceof DomainError) {
          return { isError: true, content: [{ type: "text", text: error.message }] };
        }
        throw error;
      }
    },
  });
}
