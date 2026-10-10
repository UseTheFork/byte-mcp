import { DomainError } from "@/shared/errors.js";

export class EmptyCommitMessageError extends DomainError {
  constructor() {
    super("Commit message must not be empty");
  }
}

export class NothingStagedError extends DomainError {
  constructor() {
    super("There are no staged changes to commit");
  }
}

export class GitCommandError extends DomainError {}

export class CommitDeclinedError extends DomainError {
  constructor() {
    super("The commit was not confirmed by the user");
  }
}
