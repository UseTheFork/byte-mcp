import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { z } from "zod";
const CONFIG_FILE = join(".github", ".byte.config.json");
const DEFAULT_CONFIG = {
    git: {
        enable_scopes: false,
        enable_breaking_changes: false,
        enable_body: true,
        scopes: ["api", "auth", "cli", "config", "core", "db", "deps", "docs", "test", "ui"],
        description_guidelines: [],
        max_description_length: 72,
    },
    lint: {
        commands: [],
    },
};
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
        if (error.code === "ENOENT") {
            mkdirSync(dirname(path), { recursive: true });
            try {
                writeFileSync(path, `${JSON.stringify(DEFAULT_CONFIG, null, 2)}\n`, { flag: "wx" });
                return DEFAULT_CONFIG;
            }
            catch (writeError) {
                if (writeError.code !== "EEXIST")
                    throw writeError;
                return readConfigFile(workspaceDir);
            }
        }
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
