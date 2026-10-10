const RECENT_COMMIT_LIMIT = 10;
export class ListRecentCommits {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    execute({ repoPath }) {
        return this.repository.recentCommits(repoPath, RECENT_COMMIT_LIMIT);
    }
}
