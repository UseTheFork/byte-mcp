import type { GitRepository } from "./ports.js";

export interface GetDiffInput {
  repoPath: string;
  staged: boolean;
}

export class GetDiff {
  constructor(private readonly repository: GitRepository) {}

  execute({ repoPath, staged }: GetDiffInput): Promise<string> {
    return this.repository.diff(repoPath, { staged });
  }
}
