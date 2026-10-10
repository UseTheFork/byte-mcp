import { run } from "../../../shared/exec.js";
import { LintCommandError } from "../domain/errors.js";
export class ProcessCommandRunner {
    async run(argv, cwd) {
        const [command, ...args] = argv;
        try {
            const result = await run(command, args, cwd);
            const output = [result.stdout, result.stderr].filter(Boolean).join("\n").trim();
            return { exitCode: result.exitCode, output };
        }
        catch (error) {
            throw new LintCommandError(`Failed to run ${command}: ${error.message}`);
        }
    }
}
