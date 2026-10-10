import { CommitMessage, type Commit, type CommitMessageParts } from "../domain/commit.js";
import { CommitDeclinedError, NothingStagedError } from "../domain/errors.js";
import type { ConfirmCommit, GitRepository } from "./ports.js";

export interface CommitChangesInput {
  repoPath: string;
  message: CommitMessageParts;
  confirm: ConfirmCommit;
}

export class CommitChanges {
  constructor(private readonly repository: GitRepository) {}

  async execute({ repoPath, message, confirm }: CommitChangesInput): Promise<Commit> {
    const commitMessage = CommitMessage.create(message);

    if (!(await this.repository.hasStagedChanges(repoPath))) {
      throw new NothingStagedError();
    }
    if (!(await confirm(commitMessage.value))) {
      throw new CommitDeclinedError();
    }
    return this.repository.commit(repoPath, commitMessage);
  }
}
