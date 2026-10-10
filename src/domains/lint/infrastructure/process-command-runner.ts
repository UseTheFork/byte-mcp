import { run } from "@/shared/exec.js";
import type { CommandOutput, CommandRunner } from "../application/ports.js";
import { LintCommandError } from "../domain/errors.js";

export class ProcessCommandRunner implements CommandRunner {
  async run(argv: string[], cwd: string): Promise<CommandOutput> {
    const [command, ...args] = argv;
    try {
      const result = await run(command, args, cwd);
      const output = [result.stdout, result.stderr].filter(Boolean).join("\n").trim();
      return { exitCode: result.exitCode, output };
    } catch (error) {
      throw new LintCommandError(`Failed to run ${command}: ${(error as Error).message}`);
    }
  }
}
