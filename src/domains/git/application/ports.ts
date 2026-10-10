import type { Commit, CommitMessage } from "../domain/commit.js";

export interface GitRepository {
  hasStagedChanges(repoPath: string): Promise<boolean>;
  commit(repoPath: string, message: CommitMessage): Promise<Commit>;
}
