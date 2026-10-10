import { run } from "@/shared/exec.js";
import type { GitRepository } from "../application/ports.js";
import type { Commit, CommitMessage } from "../domain/commit.js";
import { GitCommandError } from "../domain/errors.js";

export class CliGitRepository implements GitRepository {
  async hasStagedChanges(repoPath: string): Promise<boolean> {
    // `diff --cached --quiet` exits 1 when there are staged changes.
    const { exitCode, stderr } = await run("git", ["diff", "--cached", "--quiet"], repoPath);
    if (exitCode === 0) return false;
    if (exitCode === 1) return true;
    throw new GitCommandError(stderr.trim() || `git diff failed with exit code ${exitCode}`);
  }

  async commit(repoPath: string, message: CommitMessage): Promise<Commit> {
    const result = await run("git", ["commit", "-m", message.value], repoPath);
    if (result.exitCode !== 0) {
      throw new GitCommandError(
        result.stderr.trim() || result.stdout.trim() || "git commit failed",
      );
    }
    const head = await run("git", ["rev-parse", "HEAD"], repoPath);
    if (head.exitCode !== 0) {
      throw new GitCommandError(head.stderr.trim() || "git rev-parse failed");
    }
    return { hash: head.stdout.trim(), message: message.value };
  }
}
