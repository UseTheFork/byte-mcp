import { EmptyCommitMessageError } from "./errors.js";

export class CommitMessage {
  private constructor(readonly value: string) {}

  static create(raw: string): CommitMessage {
    const value = raw.trim();
    if (!value) throw new EmptyCommitMessageError();
    return new CommitMessage(value);
  }
}

export interface Commit {
  hash: string;
  message: string;
}
