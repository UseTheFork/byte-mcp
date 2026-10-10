import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { z } from "zod";

export interface AppConfig {
  readonly workspaceDir: string;
}

const CONFIG_FILE = join(".github", ".byte.config.json");

let current: AppConfig | undefined;
// Raw file contents, keyed by domain name; each domain validates its own section.
let rawDomains: Record<string, unknown> = {};

function readConfigFile(workspaceDir: string): Record<string, unknown> {
  const path = join(workspaceDir, CONFIG_FILE);
  let text: string;
  try {
    text = readFileSync(path, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return {};
    throw error;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch (error) {
    throw new Error(`Invalid JSON in ${path}: ${(error as Error).message}`);
  }
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new Error(`${path} must contain a JSON object`);
  }
  return parsed as Record<string, unknown>;
}

export function initConfig(): AppConfig {
  if (current) throw new Error("Config already initialized");
  const workspaceDir = resolve(process.env.BYTE_MCP_WORKSPACE_DIR ?? process.cwd());
  rawDomains = readConfigFile(workspaceDir);
  current = Object.freeze({ workspaceDir });
  return current;
}

export function getDomainConfig<T extends z.ZodType>(domain: string, schema: T): z.output<T> {
  if (!current) throw new Error("Config accessed before initConfig()");
  const result = schema.safeParse(rawDomains[domain] ?? {});
  if (!result.success) {
    throw new Error(
      `Invalid "${domain}" config in ${CONFIG_FILE}:\n${z.prettifyError(result.error)}`,
    );
  }
  return result.data;
}

export function getConfig(): AppConfig {
  if (!current) throw new Error("Config accessed before initConfig()");
  return current;
}
