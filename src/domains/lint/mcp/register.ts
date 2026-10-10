import type { McpServer } from "@modelcontextprotocol/server";
import { LintFiles } from "../application/lint-files.js";
import type { CommandRunner } from "../application/ports.js";
import { getLintConfig } from "../config.js";
import { registerLintFilesTool } from "./tools/lint-files.js";

export function registerLintTools(server: McpServer, runner: CommandRunner) {
  // Loaded here so an invalid config fails at startup.
  const config = getLintConfig();
  if (!config.enable) return;
  registerLintFilesTool(server, new LintFiles(runner, config.commands));
}
