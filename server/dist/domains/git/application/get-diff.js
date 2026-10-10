export class GetDiff {
    repository;
    constructor(repository) {
        this.repository = repository;
    }
    execute({ repoPath, staged }) {
        return this.repository.diff(repoPath, { staged });
    }
}
