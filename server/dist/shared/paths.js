import { isAbsolute, relative, resolve } from "node:path";
import { DomainError } from "./errors.js";
export class PathOutsideWorkspaceError extends DomainError {
    constructor(path) {
        super(`Path is outside the workspace: ${path}`);
    }
}
export function resolveWithin(root, path) {
    const absolute = resolve(root, path);
    const rel = relative(root, absolute);
    if (rel.startsWith("..") || isAbsolute(rel))
        throw new PathOutsideWorkspaceError(path);
    return absolute;
}
