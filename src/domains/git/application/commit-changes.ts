import { CommitMessage, type Commit } from "../domain/commit.js";
import { NothingStagedError } from "../domain/errors.js";
import type { GitRepository } from "./ports.js";

export interface CommitChangesInput {
  repoPath: string;
  message: string;
}

export class CommitChanges {
  constructor(private readonly repository: GitRepository) {}

  async execute({ repoPath, message }: CommitChangesInput): Promise<Commit> {
    const commitMessage = CommitMessage.create(message);
    if (!(await this.repository.hasStagedChanges(repoPath))) {
      throw new NothingStagedError();
    }
    return this.repository.commit(repoPath, commitMessage);
  }
}
