import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { z } from "zod";
const CONFIG_FILE = join(".github", ".byte.config.json");
let current;
// Raw file contents, keyed by domain name; each domain validates its own section.
let rawDomains = {};
function readConfigFile(workspaceDir) {
    const path = join(workspaceDir, CONFIG_FILE);
    let text;
    try {
        text = readFileSync(path, "utf8");
    }
    catch (error) {
        if (error.code === "ENOENT")
            return {};
        throw error;
    }
    let parsed;
    try {
        parsed = JSON.parse(text);
    }
    catch (error) {
        throw new Error(`Invalid JSON in ${path}: ${error.message}`);
    }
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
        throw new Error(`${path} must contain a JSON object`);
    }
    return parsed;
}
export function initConfig() {
    if (current)
        throw new Error("Config already initialized");
    const workspaceDir = resolve(process.env.BYTE_MCP_WORKSPACE_DIR ?? process.cwd());
    rawDomains = readConfigFile(workspaceDir);
    current = Object.freeze({ workspaceDir });
    return current;
}
export function getDomainConfig(domain, schema) {
    if (!current)
        throw new Error("Config accessed before initConfig()");
    const result = schema.safeParse(rawDomains[domain] ?? {});
    if (!result.success) {
        throw new Error(`Invalid "${domain}" config in ${CONFIG_FILE}:\n${z.prettifyError(result.error)}`);
    }
    return result.data;
}
export function getConfig() {
    if (!current)
        throw new Error("Config accessed before initConfig()");
    return current;
}
