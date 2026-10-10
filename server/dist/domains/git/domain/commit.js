import { EmptyCommitMessageError } from "./errors.js";
export const COMMIT_TYPES = [
    "feat",
    "fix",
    "docs",
    "style",
    "refactor",
    "perf",
    "test",
    "build",
    "ci",
    "chore",
    "revert",
];
// Renders a Conventional Commits message.
export class CommitMessage {
    header;
    value;
    constructor(header, value) {
        this.header = header;
        this.value = value;
    }
    static create(parts) {
        const description = parts.description.trim();
        if (!description)
            throw new EmptyCommitMessageError();
        const scope = parts.scope?.trim();
        const breaking = parts.breakingChange === true;
        const header = `${parts.type}${scope ? `(${scope})` : ""}${breaking ? "!" : ""}: ${description}`;
        const body = (parts.body ?? []).map((line) => line.trim()).filter(Boolean);
        const breakingNote = parts.breakingChangeMessage?.trim();
        const sections = [header];
        if (body.length)
            sections.push(body.join("\n"));
        if (breaking && breakingNote)
            sections.push(`BREAKING CHANGE: ${breakingNote}`);
        return new CommitMessage(header, sections.join("\n\n"));
    }
}
