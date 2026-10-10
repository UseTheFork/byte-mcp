import { z } from "zod";
import { getDomainConfig } from "../../shared/config.js";
export const gitConfigSchema = z.object({
    enable_scopes: z
        .boolean()
        .default(false)
        .describe("Enable scope selection for conventional commits"),
    enable_breaking_changes: z
        .boolean()
        .default(false)
        .describe("Enable breaking change detection and confirmation"),
    enable_body: z.boolean().default(true).describe("Enable commit message body generation"),
    scopes: z
        .array(z.string())
        .default(["api", "auth", "cli", "config", "core", "db", "deps", "docs", "test", "ui"])
        .describe("Available scopes for conventional commits"),
    description_guidelines: z
        .array(z.string())
        .default([])
        .describe("Additional guidelines for commit descriptions"),
    max_description_length: z
        .number()
        .int()
        .positive()
        .default(72)
        .describe("Maximum character length for commit descriptions"),
});
export function getGitConfig() {
    return getDomainConfig("git", gitConfigSchema);
}
