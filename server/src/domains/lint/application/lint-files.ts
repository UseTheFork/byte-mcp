import { resolveWithin } from "@/shared/paths.js";

import { planLintRuns, type LintCommand, type LintRunResult } from "../domain/lint.js";
import type { CommandRunner } from "./ports.js";

export interface LintFilesInput {
  workspaceDir: string;
  files: string[];
}

export interface LintReport {
  runs: LintRunResult[];
  unmatched: string[];
}

export class LintFiles {
  constructor(
    private readonly runner: CommandRunner,
    private readonly commands: LintCommand[],
  ) {}

  async execute({ workspaceDir, files }: LintFilesInput): Promise<LintReport> {
    const absolute = files.map((file) => resolveWithin(workspaceDir, file));
    const { plans, unmatched } = planLintRuns(this.commands, absolute);

    // Sequential: fixers may rewrite files that later commands read.
    const runs: LintRunResult[] = [];
    for (const plan of plans) {
      const result = await this.runner.run(plan.argv, workspaceDir);
      runs.push({ ...plan, ...result });
    }
    return { runs, unmatched };
  }
}
