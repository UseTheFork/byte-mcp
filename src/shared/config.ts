import { resolve } from "node:path";

export interface AppConfig {
  readonly workspaceDir: string;
}

let current: AppConfig | undefined;

export function initConfig(): AppConfig {
  if (current) throw new Error("Config already initialized");
  current = Object.freeze({
    workspaceDir: resolve(process.env.BYTE_MCP_WORKSPACE_DIR ?? process.cwd()),
  });
  return current;
}

export function getConfig(): AppConfig {
  if (!current) throw new Error("Config accessed before initConfig()");
  return current;
}
