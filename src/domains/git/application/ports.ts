import type { Commit, CommitMessage } from "../domain/commit.js";

// Resolves true when the user approves the rendered commit message.
export type ConfirmCommit = (message: string) => Promise<boolean>;

export interface GitRepository {
  hasStagedChanges(repoPath: string): Promise<boolean>;
  commit(repoPath: string, message: CommitMessage): Promise<Commit>;
}
