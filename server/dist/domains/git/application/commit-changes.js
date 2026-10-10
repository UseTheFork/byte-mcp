import { CommitMessage } from "../domain/commit.js";
import { CommitDeclinedError, NothingStagedError } from "../domain/errors.js";
export class CommitChanges {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    async execute({ repoPath, message, confirm }) {
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
