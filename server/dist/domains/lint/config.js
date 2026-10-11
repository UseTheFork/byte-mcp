import { z } from "zod";
import { getDomainConfig } from "../../shared/config.js";
export const lintCommandSchema = z.object({
    command: z
        .array(z.string())
        .min(1)
        .describe("Command and arguments to execute for linting (e.g., ['ruff', 'check', '--fix']). Use {files} placeholder to specify where the file paths should be inserted, otherwise they will be appended to the end."),
    languages: z
        .array(z.string())
        .describe("List of language names this command handles (e.g., ['python', 'php']). Empty list means all files."),
});
export const lintConfigSchema = z.object({
    commands: z
        .array(lintCommandSchema)
        .default([])
        .describe("List of lint commands to run on files with their target languages"),
});
export function getLintConfig() {
    return getDomainConfig("lint", lintConfigSchema);
}
