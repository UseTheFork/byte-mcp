import type { FastMCP } from "fastmcp";

import { LintFiles } from "../application/lint-files.js";
import type { CommandRunner } from "../application/ports.js";
import { getLintConfig } from "../config.js";
import { registerLintFilesTool } from "./tools/lint-files.js";

export function registerLintTools(server: FastMCP, runner: CommandRunner) {
  // Loaded here so an invalid config fails at startup.
  const config = getLintConfig();
  registerLintFilesTool(server, new LintFiles(runner, config.commands));
}
