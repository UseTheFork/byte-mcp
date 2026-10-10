import type { Commit } from "../domain/commit.js";
import type { GitRepository } from "./ports.js";

const RECENT_COMMIT_LIMIT = 10;

export class ListRecentCommits {
  constructor(private readonly repository: GitRepository) {}

  execute({ repoPath }: { repoPath: string }): Promise<Commit[]> {
    return this.repository.recentCommits(repoPath, RECENT_COMMIT_LIMIT);
  }
}
