import { resolveWithin } from "../../../shared/paths.js";
import { planLintRuns } from "../domain/lint.js";
export class LintFiles {
    runner;
    commands;
    constructor(runner, commands) {
        this.runner = runner;
        this.commands = commands;
    }
    async execute({ workspaceDir, files }) {
        const absolute = files.map((file) => resolveWithin(workspaceDir, file));
        const { plans, unmatched } = planLintRuns(this.commands, absolute);
        // Sequential: fixers may rewrite files that later commands read.
        const runs = [];
        for (const plan of plans) {
            const result = await this.runner.run(plan.argv, workspaceDir);
            runs.push({ ...plan, ...result });
        }
        return { runs, unmatched };
    }
}
