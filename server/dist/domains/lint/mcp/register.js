import { LintFiles } from "../application/lint-files.js";
import { getLintConfig } from "../config.js";
import { registerLintFilesTool } from "./tools/lint-files.js";
export function registerLintTools(server, runner) {
    // Loaded here so an invalid config fails at startup.
    const config = getLintConfig();
    registerLintFilesTool(server, new LintFiles(runner, config.commands));
}
